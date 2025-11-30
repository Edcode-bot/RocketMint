
# Deployment Guide

## Deploying to Replit (Recommended)

RocketMint is optimized for deployment on Replit:

1. Click the "Deploy" button in the top-right of the Replit workspace
2. Select "Static Deployment" or "Autoscale Deployment" based on your needs
3. Configure:
   - Build command: `npm run build`
   - Public directory: `dist` (for static) or use default for autoscale
4. Click "Deploy"

Your app will be live at your Replit deployment URL.

## Alternative: Vercel Deployment

If deploying to Vercel:

### Prerequisites
- Vercel account connected to your GitHub repository
- Node.js 18+ environment

### Configuration

1. **Build Settings:**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

2. **Environment Variables:**
   Add these in Vercel dashboard under Settings > Environment Variables:
   ```
   NODE_ENV=production
   FIREBASE_API_KEY=your_key (if using Firebase)
   FIREBASE_PROJECT_ID=your_project_id
   # ... other Firebase vars from .env.example
   ```

3. **vercel.json** (optional, already configured):
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "framework": "vite"
   }
   ```

### Deploy Steps

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Or use Vercel's GitHub integration for automatic deployments on push.

### Important Notes

- Ensure `package.json` scripts are correct:
  - `build`: Production build command
  - `start`: Production server (for server-side apps)
- Static files are served from `dist/` directory
- API routes not supported in static deployment (use Replit or Vercel Functions)

## Troubleshooting

**Build fails:**
- Check Node.js version matches local development (18+)
- Verify all dependencies in package.json
- Check build logs for specific errors

**Environment variables not working:**
- Prefix client-side vars with `VITE_` for Vite to expose them
- Rebuild after adding new variables

**404 on routes:**
- Configure rewrites in Vercel to handle client-side routing
- Add to vercel.json: `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`
