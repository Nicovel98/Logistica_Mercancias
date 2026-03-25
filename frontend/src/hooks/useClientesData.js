import { useState } from 'react';
import { deleteCliente, fetchClientes, postCliente, updateCliente } from '../api';
import { INITIAL_CLIENTE } from './constants';

function useClientesData(setFeedback) {
    const [clientes, setClientes] = useState([]);
    const [seleccionCliente, setSeleccionCliente] = useState(null);
    const [clienteNuevo, setClienteNuevo] = useState({ ...INITIAL_CLIENTE });
    const [editingClienteId, setEditingClienteId] = useState(null);
    const [loadingClientes, setLoadingClientes] = useState(false);

    const actualizarClientes = async () => {
        setLoadingClientes(true);
        try {
            const data = await fetchClientes();
            setClientes(data);
        } catch (error) {
            console.error(error);
            setFeedback({ type: 'error', message: error.message });
        } finally {
            setLoadingClientes(false);
        }
    };

    const seleccionarCliente = (id) => {
        setSeleccionCliente(id);
    };

    const crearCliente = async (e) => {
        e.preventDefault();
        try {
            await postCliente(clienteNuevo);
            setClienteNuevo({ ...INITIAL_CLIENTE });
            await actualizarClientes();
            setFeedback({ type: 'success', message: 'Cliente creado correctamente' });
        } catch (error) {
            setFeedback({ type: 'error', message: error.message });
        }
    };

    const editarCliente = (cliente) => {
        setEditingClienteId(cliente.id_cliente);
        setClienteNuevo({ nombre: cliente.nombre, email: cliente.email, telefono: cliente.telefono, direccion_principal: cliente.direccion_principal });
    };

    const guardarCliente = async (e) => {
        e.preventDefault();
        if (!editingClienteId) return;
        try {
            await updateCliente(editingClienteId, clienteNuevo);
            setEditingClienteId(null);
            setClienteNuevo({ ...INITIAL_CLIENTE });
            await actualizarClientes();
            setFeedback({ type: 'success', message: 'Cliente actualizado correctamente' });
        } catch (error) {
            setFeedback({ type: 'error', message: error.message });
        }
    };

    const eliminarCliente = async (id) => {
        await deleteCliente(id);
        await actualizarClientes();
        if (seleccionCliente === id) {
            setSeleccionCliente(null);
        }
        setFeedback({ type: 'success', message: 'Cliente eliminado correctamente' });
    };

    const onCancelEditCliente = () => {
        setEditingClienteId(null);
        setClienteNuevo({ ...INITIAL_CLIENTE });
        setFeedback({ type: 'info', message: 'Edición cancelada.' });
    };

    const clienteSeleccionado = clientes.find((cliente) => cliente.id_cliente === seleccionCliente);

    return {
        clientes,
        seleccionCliente,
        clienteNuevo,
        editingClienteId,
        loadingClientes,
        setClienteNuevo,
        actualizarClientes,
        seleccionarCliente,
        crearCliente,
        editarCliente,
        guardarCliente,
        eliminarCliente,
        onCancelEditCliente,
        clienteSeleccionado
    };
}

export default useClientesData;
