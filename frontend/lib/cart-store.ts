'use client';

import { useSyncExternalStore, useCallback } from "react"
import type { CartItem } from "./types"

let cartItems: CartItem[] = []
const listeners = new Set<() => void>()

function emitChange() {
  for (const listener of listeners) {
    listener()
  }
}

export function getCartItems(): CartItem[] {
  return cartItems
}

export function addToCart(item: CartItem) {
  const existing = cartItems.find(
    (i) => i.productId === item.productId && i.size === item.size && i.color === item.color,
  )
  if (existing) {
    cartItems = cartItems.map((i) =>
      i.productId === item.productId && i.size === item.size && i.color === item.color
        ? { ...i, quantity: i.quantity + item.quantity }
        : i,
    )
  } else {
    cartItems = [...cartItems, item]
  }
  emitChange()
}

export function removeFromCart(productId: string, size: string, color: string) {
  cartItems = cartItems.filter(
    (i) => !(i.productId === productId && i.size === size && i.color === color),
  )
  emitChange()
}

export function updateQuantity(productId: string, size: string, color: string, quantity: number) {
  if (quantity <= 0) {
    removeFromCart(productId, size, color)
    return
  }
  cartItems = cartItems.map((i) =>
    i.productId === productId && i.size === size && i.color === color ? { ...i, quantity } : i,
  )
  emitChange()
}

export function clearCart() {
  cartItems = []
  emitChange()
}

export function getCartTotal(): number {
  return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

export function getCartCount(): number {
  return cartItems.reduce((sum, item) => sum + item.quantity, 0)
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useCart() {
  const items = useSyncExternalStore(subscribe, getCartItems, getCartItems)
  const count = useSyncExternalStore(
    subscribe,
    getCartCount,
    getCartCount,
  )
  const total = useSyncExternalStore(
    subscribe,
    getCartTotal,
    getCartTotal,
  )

  return {
    items,
    count,
    total,
    addToCart: useCallback(addToCart, []),
    removeFromCart: useCallback(removeFromCart, []),
    updateQuantity: useCallback(updateQuantity, []),
    clearCart: useCallback(clearCart, []),
  }
}
