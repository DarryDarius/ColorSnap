# Photo Optimizer / ColorSnap

This repo currently contains:

- **Legacy static site (HTML/CSS/JS)** at the repo root (e.g. `index.html`, `analysis.html`).
- **New React rebuild** inside `web/` (Vite + React + React Router).
- **Backend service** inside `server/` (Node/Express) that serves the built React app and provides minimal APIs.
- **Infrastructure-as-Code** inside `infra/` (AWS CDK: ECS Fargate + ALB + ECR + CloudWatch Logs).

## Run the React app

### Prerequisites

- Node.js **18+**
- npm (comes with Node)

### Install + start dev server

```bash
cd "web"
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

## Run the full app locally (Frontend + Backend API)

This enables “dynamic” endpoints like booking submission (`POST /api/bookings`).

### 1) Start the backend (port 3000)

```bash
cd "server"
npm install
npm run dev
```

### 2) Start the frontend (port 5173)

```bash
cd "web"
npm install
npm run dev
```

Vite is configured to proxy `/api/*` and `/healthz` to `http://localhost:3000` (see `web/vite.config.ts`).

## Build (production)

```bash
cd "web"
npm run build
npm run preview
```

The production build output is in `web/dist/`.

## Docker (local)

Build and run the production container locally:

```bash
docker build -t colorsnap:local .
docker run -p 3000:3000 colorsnap:local
```

Then open `http://localhost:3000`.

NOTE: The Dockerfile will use `npm ci` if `package-lock.json` files exist, otherwise it falls back to `npm install`.
TODO: commit lockfiles for reproducible builds.

## Where to edit things

- **Pages (routes)**: `web/src/pages/*`
- **Shared layout (header/footer)**: `web/src/components/*`
- **Global styles**: `web/public/global.css`
- **Images**: `web/public/images/*` (served at `images/...`)
- **Backend API + static hosting**: `server/src/index.ts`
- **AWS CDK stack**: `infra/src/stacks/ColorSnapStack.ts`

## Notes about the demo logic

- **Upload → Result** uses `localStorage` key `uploadedPhoto` (Base64 data URL) to preserve your photo across pages.
- **Shopping cart** uses `localStorage` key `shoppingCart`.
- **Bookings API** currently stores data **in-memory** (not durable). See TODOs in `server/src/index.ts`.

## AWS deployment (ECS Fargate + ALB + ECR) — real “dynamic” hosting

### What you get

- ALB as the public entrypoint (HTTP/optional HTTPS)
- ECS Fargate running your containerized app
- ECR repository for images
- CloudWatch Logs for container logs
- Optional: custom domain + HTTPS (Route53 + ACM) — TODO in CDK code
- Optional: database (RDS Postgres) — TODO in CDK + server code

### 0) Prerequisites

- AWS account + AWS CLI credentials configured locally
- Node.js 18+
- (Recommended) a dedicated AWS account/region for this project

### 1) Deploy the infrastructure once (CDK)

```bash
cd "infra"
npm install
npx cdk bootstrap
npx cdk deploy -c projectName=colorsnap -c enableHttps=false
```

After deployment, CDK outputs:
- ALB DNS name (you can open it in the browser)
- ECR repo name
- ECS cluster/service names
- Task execution/task role ARNs (needed for CI/CD workflow)

### 2) Enable HTTPS + custom domain (optional, + big interview points)

You must first:
- Create/own a domain and host it in Route53
- Request an ACM certificate in the SAME REGION as your ALB

Then deploy with context values (see TODO in `infra/src/stacks/ColorSnapStack.ts`).

### 3) CI/CD (GitHub Actions → ECR → ECS)

Workflow: `.github/workflows/deploy-ecs.yml`

TODO: You must configure GitHub → AWS permissions. Best practice is **OIDC**:
- Create an IAM role for GitHub Actions to assume
- Add the required secrets in GitHub:
  - `AWS_REGION`
  - `AWS_ROLE_ARN`
  - `ECR_REPOSITORY`
  - `ECS_CLUSTER`
  - `ECS_SERVICE`
  - `ECS_TASK_EXECUTION_ROLE_ARN`
  - `ECS_TASK_ROLE_ARN`

On every push to `main`, CI/CD will:
1) Build the Docker image
2) Push it to ECR
3) Register a new task definition and deploy it to the ECS service



