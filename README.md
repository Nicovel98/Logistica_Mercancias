# 📦 Logística Mercancías - TechLogistics S.A.

Sistema full-stack para la gestión integral y rastreo de envíos en tiempo real. El sistema optimiza y minimiza los costos operativos, garantiza visibilidad sobre la mercancía y asegura entregas eficientes.

## 📑 Documentación por módulo

- [Backend](backend/README.md)
- [Frontend](frontend/README.md)
- [Diagrama de clases (Mermaid)](DIAGRAMA_CLASES.md)

## 🛠️ Stack Tecnológico

- **Frontend:** React (Vite) - Interfaz dinámica y responsiva.
- **Backend:** Node.js + Express - API REST robusta.
- **Tiempo Real:** Socket.IO para actualizaciones de rastreo en vivo.
- **Base de Datos:** MySQL - Gestión relacional de envíos y logística.
- **Testing:** Scripts automatizados para validación de endpoints.

## 📁 Estructura del repositorio

- `db/` - scripts de la base de datos (MySQL)
- `backend/` - servidor Express + API REST + Socket.IO
- `frontend/` - aplicación React (Vite)
- `test/` - pruebas automatizadas de endpoints

## 📋 Requisitos

- Node.js 18+ / npm
- MySQL 8+
- `jq` para formato JSON en tests (opcional)

## 🔧 Configuración

1. Importar `db/Logistica_Mercancias.sql` en MySQL.
2. Configurar credenciales en `backend/.env` (o `backend/db.js`).
3. Instalar dependencias:
   - `cd backend && npm install`
   - `cd frontend && npm install`

## 🚀 Ejecutar

- Backend:
  - `cd backend && npm run dev` o `node app.js`
- Frontend:
  - `cd frontend && npm run dev`

## 🌐 Accesos rápidos

- API backend: `http://localhost:3000`
- Frontend (Vite): `http://localhost:5173`

## 🧪 API y pruebas

- Usa `test/test_endpoints.sh` con backend corriendo.
- También hay un documento de pruebas: `PRUEBAS_ENDPOINTS.md`.
