import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderManagement from './components/OrderManagement';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showOrderManagement, setShowOrderManagement] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar produtos ao iniciar
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Carregar produtos quando a categoria for alterada
  useEffect(() => {
    if (selectedCategory) {
      fetchProductsByCategory(selectedCategory);
    } else {
      fetchProducts();
    }
  }, [selectedCategory]);

  // Buscar todos os produtos
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/produtos');
      if (!response.ok) {
        throw new Error('Erro ao carregar produtos');
      }
      const data = await response.json();
      setProducts(data.produtos);
      setError(null);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      setError('Não foi possível carregar os produtos. Tente novamente mais tarde.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Buscar categorias
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5001/categorias');
      if (!response.ok) {
        throw new Error('Erro ao carregar categorias');
      }
      const data = await response.json();
      setCategories(data.categorias);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      setCategories([]);
    }
  };

  // Buscar produtos por categoria - CORRIGIDO
  const fetchProductsByCategory = async (category) => {
    setLoading(true);
    try {
      // Vamos usar encodeURIComponent para garantir que caracteres especiais sejam tratados corretamente
      const encodedCategory = encodeURIComponent(category);
      
      // Registrar URL para debug
      console.log(`Buscando produtos da categoria: ${encodedCategory}`);
      
      // URL CORRIGIDA: usando query parameter em vez de path parameter
      const url = `http://localhost:5001/produtos/categoria/{categoria}?categoria=${encodedCategory}`;
      console.log(`URL: ${url}`);
      
      const response = await fetch(url);
      
      console.log(`Status da resposta: ${response.status}`);
      
      if (!response.ok) {
        // Tentativa de exibir detalhes de erro
        try {
          const errorText = await response.text();
          console.error('Resposta do erro:', errorText);
        } catch (e) {
          console.error('Não foi possível ler o corpo da resposta de erro');
        }
        
        throw new Error(`Erro ao carregar produtos da categoria (${response.status})`);
      }
      
      const data = await response.json();
      console.log('Dados recebidos:', data);
      
      if (data && data.produtos) {
        setProducts(data.produtos);
        setError(null);
      } else {
        console.error('Formato de resposta inesperado:', data);
        setError('A resposta do servidor não contém dados de produtos válidos.');
        setProducts([]);
      }
    } catch (error) {
      console.error('Erro ao buscar produtos por categoria:', error);
      setError('Não foi possível carregar os produtos desta categoria.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Adicionar produto ao carrinho
  const addToCart = (product) => {
    const existingProduct = cart.find(item => item.id === product.id);
    
    if (existingProduct) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantidade: item.quantidade + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantidade: 1 }]);
    }
  };

  // Remover produto do carrinho
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  // Atualizar quantidade de um item no carrinho
  const updateCartItemQuantity = (productId, quantidade) => {
    if (quantidade <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => 
        item.id === productId 
          ? { ...item, quantidade } 
          : item
      ));
    }
  };

  // Finalizar pedido
  const checkout = async (customerInfo) => {
    try {
      // Formatar os itens conforme esperado pela API
      const itensFormatados = cart.map(item => ({
        produto_id: Number(item.id),
        produto_nome: String(item.nome),
        quantidade: Number(item.quantidade),
        preco_unitario: Number(item.preco)
      }));

      const pedido = {
        cliente_nome: customerInfo.nome,
        cliente_email: customerInfo.email,
        itens: itensFormatados
      };

      console.log("Enviando pedido:", pedido);

      const response = await fetch('http://localhost:5000/pedido', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedido),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro detalhado:", errorData);
        alert(`Erro ao realizar pedido: ${errorData.detail || errorData.mesage || 'Tente novamente.'}`);
        return;
      }

      const data = await response.json();
      console.log("Resposta do servidor:", data);
      alert('Pedido realizado com sucesso!');
      setCart([]);
      setShowCheckout(false);
      setShowCart(false);
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
      alert('Erro ao finalizar pedido. Verifique sua conexão e tente novamente.');
    }
  };

  return (
    <div className="App">
      <Header 
        cartItemCount={cart.reduce((total, item) => total + item.quantidade, 0)} 
        onCartClick={() => {
          setShowCart(true);
          setShowCheckout(false);
          setShowOrderManagement(false);
        }}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={(category) => setSelectedCategory(category)}
        onAdminClick={() => {
          setShowOrderManagement(true);
          setShowCart(false);
          setShowCheckout(false);
        }}
      />
      
      {!showCart && !showCheckout && !showOrderManagement && (
        <ProductList 
          products={products} 
          onAddToCart={addToCart}
          loading={loading}
          error={error}
        />
      )}
      
      {showCart && !showCheckout && !showOrderManagement && (
        <Cart 
          items={cart} 
          onRemoveItem={removeFromCart} 
          onUpdateQuantity={updateCartItemQuantity}
          onCheckout={() => {
            if (cart.length > 0) {
              setShowCheckout(true);
              setShowCart(false);
            } else {
              alert('Adicione produtos ao carrinho primeiro.');
            }
          }}
          onContinueShopping={() => setShowCart(false)}
        />
      )}
      
      {showCheckout && !showOrderManagement && (
        <Checkout 
          cart={cart} 
          onCheckout={checkout}
          onBack={() => {
            setShowCheckout(false);
            setShowCart(true);
          }}
        />
      )}

      {showOrderManagement && (
        <OrderManagement 
          onBack={() => setShowOrderManagement(false)}
        />
      )}
    </div>
  );
}

export default App;