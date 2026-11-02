ASUMIT CONSTRUCCIONES WEBSITE PROTOTYPE

Files:
- index.html: responsive one-page website prototype
- assets/asumit-logo.jpeg: supplied company logo

IMPORTANT BEFORE PUBLIC LAUNCH
1. Add the real company phone number, WhatsApp number, email, office address and service area.
2. Replace social link placeholders with the official Facebook and Instagram profile URLs; configure the WhatsApp link.
3. Add a short company-owned or licensed drone MP4 and connect the hero video player.
4. Gallery photos currently use remotely hosted Unsplash images as visual inspiration. Verify the usage rights and replace with actual company project photos before presenting them as company work.
5. Review the draft Privacy Policy and Terms with the company; complete its legal identity, jurisdiction and privacy contact.
6. Connect the lead form to Supabase with a table and suitable security controls. The form is intentionally not saving data yet.
7. Do not place a Supabase service-role key in browser JavaScript. Use only a publishable/anon key client-side, with appropriate RLS, or route submissions through an Edge Function.

SUPABASE / GITHUB NOTE
Supabase is used for the backend (database, storage and Edge Functions), and GitHub is used for source control. Supabase Storage serves files such as images and video; it does not by itself act like a conventional static-site host for an index.html website. Choose a frontend hosting/deployment approach separately before publishing the domain.
