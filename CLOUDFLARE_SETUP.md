# Configuración de Cloudflare Pages + Google Sheets para Asumit Construcciones

El sitio conserva su formulario propio, sin marca de agua ni publicidad. Cloudflare Pages recibe el formulario y una función lo reenvía a Google Apps Script, que agrega cada solicitud a una hoja privada de Google Sheets.

## 1. Crear la hoja de Google
1. Entra en https://sheets.google.com y crea una hoja llamada `Solicitudes Asumit`.
2. Copia el ID de la hoja desde su URL: es el texto entre `/d/` y `/edit`.

## 2. Crear el receptor de Google Apps Script
1. Entra en https://script.google.com y crea un proyecto.
2. Abre el archivo `Code.gs`, borra el ejemplo y pega el contenido de [google-apps-script/Code.gs](google-apps-script/Code.gs) del repositorio.
3. En **Project Settings** → **Script Properties**, agrega:
   - `ASUMIT_SHEET_ID`: el ID de tu hoja de Google.
   - `ASUMIT_FORM_SECRET`: crea una contraseña aleatoria larga (mínimo 32 caracteres). No la publiques ni la pongas en GitHub.
4. Haz clic en **Deploy** → **New deployment**.
5. Selecciona tipo **Web app**.
6. **Execute as:** Me.
7. **Who has access:** Anyone.
8. Haz clic en **Deploy**, autoriza los permisos solicitados y copia la URL que termina en `/exec`.

El acceso público al Web App es necesario para que el formulario pueda enviar datos sin iniciar sesión. El receptor valida una clave secreta que solo se configura en las propiedades de Apps Script y en Cloudflare; no se envía al navegador.

## 3. Configurar Cloudflare Pages
1. Abre Cloudflare → **Workers & Pages** → tu proyecto Pages.
2. Entra en **Settings** → **Environment variables** (o **Variables and Secrets**).
3. Agrega estas variables como secretos para **Production**:
   - `GOOGLE_APPS_SCRIPT_URL`: la URL /exec del despliegue de Apps Script.
   - `GOOGLE_SHEETS_SECRET`: exactamente la misma clave creada como `ASUMIT_FORM_SECRET`.
4. Guarda los cambios y vuelve a desplegar el proyecto para que la Function tome las variables.

## 4. Verificar
1. Abre el dominio de tu página y envía una solicitud de prueba.
2. Confirma que aparece una fila nueva en la pestaña **Solicitudes** de Google Sheets.
3. Comprueba que el sitio muestra el mensaje de envío exitoso.

## Seguridad y mantenimiento
- No compartas la hoja públicamente: mantenla privada y comparte solo con las personas autorizadas.
- No publiques la URL de Apps Script ni la clave secreta en archivos del sitio o en GitHub.
- Si creas una nueva versión del Web App de Apps Script, actualiza la URL en Cloudflare si cambia.
- No elimines Netlify ni los datos antiguos de Supabase hasta probar el nuevo flujo en el dominio definitivo.
- Los registros quedan en Google Sheets; no se necesita D1 para este flujo.
