import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { articles, adSettings, adminUsers } from '../src/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

const app = express();
const PORT = process.env.PORT || 3001;

// Database connection
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// JWT Secret
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret');

// ============= AUTH ROUTES =============

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await db.select()
      .from(adminUsers)
      .where(eq(adminUsers.username, username))
      .limit(1);
    
    if (user.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const valid = await bcrypt.compare(password, user[0].password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = await new SignJWT({ 
      id: user[0].id, 
      username: user[0].username 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(JWT_SECRET);
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'
    });
    
    res.json({ success: true, username: user[0].username });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true });
});

app.get('/api/auth/verify', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ authenticated: false });
    }
    
    await jwtVerify(token, JWT_SECRET);
    res.json({ authenticated: true });
  } catch (error) {
    res.status(401).json({ authenticated: false });
  }
});

// ============= ARTICLE ROUTES =============

app.get('/api/articles', async (req, res) => {
  try {
    const allArticles = await db.select().from(articles)
      .orderBy(articles.createdAt, 'desc');
    res.json(allArticles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

app.get('/api/articles/:id', async (req, res) => {
  try {
    const article = await db.select()
      .from(articles)
      .where(eq(articles.id, parseInt(req.params.id)))
      .limit(1);
    
    if (article.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

app.post('/api/articles', async (req, res) => {
  try {
    const { title, content, category, featured } = req.body;
    const result = await db.insert(articles).values({
      title,
      content,
      category,
      featured: featured || false
    }).returning();
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create article' });
  }
});

app.put('/api/articles/:id', async (req, res) => {
  try {
    const { title, content, category, featured } = req.body;
    const result = await db.update(articles)
      .set({ title, content, category, featured, updatedAt: new Date() })
      .where(eq(articles.id, parseInt(req.params.id)))
      .returning();
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update article' });
  }
});

app.delete('/api/articles/:id', async (req, res) => {
  try {
    await db.delete(articles)
      .where(eq(articles.id, parseInt(req.params.id)));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

// ============= AD ROUTES =============

app.get('/api/ads', async (req, res) => {
  try {
    const ads = await db.select().from(adSettings);
    res.json(ads);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ads' });
  }
});

app.put('/api/ads/:id', async (req, res) => {
  try {
    const { code, enabled } = req.body;
    const result = await db.update(adSettings)
      .set({ code, enabled, updatedAt: new Date() })
      .where(eq(adSettings.id, parseInt(req.params.id)))
      .returning();
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'Ad not found' });
    }
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update ad' });
  }
});

// ============= START SERVER =============

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
