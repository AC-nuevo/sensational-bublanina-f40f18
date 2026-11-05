# Configuración de Cloudflare para Asumit Construcciones

El sitio usa HTML/CSS/JavaScript propio y una Cloudflare Pages Function. El formulario no inserta marcas, logotipos ni publicidad de Cloudflare en la página.

## 1. Crear el proyecto Pages
- Cloudflare Dashboard → Workers & Pages → Create application → Pages → Connect to Git.
- Conecta `AC-nuevo/sensational-bublanina-f40f18`.
- Production branch: `main`.
- Framework preset: `None`.
- Build command: vacío.
- Build output directory: `.` (la carpeta raíz, donde está `index.html`).
- Guarda y despliega.

## 2. Crear la base de datos D1
- Workers & Pages → D1 SQL Database → Create database.
- Nombre sugerido: `asumit-leads`.
- Abre la base de datos, entra en Console y ejecuta el contenido de `migrations/0001_create_leads.sql`.

## 3. Conectar D1 con Pages
- Abre el proyecto Pages → Settings → Bindings → Add → D1 database.
- Variable name: `ASUMIT_DB` (debe escribirse exactamente así).
- Selecciona la base `asumit-leads`.
- Guarda y vuelve a desplegar el proyecto para que la Function reciba el binding.

## 4. Dominio
- En Pages → Custom domains → Set up a custom domain, agrega el dominio que ya tienes en Cloudflare.
- Sigue las indicaciones de Cloudflare y espera a que el estado del dominio sea Active.

## 5. Prueba antes de retirar los servicios antiguos
- Abre el dominio de Pages y envía una solicitud de prueba con datos propios.
- En D1 → Console ejecuta: `SELECT id, name, phone, email, project_type, created_at FROM leads ORDER BY id DESC LIMIT 10;`
- Confirma que aparece la solicitud y que la página muestra el mensaje de éxito.

## Importante
- El formulario está diseñado sin servicios externos de formularios ni marcas visibles.
- Los datos se guardan en D1. Para revisar solicitudes, usa D1 → Console; no hay todavía un panel administrativo público.
- No elimines el proyecto ni la base de Supabase hasta que Cloudflare esté publicado, el dominio esté activo y la prueba de envío/lectura haya funcionado.
- Protege el acceso al panel de Cloudflare con autenticación multifactor. No publiques credenciales ni tokens en GitHub.
