const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
});

export async function onRequestPost({ request, env }) {
  if (!env.GOOGLE_APPS_SCRIPT_URL || !env.GOOGLE_SHEETS_SECRET) {
    return json({ error: "El formulario todavía no está configurado. Inténtalo más tarde." }, 503);
  }

  let endpoint;
  try {
    endpoint = new URL(env.GOOGLE_APPS_SCRIPT_URL);
    if (endpoint.protocol !== "https:" || endpoint.hostname !== "script.google.com" || !endpoint.pathname.endsWith("/exec")) {
      throw new Error("Invalid Apps Script deployment URL");
    }
  } catch {
    console.error("GOOGLE_APPS_SCRIPT_URL must be the HTTPS /exec URL of the Apps Script web app");
    return json({ error: "El formulario no está configurado correctamente. Inténtalo más tarde." }, 503);
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
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return json({ error: "El contenido del formulario no es válido." }, 400);
  }

  const clean = value => typeof value === "string" ? value.trim() : "";
  const lead = {
    name: clean(data.name),
    phone: clean(data.phone),
    email: clean(data.email),
    project_type: clean(data.project_type),
    budget: clean(data.budget),
    details: clean(data.details),
    consent: data.consent === true
  };
  if (!lead.name || lead.name.length > 120 || !lead.phone || lead.phone.length > 30 ||
      (lead.email && (lead.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email))) ||
      !lead.project_type || lead.project_type.length > 100 ||
      lead.budget.length > 100 || !lead.details || lead.details.length > 5000 || !lead.consent) {
    return json({ error: "Revisa los campos obligatorios y acepta la política de privacidad." }, 400);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    // Apps Script web apps can redirect their response to googleusercontent.com.
    // Following the redirect lets this server-side request receive the final JSON response.
    const upstream = await fetch(endpoint.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...lead, secret: env.GOOGLE_SHEETS_SECRET }),
      redirect: "follow",
      signal: controller.signal
    });
    const responseText = await upstream.text();
    let result;
    try { result = JSON.parse(responseText); }
    catch { result = null; }

    if (!upstream.ok || !result || result.ok !== true) {
      console.error("Google Sheets submission failed", upstream.status, responseText.slice(0, 500));
      return json({ error: "No pudimos guardar tu solicitud. Inténtalo más tarde." }, 502);
    }
    return json({ ok: true });
  } catch (error) {
    console.error("Google Sheets connection failed", error);
    if (error?.name === "AbortError") {
      return json({ error: "La conexión tardó demasiado. Inténtalo nuevamente." }, 504);
    }
    return json({ error: "No pudimos conectar con el registro de solicitudes. Inténtalo más tarde." }, 502);
  } finally {
    clearTimeout(timeout);
  }
}
