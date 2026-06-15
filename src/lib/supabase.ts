import { createClient } from "@supabase/supabase-js";

// AI Agent Base（自管 Supabase，已套用 空系統底座 + AI 代理模組）。
// 刻意不讀 import.meta.env，避免 Lovable Cloud 覆寫環境變數時被導走。
const SUPABASE_URL = "https://vzhrxohknejzjwvbvckd.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6aHJ4b2hrbmVqemp3dmJ2Y2tkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MDMzNDAsImV4cCI6MjA5NzA3OTM0MH0.5zLokTDttXyq4RBrEgOuKrKRb8qBz5FosjAdvKrCw18";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
