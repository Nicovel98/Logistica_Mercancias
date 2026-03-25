export const INITIAL_RASTREO = { envio: null, estados: [] };
export const INITIAL_ENVIO = {
    id_pedido: '',
    id_transportista: '',
    id_ruta: '',
    codigo_rastreo: '',
    fecha_despacho: '',
    fecha_entrega_estimada: '',
    estado_envio: 'Pendiente'
};
export const INITIAL_CLIENTE = { nombre: '', email: '', telefono: '', direccion_principal: '' };
export const INITIAL_PEDIDO = { id_cliente: '', estado_pedido: 'Creado' };
export const INITIAL_TRANSPORTISTA = { nombre_empresa: '', tipo_vehiculo: '', placa_vehiculo: '', telefono_contacto: '' };
