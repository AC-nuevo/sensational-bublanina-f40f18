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
policyVisibilityStyle.textContent = `
  .privacy{display:none!important}
  .privacy:target{display:block!important}

  /* Give the mission statement a more distinctive, editorial feel. */
  .mission-copy h2{
    max-width: 760px;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(2.7rem, 5vw, 4.8rem);
    font-weight: 500;
    line-height: 1.04;
    letter-spacing: -.055em;
    text-wrap: balance;
  }
  .mission-copy p{
    max-width: 580px;
    line-height: 1.85;
  }
`;
document.head.appendChild(policyVisibilityStyle);
