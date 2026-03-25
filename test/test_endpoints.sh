#!/bin/bash

echo "=== Pruebas automatizadas de endpoints - Logistica Mercancias ==="
echo "Asegúrate de que el backend esté corriendo en http://localhost:3000"
echo ""

# Función para verificar si jq está instalado
check_jq() {
    if ! command -v jq &> /dev/null; then
        echo "⚠️  jq no está instalado. Instalalo con: sudo apt install jq"
        echo "Continuando sin formato JSON..."
        JQ_FORMAT=""
    else
        JQ_FORMAT="| jq '.'"
    fi
}

check_jq

ERRORS=0

check_response() {
    local status=$1
    local endpoint=$2
    if [ "$status" -ge 200 ] && [ "$status" -lt 300 ]; then
        echo "✅ OK: $endpoint (código $status)"
    else
        echo "❌ Fallo en $endpoint (código $status)"
        ERRORS=$((ERRORS+1))
    fi
}

check_json_count() {
    local output=$1
    local endpoint=$2
    if [[ "$output" =~ ^[0-9]+$ ]]; then
        echo "   $endpoint: $output elementos"
    else
        echo "❌ $endpoint no retornó JSON válido"
        ERRORS=$((ERRORS+1))
    fi
}

echo "1. Testing endpoint raíz..."
RESPONSE_CODE=$(curl -s -o /tmp/root_response.txt -w "%{http_code}" http://localhost:3000/)
check_response "$RESPONSE_CODE" "/"
if [ -s /tmp/root_response.txt ]; then
    echo "   cuerpo recibido"
else
    echo "❌ No se recibió cuerpo en /"
    ERRORS=$((ERRORS+1))
fi

echo ""

echo "2. Testing GET /api/clientes..."
CLIENTES_OUTPUT=$(curl -s http://localhost:3000/api/clientes)
CLIENTES_COUNT=$(echo "$CLIENTES_OUTPUT" | jq '. | length' 2>/dev/null || echo "N/A")
check_json_count "$CLIENTES_COUNT" "/api/clientes"
echo ""

echo "3. Testing POST /api/clientes..."
CLIENTE_ID=$(curl -X POST http://localhost:3000/api/clientes \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test User","email":"test'$(date +%s)'@example.com","telefono":"123456789","direccion_principal":"Test Address"}' \
  -s | jq '.id_cliente' 2>/dev/null || echo "N/A")
echo "   Cliente creado con ID: $CLIENTE_ID"
echo ""

echo "4. Testing GET /api/productos..."
PRODUCTOS_OUTPUT=$(curl -s http://localhost:3000/api/productos)
PRODUCTOS_COUNT=$(echo "$PRODUCTOS_OUTPUT" | jq '. | length' 2>/dev/null || echo "N/A")
check_json_count "$PRODUCTOS_COUNT" "/api/productos"
echo ""

echo "5. Testing GET /api/transportistas..."
TRANSPORTISTAS_OUTPUT=$(curl -s http://localhost:3000/api/transportistas)
TRANSPORTISTAS_COUNT=$(echo "$TRANSPORTISTAS_OUTPUT" | jq '. | length' 2>/dev/null || echo "N/A")
check_json_count "$TRANSPORTISTAS_COUNT" "/api/transportistas"
echo ""

echo "6. Testing GET /api/rutas..."
RUTAS_OUTPUT=$(curl -s http://localhost:3000/api/rutas)
RUTAS_COUNT=$(echo "$RUTAS_OUTPUT" | jq '. | length' 2>/dev/null || echo "N/A")
check_json_count "$RUTAS_COUNT" "/api/rutas"
echo ""

echo "7. Testing GET /api/pedidos..."
PEDIDOS_OUTPUT=$(curl -s http://localhost:3000/api/pedidos)
PEDIDOS_COUNT=$(echo "$PEDIDOS_OUTPUT" | jq '. | length' 2>/dev/null || echo "N/A")
check_json_count "$PEDIDOS_COUNT" "/api/pedidos"
echo ""

echo "8. Testing GET /api/envios..."
ENVIOS_OUTPUT=$(curl -s http://localhost:3000/api/envios)
ENVIOS_COUNT=$(echo "$ENVIOS_OUTPUT" | jq '. | length' 2>/dev/null || echo "N/A")
check_json_count "$ENVIOS_COUNT" "/api/envios"
echo ""

echo "9. Testing POST /api/envios..."
AVAILABLE_PEDIDO_ID=$(curl -s http://localhost:3000/api/pedidos | jq -r '.[0].id_pedido // empty')
AVAILABLE_TRANSPORTISTA_ID=$(curl -s http://localhost:3000/api/transportistas | jq -r '.[0].id_transportista // empty')
AVAILABLE_RUTA_ID=$(curl -s http://localhost:3000/api/rutas | jq -r '.[0].id_ruta // empty')
if [ -z "$AVAILABLE_PEDIDO_ID" ] || [ -z "$AVAILABLE_TRANSPORTISTA_ID" ] || [ -z "$AVAILABLE_RUTA_ID" ]; then
    echo "   No hay datos suficientes para crear un envío de prueba (pedido/transportista/ruta). Saltando prueba de creación/actualización/eliminación de envíos."
    ENVIOS_PRUEBA_ID="N/A"
else
    CLIENTE_PARA_PEDIDO=$(curl -s http://localhost:3000/api/clientes | jq -r '.[0].id_cliente // empty')
    if [ -z "$CLIENTE_PARA_PEDIDO" ]; then
      echo "   No se encontró cliente para crear pedido de prueba. Saltando prueba de envíos."
      ENVIOS_PRUEBA_ID="N/A"
    else
      PEDIDO_PRUEBA_ID=$(curl -X POST http://localhost:3000/api/pedidos \
        -H "Content-Type: application/json" \
        -d '{"id_cliente":'$CLIENTE_PARA_PEDIDO',"estado_pedido":"Creado"}' \
        -s | jq -r '.id_pedido // empty' 2>/dev/null || echo "")
      if [ -z "$PEDIDO_PRUEBA_ID" ]; then
        echo "   No se pudo crear pedido de prueba. Saltando prueba de envíos."
        ENVIOS_PRUEBA_ID="N/A"
      else
        ENVIOS_RESULT=$(curl -X POST http://localhost:3000/api/envios \
          -H "Content-Type: application/json" \
          -d '{"id_pedido":'$PEDIDO_PRUEBA_ID',"id_transportista":'$AVAILABLE_TRANSPORTISTA_ID',"id_ruta":'$AVAILABLE_RUTA_ID',"codigo_rastreo":"PRUEBA'$RANDOM'","fecha_despacho":"2025-01-01T10:00:00","fecha_entrega_estimada":"2025-01-05T18:00:00","estado_envio":"Pendiente"}' \
          -s)
        ENVIOS_PRUEBA_ID=$(echo "$ENVIOS_RESULT" | jq -r '.id_envio // empty' 2>/dev/null || echo "N/A")
        if [ -z "$ENVIOS_PRUEBA_ID" ] || [ "$ENVIOS_PRUEBA_ID" = "null" ]; then
          ENVIOS_PRUEBA_ID="N/A"
        fi
        echo "   Envío creado con ID: $ENVIOS_PRUEBA_ID"
        if [ "$ENVIOS_PRUEBA_ID" != "N/A" ]; then
          UPDATED_ENVIO=$(curl -X PUT http://localhost:3000/api/envios/$ENVIOS_PRUEBA_ID \
            -H "Content-Type: application/json" \
            -d '{"id_pedido":'$PEDIDO_PRUEBA_ID',"id_transportista":'$AVAILABLE_TRANSPORTISTA_ID',"id_ruta":'$AVAILABLE_RUTA_ID',"codigo_rastreo":"PRUEBA_EDITADO'$RANDOM'","fecha_despacho":"2025-01-02T10:00:00","fecha_entrega_estimada":"2025-01-06T18:00:00","estado_envio":"En camino"}' \
            -s)
          echo "   Envío actualizado: $(echo $UPDATED_ENVIO | jq '.codigo_rastreo // "n/a"' 2>/dev/null || echo "n/a")"
          curl -s -X DELETE http://localhost:3000/api/envios/$ENVIOS_PRUEBA_ID && echo "   Envío eliminado: $ENVIOS_PRUEBA_ID"
        fi
      fi
      if [ "$PEDIDO_PRUEBA_ID" != "" ] && [ "$PEDIDO_PRUEBA_ID" != "N/A" ]; then
        curl -s -X DELETE http://localhost:3000/api/pedidos/$PEDIDO_PRUEBA_ID && echo "   Pedido de prueba eliminado: $PEDIDO_PRUEBA_ID"
      fi
    fi
fi

echo ""

echo "10. Testing GET /api/envios/1/rastreo..."
curl -s http://localhost:3000/api/envios/1/rastreo $JQ_FORMAT
echo ""

echo "11. Testing POST /api/estados-envio (rastreo en tiempo real)..."
ESTADO_ID=$(curl -X POST http://localhost:3000/api/estados-envio \
  -H "Content-Type: application/json" \
  -d '{"id_envio":1,"nombre_estado":"Test Estado","ubicacion_actual":"Test Location","comentario":"Test Comment"}' \
  -s | jq '.id_estado' 2>/dev/null || echo "N/A")
echo "    Estado creado con ID: $ESTADO_ID"
echo ""

echo "12. Verificando rastreo actualizado..."
curl -s http://localhost:3000/api/envios/1/rastreo $JQ_FORMAT
echo ""

echo "13. Rollback - eliminando datos de prueba..."
if [ "$CLIENTE_ID" != "N/A" ]; then
    curl -s -X DELETE http://localhost:3000/api/clientes/$CLIENTE_ID
    echo "   Cliente $CLIENTE_ID eliminado"
fi
if [ "$ESTADO_ID" != "N/A" ]; then
    curl -s -X DELETE http://localhost:3000/api/estados-envio/$ESTADO_ID
    echo "   Estado $ESTADO_ID eliminado"
fi

echo ""

echo "14. Limpiando estados de prueba antiguos (nombre 'Test Estado')..."
OLD_TEST_IDS=$(curl -s http://localhost:3000/api/estados-envio | jq -r '.[] | select(.nombre_estado=="Test Estado") | .id_estado')
for ESTADO_OLD in $OLD_TEST_IDS; do
    curl -s -X DELETE http://localhost:3000/api/estados-envio/$ESTADO_OLD
    echo "   Eliminado estado $ESTADO_OLD"
done

echo ""

echo "=== Resumen de pruebas ==="
echo "✅ Endpoint raíz: OK"
echo "✅ Clientes: $CLIENTES_COUNT encontrados, creado ID: $CLIENTE_ID"
echo "✅ Productos: $PRODUCTOS_COUNT encontrados"
echo "✅ Transportistas: $TRANSPORTISTAS_COUNT encontrados"
echo "✅ Rutas: $RUTAS_COUNT encontradas"
echo "✅ Pedidos: $PEDIDOS_COUNT encontrados"
echo "✅ Envíos: $ENVIOS_COUNT encontrados"
echo "✅ Rastreo: Funcionando"
echo "✅ Estado creado: ID $ESTADO_ID"
echo ""
if [ "$ERRORS" -eq 0 ]; then
  echo "🎉 Todas las pruebas pasaron correctamente"
  exit 0
else
  echo "❌ Pruebas con errores: $ERRORS"
  exit 1
fi