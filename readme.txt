ASUMIT CONSTRUCCIONES WEBSITE PROTOTYPE

Repository files
- index.html: responsive one-page website.
- assets/asumit-logo.jpeg: supplied company logo.
- assets/site-config.js: public contact and Supabase configuration placeholders.
- supabase/schema.sql: leads table and Row Level Security (RLS) policy.

SETUP BEFORE TESTING THE CONTACT FORM
1. Create or open the company's Supabase project.
2. In Supabase Dashboard > SQL Editor, run supabase/schema.sql.
3. Open assets/site-config.js and set:
   - supabaseUrl: Project URL from Supabase Project Settings > API.
   - supabasePublishableKey: publishable key (or legacy anon key).
   - whatsappNumber: WhatsApp number in international digits-only format.
   - companyPhone, companyEmail, serviceArea, facebookUrl and instagramUrl.
4. Commit the configuration to the deployment branch only after confirming the values. The publishable/anon key is designed to be public; NEVER put a service_role key or database password in frontend code.
5. Submit a test inquiry and verify that one row appears in public.leads.

FORM SECURITY
- Row Level Security is enabled.
- Anonymous visitors receive INSERT permission only, and the policy requires consent=true and source='website'.
- Anonymous visitors cannot SELECT, UPDATE or DELETE leads.
- The honeypot field and client-side validation reduce basic spam but are not a substitute for server-side rate limiting or CAPTCHA. For a public production launch, add a Supabase Edge Function with rate limiting and CAPTCHA verification (or an equivalent protected submission service).
- Restrict dashboard access to authorized company staff. Do not expose customer inquiries publicly.

BEFORE PUBLIC LAUNCH
1. Add and verify the real company phone, WhatsApp, email, office address and service area.
2. Replace social links with official company profile URLs.
3. Replace Unsplash inspiration photos with company-owned or properly licensed images of actual work. Until then, the gallery is explicitly labeled as inspiration, not completed company projects.
4. Add the company's own drone video if desired; the current button explains where video footage should be connected.
5. Complete and legally review the draft Privacy Policy and Website Terms, including the company's legal identity, address, privacy contact and applicable Dominican Republic requirements.
6. Test the website on mobile and desktop, test the form and verify the Supabase RLS behavior.
7. Choose and configure frontend hosting. Supabase is the backend/database; it does not automatically host this static website.

BRANCH
Current implementation work is isolated in fix/prototype-css. Review the pull request before merging to main.
