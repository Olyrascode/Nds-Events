import { createContext, useContext, useState } from 'react';
import { addToCart as addToCartUtil } from '../utils/cartUtils';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product, quantity, startDate, endDate) => {
    setCart(currentCart => addToCartUtil(currentCart, product, quantity, startDate, endDate));
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart(currentCart => currentCart.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    isCartOpen,  
    setIsCartOpen 
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}