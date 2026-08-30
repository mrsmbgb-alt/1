# Quick Start Guide - Canada Easy Guide

Get your Canada Easy Guide website up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- PostgreSQL installed and running
- Basic command line knowledge

## Installation Steps

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Configure Environment

Create a \`.env\` file in the project root:

\`\`\`env
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db
JWT_SECRET=your-secret-key-change-this
NEXT_PUBLIC_BASE_URL=http://localhost:3000
\`\`\`

### 3. Create Database

\`\`\`bash
# On macOS/Linux
createdb app_db

# Or using psql
psql -U postgres -c "CREATE DATABASE app_db;"
\`\`\`

### 4. Initialize Database

\`\`\`bash
# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
\`\`\`

### 5. Start Development Server

\`\`\`bash
npm run dev
\`\`\`

### 6. Access Your Website

- **Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin/login
  - Username: \`admin\`
  - Password: \`password123\`

## What's Included

### Sample Content
- 6 immigration-related articles
- Multiple categories
- Featured articles configured
- All 11 ad slots pre-configured with sample codes

### Admin Features
- Full article CRUD operations
- Category management
- Featured article toggling
- Centralized ad code management

## Next Steps

1. **Login to Admin Panel**
   - Go to http://localhost:3000/admin/login
   - Use credentials: admin / password123

2. **Update Ad Codes**
   - Navigate to "Ad Management"
   - Replace sample ad codes with your actual advertising network scripts
   - Enable/disable ads as needed

3. **Create Your Content**
   - Click "Create New Article"
   - Write your immigration guides
   - Organize by category
   - Mark important ones as "Featured"

4. **Customize Branding**
   - Update site title in \`src/app/layout.tsx\`
   - Modify colors in \`src/app/globals.css\`
   - Adjust hero section in \`src/app/page.tsx\`

## Common Tasks

### Add a New Article

1. Login to admin panel
2. Click "Create New Article"
3. Fill in title, content (HTML supported), category
4. Toggle "Featured" if it should appear on homepage
5. Click "Create Article"

### Update Ad Code

1. Go to Admin → Ad Management
2. Find the ad slot you want to update
3. Paste your ad network code in the textarea
4. Toggle enabled/disabled
5. Click "Save Changes"

### View Live Changes

Any changes you make in the admin panel are immediately visible on the public website (after page refresh).

## Troubleshooting

### Database Connection Error
- Make sure PostgreSQL is running: \`pg_isready\`
- Check DATABASE_URL in .env file
- Verify database exists: \`psql -l\`

### Port Already in Use
- Change port: \`PORT=3001 npm run dev\`
- Or kill process: \`lsof -ti:3000 | xargs kill\`

### Can't Login to Admin
- Verify you ran \`npm run db:seed\`
- Check browser console for errors
- Clear browser cookies

## Production Deployment

When ready to deploy:

1. Read the full [DEPLOYMENT.md](DEPLOYMENT.md) guide
2. Change admin password
3. Update JWT_SECRET
4. Configure production database
5. Deploy to Vercel, Railway, or your VPS

## Support

- **Full Documentation**: See [README.md](README.md)
- **Deployment Guide**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Code Structure**: Explore \`src/\` directory

## Project Structure Quick Reference

\`\`\`
src/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes
│   ├── article/[id]/      # Article pages
│   ├── category/[name]/   # Category pages
│   └── page.tsx           # Homepage
├── components/            # React components
│   └── AdSlot.tsx         # Ad display component
├── db/                    # Database
│   ├── schema.ts          # Database schema
│   ├── index.ts           # DB connection
│   └── seed.ts            # Seed script
└── lib/                   # Utilities
    └── auth.ts            # Authentication
\`\`\`

## Tips for Success

1. **Start with Content**: Create 10-15 quality articles before launching
2. **Test Ads First**: Use demo ad codes to test placement before real ads
3. **Mobile First**: Check how your site looks on mobile devices
4. **SEO Matters**: Use descriptive titles and organize content well
5. **Monitor Performance**: Use browser DevTools to check page speed

## Ready to Launch?

Once you have:
- [ ] Created quality content
- [ ] Configured your ad codes
- [ ] Tested on different devices
- [ ] Changed admin password
- [ ] Set secure JWT_SECRET

You're ready to deploy! Follow the [DEPLOYMENT.md](DEPLOYMENT.md) guide.

---

**Happy Publishing!** 🇨🇦

If you encounter any issues, check the main README.md for detailed troubleshooting.
