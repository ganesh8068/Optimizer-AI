<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1KqQ5IJ2_ZxqQInk9w42XQhpuIsOpiY7m

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set the `VITE_GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
3. Run the app:
   ```bash
   npm run dev
   ```

## Run with Docker

**Prerequisites:** Docker & Docker Compose

### Development

```bash
docker-compose --profile dev up
```

Access at: http://localhost:3000

### Production

```bash
docker build --build-arg VITE_GEMINI_API_KEY=your_key -t optimizer-ai:latest .
docker run -p 3001:3001 optimizer-ai:latest
```

Access at: http://localhost:3001

## CI/CD Pipeline

This project includes an automated CI/CD pipeline with GitHub Actions. See [docs/CI_CD.md](docs/CI_CD.md) for detailed information.

### Pipeline Features

- ✅ Automated TypeScript type checking
- ✅ Multi-version Node.js testing (18.x, 20.x)
- ✅ Security vulnerability scanning
- ✅ Automatic builds and deployments
- ✅ Docker containerization support

### Setup

To enable CI/CD, set these GitHub secrets:

1. `VITE_GEMINI_API_KEY` - Your Google Gemini API key

## Build & Deploy

### Build for Production

```bash
npm run build
```

### Run Production Server

```bash
npm start
```

The server will start on port 3001 and serve the built application.
