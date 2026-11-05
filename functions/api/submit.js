const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
});

export async function onRequestPost({ request, env }) {
  if (!env.GOOGLE_APPS_SCRIPT_URL || !env.GOOGLE_SHEETS_SECRET) {
    return json({ error: "El formulario todavía no está configurado. Inténtalo más tarde." }, 503);
  }
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return json({ error: "Formato de solicitud no válido." }, 415);
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return json({ error: "Origen no autorizado." }, 403);
    } catch { return json({ error: "Origen no válido." }, 403); }
  }
  const length = Number(request.headers.get("content-length") || 0);
  if (length > 12000) return json({ error: "La solicitud es demasiado grande." }, 413);
  let data;
  try { data = await request.json(); }
  catch { return json({ error: "No se pudo leer el formulario." }, 400); }

  const clean = value => typeof value === "string" ? value.trim() : "";
  const lead = {
    name: clean(data.name),
    phone: clean(data.phone),
    email: clean(data.email) || "",
    project_type: clean(data.project_type),
    budget: clean(data.budget) || "",
    details: clean(data.details),
    consent: data.consent === true
  };
  if (!lead.name || lead.name.length > 120 || !lead.phone || lead.phone.length > 30 ||
      (lead.email && (lead.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email))) ||
      !lead.project_type || lead.project_type.length > 100 ||
      lead.budget.length > 100 || !lead.details || lead.details.length > 5000 || !lead.consent) {
    return json({ error: "Revisa los campos obligatorios y acepta la política de privacidad." }, 400);
  }

  try {
    const upstream = await fetch(env.GOOGLE_APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...lead, secret: env.GOOGLE_SHEETS_SECRET })
    });
    const result = await upstream.json().catch(() => ({}));
    if (!upstream.ok || result.ok !== true) {
      console.error("Google Sheets submission failed", upstream.status, result);
      return json({ error: "No pudimos guardar tu solicitud. Inténtalo más tarde." }, 502);
    }
    return json({ ok: true });
  } catch (error) {
    console.error("Google Sheets connection failed", error);
    return json({ error: "No pudimos conectar con el registro de solicitudes. Inténtalo más tarde." }, 502);
  }
}
