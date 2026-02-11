# Deployment Guide

Complete guide for deploying CUET Lost & Found Box to production.

## 📋 Table of Contents

- [Deployment Options](#deployment-options)
- [Frontend Deployment](#frontend-deployment)
- [Backend Deployment (Future)](#backend-deployment-future)
- [Domain & SSL](#domain--ssl)
- [Environment Configuration](#environment-configuration)
- [Monitoring & Maintenance](#monitoring--maintenance)

---

## 🚀 Deployment Options

### Static Hosting (Current - Frontend Only)

Since the current version is frontend-only, you can deploy to any static hosting service:

- **GitHub Pages** - Free, integrated with GitHub
- **Netlify** - Free tier, easy deployment
- **Vercel** - Free tier, great performance
- **Cloudflare Pages** - Free, global CDN
- **AWS S3 + CloudFront** - Scalable, professional
- **Firebase Hosting** - Free tier available

### Full-Stack Hosting (Future - With Backend)

For the complete application with backend:

- **Heroku** - Easy deployment, free tier
- **DigitalOcean** - Droplets or App Platform
- **AWS** - EC2, Elastic Beanstalk, or Lambda
- **Google Cloud Platform** - App Engine or Compute Engine
- **Railway** - Modern deployment platform
- **Render** - Free tier for web services

---

## 🌐 Frontend Deployment

### Option 1: GitHub Pages

**Prerequisites:**
- GitHub account
- Repository pushed to GitHub

**Steps:**

1. **Prepare Repository**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Configure GitHub Pages**
   - Go to repository Settings
   - Navigate to Pages section
   - Source: Deploy from branch
   - Branch: `main` → `/Frontend` folder
   - Click Save

3. **Update File Paths** (if needed)
   
   If deploying from subdirectory, update paths in HTML files:
   ```html
   <!-- From -->
   <link rel="stylesheet" href="css/style.css">
   
   <!-- To -->
   <link rel="stylesheet" href="/css/style.css">
   ```

4. **Access Your Site**
   - URL: `https://username.github.io/repository-name/`
   - Wait 1-2 minutes for deployment

5. **Custom Domain** (optional)
   - Add CNAME file with your domain
   - Configure DNS records
   - Enable HTTPS

**GitHub Pages Configuration File** (optional):

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./Frontend
```

### Option 2: Netlify

**Steps:**

1. **Sign Up**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub

2. **Deploy**
   
   **Method A: Drag & Drop**
   - Drag `Frontend` folder to Netlify
   - Site is live immediately
   
   **Method B: Git Integration**
   - Click "New site from Git"
   - Choose repository
   - Build settings:
     - Base directory: `Frontend`
     - Build command: (leave empty)
     - Publish directory: `.`
   - Click Deploy

3. **Configure**
   - Custom domain: Settings → Domain management
   - HTTPS: Automatic
   - Environment variables: Site settings → Build & deploy

**Netlify Configuration** (`netlify.toml`):
```toml
[build]
  base = "Frontend"
  publish = "."

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
```

### Option 3: Vercel

**Steps:**

1. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

2. **Deploy via Web**
   - Go to [vercel.com](https://vercel.com)
   - Import Git repository
   - Root directory: `Frontend`
   - Framework preset: Other
   - Click Deploy

3. **Deploy via CLI**
   ```bash
   cd Frontend
   vercel
   ```

4. **Production Deployment**
   ```bash
   vercel --prod
   ```

**Vercel Configuration** (`vercel.json`):
```json
{
  "version": 2,
  "builds": [
    {
      "src": "Frontend/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/Frontend/$1"
    }
  ]
}
```

### Option 4: Cloudflare Pages

**Steps:**

1. **Create Account**
   - Sign up at [pages.cloudflare.com](https://pages.cloudflare.com)

2. **Connect Repository**
   - Click "Create a project"
   - Connect GitHub account
   - Select repository

3. **Configure Build**
   - Build command: (leave empty)
   - Build output directory: `Frontend`
   - Root directory: `/`

4. **Deploy**
   - Click "Save and Deploy"
   - Site goes live on Cloudflare's global network

### Option 5: AWS S3 + CloudFront

**Prerequisites:**
- AWS account
- AWS CLI installed

**Steps:**

1. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://cuet-lost-found-box
   ```

2. **Configure Bucket for Static Hosting**
   ```bash
   aws s3 website s3://cuet-lost-found-box \
     --index-document index.html \
     --error-document index.html
   ```

3. **Set Bucket Policy**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::cuet-lost-found-box/*"
       }
     ]
   }
   ```

4. **Upload Files**
   ```bash
   cd Frontend
   aws s3 sync . s3://cuet-lost-found-box
   ```

5. **Setup CloudFront** (optional, for CDN)
   - Create distribution
   - Origin: S3 bucket
   - Enable HTTPS
   - Configure caching

6. **Deployment Script** (`deploy.sh`):
   ```bash
   #!/bin/bash
   cd Frontend
   aws s3 sync . s3://cuet-lost-found-box --delete
   aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
   ```

---

## 🔒 Domain & SSL

### Custom Domain Setup

**For Netlify/Vercel:**
1. Add custom domain in dashboard
2. Update DNS records:
   ```
   Type: A
   Name: @
   Value: [Provider's IP]
   
   Type: CNAME
   Name: www
   Value: [Your site URL]
   ```

**For GitHub Pages:**
1. Add CNAME file with domain name
2. Update DNS:
   ```
   Type: A
   Name: @
   Value: 185.199.108.153
   Value: 185.199.109.153
   Value: 185.199.110.153
   Value: 185.199.111.153
   ```

### SSL Certificate

Most platforms provide free SSL automatically via Let's Encrypt.

**Manual SSL Setup** (if needed):
```bash
# Using Certbot
sudo certbot --nginx -d cuet-lost-found.com -d www.cuet-lost-found.com
```

---

## ⚙️ Environment Configuration

### Production Build Checklist

- [ ] Remove console.log() statements
- [ ] Minify CSS and JavaScript
- [ ] Optimize images
- [ ] Enable caching headers
- [ ] Configure CSP headers
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Check responsive design
- [ ] Verify all links work
- [ ] Test forms thoroughly

### Environment Variables

Create `.env.production`:
```env
NODE_ENV=production
API_BASE_URL=https://api.cuet-lost-found.com
ENABLE_ANALYTICS=true
SENTRY_DSN=your_sentry_dsn
```

### Build Optimization

**Minify CSS:**
```bash
# Using clean-css-cli
npm install -g clean-css-cli
cleancss -o style.min.css style.css
```

**Minify JavaScript:**
```bash
# Using terser
npm install -g terser
terser main.js -o main.min.js -c -m
```

**Optimize Images:**
```bash
# Using imagemin
npm install -g imagemin-cli
imagemin resources/*.png --out-dir=resources/optimized
```

---

## 📊 Monitoring & Maintenance

### Analytics

**Google Analytics Setup:**
```html
<!-- Add to <head> of all HTML files -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Error Tracking

**Sentry Setup:**
```html
<script src="https://browser.sentry-cdn.com/7.x.x/bundle.min.js"></script>
<script>
  Sentry.init({
    dsn: 'YOUR_SENTRY_DSN',
    environment: 'production',
    release: 'cuet-lost-found@1.0.0'
  });
</script>
```

### Uptime Monitoring

Use services like:
- UptimeRobot (free)
- Pingdom
- StatusCake
- Better Uptime

### Performance Monitoring

**Lighthouse CI:**
```bash
npm install -g @lhci/cli
lhci autorun --upload.target=temporary-public-storage
```

### Backup Strategy

**Automated Backups:**
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d)
aws s3 sync s3://cuet-lost-found-box s3://cuet-lost-found-backup/$DATE/
```

---

## 🔄 Continuous Deployment

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Configure AWS Credentials
      uses: aws-actions/configure-aws-credentials@v1
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1
    
    - name: Deploy to S3
      run: |
        cd Frontend
        aws s3 sync . s3://cuet-lost-found-box --delete
    
    - name: Invalidate CloudFront
      run: |
        aws cloudfront create-invalidation \
          --distribution-id ${{ secrets.CLOUDFRONT_DIST_ID }} \
          --paths "/*"
    
    - name: Notify Deployment
      run: echo "Deployment completed successfully!"
```

---

## 🐳 Docker Deployment (Future)

**Dockerfile:**
```dockerfile
FROM nginx:alpine

COPY Frontend /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**Docker Compose:**
```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped
```

**Deploy:**
```bash
docker-compose up -d
```

---

## ✅ Post-Deployment Checklist

- [ ] Site is accessible via HTTPS
- [ ] Custom domain works (if configured)
- [ ] All pages load correctly
- [ ] Forms submit successfully
- [ ] Images display properly
- [ ] Responsive design works on mobile
- [ ] No console errors
- [ ] Analytics tracking works
- [ ] Error monitoring active
- [ ] Backup system configured
- [ ] SSL certificate valid
- [ ] DNS records correct
- [ ] CDN configured (if applicable)

---

## 🆘 Troubleshooting

### Common Issues

**404 Errors:**
- Check build directory configuration
- Verify file paths in HTML
- Configure redirects for SPA

**CSS Not Loading:**
- Check MIME types
- Verify file paths
- Clear CDN cache

**Slow Performance:**
- Enable gzip compression
- Optimize images
- Use CDN
- Minify assets

---

## 📞 Support

For deployment assistance:
- Email: deploy@cuet-lost-found.com
- Documentation: See [README.md](../README.md)
- Issues: [GitHub Issues](https://github.com/yourusername/cuet-lost-found-box/issues)

---

<div align="center">
  <p><strong>Deploy with confidence! 🚀</strong></p>
</div>
