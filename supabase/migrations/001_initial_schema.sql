-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Organizations
create table organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  industry text,
  company_size text,
  ai_tools text[],
  governance_notes text,
  created_at timestamp default now(),
  clerk_org_id text unique not null
);

-- Users (synced from Clerk)
create table users (
  id uuid primary key default uuid_generate_v4(),
  clerk_user_id text unique not null,
  email text not null,
  organization_id uuid references organizations(id),
  role text,
  time_priorities text[],
  is_individual boolean default false,
  ai_tools text[],
  created_at timestamp default now()
);

-- Use Cases (curated library)
create table use_cases (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  role text not null,
  tool text not null,
  time_activity text not null,
  prompt_template text not null,
  time_saved_minutes integer,
  created_at timestamp default now()
);

-- User Use Case Attempts
create table user_attempts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id),
  use_case_id uuid references use_cases(id),
  status text not null,
  feedback text,
  created_at timestamp default now()
);

-- Indexes
create index idx_users_org on users(organization_id);
create index idx_users_clerk on users(clerk_user_id);
create index idx_attempts_user on user_attempts(user_id);
create index idx_attempts_use_case on user_attempts(use_case_id);
create index idx_use_cases_role on use_cases(role);
create index idx_use_cases_tool on use_cases(tool);
