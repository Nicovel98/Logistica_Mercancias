import { useState } from 'react';
import { deletePedido, fetchPedidos, postPedido, updatePedido } from '../api';
import { INITIAL_PEDIDO } from './constants';

function usePedidosData(setFeedback) {
    const [pedidos, setPedidos] = useState([]);
    const [seleccionPedido, setSeleccionPedido] = useState(null);
    const [pedidoNuevo, setPedidoNuevo] = useState({ ...INITIAL_PEDIDO });
    const [editingPedidoId, setEditingPedidoId] = useState(null);
    const [loadingPedidos, setLoadingPedidos] = useState(false);

    const actualizarPedidos = async () => {
        setLoadingPedidos(true);
        try {
            const data = await fetchPedidos();
            setPedidos(data);
        } catch (error) {
            console.error(error);
            setFeedback({ type: 'error', message: error.message });
        } finally {
            setLoadingPedidos(false);
        }
    };

    const seleccionarPedido = (id) => {
        setSeleccionPedido(id);
    };

    const crearPedido = async (e) => {
        e.preventDefault();
        try {
            await postPedido(pedidoNuevo);
            setPedidoNuevo({ ...INITIAL_PEDIDO });
            await actualizarPedidos();
            setFeedback({ type: 'success', message: 'Pedido creado correctamente' });
        } catch (error) {
            setFeedback({ type: 'error', message: error.message });
        }
    };

    const editarPedido = (pedido) => {
        setEditingPedidoId(pedido.id_pedido);
        setPedidoNuevo({ id_cliente: pedido.id_cliente, estado_pedido: pedido.estado_pedido });
    };

    const guardarPedido = async (e) => {
        e.preventDefault();
        if (!editingPedidoId) return;
        try {
            await updatePedido(editingPedidoId, pedidoNuevo);
            setEditingPedidoId(null);
            setPedidoNuevo({ ...INITIAL_PEDIDO });
            await actualizarPedidos();
            setFeedback({ type: 'success', message: 'Pedido actualizado correctamente' });
        } catch (error) {
            setFeedback({ type: 'error', message: error.message });
        }
    };

    const eliminarPedido = async (id) => {
        await deletePedido(id);
        await actualizarPedidos();
        if (seleccionPedido === id) {
            setSeleccionPedido(null);
        }
        setFeedback({ type: 'success', message: 'Pedido eliminado correctamente' });
    };

    const onCancelEditPedido = () => {
        setEditingPedidoId(null);
        setPedidoNuevo({ ...INITIAL_PEDIDO });
        setFeedback({ type: 'info', message: 'Edición cancelada.' });
    };

    const pedidoSeleccionado = pedidos.find((pedido) => pedido.id_pedido === seleccionPedido);

    return {
        pedidos,
        seleccionPedido,
        pedidoNuevo,
        editingPedidoId,
        loadingPedidos,
        setPedidoNuevo,
        actualizarPedidos,
        seleccionarPedido,
        crearPedido,
        editarPedido,
        guardarPedido,
        eliminarPedido,
        onCancelEditPedido,
        pedidoSeleccionado
    };
}

export default usePedidosData;
