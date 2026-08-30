# Canada Easy Guide - Full-Stack Immigration Website

A complete, production-ready immigration guide website built with Next.js, PostgreSQL, and smart ad management system.

## 🌟 Features

### Public Website
- **Homepage**: Hero section, category browsing, featured articles, latest articles
- **Article Pages**: Full article view with related articles and smart ad placements
- **Category Pages**: Browse articles by category
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Smart Ad Placement**: Device-specific ad display for optimal user experience

### Admin Panel
- **Secure Login**: Authentication with JWT tokens
- **Article Management**: Create, edit, delete articles with HTML content support
- **Ad Management**: Centralized ad code management with enable/disable toggles
- **Dashboard**: Statistics and quick overview of content

### Smart Ad Management
- **Device-Responsive**: Different ads for mobile, tablet, and desktop
- **Centralized Control**: Update all ad codes from one place
- **Non-Intrusive**: Smart placement strategy to maximize revenue without annoying users
- **11 Ad Slots**: Pre-configured with various banner sizes and formats

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **PostgreSQL** (version 14 or higher) - [Download here](https://www.postgresql.org/download/)
- **Git** - [Download here](https://git-scm.com/)

## 🚀 Quick Start

### 1. Clone the Repository

\`\`\`bash
git clone <repository-url>
cd canada-easy-guide
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Set Up Environment Variables

Create a \`.env\` file in the root directory:

\`\`\`env
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db
JWT_SECRET=your-secret-key-change-this-in-production
NEXT_PUBLIC_BASE_URL=http://localhost:3000
\`\`\`

**Important**: Change the \`JWT_SECRET\` to a random, secure string in production.

### 4. Set Up the Database

Make sure PostgreSQL is running, then create the database:

\`\`\`bash
# On macOS/Linux
psql -U postgres -c "CREATE DATABASE app_db;"

# On Windows (using psql command)
psql -U postgres
CREATE DATABASE app_db;
\q
\`\`\`

### 5. Push Database Schema

\`\`\`bash
npx drizzle-kit push
\`\`\`

### 6. Seed the Database

Populate the database with initial data (sample articles, admin user, and ad codes):

\`\`\`bash
npx tsx src/db/seed.ts
\`\`\`

**Default Admin Credentials:**
- Username: \`admin\`
- Password: \`password123\`

### 7. Run the Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Usage

### Accessing the Website
- **Homepage**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login

### Admin Panel Features

#### Article Management
1. Login at \`/admin/login\`
2. View all articles on the dashboard
3. Click "Create New Article" to add content
4. Edit or delete existing articles
5. Toggle "Featured" status for homepage display

#### Ad Management
1. Navigate to "Ad Management" from the admin dashboard
2. Each ad slot has:
   - Name and description
   - Enable/disable toggle
   - Code editor for ad scripts
   - Save button (appears when changes are made)
3. Changes apply immediately across the entire website

### Content Guidelines

#### Writing Articles
- Use HTML formatting for content
- Common tags: \`<p>\`, \`<h2>\`, \`<h3>\`, \`<ul>\`, \`<li>\`, \`<strong>\`
- Categories: Immigration, Express Entry, Student Visa, Work Permit, Family Sponsorship, Provincial Nominee
- Mark important articles as "Featured" for homepage display

#### Ad Placement Strategy

**Desktop View:**
- 728x90 banner at the top
- 300x250 sidebar ads
- 468x60 in-content ads

**Tablet View:**
- 468x60 header banner
- 300x250 in-content ads

**Mobile View:**
- 320x50 sticky bottom banner
- Single ad to avoid clutter

**Universal:**
- Popunder: Non-intrusive, triggers on user interaction
- Native ads: Blend with content design

## 🗂️ Project Structure

\`\`\`
canada-easy-guide/
├── src/
│   ├── app/
│   │   ├── admin/              # Admin panel pages
│   │   │   ├── login/          # Admin login
│   │   │   ├── articles/       # Article CRUD
│   │   │   └── ads/            # Ad management
│   │   ├── api/                # API routes
│   │   │   ├── auth/           # Authentication endpoints
│   │   │   ├── articles/       # Article CRUD endpoints
│   │   │   └── ads/            # Ad management endpoints
│   │   ├── article/[id]/       # Individual article pages
│   │   ├── category/[name]/    # Category listing pages
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Homepage
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   └── AdSlot.tsx          # Reusable ad component
│   ├── db/
│   │   ├── index.ts            # Database connection
│   │   ├── schema.ts           # Database schema
│   │   └── seed.ts             # Seed script
│   └── lib/
│       └── auth.ts             # Authentication utilities
├── .env                        # Environment variables
├── package.json                # Dependencies
└── README.md                   # This file
\`\`\`

## 🌐 Deployment

### Option 1: Vercel (Recommended)

#### Deploy the Application

1. **Install Vercel CLI:**
   \`\`\`bash
   npm install -g vercel
   \`\`\`

2. **Set Up PostgreSQL:**
   - Use [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) (easiest)
   - Or use [Neon](https://neon.tech/), [Supabase](https://supabase.com/), or [Railway](https://railway.app/)

3. **Deploy:**
   \`\`\`bash
   vercel
   \`\`\`

4. **Set Environment Variables in Vercel Dashboard:**
   - \`DATABASE_URL\`: Your PostgreSQL connection string
   - \`JWT_SECRET\`: Random secure string
   - \`NEXT_PUBLIC_BASE_URL\`: Your production URL

5. **Run Database Migration:**
   \`\`\`bash
   # Install drizzle-kit globally
   npm install -g drizzle-kit

   # Push schema to production database
   DATABASE_URL=<your-production-db-url> npx drizzle-kit push
   
   # Seed the database
   DATABASE_URL=<your-production-db-url> npx tsx src/db/seed.ts
   \`\`\`

### Option 2: Separate Frontend & Backend

#### Frontend (Cloudflare Pages / Vercel)

1. Build the static frontend:
   \`\`\`bash
   npm run build
   \`\`\`

2. Deploy the \`.next\` folder to your hosting provider

#### Backend API (Render / Railway)

1. Set up a Node.js service
2. Set environment variables
3. Deploy the application

**Note**: For Next.js, it's easier to deploy as a single application (Option 1).

### Post-Deployment Steps

1. **Secure Your Admin Panel:**
   - Change the default admin password immediately
   - Use strong JWT_SECRET

2. **Configure Your Ads:**
   - Login to admin panel at \`your-domain.com/admin/login\`
   - Navigate to "Ad Management"
   - Update ad codes with your actual advertising network scripts
   - Enable/disable ads as needed

3. **Add Your Content:**
   - Create your own articles
   - Set up categories
   - Mark important articles as featured

## 🔒 Security

- Passwords are hashed with bcrypt
- JWT tokens for authentication
- HTTP-only cookies for session management
- Admin routes protected with middleware
- SQL injection protection via Drizzle ORM

## 📊 Database Schema

### Articles Table
- \`id\`: Serial primary key
- \`title\`: Article title
- \`content\`: HTML content
- \`category\`: Article category
- \`featured\`: Boolean for homepage display
- \`createdAt\`: Creation timestamp
- \`updatedAt\`: Last update timestamp

### Ad Settings Table
- \`id\`: Serial primary key
- \`name\`: Unique ad identifier
- \`code\`: Ad script/HTML code
- \`enabled\`: Boolean to show/hide ad
- \`updatedAt\`: Last update timestamp

### Admin Users Table
- \`id\`: Serial primary key
- \`username\`: Unique username
- \`password\`: Hashed password
- \`createdAt\`: Creation timestamp

## 🎨 Customization

### Branding
- Update colors in \`src/app/globals.css\`
- Modify logo/title in page components
- Change metadata in \`src/app/layout.tsx\`

### Ad Placement
- Adjust ad positions in page components
- Modify responsive breakpoints in CSS
- Add/remove ad slots in the database

### Content Categories
- Categories are dynamic based on articles
- Add new categories by creating articles with new category names
- No hardcoded category list

## 🐛 Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running: \`pg_isready\`
- Check DATABASE_URL in .env file
- Ensure database exists: \`psql -l\`

### Build Errors
- Clear Next.js cache: \`rm -rf .next\`
- Reinstall dependencies: \`rm -rf node_modules && npm install\`
- Check Node.js version: \`node -v\` (should be 18+)

### Authentication Issues
- Clear browser cookies
- Check JWT_SECRET is set
- Verify admin user exists in database

## 📝 License

This project is provided as-is for your use. Feel free to modify and customize as needed.

## 🤝 Support

For issues, questions, or contributions:
1. Check the troubleshooting section
2. Review the code comments
3. Test in development before deploying

## ✨ Credits

Built with:
- [Next.js 16](https://nextjs.org/) - React framework
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) - Password hashing
- [jose](https://github.com/panva/jose) - JWT tokens

---

**Happy Publishing! 🇨🇦**
