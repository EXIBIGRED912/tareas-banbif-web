# Tareas BanBif

Aplicacion web responsive para gestionar tareas internas de proyectos con React, Vite, TypeScript, TailwindCSS y lucide-react. Consume la API real del Worker de Cloudflare mediante `VITE_API_URL`.

## Configuracion local

1. Instala dependencias:

```bash
npm install
```

2. Crea tu archivo `.env` tomando como base `.env.example`:

```bash
VITE_API_URL=https://wandering-violet-87c6.motelo108.workers.dev/api
```

3. Ejecuta en desarrollo:

```bash
npm run dev
```

4. Compila para produccion:

```bash
npm run build
```

## Cloudflare Pages

Configuracion recomendada:

- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_URL=https://wandering-violet-87c6.motelo108.workers.dev/api`

## Backend Worker

El archivo `worker.js` incluye una version robusta de referencia para:

- `GET /api/health`
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `PUT /api/tasks/:id/finish`
- `GET /api/dashboard/summary`

Usa `env.DB` como binding de Cloudflare D1 y guarda `tags` como JSON string. El frontend no toca D1 directamente.
