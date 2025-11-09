# Lenso Deployment Guide

Complete guide for deploying your Lenso application to production.

---

## 🚀 Quick Deployment Options

### 1. **Vercel** (Recommended - Easiest)

Vercel is the easiest way to deploy Next.js applications with zero configuration.

**Steps:**
1. Push your code to GitHub (already done!)
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository: `AmjadAlthabteh/lenzo_app_01`
5. Configure environment variables:
   - `OPENAI_API_KEY` - Your OpenAI API key
   - `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
   - `NEXTAUTH_URL` - Your production URL (e.g., https://lenso.vercel.app)
   - Optional: `GITHUB_ID`, `GITHUB_SECRET` for GitHub auth
   - Optional: AWS credentials for S3
6. Click "Deploy"

**Pros:**
- Zero configuration
- Automatic HTTPS
- Global CDN
- Automatic deployments on git push
- Free tier available
- Built specifically for Next.js

**Production URL:** `https://your-app-name.vercel.app`

---

### 2. **Netlify**

Another excellent platform for deploying Next.js apps.

**Steps:**
1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select `AmjadAlthabteh/lenzo_app_01`
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Add environment variables in Site settings → Environment variables
6. Deploy!

**Pros:**
- Simple deployment
- Automatic HTTPS
- Good free tier
- Form handling
- Serverless functions

**Production URL:** `https://your-app-name.netlify.app`

---

### 3. **Railway**

Full-stack deployment platform with database support.

**Steps:**
1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add environment variables
5. Railway will auto-detect Next.js and deploy

**Pros:**
- Easy database provisioning (PostgreSQL)
- Good for full-stack apps
- Free tier with $5/month credit
- Simple scaling

**Production URL:** `https://your-app.up.railway.app`

---

### 4. **AWS Amplify**

AWS's managed hosting for modern web apps.

**Steps:**
1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
2. Click "New app" → "Host web app"
3. Connect to GitHub
4. Select repository and branch
5. Configure build settings (auto-detected)
6. Add environment variables
7. Deploy

**Pros:**
- AWS ecosystem integration
- Good for S3 integration (already using S3 for media)
- Continuous deployment
- Global CDN

**Production URL:** `https://main.d1234567890.amplifyapp.com`

---

### 5. **DigitalOcean App Platform**

Simple PaaS with predictable pricing.

**Steps:**
1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Create new app from GitHub
3. Select your repository
4. Configure environment variables
5. Choose your plan ($5-12/month)
6. Deploy

**Pros:**
- Predictable pricing
- Managed databases
- Easy scaling
- Good documentation

---

### 6. **Self-Hosted (VPS)**

Deploy on your own server (DigitalOcean, Linode, AWS EC2, etc.)

**Steps:**
1. Set up a VPS (Ubuntu 22.04 recommended)
2. Install Node.js 18+:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
3. Install PM2 for process management:
   ```bash
   sudo npm install -g pm2
   ```
4. Clone your repository:
   ```bash
   git clone https://github.com/AmjadAlthabteh/lenzo_app_01.git
   cd lenzo_app_01
   ```
5. Install dependencies:
   ```bash
   npm install
   ```
6. Create `.env.local` with your environment variables
7. Build the app:
   ```bash
   npm run build
   ```
8. Start with PM2:
   ```bash
   pm2 start npm --name "lenso" -- start
   pm2 save
   pm2 startup
   ```
9. Set up Nginx as reverse proxy
10. Configure SSL with Let's Encrypt

**Pros:**
- Full control
- Cost-effective at scale
- Can customize everything

**Cons:**
- More setup required
- Need to manage server security
- Manual SSL configuration

---

## 📊 Database Options

### Current: SQLite (Development Only)
Your app currently uses SQLite (`file:./dev.db`), which is **NOT suitable for production**.

### Production Database Options:

#### **1. PostgreSQL on Vercel (Recommended)**
- Vercel Postgres - Managed PostgreSQL
- Automatic backups
- Easy setup from Vercel dashboard
- Update `DATABASE_URL` in env vars

