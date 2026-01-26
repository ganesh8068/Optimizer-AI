# CI/CD Pipeline Documentation

## Overview

This project uses GitHub Actions for continuous integration and deployment (CI/CD). The pipeline automatically tests, builds, and deploys the application on every push to `main` or `develop` branches.

## Pipeline Stages

### 1. **Lint and Test** (Required)
- Runs on all pushes and pull requests
- Tests on Node.js 18.x and 20.x
- Steps:
  - Checkout code
  - Setup Node.js and cache dependencies
  - Run TypeScript compiler check (`tsc --noEmit`)
  - Build application (`npm run build`)
  - Upload build artifacts

### 2. **Security Scan** (Optional)
- Runs in parallel with lint-and-test
- Performs npm audit for vulnerabilities
- Integrates with Snyk for advanced security scanning (optional)
- Non-blocking (continues on error)

### 3. **Build and Deploy** (Conditional)
- Runs only on successful lint-and-test completion
- Triggered only on pushes to `main` or `develop` branches
- Builds application with production secrets
- Tests production server startup
- Deploys to appropriate environment:
  - **main branch** → Production
  - **develop branch** → Staging

### 4. **Notify** (Always)
- Final step that reports pipeline status
- Fails if lint-and-test or security-scan failed

## Setup Instructions

### 1. GitHub Secrets Configuration

Set the following secrets in your GitHub repository:

**Settings → Secrets and variables → Actions → New repository secret**

```
VITE_GEMINI_API_KEY     # Your Google Gemini API key
SNYK_TOKEN              # (Optional) Snyk security scanning token
```

### 2. GitHub Pages Deployment (Optional)

If deploying to GitHub Pages:
1. Go to **Settings → Pages**
2. Set source to "GitHub Actions"
3. Ensure `gh-pages` branch exists or enable automatic creation

### 3. Environment Variables

Create a `.env.local` file locally (not committed to git):

```env
VITE_GEMINI_API_KEY=your_api_key_here
```

## Local Development with Docker

### Development Container
```bash
docker-compose --profile dev up
```

Accesses:
- Vite dev server: `http://localhost:3000`
- Express server: `http://localhost:3001`

### Production Container
```bash
# Build with API key
docker build --build-arg VITE_GEMINI_API_KEY=your_key -t optimizer-ai:latest .

# Run production container
docker run -p 3001:3001 optimizer-ai:latest
```

Access at: `http://localhost:3001`

## Manual Deployment

### Build
```bash
npm ci
npm run build
```

### Run Production
```bash
npm start
```

The server will:
- Build the application
- Start Express server on port 3001
- Serve static files from `dist/` directory

## Monitoring

### Health Check
The Docker container includes a health check that monitors the application every 30 seconds.

### Build Artifacts
Successful builds are uploaded as artifacts and retained for 1 day.

## Troubleshooting

### Pipeline Fails on "Run TypeScript compiler check"
- Ensure all TypeScript files have proper type annotations
- Run locally: `npx tsc --noEmit`

### Pipeline Fails on "Build application"
- Check for build errors locally: `npm run build`
- Verify all dependencies are installed: `npm ci`

### Deploy Step Fails
- Verify `VITE_GEMINI_API_KEY` secret is set correctly
- Check Express server is starting: `npm start`
- Verify port 3001 is available

### Docker Build Fails
- Ensure Docker daemon is running
- Check Node.js version compatibility
- Clear Docker cache if needed: `docker builder prune`

## Branch Strategy

- **main**: Production-ready code
  - Triggers production deployment
  - Pull requests require passing CI/CD
  
- **develop**: Development branch
  - Triggers staging deployment
  - Integration branch before main

- **feature branches**: Feature development
  - Run CI/CD checks only (no deployment)
  - Create pull requests to develop

## Performance Optimization

The pipeline uses:
- **npm ci**: Faster, more reliable than npm install
- **Action caching**: Caches node_modules across runs
- **Multi-version testing**: Tests compatibility with Node 18 & 20
- **Parallel jobs**: Security scan runs alongside lint-and-test

## Security Best Practices

1. ✅ Secrets are never logged
2. ✅ API keys are injected at build time
3. ✅ npm audit runs on every build
4. ✅ Docker images are based on Alpine (smaller attack surface)
5. ✅ Health checks ensure container stability
6. ✅ Environment variables are isolated per environment

## Future Enhancements

- [ ] Add E2E testing with Playwright/Cypress
- [ ] Add performance benchmarking
- [ ] Auto-generate release notes
- [ ] Deploy to cloud platforms (Vercel, Railway, Render)
- [ ] Add Slack/Email notifications
- [ ] Database migrations in deployment
- [ ] Automated rollback on failed deployments
