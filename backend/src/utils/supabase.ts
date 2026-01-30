import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️  Supabase credentials not configured. Using in-memory storage.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper to check if DB is available
export function hasDatabase(): boolean {
  return !!(supabaseUrl && supabaseKey);
}

// In-memory fallback for development
export const inMemoryDB = {
  brands: [] as any[],
  campaigns: [] as any[],
  leads: [] as any[],
  videos: [] as any[],
  users: [] as any[]
};
