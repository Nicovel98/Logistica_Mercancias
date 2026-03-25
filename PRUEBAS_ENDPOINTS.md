# Pruebas de endpoints - Logística Mercancías

Este documento está alineado con el script automatizado actual en `test/test_endpoints.sh`.

## Requisitos previos

- Backend corriendo en `http://localhost:3000`
- Base de datos cargada con datos base
- MySQL corriendo
- `jq` instalado (opcional, pero recomendado)

## Ejecución recomendada (automática)

Desde la raíz del proyecto:

```bash
bash test/test_endpoints.sh
```

## Flujo que valida el script (1:1)

1. `GET /` (endpoint raíz y cuerpo de respuesta)
2. `GET /api/clientes`
3. `POST /api/clientes` (crea cliente de prueba)
4. `GET /api/productos`
5. `GET /api/transportistas`
6. `GET /api/rutas`
7. `GET /api/pedidos`
8. `GET /api/envios`
9. Flujo de envíos de prueba:
   - crea pedido temporal,
   - `POST /api/envios`,
   - `PUT /api/envios/:id`,
   - `DELETE /api/envios/:id`,
   - elimina pedido temporal.
10. `GET /api/envios/1/rastreo`
11. `POST /api/estados-envio` (estado temporal para `id_envio=1`)
12. `GET /api/envios/1/rastreo` (verifica actualización)
13. Rollback de datos temporales principales (cliente y estado creado)
14. Limpieza adicional de estados `Test Estado` residuales

## Verificaciones manuales rápidas (opcional)

```bash
curl -s http://localhost:3000/api/clientes | jq
curl -s http://localhost:3000/api/envios | jq
curl -s http://localhost:3000/api/envios/1/rastreo | jq
curl -s "http://localhost:3000/api/estados-envio?id_envio=1" | jq
```

## Notas

- El script está diseñado para dejar el entorno limpio al finalizar (rollback + limpieza de estados de prueba).
- Si falla alguna prueba, revisa primero que backend y base de datos estén activos con datos mínimos cargados.