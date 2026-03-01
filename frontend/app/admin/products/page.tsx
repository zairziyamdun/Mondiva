"use client"

import { useState, useEffect } from "react"
import { Edit, Loader2, Plus, Trash2 } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { ProductFormDialog } from "@/components/admin/product-form-dialog"
import { formatPrice } from "@/lib/utils"
import { getCurrentPrice } from "@/lib/utils/pricing"
import { api } from "@/lib/api"
import type { ApiProduct } from "@/lib/types"
import { normalizeProduct } from "@/lib/types"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    const res = await api.get<ApiProduct[]>("/api/products")
    if (res.ok) {
      setProducts((res.data ?? []).map((p) => normalizeProduct(p)).filter(Boolean) as Product[])
    } else {
      setError(res.error?.message ?? "Не удалось загрузить товары")
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const openCreate = () => {
    setEditingProduct(null)
    setDialogOpen(true)
  }

  const openEdit = (product: Product) => {
    setEditingProduct(product)
    setDialogOpen(true)
  }

  const handleFormSuccess = (product: Product, isNew: boolean) => {
    if (isNew) {
      setProducts((prev) => [product, ...prev])
    } else {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? product : p))
      )
    }
  }

  const handleDelete = async (product: Product) => {
    const res = await api.delete(`/api/products/${product.id}`)
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== product.id))
    }
  }

  return (
    <AdminShell title="Товары" description="Управление каталогом товаров">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{products.length} товаров</p>
        <Button size="sm" className="rounded-full" onClick={openCreate}>
          <Plus className="mr-1 h-4 w-4" /> Добавить товар
        </Button>
      </div>

      <ProductFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingProduct={editingProduct}
        onSuccess={handleFormSuccess}
      />

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Загрузка...</span>
        </div>
      ) : error ? (
        <p className="py-8 text-center text-destructive">{error}</p>
      ) : (
        <div className="rounded-2xl bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="p-4">Товар</th>
                  <th className="p-4">Категория</th>
                  <th className="p-4">Цена</th>
                  <th className="p-4">Бренд</th>
                  <th className="p-4">Остаток</th>
                  <th className="p-4">Действия</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-border last:border-0">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images?.[0] || "/placeholder.svg"}
                          alt={product.name}
                          className="h-10 w-8 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-foreground">{product.name}</p>
                          <p className="text-xs text-muted-foreground">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-foreground">{product.categorySlug || product.category || "—"}</td>
                    <td className="p-4">
                      <span className="font-medium text-foreground">{formatPrice(getCurrentPrice(product))}</span>
                      {product.discountPrice != null && (
                        <span className="ml-1 text-xs text-muted-foreground line-through">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-foreground">{product.brand || "—"}</td>
                    <td className="p-4">
                      <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                        {product.stock > 0 ? `${product.stock} шт.` : "Нет в наличии"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(product)}>
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Удалить товар?</AlertDialogTitle>
                              <AlertDialogDescription>
                                {product.name}. Это действие нельзя отменить.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Отмена</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={() => handleDelete(product)}
                              >
                                Удалить
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {products.length === 0 && (
            <p className="py-12 text-center text-sm text-muted-foreground">Нет товаров</p>
          )}
        </div>
      )}
    </AdminShell>
  )
}
