// src/context/CartContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import api from "../../api";
import toast from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const getToken = () => localStorage.getItem("token");

  const fetchCart = async () => {
    try {
      const res = await api.get("/api/cart", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setCart(res.data.items);
    } catch (err) {
      console.error("Fetch cart failed", err);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const res = await api.post(
        "/api/cart/add",
        { productId, quantity },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      // Update local state instead of fetching again
      setCart(res.data.items);
      toast.success("Added to cart");
    } catch (err) {
      console.error("Add to cart error", err);
      toast.error("Failed to add to cart");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await api.delete(`/api/cart/${productId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setCart(res.data.items);
      toast.success("Removed from cart");
    } catch (err) {
      console.error("Remove from cart error", err);
      toast.error("Failed to remove item");
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await api.put(
        `/api/cart/${productId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setCart(res.data.items);
    } catch (err) {
      console.error("Update quantity error", err);
      toast.error("Failed to update quantity");
    }
  };

  const clearCart = async () => {
    try {
      await api.delete("/api/cart", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setCart([]);
      toast.success("Cart cleared");
    } catch (err) {
      console.error("Clear cart error", err);
      toast.error("Failed to clear cart");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{ cart, fetchCart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
