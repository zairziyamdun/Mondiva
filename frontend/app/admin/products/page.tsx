"use client"

import { useState, useEffect } from "react"
import { Edit, Loader2, Plus, Trash2 } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { formatPrice } from "@/lib/utils"
import { api } from "@/lib/api"
import type { ApiProduct } from "@/lib/types"
import { normalizeProduct } from "@/lib/types"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
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

interface ProductFormState {
  name: string
  slug: string
  price: string
  description: string
  categorySlug: string
  brand: string
  inStock: boolean
  isNew: boolean
  isPopular: boolean
  imagesStr: string
}

const emptyForm: ProductFormState = {
  name: "",
  slug: "",
  price: "",
  description: "",
  categorySlug: "",
  brand: "",
  inStock: true,
  isNew: false,
  isPopular: false,
  imagesStr: "",
}

function formFromProduct(p: Product): ProductFormState {
  return {
    name: p.name,
    slug: p.slug,
    price: String(p.price),
    description: p.description ?? "",
    categorySlug: p.categorySlug ?? "",
    brand: p.brand ?? "",
    inStock: p.inStock ?? true,
    isNew: p.isNew ?? false,
    isPopular: p.isPopular ?? false,
    imagesStr: (p.images ?? []).join(", "),
  }
}

function buildProductBody(form: ProductFormState) {
  const price = Number(form.price)
  const images = form.imagesStr
    ? form.imagesStr.split(",").map((s) => s.trim()).filter(Boolean)
    : []
  return {
    name: form.name,
    slug: form.slug,
    price: Number.isNaN(price) ? 0 : price,
    description: form.description || undefined,
    categorySlug: form.categorySlug || undefined,
    brand: form.brand || undefined,
    inStock: form.inStock,
    isNew: form.isNew,
    isPopular: form.isPopular,
    images: images.length ? images : undefined,
  }
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [form, setForm] = useState<ProductFormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    const res = await api.get<ApiProduct[]>("/api/products")
    if (res.ok) {
      setProducts(
        (res.data ?? []).map((p) => normalizeProduct(p)).filter(Boolean) as Product[]
      )
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
    setForm(emptyForm)
    setFormError(null)
    setDialogOpen(true)
  }

  const openEdit = (product: Product) => {
    setEditingProduct(product)
    setForm(formFromProduct(product))
    setFormError(null)
    setDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.slug.trim()) {
      setFormError("Название и slug обязательны")
      return
    }
    const price = Number(form.price)
    if (Number.isNaN(price) || price < 0) {
      setFormError("Цена должна быть числом ≥ 0")
      return
    }
    setSaving(true)
    setFormError(null)
    const body = buildProductBody(form)
    if (editingProduct) {
      const res = await api.put<ApiProduct>(`/api/products/${editingProduct.id}`, body)
      setSaving(false)
      if (res.ok && res.data) {
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? normalizeProduct(res.data)! : p))
        )
        setDialogOpen(false)
      } else {
        setFormError(!res.ok ? res.error?.message ?? "Ошибка сохранения" : null)
      }
    } else {
      const res = await api.post<ApiProduct>("/api/products", body)
      setSaving(false)
      if (res.ok && res.data) {
        const newProduct = normalizeProduct(res.data)
        if (newProduct) setProducts((prev) => [newProduct, ...prev])
        setDialogOpen(false)
      } else {
        setFormError(!res.ok ? res.error?.message ?? "Ошибка сохранения" : null)
      }
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
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <Button
            size="sm"
            className="rounded-full"
            onClick={() => {
              openCreate()
              setDialogOpen(true)
            }}
          >
            <Plus className="mr-1 h-4 w-4" /> Добавить товар
          </Button>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Редактировать товар" : "Новый товар"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {formError}
                </p>
              )}
              <div>
                <Label className="text-xs text-muted-foreground">Название *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Slug *</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  className="mt-1"
                  placeholder="product-slug"
                  required
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Цена (₽) *</Label>
                <Input
                  type="number"
                  min={0}
                  step={1}
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Описание</Label>
                <Input
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Категория (slug)</Label>
                <Input
                  value={form.categorySlug}
                  onChange={(e) => setForm((f) => ({ ...f, categorySlug: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Бренд</Label>
                <Input
                  value={form.brand}
                  onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">URL изображений (через запятую)</Label>
                <Input
                  value={form.imagesStr}
                  onChange={(e) => setForm((f) => ({ ...f, imagesStr: e.target.value }))}
                  className="mt-1"
                  placeholder="https://..."
                />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.inStock}
                    onChange={(e) => setForm((f) => ({ ...f, inStock: e.target.checked }))}
                    className="rounded"
                  />
                  В наличии
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.isNew}
                    onChange={(e) => setForm((f) => ({ ...f, isNew: e.target.checked }))}
                    className="rounded"
                  />
                  Новинка
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.isPopular}
                    onChange={(e) => setForm((f) => ({ ...f, isPopular: e.target.checked }))}
                    className="rounded"
                  />
                  Популярный
                </label>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Сохранить"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

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
                  <th className="p-4">Статус</th>
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
                      <span className="font-medium text-foreground">{formatPrice(product.price)}</span>
                      {product.oldPrice != null && (
                        <span className="ml-1 text-xs text-muted-foreground line-through">
                          {formatPrice(product.oldPrice)}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-foreground">{product.brand || "—"}</td>
                    <td className="p-4">
                      <Badge variant={product.inStock ? "default" : "destructive"}>
                        {product.inStock ? "В наличии" : "Нет в наличии"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEdit(product)}
                        >
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
