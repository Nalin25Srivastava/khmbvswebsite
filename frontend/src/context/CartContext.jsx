import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity, flavor) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(
                (item) => 
                    item._id === product._id && 
                    item.flavor?.name === flavor?.name &&
                    item.selectedSize === product.selectedSize
            );

            if (existingItem) {
                return prevItems.map((item) =>
                    item._id === product._id && 
                    item.flavor?.name === flavor?.name &&
                    item.selectedSize === product.selectedSize
                        ? { ...item, qty: item.qty + quantity }
                        : item
                );
            }
            return [...prevItems, { ...product, qty: quantity, flavor }];
        });
    };

    const removeFromCart = (id, flavorName, size) => {
        setCartItems((prevItems) => 
            prevItems.filter((item) => 
                !(item._id === id && item.flavor?.name === flavorName && item.selectedSize === size)
            )
        );
    };

    const updateQuantity = (id, flavorName, size, qty) => {
        if (qty < 1) return;
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item._id === id && item.flavor?.name === flavorName && item.selectedSize === size
                    ? { ...item, qty }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartCount: cartItems.reduce((acc, item) => acc + item.qty, 0),
                cartTotal: cartItems.reduce((acc, item) => acc + item.price * item.qty, 0),
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
