# Deployment Guide for N-400 Prep Companion

This guide covers deploying the N-400 Prep Companion to Cloudflare Pages.

## Prerequisites

1. A GitHub account with this repository
2. A Cloudflare account (free tier works fine)

## Cloudflare Pages Setup

### Step 1: Connect Repository

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages** > **Create application** > **Pages**
3. Click **Connect to Git**
4. Select your GitHub account and the `n400-prep-companion` repository
5. Click **Begin setup**

### Step 2: Configure Build Settings

Use these settings:

| Setting | Value |
|---------|-------|
| **Production branch** | `main` |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Root directory** | `/` (leave empty) |
| **Node.js version** | `20` |

### Step 3: Environment Variables

No environment variables are required - this is a fully client-side application.

### Step 4: Deploy

Click **Save and Deploy**. Cloudflare will:
1. Clone your repository
2. Install dependencies
3. Build the project
4. Deploy to their global CDN

## Deployment URLs

After deployment, your site will be available at:
- **Production**: `https://n400-prep-companion.pages.dev`
- **Preview**: Each PR gets a unique preview URL

## Custom Domain (Optional)

1. Go to your Pages project
2. Click **Custom domains**
3. Add your domain
4. Follow DNS configuration instructions

## Automatic Deployments

- **Push to `main`**: Triggers production deployment
- **Open a PR**: Creates preview deployment
- **Merge PR**: Updates production

## Build Verification

Before pushing, verify the build works locally:

```bash
npm install
npm run build
npm run preview  # Test the production build locally
```

## Troubleshooting

### Build Fails

1. Check Node.js version is 20+
2. Ensure all dependencies are in `package.json`
3. Run `npm run build` locally to see errors

### Site Not Loading

1. Check browser console for errors
2. Verify IndexedDB is available (not in private/incognito mode for first load)
3. Clear browser cache and reload

### Data Not Persisting

1. Check browser storage settings
2. Ensure site isn't in private browsing mode
3. Check for IndexedDB quota errors

## Performance Optimizations

Cloudflare Pages automatically provides:
- Global CDN distribution
- Automatic HTTPS
- HTTP/3 support
- Brotli compression
- Edge caching

## Security Headers

For additional security, add to `_headers` file in `public/`:

```
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
```

## Monitoring

- View deployment status in Cloudflare dashboard
- Check build logs for any issues
- Monitor traffic analytics

---

## Quick Deploy Checklist

- [ ] Repository connected to Cloudflare Pages
- [ ] Build settings configured
- [ ] Initial deployment successful
- [ ] Test all features in production
- [ ] Export/Import works correctly
- [ ] Offline functionality verified

## Support

For issues:
1. Check build logs in Cloudflare dashboard
2. Open issue on GitHub repository
3. Review Cloudflare Pages documentation
