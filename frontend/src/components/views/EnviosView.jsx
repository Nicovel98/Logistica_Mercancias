function getEstadoBadgeClass(estado = '') {
    const value = estado.toLowerCase();

    if (value.includes('entregado')) return 'is-success';
    if (value.includes('retrasado')) return 'is-danger';
    if (value.includes('camino') || value.includes('tránsito') || value.includes('transito')) return 'is-info';
    return 'is-warning';
}

function EnviosView({
    envios,
    seleccion,
    loadingEnvios,
    actualizarEnvios,
    seleccionarEnvio,
    editarEnvio,
    handleConfirmDelete,
    loadingRastreo,
    rastreo,
    editingEnvioId,
    envioNuevo,
    setEnvioNuevo,
    pedidos,
    transportistas,
    guardarEnvio,
    crearEnvio,
    onCancelEditEnvio
}) {
    return (
        <section className="envios-section">
            <div className="top-row">
                <div className="panel">
                    <h2>Envios</h2>
                    <button className="refresh-btn" onClick={actualizarEnvios} disabled={loadingEnvios}>
                        {loadingEnvios ? 'Actualizando...' : 'Refrescar envíos'}
                    </button>

                    {loadingEnvios ? (
                        <p className="loading">Cargando envíos...</p>
                    ) : envios.length === 0 ? (
                        <p className="empty-state">No hay envíos registrados todavía.</p>
                    ) : (
                        <ul className="envios-list">
                            {envios.map((envio) => (
                                <li key={envio.id_envio} className={seleccion === envio.id_envio ? 'envio-card selected' : 'envio-card'}>
                                    <div className="envio-list-item">
                                        <button className="link" onClick={() => seleccionarEnvio(envio.id_envio)}>
                                            <div className="link-main">
                                                <strong>{envio.codigo_rastreo}</strong>
                                                <span>{`Pedido #${envio.id_pedido} · ${envio.cliente_nombre || `Cliente ${envio.id_cliente ?? 'N/D'}`}`}</span>
                                            </div>
                                            <span className={`status-badge ${getEstadoBadgeClass(envio.estado_envio)}`}>{envio.estado_envio}</span>
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
                                    <p>
                                        <strong>Estado actual:</strong>{' '}
                                        <span className={`status-badge ${getEstadoBadgeClass(rastreo.envio.estado_envio)}`}>{rastreo.envio.estado_envio}</span>
                                    </p>
                                    <p><strong>Despacho:</strong> {new Date(rastreo.envio.fecha_despacho).toLocaleString()}</p>
                                    <p><strong>Entrega estimada:</strong> {new Date(rastreo.envio.fecha_entrega_estimada).toLocaleString()}</p>
                                    <p><strong>Pedido:</strong> #{rastreo.envio.id_pedido}</p>
                                    <p><strong>Cliente:</strong> {rastreo.envio.cliente_nombre || `Cliente ${rastreo.envio.id_cliente ?? 'N/D'}`}</p>
                                    <p><strong>Transportista:</strong> {rastreo.envio.transportista_nombre || 'N/D'}</p>

                                    <h3>Historial de estados</h3>
                                    {rastreo.estados.length === 0 ? (
                                        <p className="empty-state">Aún no hay estados en el historial.</p>
                                    ) : (
                                        <ul className="timeline">
                                            {rastreo.estados.map((estado) => (
                                                <li key={estado.id_estado}>
                                                    <div className="estado-header">
                                                        <span>{new Date(estado.fecha_actualizacion).toLocaleString()}</span>
                                                        <span className={`status-badge ${getEstadoBadgeClass(estado.nombre_estado)}`}>{estado.nombre_estado}</span>
                                                    </div>
                                                    <p>{estado.ubicacion_actual}</p>
                                                    <p>{estado.comentario}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
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
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setEnvioNuevo({ ...envioNuevo, id_pedido: value ? Number(value) : '' });
                                    }}
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
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setEnvioNuevo({ ...envioNuevo, id_transportista: value ? Number(value) : '' });
                                    }}
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
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setEnvioNuevo({ ...envioNuevo, id_ruta: value ? Number(value) : '' });
                                    }}
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
                                    <button type="button" className="small" onClick={onCancelEditEnvio}>
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default EnviosView;
