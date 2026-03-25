function ConfirmDialog({ confirmDialog, closeConfirm, confirmDelete, loadingAction }) {
    if (!confirmDialog.open) {
        return null;
    }

    return (
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
    );
}

export default ConfirmDialog;
