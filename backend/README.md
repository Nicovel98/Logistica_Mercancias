# Backend - Logística Mercancías

APIs REST para gestión de clientes, pedidos, envíos y rastreo.

## Relación con el proyecto

- Documentación general: [README raíz](../README.md)
- Cliente web: [Frontend README](../frontend/README.md)

## Requisitos
- Node 18+
- MySQL 8+ (o MariaDB)

## Configuración
1. Copia `.env.example` a `.env`.
2. Ajusta valores de conexión.
3. Ejecuta script SQL en `db/Logistica_Mercancias.sql`.

4. Instala dependencias:
	```bash
	npm install
	```

## Ejecutar
```bash
npm run dev
```

Backend por defecto en `http://localhost:3000`.

## Endpoints principales
- `GET /api/clientes`
- `POST /api/clientes`
- `GET /api/pedidos`
- `POST /api/pedidos`
- `GET /api/envios`
- `POST /api/envios`
- `GET /api/envios/:id/rastreo`
- `GET /api/estados-envio?id_envio=...`
- `POST /api/estados-envio`

## Tiempo real (Socket.IO)

El backend emite eventos `rastreo_actualizado` cuando hay cambios en estados/envíos para refrescar el detalle en frontend.

## Pruebas rápidas

Con backend corriendo desde la raíz del proyecto:

```bash
bash test/test_endpoints.sh
```

