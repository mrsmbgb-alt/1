# Site Structure - Canada Easy Guide

Complete overview of all pages, routes, and functionality.

## Public Routes (No Authentication Required)

### Homepage
**URL**: `/`  
**Description**: Main landing page with featured articles, categories, and latest content  
**Features**:
- Hero section with site introduction
- Category browsing cards
- 3 featured articles showcase
- 6 latest articles grid
- Device-specific ad placements

**Ad Placements**:
- Desktop: 728x90 header, 300x250 mid-content
- Tablet: 468x60 header
- Mobile: 320x50 sticky footer
- All: Popunder on interaction

---

### Article Page
**URL**: `/article/[id]`  
**Example**: `/article/1`, `/article/2`  
**Description**: Individual article display with full content  
**Features**:
- Full article content with HTML rendering
- Category badge (clickable)
- Publication and update dates
- Related articles (same category)
- Back to home button

**Ad Placements**:
- Desktop: 728x90 header, 300x250 sidebar (top), 468x60 in-content, 160x600 sidebar (bottom)
- Tablet: 468x60 header, native 4:1 in-content
- Mobile: Native 4:1 in-content, 320x50 sticky footer
- All: Popunder, smartlink in sponsored section

**Dynamic Data**:
- Article ID from URL parameter
- Content from database
- Related articles based on category
- Ad codes from ad settings

---

### Category Page
**URL**: `/category/[name]`  
**Examples**: `/category/Immigration`, `/category/Student%20Visa`  
**Description**: List all articles in a specific category  
**Features**:
- Category header with gradient
- Article count display
- Grid of article cards (responsive)
- Empty state if no articles
- Back to home button

**Ad Placements**:
- Desktop: 728x90 header, 300x250 bottom, ad after every 6 articles
- Tablet: 468x60 header
- Mobile: 320x50 sticky footer
- All: Popunder

**Dynamic Data**:
- Category name from URL (decoded)
- Articles filtered by category
- Dynamic article count

---

## Admin Routes (Authentication Required)

### Admin Login
**URL**: `/admin/login`  
**Description**: Authentication page for admin access  
**Features**:
- Username/password form
- Error handling
- Automatic redirect to dashboard on success
- Default credentials displayed

**Default Credentials**:
- Username: `admin`
- Password: `password123`

**Security**:
- Passwords hashed with bcrypt
- JWT token generation
- HTTP-only cookie storage

---

### Admin Dashboard
**URL**: `/admin`  
**Description**: Main admin control panel  
**Features**:
- Article statistics (total, featured, categories)
- Complete article list in table format
- Quick actions (View, Edit, Delete)
- Navigation to ad management
- Link to view public site

**Statistics Displayed**:
- Total articles count
- Featured articles count
- Number of unique categories

**Article Table Columns**:
- Title (linked)
- Category (badge)
- Featured status (badge)
- Created date
- Actions (View/Edit/Delete)

**Authentication**:
- Auto-redirect to login if not authenticated
- Check session on page load

---

### Create Article
**URL**: `/admin/articles/new`  
**Description**: Form to create new article  
**Features**:
- Title input
- Category input (with suggestions)
- HTML content textarea
- Featured checkbox
- Form validation
- Error handling
- Success redirect to dashboard

**Form Fields**:
- **Title** (required) - Article headline
- **Category** (required) - Article category
- **Content** (required) - HTML content
- **Featured** (optional) - Mark as featured

**Content Format**:
- Supports full HTML
- Common tags: `<p>`, `<h2>`, `<h3>`, `<ul>`, `<li>`, `<strong>`
- No WYSIWYG editor (raw HTML)

---

### Edit Article
**URL**: `/admin/articles/edit/[id]`  
**Example**: `/admin/articles/edit/1`  
**Description**: Update existing article  
**Features**:
- Pre-filled form with current data
- Same fields as create
- Update timestamps automatically
- Success redirect to dashboard
- Cancel option

**Load Process**:
1. Fetch article by ID
2. Populate form fields
3. Allow editing
4. Save updates on submit

---

