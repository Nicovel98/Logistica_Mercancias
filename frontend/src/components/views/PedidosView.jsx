function getPedidoBadgeClass(estado = '') {
    const value = estado.toLowerCase();

    if (value.includes('entregado')) return 'is-success';
    if (value.includes('enviado')) return 'is-info';
    return 'is-warning';
}

function PedidosView({
    pedidos,
    seleccionPedido,
    seleccionarPedido,
    handleConfirmDelete,
    editarPedido,
    loadingPedidos,
    actualizarPedidos,
    pedidoSeleccionado,
    editingPedidoId,
    pedidoNuevo,
    setPedidoNuevo,
    guardarPedido,
    crearPedido,
    onCancelEditPedido,
    clientes
}) {
    return (
        <section className="pedidos-section">
            <div className="top-row">
                <div className="panel">
                    <h2>Pedidos</h2>
                    <button className="refresh-btn" onClick={actualizarPedidos} disabled={loadingPedidos}>
                        {loadingPedidos ? 'Actualizando...' : 'Refrescar pedidos'}
                    </button>
                    {loadingPedidos ? (
                        <p className="loading">Cargando pedidos...</p>
                    ) : pedidos.length === 0 ? (
                        <p className="empty-state">No hay pedidos registrados todavía.</p>
                    ) : (
                        <ul className="pedidos-list">
                            {pedidos.map((p) => (
                                <li key={p.id_pedido} className={seleccionPedido === p.id_pedido ? 'pedido-card selected' : 'pedido-card'}>
                                    <div className="pedido-list-item">
                                        <button className="link" onClick={() => seleccionarPedido(p.id_pedido)}>
                                            <strong>{`Pedido ${p.id_pedido}`}</strong>
                                            <span className={`status-badge ${getPedidoBadgeClass(p.estado_pedido)}`}>{p.estado_pedido}</span>
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
                                    <p>
                                        <strong>Estado:</strong>{' '}
                                        <span className={`status-badge ${getPedidoBadgeClass(pedidoSeleccionado.estado_pedido)}`}>{pedidoSeleccionado.estado_pedido}</span>
                                    </p>
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
                            <select
                                value={pedidoNuevo.id_cliente}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setPedidoNuevo({ ...pedidoNuevo, id_cliente: value ? Number(value) : '' });
                                }}
                                required
                            >
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
                                {editingPedidoId && <button type="button" className="small" onClick={onCancelEditPedido}>Cancelar</button>}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default PedidosView;
