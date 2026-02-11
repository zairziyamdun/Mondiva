"use client"

import { useSyncExternalStore, useCallback } from "react"
import type { CartItem } from "./types"

const CART_STORAGE_KEY = "mondiva_cart"

let cartItems: CartItem[] = []
let hydrated = false
const listeners = new Set<() => void>()

function loadFromStorage(): void {
  if (typeof window === "undefined" || hydrated) return
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        cartItems = parsed
      }
    }
  } catch {
    // ignore
  }
  hydrated = true
}

function saveToStorage(): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
  } catch {
    // ignore
  }
}

function emitChange() {
  for (const listener of listeners) {
    listener()
  }
}

export function getCartItems(): CartItem[] {
  loadFromStorage()
  return cartItems
}

export function addToCart(item: CartItem) {
  loadFromStorage()
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
  saveToStorage()
  emitChange()
}

export function removeFromCart(productId: string, size: string, color: string) {
  loadFromStorage()
  cartItems = cartItems.filter(
    (i) => !(i.productId === productId && i.size === size && i.color === color),
  )
  saveToStorage()
  emitChange()
}

export function updateQuantity(productId: string, size: string, color: string, quantity: number) {
  loadFromStorage()
  if (quantity <= 0) {
    removeFromCart(productId, size, color)
    return
  }
  cartItems = cartItems.map((i) =>
    i.productId === productId && i.size === size && i.color === color ? { ...i, quantity } : i,
  )
  saveToStorage()
  emitChange()
}

export function clearCart() {
  cartItems = []
  saveToStorage()
  emitChange()
}

export function getCartTotal(): number {
  loadFromStorage()
  return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

export function getCartCount(): number {
  loadFromStorage()
  return cartItems.reduce((sum, item) => sum + item.quantity, 0)
}

function subscribe(listener: () => void) {
  loadFromStorage()
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useCart() {
  const items = useSyncExternalStore(subscribe, getCartItems, getCartItems)
  const count = useSyncExternalStore(subscribe, getCartCount, getCartCount)
  const total = useSyncExternalStore(subscribe, getCartTotal, getCartTotal)

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