### Ad Management
**URL**: `/admin/ads`  
**Description**: Centralized ad code management  
**Features**:
- List of all 11 ad slots
- Individual enable/disable toggles
- Code editor for each ad
- Save button (appears on change)
- Ad placement strategy guide
- Success/error messages

**Ad Slots**:
1. **popunder** - Popunder ad
2. **native_4_1** - Native banner 4:1
3. **native_1_4** - Native banner 1:4
4. **social_bar** - Social sharing bar
5. **banner_468_60** - Banner 468x60
6. **banner_300_250** - Banner 300x250
7. **banner_160_300** - Banner 160x300
8. **banner_160_600** - Banner 160x600
9. **smartlink** - Smart text link
10. **banner_320_50** - Banner 320x50
11. **banner_728_90** - Banner 728x90

**Each Ad Slot Shows**:
- Ad name
- Description/best use
- Current status (enabled/disabled)
- Code textarea
- Last updated timestamp
- Save button

**Changes Apply**:
- Immediately across entire site
- No rebuild required
- Server-side fetching

---

## API Routes

All API routes return JSON responses.

### Authentication Endpoints

#### POST `/api/auth/login`
**Description**: Admin login  
**Request Body**:
\`\`\`json
{
  "username": "admin",
  "password": "password123"
}
\`\`\`
**Response** (Success):
\`\`\`json
{
  "success": true,
  "username": "admin"
}
\`\`\`
**Response** (Error):
\`\`\`json
{
  "error": "Invalid credentials"
}
\`\`\`
**Sets Cookie**: `auth-token` (HTTP-only, 7 days)

---

#### POST `/api/auth/logout`
**Description**: Admin logout  
**Request**: Empty  
**Response**:
\`\`\`json
{
  "success": true
}
\`\`\`
**Deletes Cookie**: `auth-token`

---

#### GET `/api/auth/me`
**Description**: Get current authenticated user  
**Authentication**: Required  
**Response** (Success):
\`\`\`json
{
  "user": {
    "username": "admin",
    "userId": 1
  }
}
\`\`\`
**Response** (Not Authenticated):
\`\`\`json
{
  "error": "Not authenticated"
}
\`\`\`

---

### Article Endpoints

#### GET `/api/articles`
**Description**: List all articles with optional filters  
**Query Parameters**:
- `featured=true` - Only featured articles
- `category=Immigration` - Filter by category
- `limit=6` - Limit results

**Response**:
\`\`\`json
[
  {
    "id": 1,
    "title": "Complete Guide to Canadian Immigration",
    "content": "<p>Article content...</p>",
    "category": "Immigration",
    "featured": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
\`\`\`

---

#### GET `/api/articles/[id]`
**Description**: Get single article by ID  
**Response** (Success):
\`\`\`json
{
  "id": 1,
  "title": "Complete Guide to Canadian Immigration",
  "content": "<p>Article content...</p>",
  "category": "Immigration",
  "featured": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
\`\`\`
**Response** (Not Found):
\`\`\`json
{
  "error": "Article not found"
}
\`\`\`

---

#### POST `/api/articles`
**Description**: Create new article  
**Authentication**: Required  
**Request Body**:
\`\`\`json
{
  "title": "New Article Title",
  "content": "<p>Article content...</p>",
  "category": "Immigration",
  "featured": false
}
\`\`\`
**Response** (Success):
\`\`\`json
{
  "id": 7,
  "title": "New Article Title",
  "content": "<p>Article content...</p>",
  "category": "Immigration",
  "featured": false,
  "createdAt": "2024-01-20T15:45:00.000Z",
  "updatedAt": "2024-01-20T15:45:00.000Z"
}
\`\`\`

---

#### PUT `/api/articles/[id]`
**Description**: Update existing article  
**Authentication**: Required  
**Request Body**:
\`\`\`json
{
  "title": "Updated Title",
  "content": "<p>Updated content...</p>",
  "category": "Student Visa",
  "featured": true
}
\`\`\`
**Response**: Updated article object

---

#### DELETE `/api/articles/[id]`
**Description**: Delete article  
**Authentication**: Required  
**Response**:
\`\`\`json
{
  "success": true
}
\`\`\`

---

### Ad Settings Endpoints

#### GET `/api/ads`
**Description**: Get all ad settings  
**Response**:
\`\`\`json
[
  {
    "id": 1,
    "name": "banner_728_90",
    "code": "<script>...</script>",
    "enabled": true,
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
\`\`\`

---

#### PUT `/api/ads`
**Description**: Update ad setting  
**Authentication**: Required  
**Request Body**:
\`\`\`json
{
  "name": "banner_728_90",
  "code": "<script>new ad code...</script>",
  "enabled": true
}
\`\`\`
**Response**: Updated ad setting object

**Note**: Creates new ad setting if name doesn't exist

---

### Utility Endpoints

#### GET `/api/health`
**Description**: Health check endpoint  
**Response**:
\`\`\`json
{
  "status": "ok",
  "timestamp": "2024-01-20T15:45:00.000Z"
}
\`\`\`
**Use**: Uptime monitoring, deployment verification

---

## Database Schema

### Articles Table (`articles`)

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key, auto-increment |
| title | TEXT | Article title (required) |
| content | TEXT | HTML content (required) |
| category | VARCHAR(100) | Category name (required) |
| featured | BOOLEAN | Featured status (default: false) |
| createdAt | TIMESTAMP | Creation date (auto) |
| updatedAt | TIMESTAMP | Last update (auto) |

**Indexes**: Primary key on `id`

---

### Ad Settings Table (`ad_settings`)

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key, auto-increment |
| name | VARCHAR(100) | Unique ad identifier (required) |
| code | TEXT | Ad script/HTML (required) |
| enabled | BOOLEAN | Show/hide toggle (default: true) |
| updatedAt | TIMESTAMP | Last update (auto) |

**Indexes**: Primary key on `id`, unique on `name`

---

### Admin Users Table (`admin_users`)

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key, auto-increment |
| username | VARCHAR(50) | Unique username (required) |
| password | VARCHAR(255) | Bcrypt hash (required) |
| createdAt | TIMESTAMP | Creation date (auto) |

**Indexes**: Primary key on `id`, unique on `username`

**Security**: Passwords stored as bcrypt hashes, never plain text

---

## Component Architecture

### React Components

#### `AdSlot.tsx`
**Location**: `src/components/AdSlot.tsx`  
**Type**: Client Component  
**Props**:
- `adName: string` - Name of ad to display
- `className?: string` - Optional CSS classes

**Functionality**:
- Fetches ad code from API on mount
- Checks if ad is enabled
- Renders ad code via `dangerouslySetInnerHTML`
- Returns null if disabled or no code

**Usage Example**:
\`\`\`tsx
<AdSlot adName="banner_728_90" className="ad-desktop" />
\`\`\`

---

### Page Components

All pages are Next.js App Router components with:
- Server-side rendering (default)
- Async data fetching
- TypeScript types
- Tailwind CSS styling

---

## File Structure

\`\`\`
canada-easy-guide/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── admin/                    # Admin panel
│   │   │   ├── login/
│   │   │   │   └── page.tsx          # Login page
│   │   │   ├── articles/
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx      # Create article
│   │   │   │   └── edit/[id]/
│   │   │   │       └── page.tsx      # Edit article
│   │   │   ├── ads/
│   │   │   │   └── page.tsx          # Ad management
│   │   │   └── page.tsx              # Dashboard
│   │   ├── api/                      # API routes
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts    # Login endpoint
│   │   │   │   ├── logout/route.ts   # Logout endpoint
│   │   │   │   └── me/route.ts       # Current user
│   │   │   ├── articles/
│   │   │   │   ├── route.ts          # List/Create
│   │   │   │   └── [id]/route.ts     # Get/Update/Delete
│   │   │   ├── ads/
│   │   │   │   └── route.ts          # List/Update ads
│   │   │   └── health/
│   │   │       └── route.ts          # Health check
│   │   ├── article/[id]/
│   │   │   └── page.tsx              # Article page
│   │   ├── category/[name]/
│   │   │   └── page.tsx              # Category page
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Homepage
│   │   └── globals.css               # Global styles
│   ├── components/
│   │   └── AdSlot.tsx                # Ad component
│   ├── db/
│   │   ├── index.ts                  # DB connection
│   │   ├── schema.ts                 # DB schema
│   │   └── seed.ts                   # Seed script
│   └── lib/
│       └── auth.ts                   # Auth utilities
├── public/                            # Static assets
├── .env                              # Environment variables
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── tailwind.config.ts                # Tailwind config
├── README.md                         # Main documentation
├── QUICKSTART.md                     # Quick start guide
├── DEPLOYMENT.md                     # Deployment guide
├── AD_PLACEMENT_GUIDE.md             # Ad strategy
├── FEATURES.md                       # Feature list
└── SITEMAP.md                        # This file
\`\`\`

---

## Navigation Flow

### Public User Journey

\`\`\`
Homepage (/)
    ↓
    ├─→ Category (/category/[name])
    │       ↓
    │       └─→ Article (/article/[id])
    │               ↓
    │               ├─→ Related Article
    │               └─→ Back to Home
    │
    └─→ Featured Article (/article/[id])
            ↓
            ├─→ Related Article
            ├─→ Category
            └─→ Back to Home
\`\`\`

### Admin User Journey

\`\`\`
Login (/admin/login)
    ↓
Dashboard (/admin)
    ↓
    ├─→ View Public Site (/)
    │
    ├─→ Create Article (/admin/articles/new)
    │       ↓
    │       └─→ Back to Dashboard
    │
    ├─→ Edit Article (/admin/articles/edit/[id])
    │       ↓
    │       └─→ Back to Dashboard
    │
    └─→ Ad Management (/admin/ads)
            ↓
            └─→ Back to Dashboard
\`\`\`

---

## URL Patterns

### Public URLs
- `/` - Homepage
- `/article/1` - Article with ID 1
- `/article/2` - Article with ID 2
- `/category/Immigration` - Immigration category
- `/category/Student%20Visa` - Student Visa category (URL encoded)

### Admin URLs
- `/admin/login` - Login page
- `/admin` - Dashboard
- `/admin/articles/new` - Create article
- `/admin/articles/edit/1` - Edit article ID 1
- `/admin/ads` - Ad management

### API URLs
- `/api/articles` - Article operations
- `/api/articles/1` - Article ID 1
- `/api/ads` - Ad settings
- `/api/auth/login` - Login
- `/api/auth/logout` - Logout
- `/api/auth/me` - Current user
- `/api/health` - Health check

---

## Environment Variables

### Required Variables

\`\`\`env
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your-secret-key-minimum-32-characters
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
\`\`\`

### Variable Usage

- **DATABASE_URL**: Used in `src/db/index.ts` for PostgreSQL connection
- **JWT_SECRET**: Used in `src/lib/auth.ts` for token signing
- **NEXT_PUBLIC_BASE_URL**: Used in client-side fetch calls

### Security Notes

- Never commit `.env` to version control
- Use strong, random JWT_SECRET in production
- Change admin password after first login
- Use HTTPS in production (secure cookies)

---

## Deployment Checklist

Before going live:

- [ ] Change admin password
- [ ] Update JWT_SECRET
- [ ] Configure production DATABASE_URL
- [ ] Set NEXT_PUBLIC_BASE_URL
- [ ] Update ad codes with real advertising network
- [ ] Create initial content (10+ articles)
- [ ] Test on different devices
- [ ] Set up database backups
- [ ] Configure monitoring
- [ ] Test all admin functions
- [ ] Verify ad placements
- [ ] Check performance (Lighthouse)
- [ ] Set up SSL/HTTPS

---

## Support Resources

- **Quick Start**: See [QUICKSTART.md](QUICKSTART.md)
- **Full Documentation**: See [README.md](README.md)
- **Deployment**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Ad Strategy**: See [AD_PLACEMENT_GUIDE.md](AD_PLACEMENT_GUIDE.md)
- **Features**: See [FEATURES.md](FEATURES.md)

---

**This sitemap documents every route, endpoint, and component in Canada Easy Guide.** Use it as a reference for understanding the application structure and planning customizations.
