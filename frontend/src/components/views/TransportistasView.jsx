function TransportistasView({
    transportistas,
    seleccionTransportista,
    seleccionarTransportista,
    handleConfirmDelete,
    editarTransportista,
    loadingTransportistas,
    actualizarTransportistas,
    transportistaSeleccionado,
    editingTransportistaId,
    transportistaNuevo,
    setTransportistaNuevo,
    guardarTransportista,
    crearTransportista,
    onCancelEditTransportista
}) {
    return (
        <section className="transportistas-section">
            <div className="top-row">
                <div className="panel">
                    <h2>Transportistas</h2>
                    <button className="refresh-btn" onClick={actualizarTransportistas} disabled={loadingTransportistas}>
                        {loadingTransportistas ? 'Actualizando...' : 'Refrescar transportistas'}
                    </button>
                    {loadingTransportistas ? (
                        <p className="loading">Cargando transportistas...</p>
                    ) : transportistas.length === 0 ? (
                        <p className="empty-state">No hay transportistas registrados todavía.</p>
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
                                {editingTransportistaId && <button type="button" className="small" onClick={onCancelEditTransportista}>Cancelar</button>}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default TransportistasView;