#### **2. Supabase (Recommended)**
- Free tier with PostgreSQL
- Real-time features
- Built-in auth (can replace NextAuth)
- Dashboard for data management
- Get connection string from [supabase.com](https://supabase.com)

#### **3. PlanetScale**
- Serverless MySQL
- Generous free tier
- Good Prisma support
- Auto-scaling

#### **4. Railway PostgreSQL**
- Easy setup with Railway deployment
- $5/month for 1GB
- Automatic backups

**Migration Steps:**
1. Choose a database provider
2. Get the `DATABASE_URL` connection string
3. Add to environment variables
4. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

---

## 🔐 Environment Variables Checklist

Required for production:

```bash
# Required
OPENAI_API_KEY=sk-...                    # Your OpenAI API key
NEXTAUTH_SECRET=...                      # Generate with: openssl rand -base64 32
NEXTAUTH_URL=https://your-domain.com     # Your production URL
DATABASE_URL=postgresql://...            # Production database URL

# Optional - GitHub OAuth
GITHUB_ID=...
GITHUB_SECRET=...

# Optional - AWS S3 (for media uploads)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
S3_BUCKET=your-bucket-name
```

---

## 🎯 Pre-Deployment Checklist

- [ ] Update `DATABASE_URL` to production database
- [ ] Set all required environment variables
- [ ] Test build locally: `npm run build`
- [ ] Configure S3 for media uploads (or use alternative)
- [ ] Update `NEXTAUTH_URL` to production domain
- [ ] Enable HTTPS (most platforms do this automatically)
- [ ] Test all features in production
- [ ] Set up monitoring (Vercel Analytics, Sentry, etc.)
- [ ] Configure custom domain (optional)

---

## 🌐 Custom Domain Setup

Most platforms support custom domains:

1. **Buy a domain** (Namecheap, Google Domains, etc.)
2. **Add domain to your hosting platform**
3. **Update DNS records** (platform will provide instructions)
4. **Wait for DNS propagation** (5 minutes - 48 hours)
5. **SSL certificate** will be provisioned automatically

Example DNS records for Vercel:
```
Type: A     Name: @     Value: 76.76.21.21
Type: CNAME Name: www   Value: cname.vercel-dns.com
```

---

## 📈 Recommended Setup (Best for Lenso)

**For Quick Start:**
- **Hosting:** Vercel
- **Database:** Supabase (PostgreSQL)
- **Media Storage:** S3 (already configured) or Cloudinary
- **Domain:** Namecheap or Vercel Domains
- **Cost:** Free tier for everything!

**Deployment Time:** ~10 minutes

---

## 🔄 Continuous Deployment

Once connected to Vercel/Netlify/Railway:
- Every `git push` to `main` branch = automatic deployment
- Preview deployments for pull requests
- Instant rollbacks if needed

**Workflow:**
1. Make changes locally
2. Test: `npm run dev`
3. Commit: `git add . && git commit -m "..."`
4. Push: `git push`
5. Auto-deploy to production! 🚀

---

## 📱 Post-Deployment

After deploying:

1. **Test all features:**
   - Upload a moment
   - Check AI summarization
   - Verify feed updates
   - Test anonymous posting

2. **Monitor performance:**
   - Use Vercel Analytics
   - Check error logs
   - Monitor API usage (OpenAI)

3. **Set up analytics** (optional):
   - Google Analytics
   - Plausible
   - Umami

---

## 🆘 Troubleshooting

**Build fails:**
- Check all dependencies are in `package.json`
- Verify Node.js version (18+)
- Check build logs for errors

**Database connection issues:**
- Verify `DATABASE_URL` is correct
- Run migrations: `npx prisma migrate deploy`
- Check database is accessible from hosting platform

**Environment variables not working:**
- Restart deployment after adding env vars
- Check spelling and format
- Some platforms need `NEXT_PUBLIC_` prefix for client-side vars

---

## 💰 Cost Estimate

**Free Tier (Great for starting out):**
- Vercel: Free (unlimited personal projects)
- Supabase: Free (500MB database, 2GB bandwidth)
- S3: ~$1-5/month (pay as you go)
- Total: **$1-5/month**

**Paid Tier (For growth):**
- Vercel Pro: $20/month
- Supabase Pro: $25/month
- S3: ~$5-20/month
- Total: **$50-65/month**

---

## 🎉 Quick Start Command

```bash
# 1. Ensure everything is pushed to GitHub
git push

# 2. Go to Vercel
# Visit vercel.com → Import Git Repository

# 3. Add environment variables
# Add OPENAI_API_KEY, NEXTAUTH_SECRET, DATABASE_URL

# 4. Deploy!
# Click deploy and wait ~2 minutes

# Your app is live! 🚀
```

---

**Need help?** Check the official docs:
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Docs](https://vercel.com/docs)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
