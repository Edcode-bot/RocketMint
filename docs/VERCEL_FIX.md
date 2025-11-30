
# Vercel Deployment Fix Guide

## Issue Summary

RocketMint uses a custom Express server with Vite, which requires specific configuration for Vercel deployment. This guide provides the exact steps to deploy successfully.

## Package.json Scripts

Ensure your `package.json` has these scripts:

```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "vite build",
    "start": "NODE_ENV=production tsx server/index.ts",
    "preview": "vite preview"
  }
}
```

## Vercel Project Settings

1. **Framework Preset**: Select "Other" or "Vite"
2. **Build Command**: `npm run build`
3. **Output Directory**: `dist` (Vite default)
4. **Install Command**: `npm install` (default)
5. **Development Command**: `npm run dev` (optional)

## Environment Variables

Add these in Vercel Dashboard > Settings > Environment Variables:

```
NODE_ENV=production
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

## Important Notes

### 1. Remove `next export` Usage

This is a Vite project, not Next.js. Do NOT use `next export` or any Next.js commands.

### 2. Server Configuration

The Express server in `server/index.ts` handles:
- Static file serving from `dist/`
- API routes under `/api`
- SPA fallback for client-side routing

### 3. Content-Disposition Header

Check `server/static.ts` - ensure NO `Content-Disposition: attachment` headers are set, as this would force downloads instead of rendering pages.

Current configuration is correct:
```typescript
// ✓ Correct - no Content-Disposition header
res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
```

### 4. Port Binding

Vercel automatically provides `PORT` environment variable. The server should listen on:

```javascript
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0');
```

## Deployment Steps

### Option 1: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Option 2: GitHub Integration

1. Push code to GitHub repository
2. Import project in Vercel Dashboard
3. Configure settings as above
4. Deploy automatically on push

## Troubleshooting

### Build Fails

```bash
# Test build locally
npm run build

# Check output
ls -la dist/
```

### Server Doesn't Start

```bash
# Test production server locally
npm run build
npm start
```

### API Routes 404

Ensure `server/routes.ts` is properly exporting routes and mounted in `server/index.ts`:

```typescript
app.use('/api', routes);
```

### Static Files Not Loading

Check `dist/` directory structure after build:
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── ... (other static assets)
```

## Alternative: Replit Deployment

Since this is built on Replit, you can also deploy using Replit's native deployment:

1. Click "Deploy" button in Replit
2. Select "Reserved VM" or "Autoscale"
3. Configure environment variables
4. Deploy

Benefits:
- Zero configuration
- Automatic HTTPS
- Built-in database support
- Easy rollback

## Contact & Support

If deployment issues persist:
1. Check Vercel build logs
2. Verify all environment variables are set
3. Test build locally first
4. Consider Replit deployment as alternative

---

**Last Updated**: 2024-01-30
**Tested On**: Vercel, Replit Deploy
