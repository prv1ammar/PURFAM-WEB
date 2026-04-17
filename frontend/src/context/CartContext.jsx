import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '@/services/api';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('luxe_cart')) || []; } catch { return []; }
  });
  const [cartOpen, setCartOpen] = useState(false);

  // Sync to localStorage for guests
  useEffect(() => {
    if (!user) localStorage.setItem('luxe_cart', JSON.stringify(items));
  }, [items, user]);

  // On login, merge guest cart with server cart
  useEffect(() => {
    if (user) {
      syncWithServer();
    }
  }, [user]);

  const syncWithServer = async () => {
    try {
      const res = await api.get('/api/cart');
      const serverItems = res.data.cart?.items || [];
      setItems(serverItems);
    } catch (err) {
      console.error('Cart sync error', err);
    }
  };

  const addItem = async (product, sizeMl, qty = 1) => {
    const sizeObj = product.sizes.find(s => s.ml === sizeMl);
    if (!sizeObj) return;

    if (user) {
      try {
        const res = await api.post('/api/cart/add', { productId: product.id || product._id, qty, sizeMl });
        setItems(res.data.cart.items);
      } catch (err) { console.error(err); }
    } else {
      setItems(prev => {
        const pid = product.id || product._id;
        const existIdx = prev.findIndex(i => (i.product?.id || i.product?._id) === pid && i.sizeMl === sizeMl);
        if (existIdx >= 0) {
          const updated = [...prev];
          updated[existIdx] = { ...updated[existIdx], qty: updated[existIdx].qty + qty };
          return updated;
        }
        return [...prev, { id: Date.now().toString(), product, sizeMl, qty, price: sizeObj.price }];
      });
    }
    setCartOpen(true);
  };

  const removeItem = async (itemId) => {
    if (user) {
      try {
        const res = await api.delete(`/api/cart/remove/${itemId}`);
        setItems(res.data.cart.items);
      } catch (err) { console.error(err); }
    } else {
      setItems(prev => prev.filter(i => (i.id || i._id) !== itemId));
    }
  };

  const updateQty = async (itemId, qty) => {
    if (user) {
      try {
        const res = await api.put('/api/cart/update', { itemId, qty });
        setItems(res.data.cart.items);
      } catch (err) { console.error(err); }
    } else {
      if (qty <= 0) {
        setItems(prev => prev.filter(i => (i.id || i._id) !== itemId));
      } else {
        setItems(prev => prev.map(i => (i.id || i._id) === itemId ? { ...i, qty } : i));
      }
    }
  };

  const clearCart = () => {
    setItems([]);
    if (user) api.delete('/api/cart/clear').catch(console.error);
  };

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = items.reduce((sum, i) => sum + (i.price * i.qty), 0);

  return (
    <CartContext.Provider value={{ items, cartOpen, setCartOpen, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
