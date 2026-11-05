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

// The full privacy notice should remain visible on the published page, not only
// after a visitor clicks a footer anchor. Do not reveal the short draft placeholder.
const privacyNotice = document.getElementById("privacy");
if (privacyNotice && privacyNotice.querySelectorAll("h3").length >= 5) {
  privacyNotice.style.display = "block";
}
