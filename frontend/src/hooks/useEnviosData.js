import { useState } from 'react';
import { deleteEnvio, fetchEnvios, fetchRastreo, postEnvio, updateEnvio } from '../api';
import { INITIAL_ENVIO, INITIAL_RASTREO } from './constants';

function useEnviosData(setFeedback) {
    const [envios, setEnvios] = useState([]);
    const [seleccion, setSeleccion] = useState(null);
    const [rastreo, setRastreo] = useState({ ...INITIAL_RASTREO });
    const [editingEnvioId, setEditingEnvioId] = useState(null);
    const [loadingEnvios, setLoadingEnvios] = useState(false);
    const [loadingRastreo, setLoadingRastreo] = useState(false);
    const [envioNuevo, setEnvioNuevo] = useState({ ...INITIAL_ENVIO });

    const actualizarEnvios = async () => {
        setLoadingEnvios(true);
        setFeedback(null);
        try {
            const data = await fetchEnvios();
            setEnvios(data);
        } catch (error) {
            console.error(error);
            setFeedback({ type: 'error', message: error.message });
        } finally {
            setLoadingEnvios(false);
        }
    };

    const seleccionarEnvio = async (id) => {
        setSeleccion(id);
        setLoadingRastreo(true);
        setFeedback(null);
        try {
            const data = await fetchRastreo(id);
            setRastreo(data);
        } catch (error) {
            console.error(error);
            setFeedback({ type: 'error', message: error.message });
        } finally {
            setLoadingRastreo(false);
        }
    };

    const crearEnvio = async (e) => {
        e.preventDefault();
        try {
            await postEnvio(envioNuevo);
            setEnvioNuevo({ ...INITIAL_ENVIO });
            await actualizarEnvios();
            setFeedback({ type: 'success', message: 'Envío creado correctamente' });
        } catch (error) {
            setFeedback({ type: 'error', message: error.message });
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
            await actualizarEnvios();
            setFeedback({ type: 'success', message: 'Envío actualizado correctamente' });
        } catch (error) {
            setFeedback({ type: 'error', message: error.message });
        }
    };

    const eliminarEnvio = async (id) => {
        await deleteEnvio(id);
        await actualizarEnvios();
        if (seleccion === id) {
            setSeleccion(null);
            setRastreo({ ...INITIAL_RASTREO });
        }
        setFeedback({ type: 'success', message: 'Envío eliminado correctamente' });
    };

    const onCancelEditEnvio = () => {
        setEditingEnvioId(null);
        setEnvioNuevo({ ...INITIAL_ENVIO });
        setFeedback({ type: 'info', message: 'Edición de envío cancelada.' });
    };

    const handleSocketUpdate = async (payload) => {
        if (seleccion && payload.envio?.id_envio === seleccion) {
            setRastreo(payload);
        }
        await actualizarEnvios();
    };

    return {
        envios,
        seleccion,
        rastreo,
        editingEnvioId,
        loadingEnvios,
        loadingRastreo,
        envioNuevo,
        setEnvioNuevo,
        actualizarEnvios,
        seleccionarEnvio,
        crearEnvio,
        editarEnvio,
        guardarEnvio,
        eliminarEnvio,
        onCancelEditEnvio,
        handleSocketUpdate
    };
}

export default useEnviosData;
