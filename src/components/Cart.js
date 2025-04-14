import React from 'react';
import './Cart.css';

const Cart = ({ items, onRemoveItem, onUpdateQuantity, onCheckout, onContinueShopping }) => {
  const total = items.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);

  return (
    <div className="cart-container">
      <h2 className="section-title">Seu Carrinho</h2>
      
      {items.length === 0 ? (
        <div className="empty-cart">
          <p>Seu carrinho está vazio</p>
          <button className="button" onClick={onContinueShopping}>Continuar Comprando</button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {items.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.imagem} alt={item.nome} />
                </div>
                <div className="cart-item-details">
                  <h3>{item.nome}</h3>
                  <p className="item-price">R$ {item.preco.toFixed(2)} cada</p>
                </div>
                <div className="cart-item-actions">
                  <div className="quantity-control">
                    <button onClick={() => onUpdateQuantity(item.id, item.quantidade - 1)}>-</button>
                    <span>{item.quantidade}</span>
                    <button onClick={() => onUpdateQuantity(item.id, item.quantidade + 1)}>+</button>
                  </div>
                  <p className="item-subtotal">R$ {(item.preco * item.quantidade).toFixed(2)}</p>
                  <button className="remove-button" onClick={() => onRemoveItem(item.id)}>Remover</button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <div className="cart-total">
              <h3>Total</h3>
              <p>R$ {total.toFixed(2)}</p>
            </div>
            <div className="cart-actions">
              <button className="button" onClick={onContinueShopping}>Continuar Comprando</button>
              <button className="button checkout-button" onClick={onCheckout}>Finalizar Compra</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;