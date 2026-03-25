import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import {
    deleteCliente,
    deleteEnvio,
    deletePedido,
    deleteTransportista,
    fetchClientes,
    fetchEnvios,
    fetchPedidos,
    fetchRastreo,
    fetchTransportistas,
    postCliente,
    postEnvio,
    postEstado,
    postPedido,
    postTransportista,
    updateCliente,
    updateEnvio,
    updatePedido,
    updateTransportista
} from './api';

const socket = io('http://localhost:3000');

const INITIAL_RASTREO = { envio: null, estados: [] };
const INITIAL_NUEVO_ESTADO = { nombre_estado: '', ubicacion_actual: '', comentario: '' };
const INITIAL_ENVIO = {
    id_pedido: '',
    id_transportista: '',
    id_ruta: '',
    codigo_rastreo: '',
    fecha_despacho: '',
    fecha_entrega_estimada: '',
    estado_envio: 'Pendiente'
};
const INITIAL_CLIENTE = { nombre: '', email: '', telefono: '', direccion_principal: '' };
const INITIAL_PEDIDO = { id_cliente: '', estado_pedido: 'Creado' };
const INITIAL_TRANSPORTISTA = { nombre_empresa: '', tipo_vehiculo: '', placa_vehiculo: '', telefono_contacto: '' };

