"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import type { Product } from "@/lib/types"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"
import type { ApiProduct } from "@/lib/types"
import { normalizeProduct } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

const productFormSchema = z
  .object({
    name: z.string().min(1, "Название обязательно"),
    slug: z.string().min(1, "Slug обязателен"),
    description: z.string().optional(),
    category: z.string().optional(),
    brand: z.string().optional(),
    price: z.coerce.number().positive("Цена должна быть > 0"),
    oldPrice: z.coerce.number().optional(),
    discountPrice: z.coerce.number().optional(),
    discountStart: z.string().optional(),
    discountEnd: z.string().optional(),
    stock: z.coerce.number().min(0, "Остаток не может быть отрицательным"),
    colorsStr: z.string().optional(),
    sizesStr: z.string().optional(),
    imagesStr: z.string().optional(),
    isNew: z.boolean().default(false),
    isPopular: z.boolean().default(false),
  })
  .refine(
    (data) => {
      if (data.discountPrice == null || data.discountPrice === 0) return true
      return data.discountPrice <= data.price
    },
    { message: "discountPrice не может быть больше price", path: ["discountPrice"] }
  )
  .refine(
    (data) => {
      if (!data.discountStart || !data.discountEnd) return true
      return new Date(data.discountStart) < new Date(data.discountEnd)
    },
    { message: "discountStart должен быть раньше discountEnd", path: ["discountEnd"] }
  )

type ProductFormValues = z.infer<typeof productFormSchema>

function valuesToBody(values: ProductFormValues) {
  const images = values.imagesStr
    ? values.imagesStr.split(",").map((s) => s.trim()).filter(Boolean)
    : []
  const colors = values.colorsStr
    ? values.colorsStr.split(",").map((s) => s.trim()).filter(Boolean)
    : []
  const sizes = values.sizesStr
    ? values.sizesStr.split(",").map((s) => s.trim()).filter(Boolean)
    : []
  return {
    name: values.name,
    slug: values.slug,
    description: values.description || undefined,
    category: values.category || undefined,
    categorySlug: values.category || undefined,
    brand: values.brand || undefined,
    price: values.price,
    oldPrice: values.oldPrice || undefined,
    discountPrice: values.discountPrice || undefined,
    discountStart: values.discountStart ? new Date(values.discountStart).toISOString() : undefined,
    discountEnd: values.discountEnd ? new Date(values.discountEnd).toISOString() : undefined,
    stock: values.stock,
    colors: colors.length ? colors : undefined,
    sizes: sizes.length ? sizes : undefined,
    images: images.length ? images : undefined,
    isNew: values.isNew,
    isPopular: values.isPopular,
  }
}

function productToValues(p: Product): ProductFormValues {
  return {
    name: p.name,
    slug: p.slug,
    description: p.description ?? "",
    category: p.category ?? p.categorySlug ?? "",
    brand: p.brand ?? "",
    price: p.price,
    oldPrice: p.oldPrice ?? undefined,
    discountPrice: p.discountPrice ?? undefined,
    discountStart: p.discountStart ? p.discountStart.slice(0, 16) : "",
    discountEnd: p.discountEnd ? p.discountEnd.slice(0, 16) : "",
    stock: p.stock,
    colorsStr: (p.colors ?? []).join(", "),
    sizesStr: (p.sizes ?? []).join(", "),
    imagesStr: (p.images ?? []).join(", "),
    isNew: p.isNew ?? false,
    isPopular: p.isPopular ?? false,
  }
}

const defaultValues: ProductFormValues = {
  name: "",
  slug: "",
  description: "",
  category: "",
  brand: "",
  price: 1,
  oldPrice: undefined,
  discountPrice: undefined,
  discountStart: "",
  discountEnd: "",
  stock: 0,
  colorsStr: "",
  sizesStr: "",
  imagesStr: "",
  isNew: false,
  isPopular: false,
}

interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingProduct: Product | null
  onSuccess: (product: Product, isNew: boolean) => void
}

