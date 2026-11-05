const HEADERS = [
  "Fecha y hora", "Nombre completo", "Teléfono / WhatsApp", "Correo electrónico",
  "Tipo de proyecto", "Presupuesto estimado", "Detalles del proyecto", "Consentimiento"
];

function doPost(e) {
  try {
    const props = PropertiesService.getScriptProperties();
    const expectedSecret = props.getProperty("ASUMIT_FORM_SECRET");
    const spreadsheetId = props.getProperty("ASUMIT_SHEET_ID");
    if (!expectedSecret || !spreadsheetId) throw new Error("Falta configurar las propiedades del script.");

    const data = JSON.parse((e.postData && e.postData.contents) || "{}");
    if (!data.secret || data.secret !== expectedSecret) {
      return output({ ok: false, error: "No autorizado." });
    }

    const fields = ["name", "phone", "project_type", "details"];
    for (const field of fields) {
      if (typeof data[field] !== "string" || !data[field].trim()) {
        return output({ ok: false, error: "Falta un campo obligatorio." });
      }
    }
    if (data.consent !== true) return output({ ok: false, error: "Se requiere consentimiento." });

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
      let sheet = spreadsheet.getSheetByName("Solicitudes");
      if (!sheet) sheet = spreadsheet.insertSheet("Solicitudes");
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(HEADERS);
        sheet.setFrozenRows(1);
      }
      const safe = value => {
        const s = String(value || "").trim();
        return /^[=+@\\-\\t\\r]/.test(s) ? "'" + s : s;
      };
      sheet.appendRow([
        new Date(), safe(data.name), safe(data.phone), safe(data.email),
        safe(data.project_type), safe(data.budget), safe(data.details), "Sí"
      ]);
    } finally {
      lock.releaseLock();
    }
    return output({ ok: true });
  } catch (err) {
    console.error(err);
    return output({ ok: false, error: "No se pudo guardar la solicitud." });
  }
}

function output(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
