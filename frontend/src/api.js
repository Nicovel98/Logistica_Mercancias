const BASE_URL = '/api';

async function request(path, options = {}, errorMessage = 'Error en la solicitud') {
    const res = await fetch(`${BASE_URL}${path}`, options);
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || errorMessage);
    }
    return res;
}

async function requestJson(path, options = {}, errorMessage = 'Error en la solicitud') {
    const res = await request(path, options, errorMessage);
    return res.json();
}

function jsonOptions(method, payload) {
    return {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    };
}

export async function fetchEnvios() {
    return requestJson('/envios', {}, 'Error al obtener envíos');
}

export async function fetchRastreo(id) {
    return requestJson(`/envios/${id}/rastreo`, {}, 'Error al obtener rastreo');
}

export async function postEstado(envioId, payload) {
    return requestJson('/estados-envio', jsonOptions('POST', { id_envio: envioId, ...payload }), 'Error al publicar estado');
}

export async function fetchClientes() {
    return requestJson('/clientes', {}, 'Error al obtener clientes');
}

export async function fetchPedidos() {
    return requestJson('/pedidos', {}, 'Error al obtener pedidos');
}

export async function fetchTransportistas() {
    return requestJson('/transportistas', {}, 'Error al obtener transportistas');
}

export async function postCliente(payload) {
    return requestJson('/clientes', jsonOptions('POST', payload), 'Error al crear cliente');
}

export async function postPedido(payload) {
    return requestJson('/pedidos', jsonOptions('POST', payload), 'Error al crear pedido');
}

export async function postTransportista(payload) {
    return requestJson('/transportistas', jsonOptions('POST', payload), 'Error al crear transportista');
}

export async function postEnvio(payload) {
    return requestJson('/envios', jsonOptions('POST', payload), 'Error al crear envío');
}

export async function updateEnvio(id, payload) {
    return requestJson(`/envios/${id}`, jsonOptions('PUT', payload), 'Error al actualizar envío');
}

export async function deleteEnvio(id) {
    await request(`/envios/${id}`, { method: 'DELETE' }, 'Error al eliminar envío');
}


export async function updateCliente(id, payload) {
    return requestJson(`/clientes/${id}`, jsonOptions('PUT', payload), 'Error al actualizar cliente');
}

export async function deleteCliente(id) {
    await request(`/clientes/${id}`, { method: 'DELETE' }, 'Error al eliminar cliente');
}

export async function updatePedido(id, payload) {
    return requestJson(`/pedidos/${id}`, jsonOptions('PUT', payload), 'Error al actualizar pedido');
}

export async function deletePedido(id) {
    await request(`/pedidos/${id}`, { method: 'DELETE' }, 'Error al eliminar pedido');
}

export async function updateTransportista(id, payload) {
    return requestJson(`/transportistas/${id}`, jsonOptions('PUT', payload), 'Error al actualizar transportista');
}

export async function deleteTransportista(id) {
    await request(`/transportistas/${id}`, { method: 'DELETE' }, 'Error al eliminar transportista');
}

