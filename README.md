# Logística Mercancías - TechLogistics S.A.

Proyecto de ejemplo full-stack para gestión y rastreo de envíos.

## Documentación por módulo

- [Backend](backend/README.md)
- [Frontend](frontend/README.md)

## Estructura del repositorio

- `db/` - scripts de la base de datos (MySQL)
- `backend/` - servidor Express + API REST + Socket.IO
- `frontend/` - aplicación React (Vite)
- `test/` - pruebas automatizadas de endpoints

## Requisitos

- Node.js 18+ / npm
- MySQL 8+
- `jq` para formato JSON en tests (opcional)

## Configuración

1. Importar `db/Logistica_Mercancias.sql` en MySQL.
2. Configurar credenciales en `backend/.env` (o `backend/db.js`).
3. Instalar dependencias:
   - `cd backend && npm install`
   - `cd frontend && npm install`

## Ejecutar

- Backend:
  - `cd backend && npm run dev` o `node app.js`
- Frontend:
  - `cd frontend && npm run dev`

## Accesos rápidos

- API backend: `http://localhost:3000`
- Frontend (Vite): `http://localhost:5173`

## API y pruebas

- Usa `test/test_endpoints.sh` con backend corriendo.
- También hay un documento de pruebas: `PRUEBAS_ENDPOINTS.md`.
