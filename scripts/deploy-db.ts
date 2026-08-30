import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../src/db/schema';

const DATABASE_URL = process.env.DATABASE_URL!;

async function setupDatabase() {
  console.log('🔄 Setting up database...');
  
  const sql = neon(DATABASE_URL);
  const db = drizzle(sql);

  console.log('✅ Database connected');
  
  // Create tables
  await sql`
    CREATE TABLE IF NOT EXISTS articles (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT NOT NULL,
      featured BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  await sql`
    CREATE TABLE IF NOT EXISTS ad_settings (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      code TEXT,
      enabled BOOLEAN DEFAULT true,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  await sql`
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  console.log('✅ Tables created');
  
  // Insert default admin
  const bcrypt = require('bcryptjs');
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  await sql`
    INSERT INTO admin_users (username, password)
    VALUES ('admin', ${hashedPassword})
    ON CONFLICT (username) DO NOTHING;
  `;
  
  console.log('✅ Admin user created');
  console.log('📝 Default credentials: admin / password123');
  
  // Insert default ad slots
  const adSlots = [
    { name: 'header_desktop', enabled: true },
    { name: 'sidebar_desktop', enabled: true },
    { name: 'in_content_desktop', enabled: true },
    { name: 'header_tablet', enabled: true },
    { name: 'in_content_tablet', enabled: true },
    { name: 'header_mobile', enabled: true },
    { name: 'sticky_mobile', enabled: true },
    { name: 'popunder', enabled: true },
    { name: 'native_desktop', enabled: true },
    { name: 'native_mobile', enabled: true },
    { name: 'interstitial', enabled: false },
  ];
  
  for (const ad of adSlots) {
    await sql`
      INSERT INTO ad_settings (name, enabled)
      VALUES (${ad.name}, ${ad.enabled})
      ON CONFLICT (name) DO NOTHING;
    `;
  }
  
  console.log('✅ Ad slots created');
  console.log('✅ Database setup complete!');
}

setupDatabase().catch(console.error);