function App() {
    const [envios, setEnvios] = useState([]);
    const [seleccion, setSeleccion] = useState(null);
    const [rastreo, setRastreo] = useState({ ...INITIAL_RASTREO });
    const [nuevoEstado, setNuevoEstado] = useState({ ...INITIAL_NUEVO_ESTADO });
    const [feedback, setFeedback] = useState('');
    const [editingEnvioId, setEditingEnvioId] = useState(null);
    const [loadingEnvios, setLoadingEnvios] = useState(false);
    const [loadingRastreo, setLoadingRastreo] = useState(false);
    const [envioNuevo, setEnvioNuevo] = useState({ ...INITIAL_ENVIO });

    const [activeView, setActiveView] = useState('envios');

    const [clientes, setClientes] = useState([]);
    const [seleccionCliente, setSeleccionCliente] = useState(null);
    const [clienteNuevo, setClienteNuevo] = useState({ ...INITIAL_CLIENTE });
    const [editingClienteId, setEditingClienteId] = useState(null);
    const [loadingClientes, setLoadingClientes] = useState(false);

    const [pedidos, setPedidos] = useState([]);
    const [seleccionPedido, setSeleccionPedido] = useState(null);
    const [pedidoNuevo, setPedidoNuevo] = useState({ ...INITIAL_PEDIDO });
    const [editingPedidoId, setEditingPedidoId] = useState(null);
    const [loadingPedidos, setLoadingPedidos] = useState(false);

    const [transportistas, setTransportistas] = useState([]);
    const [seleccionTransportista, setSeleccionTransportista] = useState(null);
    const [editingTransportistaId, setEditingTransportistaId] = useState(null);
    const [transportistaNuevo, setTransportistaNuevo] = useState({ ...INITIAL_TRANSPORTISTA });
    const [loadingTransportistas, setLoadingTransportistas] = useState(false);

    const [confirmDialog, setConfirmDialog] = useState({ open: false, type: '', id: null, label: '' });
    const [loadingAction, setLoadingAction] = useState(false);

    const actualizarEnvios = async () => {
        setLoadingEnvios(true);
        setFeedback('');
        try {
            const data = await fetchEnvios();
            setEnvios(data);
        } catch (error) {
            console.error(error);
            setFeedback(error.message);
        } finally {
            setLoadingEnvios(false);
        }
    };

    const seleccionarEnvio = async (id) => {
        setSeleccion(id);
        setLoadingRastreo(true);
        setFeedback('');
        try {
            const data = await fetchRastreo(id);
            setRastreo(data);
        } catch (error) {
            console.error(error);
            setFeedback(error.message);
        } finally {
            setLoadingRastreo(false);
        }
    };

    const actualizarClientes = async () => {
        setLoadingClientes(true);
        try {
            const data = await fetchClientes();
            setClientes(data);
        } catch (error) {
            console.error(error);
            setFeedback(error.message);
        } finally {
            setLoadingClientes(false);
        }
    };

    const seleccionarCliente = (id) => {
        setSeleccionCliente(id);
    };

    const actualizarPedidos = async () => {
        setLoadingPedidos(true);
        try {
            const data = await fetchPedidos();
            setPedidos(data);
        } catch (error) {
            console.error(error);
            setFeedback(error.message);
        } finally {
            setLoadingPedidos(false);
        }
    };

    const seleccionarPedido = (id) => {
        setSeleccionPedido(id);
    };

    const actualizarTransportistas = async () => {
        setLoadingTransportistas(true);
        try {
            const data = await fetchTransportistas();
            setTransportistas(data);
        } catch (error) {
            console.error(error);
            setFeedback(error.message);
        } finally {
            setLoadingTransportistas(false);
        }
    };

    const seleccionarTransportista = (id) => {
        setSeleccionTransportista(id);
    };

    const crearCliente = async (e) => {
        e.preventDefault();
        try {
            await postCliente(clienteNuevo);
            setClienteNuevo({ ...INITIAL_CLIENTE });
            actualizarClientes();
            setFeedback('Cliente creado correctamente');
        } catch (error) {
            setFeedback(error.message);
        }
    };

    const crearPedido = async (e) => {
        e.preventDefault();
        try {
            await postPedido(pedidoNuevo);
            setPedidoNuevo({ ...INITIAL_PEDIDO });
            actualizarPedidos();
            setFeedback('Pedido creado correctamente');
        } catch (error) {
            setFeedback(error.message);
        }
    };

    const crearTransportista = async (e) => {
        e.preventDefault();
        try {
            await postTransportista(transportistaNuevo);
            setTransportistaNuevo({ ...INITIAL_TRANSPORTISTA });
            actualizarTransportistas();
            setFeedback('Transportista creado correctamente');
        } catch (error) {
            setFeedback(error.message);
        }
    };
    const editarEnvio = (envio) => {
        setEditingEnvioId(envio.id_envio);
        setEnvioNuevo({
            id_pedido: envio.id_pedido,
            id_transportista: envio.id_transportista,
            id_ruta: envio.id_ruta,
            codigo_rastreo: envio.codigo_rastreo,
            fecha_despacho: envio.fecha_despacho ? envio.fecha_despacho.substring(0, 16) : '',
            fecha_entrega_estimada: envio.fecha_entrega_estimada ? envio.fecha_entrega_estimada.substring(0, 16) : '',
            estado_envio: envio.estado_envio || 'Pendiente'
        });
    };

    const guardarEnvio = async (e) => {
        e.preventDefault();
        if (!editingEnvioId) return;
        try {
            await updateEnvio(editingEnvioId, envioNuevo);
            setEditingEnvioId(null);
            setEnvioNuevo({ ...INITIAL_ENVIO });
            actualizarEnvios();
            setFeedback('Envío actualizado correctamente');
        } catch (error) {
            setFeedback(error.message);
        }
    };

    const handleConfirmDelete = (type, id, label) => {
        setConfirmDialog({ open: true, type, id, label });
    };

    const closeConfirm = () => {
        setConfirmDialog({ open: false, type: '', id: null, label: '' });
    };

    const confirmDelete = async () => {
        if (!confirmDialog.type || !confirmDialog.id) {
            return closeConfirm();
        }

        setLoadingAction(true);
        try {
            switch (confirmDialog.type) {
                case 'cliente':
                    await deleteCliente(confirmDialog.id);
                    actualizarClientes();
                    if (seleccionCliente === confirmDialog.id) {
                        setSeleccionCliente(null);
                    }
                    setFeedback('Cliente eliminado correctamente');
                    break;
                case 'pedido':
                    await deletePedido(confirmDialog.id);
                    actualizarPedidos();
                    if (seleccionPedido === confirmDialog.id) {
                        setSeleccionPedido(null);
                    }
                    setFeedback('Pedido eliminado correctamente');
                    break;
                case 'transportista':
                    await deleteTransportista(confirmDialog.id);
                    actualizarTransportistas();
                    if (seleccionTransportista === confirmDialog.id) {
                        setSeleccionTransportista(null);
                    }
                    setFeedback('Transportista eliminado correctamente');
                    break;
                case 'envio':
                    await deleteEnvio(confirmDialog.id);
                    actualizarEnvios();
                    if (seleccion === confirmDialog.id) {
                        setSeleccion(null);
                        setRastreo({ ...INITIAL_RASTREO });
                    }
                    setFeedback('Envío eliminado correctamente');
                    break;
                default:
                    break;
            }
        } catch (error) {
            setFeedback(error.message);
        } finally {
            setConfirmDialog({ open: false, type: '', id: null, label: '' });
            setLoadingAction(false);
        }
    };

    const crearEnvio = async (e) => {
        e.preventDefault();
        try {
            await postEnvio(envioNuevo);
            setEnvioNuevo({ ...INITIAL_ENVIO });
            actualizarEnvios();
            setFeedback('Envío creado correctamente');
        } catch (error) {
            setFeedback(error.message);
        }
    };
    const editarCliente = (cliente) => {
        setEditingClienteId(cliente.id_cliente);
        setClienteNuevo({ nombre: cliente.nombre, email: cliente.email, telefono: cliente.telefono, direccion_principal: cliente.direccion_principal });
    };

    const guardarCliente = async (e) => {
        e.preventDefault();
        if (!editingClienteId) return;
        try {
            await updateCliente(editingClienteId, clienteNuevo);
            setEditingClienteId(null);
            setClienteNuevo({ ...INITIAL_CLIENTE });
            actualizarClientes();
            setFeedback('Cliente actualizado correctamente');
        } catch (error) {
            setFeedback(error.message);
        }
    };

    const editarPedido = (pedido) => {
        setEditingPedidoId(pedido.id_pedido);
        setPedidoNuevo({ id_cliente: pedido.id_cliente, estado_pedido: pedido.estado_pedido });
    };

    const guardarPedido = async (e) => {
        e.preventDefault();
        if (!editingPedidoId) return;
        try {
            await updatePedido(editingPedidoId, pedidoNuevo);
            setEditingPedidoId(null);
            setPedidoNuevo({ ...INITIAL_PEDIDO });
            actualizarPedidos();
            setFeedback('Pedido actualizado correctamente');
        } catch (error) {
            setFeedback(error.message);
        }
    };

    const editarTransportista = (transportista) => {
        setEditingTransportistaId(transportista.id_transportista);
        setTransportistaNuevo({ nombre_empresa: transportista.nombre_empresa, tipo_vehiculo: transportista.tipo_vehiculo, placa_vehiculo: transportista.placa_vehiculo, telefono_contacto: transportista.telefono_contacto });
    };

    const guardarTransportista = async (e) => {
        e.preventDefault();
        if (!editingTransportistaId) return;
        try {
            await updateTransportista(editingTransportistaId, transportistaNuevo);
            setEditingTransportistaId(null);
            setTransportistaNuevo({ ...INITIAL_TRANSPORTISTA });
            actualizarTransportistas();
            setFeedback('Transportista actualizado correctamente');
        } catch (error) {
            setFeedback(error.message);
        }
    };

    const agregarEstado = async (e) => {
        e.preventDefault();
        if (!seleccion) return;
        try {
            await postEstado(seleccion, nuevoEstado);
            setNuevoEstado({ ...INITIAL_NUEVO_ESTADO });
            const data = await fetchRastreo(seleccion);
            setRastreo(data);
            setFeedback('Estado agregado correctamente');
        } catch (error) {
            setFeedback(error.message);
        }
    };

    useEffect(() => {
        actualizarEnvios();
        actualizarClientes();
        actualizarPedidos();
        actualizarTransportistas();

        socket.on('rastreo_actualizado', (payload) => {
            if (seleccion && payload.envio?.id_envio === seleccion) {
                setRastreo(payload);
            }
            actualizarEnvios();
        });

        return () => {
            socket.off('rastreo_actualizado');
        };
    }, [seleccion]);

    const clienteSeleccionado = clientes.find((cliente) => cliente.id_cliente === seleccionCliente);
    const pedidoSeleccionado = pedidos.find((pedido) => pedido.id_pedido === seleccionPedido);
    const transportistaSeleccionado = transportistas.find((transportista) => transportista.id_transportista === seleccionTransportista);

    return (
        <div className="app">
            <header>
                <h1>🚚 TechLogistics - Rastreo de Envíos 📦</h1>
            </header>

            <div className="tabs">
                <button className={activeView === 'envios' ? 'tab active' : 'tab'} onClick={() => setActiveView('envios')}>Envíos</button>
                <button className={activeView === 'clientes' ? 'tab active' : 'tab'} onClick={() => setActiveView('clientes')}>Clientes</button>
                <button className={activeView === 'pedidos' ? 'tab active' : 'tab'} onClick={() => setActiveView('pedidos')}>Pedidos</button>
                <button className={activeView === 'transportistas' ? 'tab active' : 'tab'} onClick={() => setActiveView('transportistas')}>Transportistas</button>
            </div>

            {activeView === 'envios' && (
                <section className="envios-section">
                    <div className="top-row">
                        <div className="panel">
                            <h2>Envios</h2>
                            <button className="refresh-btn" onClick={actualizarEnvios} disabled={loadingEnvios}>
                                {loadingEnvios ? 'Actualizando...' : 'Refrescar envíos'}
                            </button>

                            {loadingEnvios ? (
                                <p className="loading">Cargando envíos...</p>
                            ) : (
                                <ul className="envios-list">
                                    {envios.map((envio) => (
                                        <li key={envio.id_envio} className={seleccion === envio.id_envio ? 'envio-card selected' : 'envio-card'}>
                                            <div className="envio-list-item">
                                                <button className="link" onClick={() => seleccionarEnvio(envio.id_envio)}>
                                                    <strong>{envio.codigo_rastreo}</strong>
                                                    <span>{`${envio.estado_envio} · Pedido #${envio.id_pedido} · ${envio.cliente_nombre || `Cliente ${envio.id_cliente ?? 'N/D'}`}`}</span>
                                                </button>
                                                <div className="actions">
                                                    <button className="small edit" onClick={() => editarEnvio(envio)}>Editar</button>
                                                    <button className="small danger" onClick={() => handleConfirmDelete('envio', envio.id_envio, envio.codigo_rastreo)}>Eliminar</button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {seleccion && (
                            <div className="panel">
                                <h2>Detalle de rastreo</h2>
                                <div className="card">
                                    {loadingRastreo && <p className="loading">Cargando detalle...</p>}
                                    {!loadingRastreo && seleccion && !rastreo.envio && <p>No se encontró el envío seleccionado.</p>}
                                    {!loadingRastreo && seleccion && rastreo.envio && (
                                        <>
                                            <p><strong>Código:</strong> {rastreo.envio.codigo_rastreo}</p>
                                            <p><strong>Estado actual:</strong> {rastreo.envio.estado_envio}</p>
                                            <p><strong>Despacho:</strong> {new Date(rastreo.envio.fecha_despacho).toLocaleString()}</p>
                                            <p><strong>Entrega estimada:</strong> {new Date(rastreo.envio.fecha_entrega_estimada).toLocaleString()}</p>
                                            <p><strong>Pedido:</strong> #{rastreo.envio.id_pedido}</p>
                                            <p><strong>Cliente:</strong> {rastreo.envio.cliente_nombre || `Cliente ${rastreo.envio.id_cliente ?? 'N/D'}`}</p>
                                            <p><strong>Transportista:</strong> {rastreo.envio.transportista_nombre || 'N/D'}</p>

                                            <h3>Historial de estados</h3>
                                            <ul className="timeline">
                                                {rastreo.estados.map((estado) => (
                                                    <li key={estado.id_estado}>
                                                        <div className="estado-header">
                                                            <span>{new Date(estado.fecha_actualizacion).toLocaleString()}</span>
                                                            <strong>{estado.nombre_estado}</strong>
                                                        </div>
                                                        <p>{estado.ubicacion_actual}</p>
                                                        <p>{estado.comentario}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bottom-row">
                        <div className="panel">
                            <h2>{editingEnvioId ? 'Editar envío' : 'Crear envío'}</h2>
                            <div className="card envio-form-card">
                                <form onSubmit={editingEnvioId ? guardarEnvio : crearEnvio} className="form-estado">
                                    <label>
                                        Pedido:
                                        <select
                                            value={envioNuevo.id_pedido}
                                            onChange={(e) => setEnvioNuevo({ ...envioNuevo, id_pedido: Number(e.target.value) })}
                                            required
                                        >
                                            <option value="">Selecciona pedido</option>
                                            {pedidos.map((p) => (
                                                <option key={p.id_pedido} value={p.id_pedido}>{`#${p.id_pedido} - ${p.cliente_nombre || `Cliente ${p.id_cliente}`}`}</option>
                                            ))}
                                        </select>
                                    </label>
                                    <label>
                                        Transportista:
                                        <select
                                            value={envioNuevo.id_transportista}
                                            onChange={(e) => setEnvioNuevo({ ...envioNuevo, id_transportista: Number(e.target.value) })}
                                            required
                                        >
                                            <option value="">Selecciona transportista</option>
                                            {transportistas.map((t) => (
                                                <option key={t.id_transportista} value={t.id_transportista}>{`${t.nombre_empresa} (${t.placa_vehiculo})`}</option>
                                            ))}
                                        </select>
                                    </label>
                                    <label>
                                        Ruta (ID):
                                        <input
                                            type="number"
                                            value={envioNuevo.id_ruta}
                                            onChange={(e) => setEnvioNuevo({ ...envioNuevo, id_ruta: Number(e.target.value) })}
                                            placeholder="ID de ruta"
                                            required
                                        />
                                    </label>
                                    <label>
                                        Código de rastreo:
                                        <input
                                            value={envioNuevo.codigo_rastreo}
                                            onChange={(e) => setEnvioNuevo({ ...envioNuevo, codigo_rastreo: e.target.value })}
                                            placeholder="Código de rastreo"
                                            required
                                        />
                                    </label>
                                    <label>
                                        Fecha de despacho:
                                        <input
                                            type="datetime-local"
                                            value={envioNuevo.fecha_despacho}
                                            onChange={(e) => setEnvioNuevo({ ...envioNuevo, fecha_despacho: e.target.value })}
                                            required
                                        />
                                    </label>
                                    <label>
                                        Fecha de entrega estimada:
                                        <input
                                            type="datetime-local"
                                            value={envioNuevo.fecha_entrega_estimada}
                                            onChange={(e) => setEnvioNuevo({ ...envioNuevo, fecha_entrega_estimada: e.target.value })}
                                            required
                                        />
                                    </label>
                                    <label>
                                        Estado del envío:
                                        <select
                                            value={envioNuevo.estado_envio}
                                            onChange={(e) => setEnvioNuevo({ ...envioNuevo, estado_envio: e.target.value })}
                                            required
                                        >
                                            <option value="Pendiente">Pendiente</option>
                                            <option value="En camino">En camino</option>
                                            <option value="Entregado">Entregado</option>
                                            <option value="Retrasado">Retrasado</option>
                                        </select>
                                    </label>
                                    <div className="form-buttons">
                                        <button type="submit">{editingEnvioId ? 'Guardar envío' : 'Crear envío'}</button>
                                        {editingEnvioId && (
                                            <button
                                                type="button"
                                                className="small"
                                                onClick={() => {
                                                    setEditingEnvioId(null);
                                                    setEnvioNuevo({ ...INITIAL_ENVIO });
                                                    setFeedback('Edición de envío cancelada.');
                                                }}
                                            >
                                                Cancelar
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {activeView === 'clientes' && (
                <section className="clientes-section">
                    <div className="top-row">
                        <div className="panel">
                            <h2>Clientes</h2>
                            <button className="refresh-btn" onClick={actualizarClientes} disabled={loadingClientes}>
                                {loadingClientes ? 'Actualizando...' : 'Refrescar clientes'}
                            </button>
                            {loadingClientes ? (
                                <p className="loading">Cargando clientes...</p>
                            ) : (
                                <ul className="clientes-list">
                                    {clientes.map((c) => (
                                        <li key={c.id_cliente} className={seleccionCliente === c.id_cliente ? 'client-card selected' : 'client-card'}>
                                            <div className="clientes-list-item">
                                                <button className="link" onClick={() => seleccionarCliente(c.id_cliente)}>
                                                    <strong>{c.nombre}</strong>
                                                    <span>{c.email}</span>
                                                </button>
                                                <div className="actions">
                                                    <button className="small edit" onClick={() => editarCliente(c)}>Editar</button>
                                                    <button className="small danger" onClick={() => handleConfirmDelete('cliente', c.id_cliente, c.nombre)}>Eliminar</button>
                                                </div>
                                            </div>
                                        </li>))}
                                </ul>
                            )}
                        </div>

                        {seleccionCliente && (
                            <div className="panel">
                                <h2>Detalle del cliente</h2>
                                <div className="card">
                                    {loadingClientes && <p className="loading">Cargando detalle...</p>}
                                    {!loadingClientes && seleccionCliente && !clienteSeleccionado && <p>No se encontró el cliente seleccionado.</p>}
                                    {!loadingClientes && seleccionCliente && clienteSeleccionado && (
                                        <>
                                            <p><strong>Nombre:</strong> {clienteSeleccionado.nombre}</p>
                                            <p><strong>Email:</strong> {clienteSeleccionado.email}</p>
                                            <p><strong>Teléfono:</strong> {clienteSeleccionado.telefono}</p>
                                            <p><strong>Dirección:</strong> {clienteSeleccionado.direccion_principal}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bottom-row">
                        <div className="panel">
                            <h2>{editingClienteId ? 'Editar cliente' : 'Agregar cliente'}</h2>
                            <div className="card cliente-form-card">
                                <form className="form-estado" onSubmit={editingClienteId ? guardarCliente : crearCliente}>
                                    <input value={clienteNuevo.nombre} onChange={(e) => setClienteNuevo({ ...clienteNuevo, nombre: e.target.value })} placeholder="Nombre" required />
                                    <input value={clienteNuevo.email} onChange={(e) => setClienteNuevo({ ...clienteNuevo, email: e.target.value })} placeholder="Email" required />
                                    <input value={clienteNuevo.telefono} onChange={(e) => setClienteNuevo({ ...clienteNuevo, telefono: e.target.value })} placeholder="Teléfono" required />
                                    <input value={clienteNuevo.direccion_principal} onChange={(e) => setClienteNuevo({ ...clienteNuevo, direccion_principal: e.target.value })} placeholder="Dirección" required />
                                    <div className="form-buttons">
                                        <button type="submit">{editingClienteId ? 'Guardar cliente' : 'Crear cliente'}</button>
                                        {editingClienteId && <button type="button" className="small" onClick={() => { setEditingClienteId(null); setClienteNuevo({ ...INITIAL_CLIENTE }); setFeedback('Edición cancelada.') }}>Cancelar</button>}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            )}


            {activeView === 'pedidos' && (
                <section className="pedidos-section">
                    <div className="top-row">
                        <div className="panel">
                            <h2>Pedidos</h2>
                            <button className="refresh-btn" onClick={actualizarPedidos} disabled={loadingPedidos}>
                                {loadingPedidos ? 'Actualizando...' : 'Refrescar pedidos'}
                            </button>
                            {loadingPedidos ? (
                                <p className="loading">Cargando pedidos...</p>
                            ) : (
                                <ul className="pedidos-list">
                                    {pedidos.map((p) => (
                                        <li key={p.id_pedido} className={seleccionPedido === p.id_pedido ? 'pedido-card selected' : 'pedido-card'}>
                                            <div className="pedido-list-item">
                                                <button className="link" onClick={() => seleccionarPedido(p.id_pedido)}>
                                                    <strong>{`Pedido ${p.id_pedido}`}</strong>
                                                    <span>{p.estado_pedido}</span>
                                                </button>
                                                <div className="actions">
                                                    <button className="small edit" onClick={() => editarPedido(p)}>Editar</button>
                                                    <button className="small danger" onClick={() => handleConfirmDelete('pedido', p.id_pedido, `Pedido ${p.id_pedido}`)}>Eliminar</button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {seleccionPedido && (
                            <div className="panel">
                                <h2>Detalle del pedido</h2>
                                <div className="card">
                                    {loadingPedidos && <p className="loading">Cargando detalle...</p>}
                                    {!loadingPedidos && seleccionPedido && !pedidoSeleccionado && <p>No se encontró el pedido seleccionado.</p>}
                                    {!loadingPedidos && seleccionPedido && pedidoSeleccionado && (
                                        <>
                                            <p><strong>ID:</strong> {pedidoSeleccionado.id_pedido}</p>
                                            <p><strong>Cliente:</strong> {pedidoSeleccionado.cliente_nombre || pedidoSeleccionado.id_cliente}</p>
                                            <p><strong>Estado:</strong> {pedidoSeleccionado.estado_pedido}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bottom-row">
                        <div className="panel">
                            <h2>{editingPedidoId ? 'Editar pedido' : 'Agregar pedido'}</h2>
                            <div className="card">
                                <form className="form-estado" onSubmit={editingPedidoId ? guardarPedido : crearPedido}>
                                    <select value={pedidoNuevo.id_cliente} onChange={(e) => setPedidoNuevo({ ...pedidoNuevo, id_cliente: Number(e.target.value) })} required>
                                        <option value="">Selecciona cliente</option>
                                        {clientes.map((c) => (
                                            <option key={c.id_cliente} value={c.id_cliente}>{c.nombre}</option>
                                        ))}
                                    </select>
                                    <select value={pedidoNuevo.estado_pedido} onChange={(e) => setPedidoNuevo({ ...pedidoNuevo, estado_pedido: e.target.value })}>
                                        <option value="Creado">Creado</option>
                                        <option value="Enviado">Enviado</option>
                                        <option value="Entregado">Entregado</option>
                                    </select>
                                    <div className="form-buttons">
                                        <button type="submit">{editingPedidoId ? 'Guardar pedido' : 'Crear pedido'}</button>
                                        {editingPedidoId && <button type="button" className="small" onClick={() => { setEditingPedidoId(null); setPedidoNuevo({ ...INITIAL_PEDIDO }); setFeedback('Edición cancelada.') }}>Cancelar</button>}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {activeView === 'transportistas' && (
                <section className="transportistas-section">
                    <div className="top-row">
                        <div className="panel">
                            <h2>Transportistas</h2>
                            <button className="refresh-btn" onClick={actualizarTransportistas} disabled={loadingTransportistas}>
                                {loadingTransportistas ? 'Actualizando...' : 'Refrescar transportistas'}
                            </button>
                            {loadingTransportistas ? (
                                <p className="loading">Cargando transportistas...</p>
                            ) : (
                                <ul className="transportistas-list">
                                    {transportistas.map((t) => (
                                        <li key={t.id_transportista} className={seleccionTransportista === t.id_transportista ? 'transportista-card selected' : 'transportista-card'}>
                                            <div className="transportista-list-item">
                                                <button className="link" onClick={() => seleccionarTransportista(t.id_transportista)}>
                                                    <strong>{t.nombre_empresa}</strong>
                                                    <span>{t.placa_vehiculo}</span>
                                                </button>
                                                <div className="actions">
                                                    <button className="small edit" onClick={() => editarTransportista(t)}>Editar</button>
                                                    <button className="small danger" onClick={() => handleConfirmDelete('transportista', t.id_transportista, t.nombre_empresa)}>Eliminar</button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {seleccionTransportista && (
                            <div className="panel">
                                <h2>Detalle del transportista</h2>
                                <div className="card">
                                    {loadingTransportistas && <p className="loading">Cargando detalle...</p>}
                                    {!loadingTransportistas && seleccionTransportista && !transportistaSeleccionado && <p>No se encontró el transportista seleccionado.</p>}
                                    {!loadingTransportistas && seleccionTransportista && transportistaSeleccionado && (
                                        <>
                                            <p><strong>Empresa:</strong> {transportistaSeleccionado.nombre_empresa}</p>
                                            <p><strong>Tipo de vehículo:</strong> {transportistaSeleccionado.tipo_vehiculo}</p>
                                            <p><strong>Placa:</strong> {transportistaSeleccionado.placa_vehiculo}</p>
                                            <p><strong>Teléfono:</strong> {transportistaSeleccionado.telefono_contacto}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bottom-row">
                        <div className="panel">
                            <h2>{editingTransportistaId ? 'Editar transportista' : 'Agregar transportista'}</h2>
                            <div className="card">
                                <form className="form-estado" onSubmit={editingTransportistaId ? guardarTransportista : crearTransportista}>
                                    <input value={transportistaNuevo.nombre_empresa} onChange={(e) => setTransportistaNuevo({ ...transportistaNuevo, nombre_empresa: e.target.value })} placeholder="Empresa" required />
                                    <input value={transportistaNuevo.tipo_vehiculo} onChange={(e) => setTransportistaNuevo({ ...transportistaNuevo, tipo_vehiculo: e.target.value })} placeholder="Tipo vehículo" required />
                                    <input value={transportistaNuevo.placa_vehiculo} onChange={(e) => setTransportistaNuevo({ ...transportistaNuevo, placa_vehiculo: e.target.value })} placeholder="Placa" required />
                                    <input value={transportistaNuevo.telefono_contacto} onChange={(e) => setTransportistaNuevo({ ...transportistaNuevo, telefono_contacto: e.target.value })} placeholder="Teléfono" required />
                                    <div className="form-buttons">
                                        <button type="submit">{editingTransportistaId ? 'Guardar transportista' : 'Crear transportista'}</button>
                                        {editingTransportistaId && <button type="button" className="small" onClick={() => { setEditingTransportistaId(null); setTransportistaNuevo({ ...INITIAL_TRANSPORTISTA }); setFeedback('Edición cancelada.') }}>Cancelar</button>}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {confirmDialog.open && (
                <div className="modal-overlay" onClick={closeConfirm}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Confirmar eliminación</h3>
                        <p>¿Seguro que deseas eliminar <strong>{confirmDialog.label}</strong> ({confirmDialog.type})?</p>
                        <div className="modal-buttons">
                            <button className="small" onClick={closeConfirm} disabled={loadingAction}>Cancelar</button>
                            <button className="small danger" onClick={confirmDelete} disabled={loadingAction}>{loadingAction ? 'Eliminando...' : 'Eliminar'}</button>
                        </div>
                    </div>
                </div>
            )}
            {feedback && <div className="feedback">{feedback}</div>}
        </div>
    );
}

export default App;
