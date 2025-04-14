// src/components/OrderManagement.js
import React, { useState, useEffect } from 'react';
import './OrderManagement.css';

const OrderManagement = ({ onBack }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  // Status válidos para os pedidos
  const validStatuses = ["Criado", "Em processamento", "Pago", "Enviado", "Entregue", "Cancelado"];

  // Buscar todos os pedidos ao carregar o componente
  useEffect(() => {
    fetchOrders();
  }, []);

  // Função para buscar pedidos
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/pedidos');
      if (!response.ok) {
        throw new Error('Erro ao buscar pedidos');
      }
      const data = await response.json();
      setOrders(data.pedidos || []);
      setError(null);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      setError('Não foi possível carregar os pedidos. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Função para deletar um pedido
  const deleteOrder = async (orderId) => {
    if (!window.confirm('Tem certeza que deseja excluir este pedido?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/pedido?id=${orderId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir pedido');
      }

      // Atualiza a lista de pedidos após excluir
      fetchOrders();
      alert('Pedido excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir pedido:', error);
      alert('Erro ao excluir pedido. Tente novamente.');
    }
  };

  // Função para atualizar o status de um pedido
  const updateOrderStatus = async (e) => {
    e.preventDefault();
    
    if (!selectedOrder || !newStatus) {
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/pedido', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedOrder.id,
          status: newStatus
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar status do pedido');
      }

      // Atualiza a lista de pedidos após atualizar o status
      fetchOrders();
      setSelectedOrder(null);
      setNewStatus('');
      alert('Status do pedido atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error);
      alert('Erro ao atualizar status. Tente novamente.');
    }
  };

  // Formatação de data
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'numeric', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  if (loading) {
    return <div className="loading">Carregando pedidos...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="order-management">
      <div className="order-management-header">
        <h2>Gerenciamento de Pedidos</h2>
        <button className="button secondary" onClick={onBack}>
          Voltar para Loja
        </button>
        <button className="button" onClick={fetchOrders}>
          Atualizar Lista
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <p>Nenhum pedido encontrado.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <h3>Pedido #{order.id}</h3>
                <span className={`order-status status-${order.status.toLowerCase().replace(/\s/g, '-')}`}>
                  {order.status}
                </span>
              </div>
              
              <div className="order-details">
                <p><strong>Cliente:</strong> {order.cliente_nome}</p>
                <p><strong>Email:</strong> {order.cliente_email}</p>
                <p><strong>Data:</strong> {formatDate(order.data_criacao)}</p>
                <p><strong>Total:</strong> R$ {order.valor_total.toFixed(2)}</p>
              </div>
              
              <div className="order-items-summary">
                <h4>Itens ({order.itens.length})</h4>
                <ul>
                  {order.itens.map((item) => (
                    <li key={item.id}>
                      {item.quantidade}x {item.produto_nome} - 
                      R$ {item.preco_unitario.toFixed(2)} cada
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="order-actions">
                <button 
                  className="button"
                  onClick={() => setSelectedOrder(order)}
                >
                  Atualizar Status
                </button>
                <button 
                  className="button secondary"
                  onClick={() => deleteOrder(order.id)}
                >
                  Excluir Pedido
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <div className="status-update-modal">
          <div className="modal-content">
            <h3>Atualizar Status do Pedido #{selectedOrder.id}</h3>
            <form onSubmit={updateOrderStatus}>
              <div className="form-group">
                <label htmlFor="status">Novo Status:</label>
                <select
                  id="status"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  required
                >
                  <option value="">Selecione um status</option>
                  {validStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="button secondary" onClick={() => setSelectedOrder(null)}>
                  Cancelar
                </button>
                <button type="submit" className="button">
                  Atualizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;