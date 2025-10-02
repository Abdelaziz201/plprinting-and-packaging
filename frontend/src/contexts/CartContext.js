import React, { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

const initialState = {
  items: JSON.parse(localStorage.getItem('cart')) || [],
  total: 0,
  itemCount: 0,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, quantity = 1, customizations = [] } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => item.product._id === product._id && 
        JSON.stringify(item.customizations) === JSON.stringify(customizations)
      );

      let newItems;
      if (existingItemIndex > -1) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...state.items, {
          id: `${product._id}-${Date.now()}`,
          product,
          quantity,
          customizations,
          price: product.price
        }];
      }

      return {
        ...state,
        items: newItems,
      };
    }

    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: newItems,
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      const newItems = state.items.map(item =>
        item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
      ).filter(item => item.quantity > 0);

      return {
        ...state,
        items: newItems,
      };
    }

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      };

    case 'CALCULATE_TOTALS': {
      const total = state.items.reduce((sum, item) => {
        const customizationCost = item.customizations.reduce(
          (customSum, custom) => customSum + (custom.additionalCost || 0),
          0
        );
        return sum + ((item.price + customizationCost) * item.quantity);
      }, 0);

      const itemCount = state.items.reduce((count, item) => count + item.quantity, 0);

      return {
        ...state,
        total,
        itemCount,
      };
    }

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Calculate totals whenever items change
  useEffect(() => {
    dispatch({ type: 'CALCULATE_TOTALS' });
  }, [state.items]);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (product, quantity = 1, customizations = []) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: { product, quantity, customizations }
    });
    toast.success(`${product.name} added to cart!`);
  };

  const removeFromCart = (id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    toast.success('Item removed from cart');
  };

  const updateQuantity = (id, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast.success('Cart cleared');
  };

  const getItemQuantity = (productId, customizations = []) => {
    const item = state.items.find(
      item => item.product._id === productId && 
      JSON.stringify(item.customizations) === JSON.stringify(customizations)
    );
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

