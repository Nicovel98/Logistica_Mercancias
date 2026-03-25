function ClientesView({
    clientes,
    seleccionCliente,
    seleccionarCliente,
    handleConfirmDelete,
    editarCliente,
    loadingClientes,
    actualizarClientes,
    clienteSeleccionado,
    editingClienteId,
    clienteNuevo,
    setClienteNuevo,
    guardarCliente,
    crearCliente,
    onCancelEditCliente
}) {
    return (
        <section className="clientes-section">
            <div className="top-row">
                <div className="panel">
                    <h2>Clientes</h2>
                    <button className="refresh-btn" onClick={actualizarClientes} disabled={loadingClientes}>
                        {loadingClientes ? 'Actualizando...' : 'Refrescar clientes'}
                    </button>
                    {loadingClientes ? (
                        <p className="loading">Cargando clientes...</p>
                    ) : clientes.length === 0 ? (
                        <p className="empty-state">No hay clientes registrados todavía.</p>
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
                                </li>
                            ))}
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
                                {editingClienteId && <button type="button" className="small" onClick={onCancelEditCliente}>Cancelar</button>}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ClientesView;
