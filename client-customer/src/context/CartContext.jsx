/* eslint-disable react-refresh/only-export-components -- context module exports provider + hook */
import { createContext, useContext, useState } from "react";
import { getFinalPrice } from "../utils/priceHelper";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // ADD ITEM WITH CUSTOMIZATIONS
  const addToCart = (product, customizations = {}, customizationPrice = 0) => {
    const customizationKey = JSON.stringify(customizations);
    const itemId = `${product._id}-${customizationKey}`;

    // Calculate final price with discount
    const priceData = getFinalPrice(
      product.price,
      product.discountEnabled,
      product.discountType,
      product.discountValue
    );

    const cartItem = {
      _id: itemId,
      productId: product._id,
      name: product.name,
      basePrice: product.price,
      originalPrice: priceData.originalPrice,
      discountedPrice: priceData.finalPrice,
      discountAmount: priceData.discountAmount,
      discountEnabled: product.discountEnabled,
      discountType: product.discountType,
      discountValue: product.discountValue,
      customizationPrice: customizationPrice,
      price: priceData.finalPrice + customizationPrice,
      customizations: customizations,
      quantity: 1,
    };

    setCart((prev) => {
      const existing = prev.find((item) => item._id === itemId);

      if (existing) {
        return prev.map((item) =>
          item._id === itemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, cartItem];
      }
    });
  };

  // REMOVE ITEM
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  // INCREASE
  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // DECREASE
  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item._id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // TOTAL
  const getTotal = () => {
    return cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  const getCartItemCount = () =>
    cart.reduce((sum, item) => sum + item.quantity, 0);

  const clearCart = () => setCart([]);
  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        getTotal,
        getCartItemCount,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};