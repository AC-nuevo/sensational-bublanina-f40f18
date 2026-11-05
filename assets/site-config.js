// Public website settings. No database credentials or private keys belong here.
window.ASUMIT_CONFIG = {
  whatsappNumber: "18294226063",
  companyPhone: "+1 829-422-6063",
  companyEmail: "info@asumitconstrucciones.com",
  serviceArea: "Santiago de los Caballeros, República Dominicana",
  facebookUrl: "",
  instagramUrl: ""
};

// Keep policy sections out of the main page flow until a visitor opens a policy link.
const policyVisibilityStyle = document.createElement("style");
policyVisibilityStyle.textContent = ".privacy{display:none!important}.privacy:target{display:block!important}";
document.head.appendChild(policyVisibilityStyle);
