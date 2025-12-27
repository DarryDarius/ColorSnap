import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { ColorSnapStack } from "./stacks/ColorSnapStack";

const app = new cdk.App();

/**
 * TODO(you): set these via `cdk deploy --context key=value` or environment variables.
 *
 * Example:
 *   cd infra
 *   npm install
 *   npx cdk bootstrap
 *   npx cdk deploy \
 *     -c projectName=colorsnap \
 *     -c enableHttps=false \
 *     -c enableDb=false
 */
new ColorSnapStack(app, "ColorSnapStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});


