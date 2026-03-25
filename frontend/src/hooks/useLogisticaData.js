import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import useEnviosData from './useEnviosData';
import useClientesData from './useClientesData';
import usePedidosData from './usePedidosData';
import useTransportistasData from './useTransportistasData';

const socket = io('http://localhost:3000');

function useLogisticaData() {
    const [feedback, setFeedbackState] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({ open: false, type: '', id: null, label: '' });
    const [loadingAction, setLoadingAction] = useState(false);

    const setFeedback = (value) => {
        if (!value) {
            setFeedbackState(null);
            return;
        }

        if (typeof value === 'string') {
            setFeedbackState({ type: 'info', message: value });
            return;
        }

        setFeedbackState(value);
    };

    const enviosData = useEnviosData(setFeedback);
    const clientesData = useClientesData(setFeedback);
    const pedidosData = usePedidosData(setFeedback);
    const transportistasData = useTransportistasData(setFeedback);

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
                    await clientesData.eliminarCliente(confirmDialog.id);
                    break;
                case 'pedido':
                    await pedidosData.eliminarPedido(confirmDialog.id);
                    break;
                case 'transportista':
                    await transportistasData.eliminarTransportista(confirmDialog.id);
                    break;
                case 'envio':
                    await enviosData.eliminarEnvio(confirmDialog.id);
                    break;
                default:
                    break;
            }
        } catch (error) {
            setFeedback({ type: 'error', message: error.message });
        } finally {
            setConfirmDialog({ open: false, type: '', id: null, label: '' });
            setLoadingAction(false);
        }
    };

    useEffect(() => {
        enviosData.actualizarEnvios();
        clientesData.actualizarClientes();
        pedidosData.actualizarPedidos();
        transportistasData.actualizarTransportistas();
    }, []);

    useEffect(() => {
        const onRastreoActualizado = async (payload) => {
            await enviosData.handleSocketUpdate(payload);
        };

        socket.on('rastreo_actualizado', onRastreoActualizado);

        return () => {
            socket.off('rastreo_actualizado', onRastreoActualizado);
        };
    }, [enviosData.seleccion]);

    return {
        feedback,
        confirmDialog,
        loadingAction,
        handleConfirmDelete,
        closeConfirm,
        confirmDelete,
        ...enviosData,
        ...clientesData,
        ...pedidosData,
        ...transportistasData
    };
}

export default useLogisticaData;
