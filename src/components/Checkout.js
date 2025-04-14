import React, { useState } from 'react';
import './Checkout.css';

const Checkout = ({ cart, onCheckout, onBack }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: ''
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Criando o objeto de pedido no formato esperado pela API
      const pedidoData = {
        cliente_nome: formData.nome,
        cliente_email: formData.email,
        itens: cart.map(item => ({
          produto_id: item.id,
          produto_nome: item.nome,
          quantidade: item.quantidade,
          preco_unitario: item.preco
        }))
      };
      
      // Log para debug
      console.log("Enviando pedido:", pedidoData);
      
      // Enviando os dados formatados para o checkout
      onCheckout(pedidoData);
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);

  return (
    <div className="checkout-container">
      <h2 className="section-title">Finalizar Compra</h2>
      
      <div className="checkout-content">
        <div className="checkout-form-container">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <h3>Informações para o Pedido</h3>
            
            <div className="form-group">
              <label htmlFor="nome">Nome Completo</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className={errors.nome ? 'error' : ''}
              />
              {errors.nome && <span className="error-message">{errors.nome}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            
            <div className="form-actions">
              <button type="button" className="button secondary" onClick={onBack}>
                Voltar
              </button>
              <button type="submit" className="button">
                Confirmar Pedido
              </button>
            </div>
          </form>
        </div>
        
        <div className="order-summary">
          <h3>Resumo do Pedido</h3>
          
          <div className="order-items">
            {cart.map(item => (
              <div key={item.id} className="order-item">
                <span className="item-quantity">{item.quantidade}x</span>
                <span className="item-name">{item.nome}</span>
                <span className="item-price">R$ {(item.preco * item.quantidade).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="order-total">
            <span>Total</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;