export function ProductFormDialog({
  open,
  onOpenChange,
  editingProduct,
  onSuccess,
}: ProductFormDialogProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  })

  useEffect(() => {
    if (open) {
      form.reset(editingProduct ? productToValues(editingProduct) : defaultValues)
    }
  }, [open, editingProduct, form])

  const onSubmit = async (values: ProductFormValues) => {
    const body = valuesToBody(values)
    if (editingProduct) {
      const res = await api.put<ApiProduct>(`/api/products/${editingProduct.id}`, body)
      if (res.ok && res.data) {
        const normalized = normalizeProduct(res.data)
        if (normalized) onSuccess(normalized, false)
        onOpenChange(false)
      } else {
        form.setError("root", { message: res.error?.message ?? "Ошибка сохранения" })
      }
    } else {
      const res = await api.post<ApiProduct>("/api/products", body)
      if (res.ok && res.data) {
        const normalized = normalizeProduct(res.data)
        if (normalized) onSuccess(normalized, true)
        onOpenChange(false)
      } else {
        form.setError("root", { message: res.error?.message ?? "Ошибка сохранения" })
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{editingProduct ? "Редактировать товар" : "Новый товар"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {form.formState.errors.root && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {form.formState.errors.root.message}
            </p>
          )}

          {/* 1) Основное */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Основное</h4>
            <div>
              <Label htmlFor="name" className="text-xs text-muted-foreground">Название *</Label>
              <Input id="name" {...form.register("name")} className={cn("mt-1", form.formState.errors.name && "border-destructive")} />
              {form.formState.errors.name && <p className="mt-0.5 text-xs text-destructive">{form.formState.errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="slug" className="text-xs text-muted-foreground">Slug *</Label>
              <Input id="slug" {...form.register("slug")} placeholder="product-slug" className={cn("mt-1", form.formState.errors.slug && "border-destructive")} />
              {form.formState.errors.slug && <p className="mt-0.5 text-xs text-destructive">{form.formState.errors.slug.message}</p>}
            </div>
            <div>
              <Label htmlFor="description" className="text-xs text-muted-foreground">Описание</Label>
              <Textarea id="description" {...form.register("description")} rows={2} className="mt-1 resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="category" className="text-xs text-muted-foreground">Категория</Label>
                <Input id="category" {...form.register("category")} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="brand" className="text-xs text-muted-foreground">Бренд</Label>
                <Input id="brand" {...form.register("brand")} className="mt-1" />
              </div>
            </div>
          </div>

          {/* 2) Цена */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Цена</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="price" className="text-xs text-muted-foreground">Цена (₽) *</Label>
                <Input id="price" type="number" min={0} step={1} {...form.register("price")} className={cn("mt-1", form.formState.errors.price && "border-destructive")} />
                {form.formState.errors.price && <p className="mt-0.5 text-xs text-destructive">{form.formState.errors.price.message}</p>}
              </div>
              <div>
                <Label htmlFor="oldPrice" className="text-xs text-muted-foreground">oldPrice (зачёркнутая)</Label>
                <Input id="oldPrice" type="number" min={0} step={1} {...form.register("oldPrice")} className="mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="discountPrice" className="text-xs text-muted-foreground">discountPrice</Label>
                <Input id="discountPrice" type="number" min={0} step={1} {...form.register("discountPrice")} className={cn("mt-1", form.formState.errors.discountPrice && "border-destructive")} />
                {form.formState.errors.discountPrice && <p className="mt-0.5 text-xs text-destructive">{form.formState.errors.discountPrice.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="discountStart" className="text-xs text-muted-foreground">discountStart</Label>
                <Input id="discountStart" type="datetime-local" {...form.register("discountStart")} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="discountEnd" className="text-xs text-muted-foreground">discountEnd</Label>
                <Input id="discountEnd" type="datetime-local" {...form.register("discountEnd")} className={cn("mt-1", form.formState.errors.discountEnd && "border-destructive")} />
                {form.formState.errors.discountEnd && <p className="mt-0.5 text-xs text-destructive">{form.formState.errors.discountEnd.message}</p>}
              </div>
            </div>
          </div>

          {/* 3) Остатки */}
          <div>
            <Label htmlFor="stock" className="text-xs text-muted-foreground">Остаток (шт.)</Label>
            <Input id="stock" type="number" min={0} step={1} {...form.register("stock")} className={cn("mt-1", form.formState.errors.stock && "border-destructive")} />
            {form.formState.errors.stock && <p className="mt-0.5 text-xs text-destructive">{form.formState.errors.stock.message}</p>}
          </div>

          {/* 4) Вариации */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Вариации</h4>
            <div>
              <Label htmlFor="colorsStr" className="text-xs text-muted-foreground">Цвета (через запятую)</Label>
              <Input id="colorsStr" {...form.register("colorsStr")} placeholder="Чёрный, Белый, Бежевый" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="sizesStr" className="text-xs text-muted-foreground">Размеры (через запятую)</Label>
              <Input id="sizesStr" {...form.register("sizesStr")} placeholder="XS, S, M, L" className="mt-1" />
            </div>
          </div>

          {/* 5) Изображения */}
          <div>
            <Label htmlFor="imagesStr" className="text-xs text-muted-foreground">URL изображений (через запятую)</Label>
            <Input id="imagesStr" {...form.register("imagesStr")} placeholder="https://..." className="mt-1" />
          </div>

          {/* Флаги */}
          <div className="flex gap-6">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox checked={form.watch("isNew")} onCheckedChange={(c) => form.setValue("isNew", !!c)} />
              Новинка
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox checked={form.watch("isPopular")} onCheckedChange={(c) => form.setValue("isPopular", !!c)} />
              Популярный
            </label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Сохранить"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
