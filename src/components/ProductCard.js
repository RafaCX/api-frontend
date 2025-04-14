import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  const { id, nome, preco, descricao, categoria, imagem } = product;

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={imagem} alt={nome} />
      </div>
      <div className="product-details">
        <h3 className="product-title">{nome}</h3>
        <p className="product-category">{categoria}</p>
        <p className="product-price">R$ {preco.toFixed(2)}</p>
        <p className="product-description">{descricao.substring(0, 100)}...</p>
        <button 
          className="add-to-cart-button"
          onClick={() => onAddToCart(product)}
        >
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
};

export default ProductCard;