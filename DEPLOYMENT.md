# Deployment Guide - Canada Easy Guide

This guide provides detailed instructions for deploying your Canada Easy Guide website to production.

## Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] Changed the default admin password
- [ ] Updated JWT_SECRET to a secure random string
- [ ] Reviewed and updated ad codes with your actual advertising network scripts
- [ ] Tested the application locally
- [ ] Created at least some initial content

## Deployment Option 1: Vercel (Recommended - All-in-One)

Vercel provides the easiest deployment for Next.js applications with built-in PostgreSQL.

### Step 1: Install Vercel CLI

\`\`\`bash
npm install -g vercel
\`\`\`

### Step 2: Set Up Vercel Postgres

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Create a new project
3. Navigate to the Storage tab
4. Create a new Postgres database
5. Copy the connection string

### Step 3: Deploy

\`\`\`bash
# Login to Vercel
vercel login

# Deploy (follow the prompts)
vercel
\`\`\`

### Step 4: Configure Environment Variables

In the Vercel dashboard, add these environment variables:

- \`DATABASE_URL\`: Your Vercel Postgres connection string
- \`JWT_SECRET\`: A random secure string (use: openssl rand -base64 32)
- \`NEXT_PUBLIC_BASE_URL\`: Your Vercel deployment URL (e.g., https://canada-easy-guide.vercel.app)

### Step 5: Set Up Production Database

After deployment, you need to initialize the database:

\`\`\`bash
# Set your production database URL
export DATABASE_URL="your-vercel-postgres-url"

# Push schema
npx drizzle-kit push

# Seed database
npm run db:seed
\`\`\`

Alternatively, you can use Vercel CLI:

\`\`\`bash
# Install production dependencies
vercel env pull .env.production

# Push schema to production
source .env.production && npx drizzle-kit push

# Seed production database
source .env.production && npm run db:seed
\`\`\`

### Step 6: Redeploy

After setting environment variables, trigger a new deployment:

\`\`\`bash
vercel --prod
\`\`\`

## Deployment Option 2: Railway (Full-Stack Platform)

Railway provides a simple platform for deploying Node.js applications with PostgreSQL.

### Step 1: Create Railway Account

1. Go to [Railway](https://railway.app/)
2. Sign up with GitHub

### Step 2: Create New Project

\`\`\`bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init
\`\`\`

### Step 3: Add PostgreSQL

In the Railway dashboard:
1. Click "+ New"
2. Select "Database" → "PostgreSQL"
3. Railway will provide a DATABASE_URL

### Step 4: Configure Environment Variables

In Railway dashboard, add:
- \`DATABASE_URL\`: (automatically set by Railway)
- \`JWT_SECRET\`: Your secure secret key
- \`NEXT_PUBLIC_BASE_URL\`: Your Railway app URL

### Step 5: Deploy

\`\`\`bash
# Deploy
railway up
\`\`\`

### Step 6: Initialize Database

\`\`\`bash
# SSH into your Railway project
railway run bash

# Push schema
npx drizzle-kit push

# Seed database
npm run db:seed

# Exit
exit
\`\`\`

## Deployment Option 3: Render (Backend) + Cloudflare Pages (Frontend)

This option separates frontend and backend, but requires more configuration.

### Backend on Render

1. **Create Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Build Command: \`npm install && npm run build\`
   - Start Command: \`npm start\`

2. **Add PostgreSQL Database**
   - Click "New +" → "PostgreSQL"
   - Copy the internal database URL

3. **Environment Variables**
   - \`DATABASE_URL\`: Your Render PostgreSQL URL
   - \`JWT_SECRET\`: Your secure key
   - \`NEXT_PUBLIC_BASE_URL\`: Your Render web service URL

4. **Initialize Database**
   - Use Render Shell or add initialization to your build script

### Frontend on Cloudflare Pages

**Note**: Since this is a Next.js application with server-side features, deploying only the frontend to Cloudflare Pages won't work properly. The recommended approach is to use Vercel or Railway for the complete application.

## Deployment Option 4: Self-Hosted VPS (Advanced)

For complete control, deploy to your own VPS (DigitalOcean, AWS EC2, Linode, etc.).

### Requirements

- Ubuntu 22.04 or similar Linux distribution
- Node.js 18+
- PostgreSQL 14+
- Nginx (for reverse proxy)
- PM2 (for process management)

### Step 1: Set Up Server

\`\`\`bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
sudo apt install -y nginx

# Install PM2
sudo npm install -g pm2
\`\`\`

### Step 2: Set Up PostgreSQL

\`\`\`bash
# Create database and user
sudo -u postgres psql
CREATE DATABASE canada_guide;
CREATE USER canada_user WITH PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE canada_guide TO canada_user;
\q
\`\`\`

### Step 3: Deploy Application

\`\`\`bash
# Clone repository
git clone <your-repo-url> /var/www/canada-easy-guide
cd /var/www/canada-easy-guide

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
DATABASE_URL=postgresql://canada_user:your-secure-password@localhost:5432/canada_guide
JWT_SECRET=$(openssl rand -base64 32)
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
EOF

# Push database schema
npx drizzle-kit push

# Seed database
npm run db:seed

# Build application
npm run build

# Start with PM2
pm2 start npm --name "canada-guide" -- start
pm2 save
pm2 startup
\`\`\`

### Step 4: Configure Nginx

\`\`\`bash
sudo nano /etc/nginx/sites-available/canada-guide
\`\`\`

Add this configuration:

\`\`\`nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
\`\`\`

\`\`\`bash
# Enable site
sudo ln -s /etc/nginx/sites-available/canada-guide /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
\`\`\`

### Step 5: Set Up SSL with Let's Encrypt

\`\`\`bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
\`\`\`

## Post-Deployment Tasks

### 1. Change Admin Password

1. Login at \`your-domain.com/admin/login\` with default credentials
2. Use your database client to update the password:

\`\`\`sql
-- Generate new hash using bcrypt (example with bcryptjs)
-- Then update:
UPDATE admin_users 
SET password = '$2a$10$your_new_bcrypt_hash_here' 
WHERE username = 'admin';
\`\`\`

Or create a new admin user and delete the default one.

### 2. Configure Your Ads

1. Navigate to \`/admin/ads\`
2. Update each ad slot with your actual advertising network code
3. Enable/disable ads based on your monetization strategy

### 3. Create Initial Content

1. Navigate to \`/admin/articles/new\`
2. Create your first articles
3. Organize content by categories
4. Mark important articles as "Featured"

### 4. Set Up Monitoring

- Enable uptime monitoring (UptimeRobot, Pingdom)
- Set up error tracking (Sentry, LogRocket)
- Monitor database performance
- Set up automated backups for PostgreSQL

### 5. Performance Optimization

- Enable Vercel Analytics (if using Vercel)
- Configure caching headers
- Optimize images
- Monitor Core Web Vitals

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| \`DATABASE_URL\` | PostgreSQL connection string | \`postgresql://user:pass@host:5432/db\` |
| \`JWT_SECRET\` | Secret key for JWT tokens | Random 32+ character string |
| \`NEXT_PUBLIC_BASE_URL\` | Your website URL | \`https://yourdomain.com\` |

## Troubleshooting

### Database Connection Issues

\`\`\`bash
# Test database connection
psql "$DATABASE_URL" -c "SELECT 1;"
\`\`\`

### Build Failures

\`\`\`bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
\`\`\`

### Admin Login Not Working

- Check JWT_SECRET is set
- Clear browser cookies
- Verify admin user exists in database

### Ads Not Showing

- Check ad is enabled in admin panel
- Verify ad code is correct
- Check browser console for JavaScript errors
- Ensure ad blocker is disabled for testing

## Backup Strategy

### Automated Database Backups

\`\`\`bash
# Create backup script
cat > /usr/local/bin/backup-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups/canada-guide"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

pg_dump "$DATABASE_URL" > "$BACKUP_DIR/backup_$TIMESTAMP.sql"

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
EOF

chmod +x /usr/local/bin/backup-db.sh

# Add to crontab (daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-db.sh") | crontab -
\`\`\`

## Scaling Considerations

### Database Scaling
- Use connection pooling (already configured)
- Consider read replicas for high traffic
- Implement caching (Redis) for frequent queries

### Application Scaling
- Use Vercel's automatic scaling
- For self-hosted: Use PM2 cluster mode
- Consider CDN for static assets

### Monitoring
- Set up performance monitoring
- Track user analytics
- Monitor ad performance and revenue

## Support & Maintenance

### Regular Maintenance Tasks
- [ ] Weekly: Review analytics and performance
- [ ] Monthly: Update dependencies
- [ ] Monthly: Review and optimize database
- [ ] Quarterly: Security audit
- [ ] Quarterly: Content review and updates

### Update Procedure

\`\`\`bash
# Pull latest changes
git pull origin main

# Update dependencies
npm install

# Run migrations if needed
npx drizzle-kit push

# Rebuild
npm run build

# Restart application
pm2 restart canada-guide  # if using PM2
# or redeploy to Vercel/Railway
\`\`\`

---

**Deployment Complete!** 🚀

Your Canada Easy Guide is now live. Remember to:
- Change default passwords immediately
- Set up monitoring
- Configure your actual ad codes
- Create quality content
- Monitor performance and revenue

For questions or issues, refer to the main README.md file.
