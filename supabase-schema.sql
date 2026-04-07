-- Supabase Database Schema for Resource Allocation Dashboard

-- 1. PODs Table
CREATE TABLE IF NOT EXISTS pods (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  bu TEXT NOT NULL,
  lead TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Resources Table
CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT,
  role TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Allocations Table (Main project/POD assignment)
CREATE TABLE IF NOT EXISTS allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id TEXT REFERENCES resources(id) ON DELETE CASCADE,
  pod_id TEXT REFERENCES pods(id) ON DELETE SET NULL,
  project_id TEXT,
  project_name TEXT,
  percentage INTEGER DEFAULT 0,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Sprint Allocations Table (Granular sprint overrides)
CREATE TABLE IF NOT EXISTS sprint_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  allocation_id UUID REFERENCES allocations(id) ON DELETE CASCADE,
  sprint_id TEXT NOT NULL,
  percentage INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE pods ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sprint_allocations ENABLE ROW LEVEL SECURITY;

-- Create policies (Allow all for now, can be hardened later)
CREATE POLICY "Allow all access" ON pods FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON resources FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON allocations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON sprint_allocations FOR ALL USING (true) WITH CHECK (true);
