import React from 'react';
import './Header.css';

const Header = ({ 
  cartItemCount, 
  onCartClick, 
  categories, 
  selectedCategory, 
  onCategoryChange,
  onAdminClick
}) => {
  return (
    <header className="header">
      <div className="header-top">
        <h1 className="logo">Loja Online</h1>
        <div className="header-actions">
          <button className="admin-button" onClick={onAdminClick}>
            Administração
          </button>
          <button className="cart-button" onClick={onCartClick}>
            🛒 Carrinho ({cartItemCount})
          </button>
        </div>
      </div>
      
      <div className="categories">
        <button 
          className={`category-item ${selectedCategory === '' ? 'active' : ''}`}
          onClick={() => onCategoryChange('')}
        >
          Todos
        </button>
        
        {categories.map(category => (
          <button 
            key={category} 
            className={`category-item ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => onCategoryChange(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
    </header>
  );
};

export default Header;