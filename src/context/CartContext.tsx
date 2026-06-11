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

// Add global declaration for Klaviyo so TypeScript doesn't throw errors
declare global {
  interface Window {
    _learnq: any[];
  }
}

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
          const userToken = Cookies.get("shopify_customer_token");
          if (userToken) {
            const [profile, addressData] = await Promise.all([
              getCustomer(userToken),
              getCustomerAddresses(userToken)
            ]);

            const defaultAddress = addressData?.addresses?.find(
              (a: any) => a.id === addressData.defaultAddressId
            ) || addressData?.addresses?.[0];

            // const countryCode = defaultAddress?.country || "IN";
            const countryCode = "US";
            existingCart = await updateCartBuyerIdentity(
              existingCart.id,
              userToken,
              profile?.email,
              defaultAddress,
              countryCode
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
    const customer = Cookies.get("shopify_customer_token");
    if (!customer) {
      toast.error("Please log in to add items to your cart.");
      return;
    }
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
        const userToken = Cookies.get("shopify_customer_token");
        if (userToken) {
          const [profile, addressData] = await Promise.all([
            getCustomer(userToken),
            getCustomerAddresses(userToken)
          ]);
          
          const defaultAddress = addressData?.addresses?.find(
            (a: any) => a.id === addressData.defaultAddressId
          ) || addressData?.addresses?.[0];
          
          const countryCode = defaultAddress?.country || "IN";

          newCart = await createCart(finalVariantId, safeQuantity, {
            customerAccessToken: userToken,
            email: profile?.email,
            countryCode
          });
        } else {
          newCart = await createCart(finalVariantId, safeQuantity);
        }
        localStorage.setItem(CART_ID_KEY, newCart.id);
      } else {
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

      const userToken = Cookies.get("shopify_customer_token");
      if (userToken && savedCartId) {
        const [profile, addressData] = await Promise.all([
          getCustomer(userToken),
          getCustomerAddresses(userToken)
        ]);

        const defaultAddress = addressData?.addresses?.find(
          (a: any) => a.id === addressData.defaultAddressId
        ) || addressData?.addresses?.[0];

        const countryCode = defaultAddress?.country || "IN";

        newCart = await updateCartBuyerIdentity(
          newCart.id, 
          userToken,
          profile?.email,
          defaultAddress,
          countryCode
        );
      }
      
      try {
        if (typeof window !== "undefined") {
          window._learnq = window._learnq || [];
          
          // 1. Find the item that was just added
          const addedItem = newCart.lines.find(line => line.merchandise.id === finalVariantId);
          
          if (addedItem) {
            const productHandle = addedItem.merchandise.product?.handle;
            const productUrl = productHandle 
              ? `${window.location.origin}/products/${productHandle}`
              : window.location.href;

            window._learnq.push(["track", "Added to Cart", {
              // Special Klaviyo properties used for analytics tracking
              "$value": parseFloat(newCart.cost?.totalAmount?.amount || "0"),
              "CurrencyCode": newCart.cost?.totalAmount?.currencyCode || "USD",
              
              // Direct properties of the specifically added item
              "ProductID": finalVariantId,
              "ProductName": addedItem.merchandise.product?.title || "Unknown Product",
              "VariantTitle": addedItem.merchandise.title || "",
              "Price": parseFloat(addedItem.merchandise.price?.amount || "0"),
              "ImageURL": addedItem.merchandise.product?.featuredImage?.url || "",
              "Quantity": safeQuantity,
              "URL": productUrl,
              
              // Cart-wide properties to build advanced tables/reminders
              "CartTotal": parseFloat(newCart.cost?.totalAmount?.amount || "0"),
              "CheckoutURL": newCart.checkoutUrl || "",
              "ItemNames": newCart.lines.map(line => line.merchandise.product?.title || "Unknown Product"),
              
              // Full items array structure to satisfy standard Klaviyo table loops
              "Items": newCart.lines.map(line => ({
                "ProductID": line.merchandise.id,
                "ProductName": line.merchandise.product?.title || "Unknown Product",
                "Quantity": line.quantity,
                "ItemPrice": parseFloat(line.merchandise.price?.amount || "0"),
                "RowTotal": parseFloat(line.cost?.totalAmount?.amount || "0"),
                "ImageURL": line.merchandise.product?.featuredImage?.url || "",
                "URL": line.merchandise.product?.handle 
                  ? `${window.location.origin}/products/${line.merchandise.product?.handle}`
                  : window.location.href
              }))
            }]);
          }
        }
      } catch (trackError) {
        // Fail silently so tracking errors never interrupt the user checkout experience
        console.error("Klaviyo tracking error:", trackError);
      }
      // --- END KLAVIYO TRACKING ---

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
        
        const userToken = Cookies.get("shopify_customer_token");
        if (userToken) {
          const [profile, addressData] = await Promise.all([
            getCustomer(userToken),
            getCustomerAddresses(userToken)
          ]);
          const defaultAddress = addressData?.addresses?.find((a: any) => a.id === addressData.defaultAddressId) || addressData?.addresses?.[0];
          const countryCode = defaultAddress?.country || "IN";

          updatedCart = await updateCartBuyerIdentity(updatedCart.id, userToken, profile?.email, defaultAddress, countryCode);
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

  const linkCartToUser = async (customerAccessToken: string) => {
    try {
      const savedCartId = localStorage.getItem(CART_ID_KEY);
      if (!savedCartId) return; 

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

      const countryCode = defaultAddress?.country || "IN";

      const updatedCart = await updateCartBuyerIdentity(
        savedCartId, 
        customerAccessToken,
        customerProfile?.email, 
        defaultAddress,
        countryCode
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
        const userToken = Cookies.get("shopify_customer_token");
        if (userToken) {
          const [profile, addressData] = await Promise.all([
            getCustomer(userToken),
            getCustomerAddresses(userToken)
          ]);
          
          const defaultAddress = addressData?.addresses?.find(
            (a: any) => a.id === addressData.defaultAddressId
          ) || addressData?.addresses?.[0];
          
          const countryCode = defaultAddress?.country || "IN";

          checkoutCart = await createCart(variantId, quantity, {
            customerAccessToken: userToken,
            email: profile?.email,
            countryCode
          });
        } else {
          checkoutCart = await createCart(variantId, quantity);
        }
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
      if (userToken && savedCartId) {
        const [profile, addressData] = await Promise.all([
          getCustomer(userToken),
          getCustomerAddresses(userToken)
        ]);
        const defaultAddress = addressData?.addresses?.find((a: any) => a.id === addressData.defaultAddressId) || addressData?.addresses?.[0];
        const countryCode = defaultAddress?.country || "IN";

        checkoutCart = await updateCartBuyerIdentity(checkoutCart.id, userToken, profile?.email, defaultAddress, countryCode);
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