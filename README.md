# Tareas BanBif

Aplicacion web responsive para gestionar tareas internas de proyectos. Usa React, Vite, TypeScript, TailwindCSS, Cloudflare Pages, Cloudflare Workers y Cloudflare D1.

## Desarrollo local

1. Instalar dependencias:

```bash
npm install
```

2. Crear `.env` desde `.env.example`:

```bash
VITE_API_URL=https://wandering-violet-87c6.motelo108.workers.dev/api
```

3. Ejecutar frontend:

```bash
npm run dev
```

4. Compilar:

```bash
npm run build
```

## Login seguro

El login se valida en el Cloudflare Worker. El frontend no guarda contrasenas, solo:

- `sessionStorage.auth_token`
- `sessionStorage.auth_user`

El token dura 8 horas. Todos los endpoints privados requieren `Authorization: Bearer <token>`.

## Generar hash de contrasena

No guardar contrasenas ni pepper reales en el repositorio.

```bash
node scripts/generate-password-hash.cjs "MiPasswordSeguro" "MiPepperSeguro"
```

El comando imprime:

```bash
AUTH_PASSWORD_HASH=...
```

## Secrets del Worker

Worker: `wandering-violet-87c6`

Crear estos secrets en Cloudflare Dashboard -> Workers & Pages -> `wandering-violet-87c6` -> Settings -> Variables and Secrets:

- `AUTH_USERNAME`
- `AUTH_PASSWORD_HASH`
- `AUTH_PASSWORD_PEPPER`
- `JWT_SECRET`

Alternativa CLI:

```bash
npx wrangler secret put AUTH_USERNAME
npx wrangler secret put AUTH_PASSWORD_HASH
npx wrangler secret put AUTH_PASSWORD_PEPPER
npx wrangler secret put JWT_SECRET
```

No colocar valores reales en `wrangler.toml`, `.env.example`, README ni GitHub.

## Worker y D1

Configuracion en `wrangler.toml`:

- Worker: `wandering-violet-87c6`
- Binding D1: `DB`
- D1 database: `tareas-banbif-db`
- D1 database_id: `7fbb7a6c-abf9-41cc-ac06-9c2222484b44`

Endpoints publicos:

- `GET /api/health`
- `POST /api/auth/login`

Endpoints protegidos:

- `GET /api/auth/me`
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `PUT /api/tasks/:id/finish`
- `GET /api/dashboard/summary`

## Cloudflare Pages

El frontend debe seguir conectado a GitHub.

Configuracion:

- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_URL=https://wandering-violet-87c6.motelo108.workers.dev/api`

Al hacer push a `main`, Cloudflare Pages redeploya automaticamente.

## GitHub Actions para Worker

El workflow `.github/workflows/deploy-worker.yml` despliega el Worker cuando cambian archivos del backend en `main`.

Crear estos secrets en GitHub -> Settings -> Secrets and variables -> Actions:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

`CLOUDFLARE_ACCOUNT_ID`:

```text
aedca35c4f30868175f96b69791df3e2
```

El API token debe tener permisos para desplegar Workers en la cuenta correspondiente.

## Privacidad

No registrar DNI, cuentas bancarias, claves, tokens, datos de clientes ni informacion confidencial.
