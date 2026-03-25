import { useEffect, useState } from 'react';
import { ConfirmDialog, Tabs } from './components';
import { ClientesView, EnviosView, PedidosView, TransportistasView } from './components/views';
import { useLogisticaData } from './hooks';

function App() {
    const [activeView, setActiveView] = useState('envios');
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window === 'undefined') {
            return false;
        }

        const savedTheme = window.localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme === 'dark';
        }

        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    const {
        envios,
        seleccion,
        rastreo,
        feedback,
        editingEnvioId,
        loadingEnvios,
        loadingRastreo,
        envioNuevo,
        clientes,
        seleccionCliente,
        clienteNuevo,
        editingClienteId,
        loadingClientes,
        pedidos,
        seleccionPedido,
        pedidoNuevo,
        editingPedidoId,
        loadingPedidos,
        transportistas,
        seleccionTransportista,
        editingTransportistaId,
        transportistaNuevo,
        loadingTransportistas,
        confirmDialog,
        loadingAction,
        actualizarEnvios,
        seleccionarEnvio,
        actualizarClientes,
        seleccionarCliente,
        actualizarPedidos,
        seleccionarPedido,
        actualizarTransportistas,
        seleccionarTransportista,
        crearCliente,
        crearPedido,
        crearTransportista,
        editarEnvio,
        guardarEnvio,
        handleConfirmDelete,
        closeConfirm,
        confirmDelete,
        crearEnvio,
        editarCliente,
        guardarCliente,
        editarPedido,
        guardarPedido,
        editarTransportista,
        guardarTransportista,
        setEnvioNuevo,
        setClienteNuevo,
        setPedidoNuevo,
        setTransportistaNuevo,
        onCancelEditEnvio,
        onCancelEditCliente,
        onCancelEditPedido,
        onCancelEditTransportista,
        clienteSeleccionado,
        pedidoSeleccionado,
        transportistaSeleccionado
    } = useLogisticaData();

    useEffect(() => {
        const theme = isDarkMode ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        window.localStorage.setItem('theme', theme);
    }, [isDarkMode]);

    return (
        <div className="app">
            <header className="header-bar">
                <h1>🚚 TechLogistics - Rastreo de Envíos 📦</h1>
                <button
                    type="button"
                    className="theme-toggle"
                    onClick={() => setIsDarkMode((previous) => !previous)}
                    aria-label={isDarkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
                >
                    {isDarkMode ? '☀️ Modo claro' : '🌙 Modo oscuro'}
                </button>
            </header>

            <Tabs activeView={activeView} setActiveView={setActiveView} />

            {activeView === 'envios' && (
                <EnviosView
                    envios={envios}
                    seleccion={seleccion}
                    loadingEnvios={loadingEnvios}
                    actualizarEnvios={actualizarEnvios}
                    seleccionarEnvio={seleccionarEnvio}
                    editarEnvio={editarEnvio}
                    handleConfirmDelete={handleConfirmDelete}
                    loadingRastreo={loadingRastreo}
                    rastreo={rastreo}
                    editingEnvioId={editingEnvioId}
                    envioNuevo={envioNuevo}
                    setEnvioNuevo={setEnvioNuevo}
                    pedidos={pedidos}
                    transportistas={transportistas}
                    guardarEnvio={guardarEnvio}
                    crearEnvio={crearEnvio}
                    onCancelEditEnvio={onCancelEditEnvio}
                />
            )}

            {activeView === 'clientes' && (
                <ClientesView
                    clientes={clientes}
                    seleccionCliente={seleccionCliente}
                    seleccionarCliente={seleccionarCliente}
                    handleConfirmDelete={handleConfirmDelete}
                    editarCliente={editarCliente}
                    loadingClientes={loadingClientes}
                    actualizarClientes={actualizarClientes}
                    clienteSeleccionado={clienteSeleccionado}
                    editingClienteId={editingClienteId}
                    clienteNuevo={clienteNuevo}
                    setClienteNuevo={setClienteNuevo}
                    guardarCliente={guardarCliente}
                    crearCliente={crearCliente}
                    onCancelEditCliente={onCancelEditCliente}
                />
            )}

            {activeView === 'pedidos' && (
                <PedidosView
                    pedidos={pedidos}
                    seleccionPedido={seleccionPedido}
                    seleccionarPedido={seleccionarPedido}
                    handleConfirmDelete={handleConfirmDelete}
                    editarPedido={editarPedido}
                    loadingPedidos={loadingPedidos}
                    actualizarPedidos={actualizarPedidos}
                    pedidoSeleccionado={pedidoSeleccionado}
                    editingPedidoId={editingPedidoId}
                    pedidoNuevo={pedidoNuevo}
                    setPedidoNuevo={setPedidoNuevo}
                    guardarPedido={guardarPedido}
                    crearPedido={crearPedido}
                    onCancelEditPedido={onCancelEditPedido}
                    clientes={clientes}
                />
            )}

            {activeView === 'transportistas' && (
                <TransportistasView
                    transportistas={transportistas}
                    seleccionTransportista={seleccionTransportista}
                    seleccionarTransportista={seleccionarTransportista}
                    handleConfirmDelete={handleConfirmDelete}
                    editarTransportista={editarTransportista}
                    loadingTransportistas={loadingTransportistas}
                    actualizarTransportistas={actualizarTransportistas}
                    transportistaSeleccionado={transportistaSeleccionado}
                    editingTransportistaId={editingTransportistaId}
                    transportistaNuevo={transportistaNuevo}
                    setTransportistaNuevo={setTransportistaNuevo}
                    guardarTransportista={guardarTransportista}
                    crearTransportista={crearTransportista}
                    onCancelEditTransportista={onCancelEditTransportista}
                />
            )}

            <ConfirmDialog
                confirmDialog={confirmDialog}
                closeConfirm={closeConfirm}
                confirmDelete={confirmDelete}
                loadingAction={loadingAction}
            />

            {feedback?.message && <div className={`feedback ${feedback.type || 'info'}`}>{feedback.message}</div>}
        </div>
    );
}

export default App;
