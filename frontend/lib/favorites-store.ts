'use client';

import { useSyncExternalStore, useCallback } from "react"

let favoriteIds: string[] = []
const listeners = new Set<() => void>()

function emitChange() {
  for (const listener of listeners) {
    listener()
  }
}

export function toggleFavorite(productId: string) {
  if (favoriteIds.includes(productId)) {
    favoriteIds = favoriteIds.filter((id) => id !== productId)
  } else {
    favoriteIds = [...favoriteIds, productId]
  }
  emitChange()
}

export function isFavorite(productId: string): boolean {
  return favoriteIds.includes(productId)
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return favoriteIds
}

export function useFavorites() {
  const ids = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  return {
    ids,
    toggleFavorite: useCallback(toggleFavorite, []),
    isFavorite: useCallback((id: string) => ids.includes(id), [ids]),
  }
}
