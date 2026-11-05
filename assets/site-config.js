// Public website settings. Safe for browser use ONLY with Supabase publishable/anon key.
// Never add a Supabase service_role key, database password, or other secret here.
window.ASUMIT_CONFIG = {
  supabaseUrl: "https://zchqiblllionvkzpmtja.supabase.co",
  supabasePublishableKey: "sb_publishable_z9Q3dWeiokmwPLmPEkhqGQ_hvy_73Nj",
  whatsappNumber: "18294226063",
  companyPhone: "+1 829-422-6063",
  companyEmail: "info@asumitconstrucciones.com",
  serviceArea: "Santiago de los Caballeros, República Dominicana",
  facebookUrl: "",
  instagramUrl: ""
};

// Keep policy sections out of the main page flow until a visitor opens a policy link.
// The form consent and footer links set the matching URL hash and reveal that section.
const policyVisibilityStyle = document.createElement("style");
policyVisibilityStyle.textContent = ".privacy{display:none!important}.privacy:target{display:block!important}";
document.head.appendChild(policyVisibilityStyle);
