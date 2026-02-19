-- Backfill why_it_works for existing use_cases (match by title)
-- Run after migration 002_add_why_it_works.sql

update use_cases set why_it_works = 'AI excels at turning structured notes into personalized, consistent copy—saving you from retyping the same info for each attendee.' where title = 'Draft follow-up emails after meetings';
update use_cases set why_it_works = 'Giving AI context upfront lets it synthesize information into a focused brief, so you walk in prepared without manual research.' where title = 'Create meeting prep briefs';
update use_cases set why_it_works = 'AI can quickly spot patterns and prioritization signals in data that would take hours to manually analyze.' where title = 'Summarize CRM data into insights';
update use_cases set why_it_works = 'Templates and constraints help AI produce persuasive, on-brand copy that you can refine instead of writing from scratch.' where title = 'Draft proposal sections';
update use_cases set why_it_works = 'AI can pull together publicly available info into a concise brief, giving you personalization angles without hours of research.' where title = 'Research prospect before outreach';
update use_cases set why_it_works = 'Short, personalized messages perform best—AI generates options within character limits that you can tweak.' where title = 'Draft LinkedIn connection messages';
update use_cases set why_it_works = 'Clear structure and keyword guidance help AI produce SEO-friendly outlines that you can expand efficiently.' where title = 'Create blog post outlines';
update use_cases set why_it_works = 'Platform-specific formatting and hooks are formulaic enough for AI to produce strong first drafts you can edit quickly.' where title = 'Draft social media posts';
update use_cases set why_it_works = 'AI is good at comparing metrics, spotting trends, and suggesting next steps from structured data.' where title = 'Analyze campaign performance';
update use_cases set why_it_works = 'A/B testing needs volume—AI can generate varied options (questions, numbers, urgency) that you can test.' where title = 'Write email subject lines';
update use_cases set why_it_works = 'AI can extract arguments and gaps from long content, helping you identify response angles faster.' where title = 'Summarize competitor content';
update use_cases set why_it_works = 'Testing different hooks (pain, benefit, question, social proof) works well when AI generates structured variations.' where title = 'Create ad copy variations';
update use_cases set why_it_works = 'AI turns dense data into plain-language summaries when given clear output structure.' where title = 'Summarize financial reports';
update use_cases set why_it_works = 'Structured comparison and causation analysis is a strength of AI when data is well formatted.' where title = 'Analyze variance in budgets';
update use_cases set why_it_works = 'Routine communications with clear requirements are ideal for consistent, repeatable AI output.' where title = 'Draft month-end close emails';
update use_cases set why_it_works = 'AI is trained to explain complex topics in accessible language with examples.' where title = 'Explain financial concepts simply';
update use_cases set why_it_works = 'Converting notes into structured docs (purpose, steps, troubleshooting) fits AI well when format is specified.' where title = 'Draft process documentation';
update use_cases set why_it_works = 'Extracting decisions, actions, and next steps from unstructured notes is a common AI use case.' where title = 'Summarize meeting notes';
update use_cases set why_it_works = 'AI can apply stated criteria to rank and explain priorities when the list and rules are clear.' where title = 'Prioritize tasks from backlog';
update use_cases set why_it_works = 'Structured formats with inclusive language guidelines help AI produce consistent, compliant job postings.' where title = 'Draft job descriptions';
update use_cases set why_it_works = 'Mixing question types with clear instructions yields balanced interview sets quickly.' where title = 'Prepare interview questions';
update use_cases set why_it_works = 'Formal, structured policy sections (purpose, scope, procedure) suit AI when requirements are explicit.' where title = 'Draft policy language';
update use_cases set why_it_works = 'Time-based structure and clear categories make onboarding plans easy for AI to generate.' where title = 'Create onboarding checklists';
update use_cases set why_it_works = 'Converting technical context into standard doc formats works when structure is specified.' where title = 'Document technical processes';
update use_cases set why_it_works = 'Incident reports map well to symptom–cause–fix–prevention structure for AI.' where title = 'Write troubleshooting guides';
update use_cases set why_it_works = 'AI can describe what code does when given context, improving maintainability.' where title = 'Add code comments';
update use_cases set why_it_works = 'Long threads with clear sections (issue, tried, status) are ideal for AI summarization.' where title = 'Summarize ticket history';
update use_cases set why_it_works = 'Empathetic tone plus structure (acknowledge, solve, next steps) is reproducible with AI.' where title = 'Draft response templates';
update use_cases set why_it_works = 'AI translation preserves tone and formatting when given clear instructions.' where title = 'Translate support content';
update use_cases set why_it_works = 'Theme extraction and sentiment from feedback fit AI pattern-matching capabilities.' where title = 'Summarize customer feedback';
update use_cases set why_it_works = 'Clear purpose and tone parameters help AI produce appropriate first drafts.' where title = 'Draft professional emails';
update use_cases set why_it_works = 'Bullet summaries with key decisions and numbers are a core AI strength.' where title = 'Summarize long documents';
update use_cases set why_it_works = 'Scattered topics with clear format (objective, time, decisions) are easy for AI to structure.' where title = 'Organize meeting agendas';
