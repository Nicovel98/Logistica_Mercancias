# Frontend - Logística Mercancías

Aplicación React (Vite) para gestión y rastreo de envíos en tiempo real.

## Requisitos

- Node.js 18+
- npm
- Backend ejecutándose en `http://localhost:3000`

## Configuración

```bash
npm install
```

## Ejecutar

```bash
npm run dev
```

Por defecto Vite levanta el frontend en `http://localhost:5173`.

## Scripts disponibles

- `npm run dev` - inicia servidor de desarrollo (Vite)
- `npm run build` - genera build de producción
- `npm run preview` - sirve build de producción localmente

## Estructura principal

- `src/main.jsx` - punto de entrada de React
- `src/App.jsx` - composición principal de tabs, vistas y modal de confirmación
- `src/api.js` - cliente HTTP para consumir la API REST (`/api`)
- `src/components/` - componentes reutilizables y vistas por dominio
- `src/hooks/` - hooks de datos por dominio + hook orquestador
- `src/styles.css` - estilos globales y responsive

## Integración con backend

- Las llamadas REST usan `BASE_URL = '/api'` (archivo `src/api.js`).
- Socket.IO se conecta a `http://localhost:3000` (archivo `src/hooks/useLogisticaData.js`).

Si cambias host/puerto del backend, ajusta la URL del socket en `src/hooks/useLogisticaData.js` y la configuración de proxy/API según tu entorno.
