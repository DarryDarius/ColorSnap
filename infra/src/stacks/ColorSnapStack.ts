import * as cdk from "aws-cdk-lib";
import { Duration, RemovalPolicy } from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecsPatterns from "aws-cdk-lib/aws-ecs-patterns";
import * as logs from "aws-cdk-lib/aws-logs";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as route53 from "aws-cdk-lib/aws-route53";

export class ColorSnapStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const projectName =
      (this.node.tryGetContext("projectName") as string | undefined) ?? "colorsnap";

    /**
     * NOTE on costs:
     * - A default VPC with private subnets uses NAT Gateways (paid).
     * - This is the “clean” architecture (ALB public, ECS private).
     * TODO(you): If cost is a concern, you can run ECS tasks in public subnets
     *            (not ideal for prod) or use NAT instances.
     */
    const vpc = new ec2.Vpc(this, "Vpc", {
      vpcName: `${projectName}-vpc`,
      maxAzs: 2,
      natGateways: 1,
      subnetConfiguration: [
        {
          name: "public",
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          name: "private",
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
      ],
    });

    const cluster = new ecs.Cluster(this, "Cluster", {
      clusterName: `${projectName}-cluster`,
      vpc,
    });

    const repo = new ecr.Repository(this, "EcrRepo", {
      repositoryName: `${projectName}-app`,
      removalPolicy: RemovalPolicy.RETAIN,
      imageScanOnPush: true,
    });

    const logGroup = new logs.LogGroup(this, "LogGroup", {
      logGroupName: `/ecs/${projectName}`,
      retention: logs.RetentionDays.ONE_WEEK,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // ---------- HTTPS (optional) ----------
    const enableHttps =
      (this.node.tryGetContext("enableHttps") as string | undefined) === "true";

    // TODO(you): To enable HTTPS + custom domain, you must:
    // 1) Buy/own a domain and host it in Route53
    // 2) Request an ACM certificate in the SAME REGION as your ALB
    // 3) Provide hosted zone + certificate details via CDK context
    //
    // Example:
    // npx cdk deploy -c enableHttps=true \
    //   -c hostedZoneId=Z123... \
    //   -c hostedZoneName=example.com \
    //   -c domainName=colorsnap.example.com \
    //   -c certificateArn=arn:aws:acm:...
    const hostedZoneId = this.node.tryGetContext("hostedZoneId") as string | undefined;
    const hostedZoneName = this.node.tryGetContext("hostedZoneName") as string | undefined;
    const domainName = this.node.tryGetContext("domainName") as string | undefined;
    const certificateArn = this.node.tryGetContext("certificateArn") as string | undefined;

    const zone =
      enableHttps && hostedZoneId && hostedZoneName
        ? route53.HostedZone.fromHostedZoneAttributes(this, "HostedZone", {
            hostedZoneId,
            zoneName: hostedZoneName,
          })
        : undefined;

    const certificate =
      enableHttps && certificateArn
        ? acm.Certificate.fromCertificateArn(this, "Certificate", certificateArn)
        : undefined;

    if (enableHttps && (!zone || !domainName || !certificate)) {
      new cdk.CfnOutput(this, "HttpsMissingConfig", {
        value:
          "enableHttps=true but hosted zone / domainName / certificateArn is missing. See TODO in infra/src/stacks/ColorSnapStack.ts",
      });
    }

    // ---------- Service ----------
    const taskDefinition = new ecs.FargateTaskDefinition(this, "TaskDef", {
      cpu: 256,
      memoryLimitMiB: 512,
    });

    const container = taskDefinition.addContainer("app", {
      containerName: "app",
      // Image tag will be updated by CI/CD. We default to "latest".
      image: ecs.ContainerImage.fromEcrRepository(repo, "latest"),
      logging: ecs.LogDrivers.awsLogs({
        logGroup,
        streamPrefix: "app",
      }),
      environment: {
        NODE_ENV: "production",
        // TODO(you): Add DB env vars here (or inject via Secrets Manager) once RDS exists.
        // DATABASE_URL: "...",
      },
    });

    container.addPortMappings({
      containerPort: 3000,
    });

    const fargate = new ecsPatterns.ApplicationLoadBalancedFargateService(
      this,
      "FargateService",
      {
        serviceName: `${projectName}-service`,
        cluster,
        taskDefinition,
        publicLoadBalancer: true,
        // Best practice: tasks in private subnets.
        taskSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
        desiredCount: 1,
        healthCheckGracePeriod: Duration.seconds(30),
        assignPublicIp: false,

        // HTTPS (optional)
        domainName: enableHttps ? domainName : undefined,
        domainZone: enableHttps ? zone : undefined,
        certificate: enableHttps ? certificate : undefined,
        redirectHTTP: enableHttps,
      },
    );

    fargate.targetGroup.configureHealthCheck({
      path: "/healthz",
      healthyHttpCodes: "200",
      interval: Duration.seconds(20),
      timeout: Duration.seconds(5),
    });

    // ---------- Outputs for CI/CD ----------
    new cdk.CfnOutput(this, "EcrRepositoryName", { value: repo.repositoryName });
    new cdk.CfnOutput(this, "EcsClusterName", { value: cluster.clusterName });
    new cdk.CfnOutput(this, "EcsServiceName", { value: fargate.service.serviceName });
    new cdk.CfnOutput(this, "AlbDnsName", { value: fargate.loadBalancer.loadBalancerDnsName });
    new cdk.CfnOutput(this, "LogGroupName", { value: logGroup.logGroupName });
    new cdk.CfnOutput(this, "TaskRoleArn", { value: taskDefinition.taskRole.roleArn });
    if (taskDefinition.executionRole) {
      new cdk.CfnOutput(this, "TaskExecutionRoleArn", {
        value: taskDefinition.executionRole.roleArn,
      });
    } else {
      new cdk.CfnOutput(this, "TaskExecutionRoleArn", {
        value:
          "MISSING_EXECUTION_ROLE (CDK did not create an executionRole; check task definition props)",
      });
    }

    // TODO(you): Database (RDS) integration
    //
    // If you want a real “dynamic” site:
    // - Create RDS Postgres in private subnets
    // - Store credentials in Secrets Manager
    // - Allow only ECS SG -> DB SG
    // - Inject secrets into the task definition (ecs.Secret)
    //
    // This is intentionally left as a TODO to avoid accidentally creating costly resources.
  }
}


