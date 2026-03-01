"use client"

import { useState, useEffect } from "react"
import { Loader2, Percent, Trash2 } from "lucide-react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DiscountFromApi {
  _id: string
  productId: string
  type: "percentage" | "fixed"
  value: number
  startDate: string
  endDate: string
  isActive: boolean
}

interface DiscountFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productId: string | null
  productName: string
  productPrice: number
  onSuccess?: () => void
}

function formatDate(d: string) {
  const date = new Date(d)
  return date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function DiscountFormDialog({
  open,
  onOpenChange,
  productId,
  productName,
  productPrice,
  onSuccess,
}: DiscountFormDialogProps) {
  const [discounts, setDiscounts] = useState<DiscountFromApi[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [type, setType] = useState<"percentage" | "fixed">("percentage")
  const [value, setValue] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const loadDiscounts = async () => {
    if (!productId) return
    setLoading(true)
    const res = await api.get<DiscountFromApi[]>(`/api/discounts/product/${productId}`)
    if (res.ok && Array.isArray(res.data)) {
      setDiscounts(res.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (open && productId) {
      loadDiscounts()
      setValue("")
      setStartDate("")
      setEndDate("")
      setError(null)
    }
  }, [open, productId])

  const handleAdd = async () => {
    if (!productId || !value.trim() || !startDate || !endDate) {
      setError("Заполните все поля")
      return
    }
    const numValue = Number(value)
    if (Number.isNaN(numValue) || numValue <= 0) {
      setError("Значение должно быть больше 0")
      return
    }
    if (type === "percentage" && numValue > 100) {
      setError("Процент не может быть больше 100")
      return
    }
    if (new Date(startDate) >= new Date(endDate)) {
      setError("Дата начала должна быть раньше даты окончания")
      return
    }

    setSaving(true)
    setError(null)
    const res = await api.post<DiscountFromApi>("/api/discounts", {
      productId,
      type,
      value: numValue,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
    })
    setSaving(false)

    if (res.ok && res.data) {
      setDiscounts((prev) => [res.data!, ...prev])
      setValue("")
      setStartDate("")
      setEndDate("")
      onSuccess?.()
    } else {
      setError(res.error?.message ?? "Ошибка сохранения")
    }
  }

  const handleDelete = async (id: string) => {
    const res = await api.delete(`/api/discounts/${id}`)
    if (res.ok) {
      setDiscounts((prev) => prev.filter((d) => d._id !== id))
      onSuccess?.()
    }
  }

  const previewPrice =
    type === "percentage" && value
      ? Math.round(productPrice * (1 - Number(value) / 100))
      : type === "fixed" && value
        ? Math.max(0, productPrice - Number(value))
        : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Скидка — {productName}</DialogTitle>
        </DialogHeader>

        {!productId ? (
          <p className="text-sm text-muted-foreground">
            Сначала сохраните товар, затем добавьте скидку.
          </p>
        ) : (
          <div className="space-y-6">
            <p className="text-xs text-muted-foreground">
              Базовая цена: {productPrice.toLocaleString("ru-RU")} ₽
            </p>

            {/* Список существующих скидок */}
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Загрузка...
              </div>
            ) : discounts.length > 0 ? (
              <div className="space-y-2">
                <Label className="text-xs">Текущие скидки</Label>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {discounts.map((d) => (
                    <div
                      key={d._id}
                      className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
                    >
                      <div>
                        <span className="font-medium">
                          {d.type === "percentage" ? `${d.value}%` : `${d.value} ₽`}
                        </span>
                        <span className="ml-2 text-muted-foreground">
                          {formatDate(d.startDate)} — {formatDate(d.endDate)}
                        </span>
                        {!d.isActive && (
                          <Badge variant="secondary" className="ml-2">
                            Неактивна
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDelete(d._id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Форма добавления */}
            <div className="space-y-4 border-t border-border pt-4">
              <Label className="text-xs">Добавить скидку</Label>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Тип</Label>
                  <Select value={type} onValueChange={(v) => setType(v as "percentage" | "fixed")}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage" className="gap-2">
                        <Percent className="h-3.5 w-3.5" />
                        Процент
                      </SelectItem>
                      <SelectItem value="fixed">Фикс. сумма</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    {type === "percentage" ? "Процент (1–100)" : "Сумма (₽)"}
                  </Label>
                  <Input
                    type="number"
                    min={type === "percentage" ? 1 : 1}
                    max={type === "percentage" ? 100 : undefined}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={type === "percentage" ? "30" : "1000"}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Начало акции</Label>
                  <Input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Конец акции</Label>
                  <Input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              {previewPrice != null && value && (
                <p className="text-sm text-muted-foreground">
                  Цена со скидкой:{" "}
                  <span className="font-semibold text-foreground">
                    {previewPrice.toLocaleString("ru-RU")} ₽
                  </span>
                </p>
              )}

              {error && (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}

              <Button
                type="button"
                onClick={handleAdd}
                disabled={saving || !value || !startDate || !endDate}
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Добавить скидку"}
              </Button>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Закрыть
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
