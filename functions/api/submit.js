const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
});

export async function onRequestPost({ request, env }) {
  if (!env.ASUMIT_DB) return json({ error: "El formulario todavía no está configurado. Inténtalo más tarde." }, 503);

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return json({ error: "Formato de solicitud no válido." }, 415);

  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return json({ error: "Origen no autorizado." }, 403);
    } catch {
      return json({ error: "Origen no válido." }, 403);
    }
  }

  const length = Number(request.headers.get("content-length") || 0);
  if (length > 12000) return json({ error: "La solicitud es demasiado grande." }, 413);

  let data;
  try { data = await request.json(); }
  catch { return json({ error: "No se pudo leer el formulario." }, 400); }

  const clean = value => typeof value === "string" ? value.trim() : "";
  const name = clean(data.name);
  const phone = clean(data.phone);
  const email = clean(data.email) || null;
  const projectType = clean(data.project_type);
  const budget = clean(data.budget) || null;
  const details = clean(data.details);
  if (!name || name.length > 120 || !phone || phone.length > 30 ||
      (email && (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) ||
      !projectType || projectType.length > 100 || (budget && budget.length > 100) ||
      !details || details.length > 5000 || data.consent !== true) {
    return json({ error: "Revisa los campos obligatorios y acepta la política de privacidad." }, 400);
  }

  try {
    await env.ASUMIT_DB.prepare(
      "INSERT INTO leads (name, phone, email, project_type, budget, details, consent, source) VALUES (?, ?, ?, ?, ?, ?, 1, 'website')"
    ).bind(name, phone, email, projectType, budget, details).run();
    return json({ ok: true });
  } catch (error) {
    console.error("Lead submission failed", error);
    return json({ error: "No pudimos guardar tu solicitud. Inténtalo más tarde." }, 500);
  }
}

export async function onRequest(context) {
  if (context.request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: { Allow: "POST" } });
  }
  return onRequestPost(context);
}
