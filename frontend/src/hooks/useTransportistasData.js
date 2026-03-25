import { useState } from 'react';
import { deleteTransportista, fetchTransportistas, postTransportista, updateTransportista } from '../api';
import { INITIAL_TRANSPORTISTA } from './constants';

function useTransportistasData(setFeedback) {
    const [transportistas, setTransportistas] = useState([]);
    const [seleccionTransportista, setSeleccionTransportista] = useState(null);
    const [editingTransportistaId, setEditingTransportistaId] = useState(null);
    const [transportistaNuevo, setTransportistaNuevo] = useState({ ...INITIAL_TRANSPORTISTA });
    const [loadingTransportistas, setLoadingTransportistas] = useState(false);

    const actualizarTransportistas = async () => {
        setLoadingTransportistas(true);
        try {
            const data = await fetchTransportistas();
            setTransportistas(data);
        } catch (error) {
            console.error(error);
            setFeedback({ type: 'error', message: error.message });
        } finally {
            setLoadingTransportistas(false);
        }
    };

    const seleccionarTransportista = (id) => {
        setSeleccionTransportista(id);
    };

    const crearTransportista = async (e) => {
        e.preventDefault();
        try {
            await postTransportista(transportistaNuevo);
            setTransportistaNuevo({ ...INITIAL_TRANSPORTISTA });
            await actualizarTransportistas();
            setFeedback({ type: 'success', message: 'Transportista creado correctamente' });
        } catch (error) {
            setFeedback({ type: 'error', message: error.message });
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
            await actualizarTransportistas();
            setFeedback({ type: 'success', message: 'Transportista actualizado correctamente' });
        } catch (error) {
            setFeedback({ type: 'error', message: error.message });
        }
    };

    const eliminarTransportista = async (id) => {
        await deleteTransportista(id);
        await actualizarTransportistas();
        if (seleccionTransportista === id) {
            setSeleccionTransportista(null);
        }
        setFeedback({ type: 'success', message: 'Transportista eliminado correctamente' });
    };

    const onCancelEditTransportista = () => {
        setEditingTransportistaId(null);
        setTransportistaNuevo({ ...INITIAL_TRANSPORTISTA });
        setFeedback({ type: 'info', message: 'Edición cancelada.' });
    };

    const transportistaSeleccionado = transportistas.find((transportista) => transportista.id_transportista === seleccionTransportista);

    return {
        transportistas,
        seleccionTransportista,
        editingTransportistaId,
        transportistaNuevo,
        loadingTransportistas,
        setTransportistaNuevo,
        actualizarTransportistas,
        seleccionarTransportista,
        crearTransportista,
        editarTransportista,
        guardarTransportista,
        eliminarTransportista,
        onCancelEditTransportista,
        transportistaSeleccionado
    };
}

export default useTransportistasData;
