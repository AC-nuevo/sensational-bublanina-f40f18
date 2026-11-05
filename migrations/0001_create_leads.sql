-- Cloudflare D1 database schema for Asumit Construcciones website inquiries.
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 120),
  phone TEXT NOT NULL CHECK (length(phone) BETWEEN 1 AND 30),
  email TEXT CHECK (email IS NULL OR length(email) <= 254),
  project_type TEXT NOT NULL CHECK (length(project_type) BETWEEN 1 AND 100),
  budget TEXT CHECK (budget IS NULL OR length(budget) <= 100),
  details TEXT NOT NULL CHECK (length(details) BETWEEN 1 AND 5000),
  consent INTEGER NOT NULL CHECK (consent = 1),
  source TEXT NOT NULL DEFAULT 'website' CHECK (source = 'website'),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);
