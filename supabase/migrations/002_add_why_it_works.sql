-- Add why_it_works column to use_cases for explanatory blurbs
alter table use_cases add column if not exists why_it_works text;
