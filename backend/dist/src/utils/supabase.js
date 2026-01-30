"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inMemoryDB = exports.supabase = void 0;
exports.hasDatabase = hasDatabase;
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️  Supabase credentials not configured. Using in-memory storage.');
}
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
// Helper to check if DB is available
function hasDatabase() {
    return !!(supabaseUrl && supabaseKey);
}
// In-memory fallback for development
exports.inMemoryDB = {
    brands: [],
    campaigns: [],
    leads: [],
    videos: [],
    users: []
};
//# sourceMappingURL=supabase.js.map