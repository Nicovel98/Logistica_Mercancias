function Tabs({ activeView, setActiveView }) {
    return (
        <div className="tabs">
            <button className={activeView === 'envios' ? 'tab active' : 'tab'} onClick={() => setActiveView('envios')}>Envíos</button>
            <button className={activeView === 'clientes' ? 'tab active' : 'tab'} onClick={() => setActiveView('clientes')}>Clientes</button>
            <button className={activeView === 'pedidos' ? 'tab active' : 'tab'} onClick={() => setActiveView('pedidos')}>Pedidos</button>
            <button className={activeView === 'transportistas' ? 'tab active' : 'tab'} onClick={() => setActiveView('transportistas')}>Transportistas</button>
        </div>
    );
}

export default Tabs;
