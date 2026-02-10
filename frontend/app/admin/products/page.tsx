"use client"

import { Edit, Plus, Trash2 } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { products, formatPrice } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function AdminProductsPage() {
  return (
    <AdminShell title="Товары" description="Управление каталогом товаров">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{products.length} товаров</p>
        <Button size="sm" className="rounded-full">
          <Plus className="mr-1 h-4 w-4" /> Добавить товар
        </Button>
      </div>

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
                      <img src={product.images[0] || "/placeholder.svg"} alt={product.name} className="h-10 w-8 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium text-foreground">{product.name}</p>
                        <p className="text-xs text-muted-foreground">ID: {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-foreground">{product.category}</td>
                  <td className="p-4">
                    <span className="font-medium text-foreground">{formatPrice(product.price)}</span>
                    {product.oldPrice && (
                      <span className="ml-1 text-xs text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
                    )}
                  </td>
                  <td className="p-4 text-foreground">{product.brand}</td>
                  <td className="p-4">
                    <Badge variant={product.inStock ? "default" : "destructive"}>
                      {product.inStock ? "В наличии" : "Нет в наличии"}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  )
}
