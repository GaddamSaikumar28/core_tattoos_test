


"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { 
  Cart, 
  createCart, 
  getCart, 
  addToCart as apiAddToCart, 
  updateCartItem, 
  removeFromCart,
  updateCartBuyerIdentity,
  ShopifyAddress,
  getCustomer,
  getCustomerAddresses,
} from "@/src/lib/shopify";
import Cookies from "js-cookie";
interface CartContextType {
  cart: Cart | null;
  cartCount: number;
  isCartOpen: boolean;
  isCartLoading: boolean;
  isAddingToCart: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (variantOrId: any, quantity?: number) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeLineItem: (lineId: string) => Promise<void>;
  linkCartToUser: (customerAccessToken: string) => Promise<void>;
  buyNow: (variantId: string, quantity: number) => Promise<string | undefined>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_ID_KEY = "shopify_cart_id";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // 1. Initialize Cart from LocalStorage & Ensure Identity Synchronization
  const initializeCart = useCallback(async () => {
    setIsCartLoading(true);
    const savedCartId = typeof window !== 'undefined' ? localStorage.getItem(CART_ID_KEY) : null;

    if (savedCartId) {
      try {
        let existingCart = await getCart(savedCartId);
        if (existingCart) {
          // FIX: If a user is logged in on mount, sync identity immediately to clear initial race conditions
          const userToken = Cookies.get("shopify_customer_token");
          if (userToken) {
            const [profile, addressData] = await Promise.all([
              getCustomer(userToken),
              getCustomerAddresses(userToken)
            ]);

            const defaultAddress = addressData?.addresses?.find(
              (a: any) => a.id === addressData.defaultAddressId
            ) || addressData?.addresses?.[0];

            existingCart = await updateCartBuyerIdentity(
              existingCart.id,
              userToken,
              profile?.email,
              defaultAddress
            );
          }
          setCart(existingCart);
        } else {
          localStorage.removeItem(CART_ID_KEY);
          setCart(null);
        }
      } catch (error) {
        console.error("Failed to fetch cart", error);
        localStorage.removeItem(CART_ID_KEY);
      }
    }
    setIsCartLoading(false);
  }, []);

  useEffect(() => {
    initializeCart();
  }, [initializeCart]);

