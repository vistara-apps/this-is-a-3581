import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database schema helper functions
export const createTables = async () => {
  // This would typically be done via Supabase migrations
  // Including here for reference of the expected schema
  
  const userTableSQL = `
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'lifetime')),
      preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'es')),
      trusted_contacts JSONB DEFAULT '[]',
      settings JSONB DEFAULT '{}',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `

  const legalContentTableSQL = `
    CREATE TABLE IF NOT EXISTS legal_content (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      content_id TEXT NOT NULL,
      state TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('traffic', 'search', 'arrest', 'general')),
      title TEXT NOT NULL,
      body JSONB NOT NULL,
      script JSONB,
      language TEXT DEFAULT 'en' CHECK (language IN ('en', 'es')),
      version INTEGER DEFAULT 1,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(content_id, state, type, language)
    );
  `

  const recordingTableSQL = `
    CREATE TABLE IF NOT EXISTS recordings (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      file_path TEXT,
      duration INTEGER,
      metadata JSONB DEFAULT '{}',
      encrypted BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `

  const alertTableSQL = `
    CREATE TABLE IF NOT EXISTS alerts (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      location JSONB,
      contacts_notified JSONB DEFAULT '[]',
      status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'failed')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `

  // Note: These would be executed via Supabase dashboard or migrations
  console.log('Database schema defined:', {
    userTableSQL,
    legalContentTableSQL,
    recordingTableSQL,
    alertTableSQL
  })
}