  // Cross-Tab Synchronization
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CART_ID_KEY) {
        initializeCart();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [initializeCart]);

  // --- ACTIONS ---
  const addToCart = async (variantOrId: any, incomingQuantity?: number) => {
    setIsAddingToCart(true);
    try {
      let finalVariantId = "";
      if (typeof variantOrId === 'string') {
        finalVariantId = variantOrId;
      } else if (variantOrId?.variantId) {
        finalVariantId = variantOrId.variantId;
      } else if (variantOrId?.id) {
        finalVariantId = variantOrId.id;
      } else {
        toast.error("Invalid product selected.");
        return;
      }

      const safeQuantity = (typeof incomingQuantity === 'number' && incomingQuantity > 0) ? incomingQuantity : 1;
      const savedCartId = localStorage.getItem(CART_ID_KEY);
      let newCart: Cart;

      if (!savedCartId || !cart) {
        // A. CREATE BRAND NEW CART
        newCart = await createCart(finalVariantId, safeQuantity);
        localStorage.setItem(CART_ID_KEY, newCart.id);
      } else {
        // B. CHECK FOR EXISTING ITEM TO PREVENT DUPLICATES
        const existingLineItem = cart.lines.find(
          (line) => line.merchandise.id === finalVariantId
        );

        if (existingLineItem) {
          const newTotalQuantity = existingLineItem.quantity + safeQuantity;
          newCart = await updateCartItem(cart.id, existingLineItem.id, newTotalQuantity);
        } else {
          newCart = await apiAddToCart(savedCartId, finalVariantId, safeQuantity);
        }
      }

      // FIX: Always attach/verify user identity after any mutation if logged in
      const userToken = Cookies.get("shopify_customer_token");
      if (userToken) {
        const [profile, addressData] = await Promise.all([
          getCustomer(userToken),
          getCustomerAddresses(userToken)
        ]);

        const defaultAddress = addressData?.addresses?.find(
          (a: any) => a.id === addressData.defaultAddressId
        ) || addressData?.addresses?.[0];

        newCart = await updateCartBuyerIdentity(
          newCart.id, 
          userToken,
          profile?.email,
          defaultAddress
        );
      }
      
      setCart(newCart);
      setIsCartOpen(true);
      toast.success("Added to cart");
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const updateQuantity = async (lineId: string, quantity: number) => {
    if (!cart?.id) return;
    const previousCart = { ...cart };
    
    setCart(prev => prev ? {
      ...prev,
      lines: prev.lines.map(line => line.id === lineId ? { ...line, quantity } : line)
    } : null);

    try {
      if (quantity === 0) {
        await removeLineItem(lineId);
      } else {
        let updatedCart = await updateCartItem(cart.id, lineId, quantity);
        
        // Reinforce identity on modifications
        const userToken = Cookies.get("shopify_customer_token");
        if (userToken) {
          const [profile, addressData] = await Promise.all([
            getCustomer(userToken),
            getCustomerAddresses(userToken)
          ]);
          const defaultAddress = addressData?.addresses?.find((a: any) => a.id === addressData.defaultAddressId) || addressData?.addresses?.[0];
          updatedCart = await updateCartBuyerIdentity(updatedCart.id, userToken, profile?.email, defaultAddress);
        }
        setCart(updatedCart);
      }
    } catch (error) {
      console.error("Update quantity error:", error);
      setCart(previousCart);
      toast.error("Failed to update quantity");
    }
  };

  const removeLineItem = async (lineId: string) => {
    if (!cart?.id) return;
    try {
      const updatedCart = await removeFromCart(cart.id, lineId);
      setCart(updatedCart);
    } catch (error) {
      console.error("Remove from cart error:", error);
      toast.error("Failed to remove item");
    }
  };

  // 3. Guest to Logged-in User Handoff
  const linkCartToUser = async (customerAccessToken: string) => {
    try {
      const savedCartId = localStorage.getItem(CART_ID_KEY);
      if (!savedCartId) return; // FIX: Removed "!cart" dependency to protect against on-mount race condition

      const [customerProfile, addressData] = await Promise.all([
        getCustomer(customerAccessToken),
        getCustomerAddresses(customerAccessToken)
      ]);

      let defaultAddress: ShopifyAddress | undefined = undefined;
      if (addressData?.addresses?.length > 0) {
        defaultAddress = addressData.addresses.find(
          (addr: ShopifyAddress) => addr.id === addressData.defaultAddressId
        ) || addressData.addresses[0];
      }

      const updatedCart = await updateCartBuyerIdentity(
        savedCartId, 
        customerAccessToken,
        customerProfile?.email, 
        defaultAddress          
      );
      
      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to link cart to user:", error);
    }
  };

  const buyNow = async (variantId: string, quantity: number): Promise<string | undefined> => {
    try {
      const savedCartId = localStorage.getItem(CART_ID_KEY);
      let checkoutCart: Cart;

      if (!savedCartId || !cart) {
        checkoutCart = await createCart(variantId, quantity);
        localStorage.setItem(CART_ID_KEY, checkoutCart.id);
      } else {
        const existingLineItem = cart.lines.find((line) => line.merchandise.id === variantId);
        if (existingLineItem) {
          checkoutCart = await updateCartItem(cart.id, existingLineItem.id, existingLineItem.quantity + quantity);
        } else {
          checkoutCart = await apiAddToCart(savedCartId, variantId, quantity);
        }
      }

      const userToken = Cookies.get("shopify_customer_token");
      if (userToken) {
        const [profile, addressData] = await Promise.all([
          getCustomer(userToken),
          getCustomerAddresses(userToken)
        ]);
        const defaultAddress = addressData?.addresses?.find((a: any) => a.id === addressData.defaultAddressId) || addressData?.addresses?.[0];
        checkoutCart = await updateCartBuyerIdentity(checkoutCart.id, userToken, profile?.email, defaultAddress);
      }
      
      setCart(checkoutCart);
      return checkoutCart.checkoutUrl;
    } catch (error) {
      console.error("Buy Now process failed:", error);
      toast.error("Failed to initialize checkout.");
      return undefined;
    }
  };

  const cartCount = cart?.totalQuantity || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        isCartOpen,
        isCartLoading,
        isAddingToCart,
        setCartOpen: setIsCartOpen,
        addToCart,
        updateQuantity,
        removeLineItem,
        linkCartToUser,
        buyNow,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}