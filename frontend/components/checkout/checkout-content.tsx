"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, ChevronRight, MapPin, CreditCard, Truck, ShoppingBag } from "lucide-react"
import { useCart } from "@/lib/cart-store"
import { formatPrice } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

const steps = [
  { id: 1, name: "Адрес", icon: MapPin },
  { id: 2, name: "Доставка", icon: Truck },
  { id: 3, name: "Оплата", icon: CreditCard },
  { id: 4, name: "Подтверждение", icon: Check },
]

export function CheckoutContent() {
  const { items, total, clearCart } = useCart()
  const [step, setStep] = useState(1)
  const [address, setAddress] = useState({ city: "", street: "", apartment: "", phone: "", name: "" })
  const [delivery, setDelivery] = useState("courier")
  const [payment, setPayment] = useState("card")
  const [orderPlaced, setOrderPlaced] = useState(false)

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShoppingBag className="h-16 w-16 text-border" />
        <h2 className="mt-4 font-serif text-xl font-semibold text-foreground">Корзина пуста</h2>
        <p className="mt-2 text-sm text-muted-foreground">Добавьте товары для оформления заказа</p>
        <Link href="/catalog" className="mt-6">
          <Button className="rounded-full px-8">Перейти в каталог</Button>
        </Link>
      </div>
    )
  }

  if (orderPlaced) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <Check className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="mt-6 font-serif text-2xl font-bold text-foreground">Заказ оформлен!</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Спасибо за покупку! Мы отправим вам уведомление о статусе заказа на указанный номер телефона.
        </p>
        <p className="mt-4 text-sm font-medium text-foreground">
          {"Номер заказа: ORD-"}{String(Date.now()).slice(-6)}
        </p>
        <Link href="/" className="mt-6">
          <Button className="rounded-full px-8">На главную</Button>
        </Link>
      </div>
    )
  }

  const deliveryCost = total >= 5000 ? 0 : delivery === "courier" ? 500 : delivery === "cdek" ? 350 : 250
  const grandTotal = total + deliveryCost

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        {/* Steps */}
        <div className="mb-8 flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                  step >= s.id
                    ? "bg-foreground text-primary-foreground"
                    : "bg-secondary text-muted-foreground",
                )}
              >
                {step > s.id ? <Check className="h-4 w-4" /> : s.id}
              </div>
              <span
                className={cn(
                  "hidden text-sm sm:block",
                  step >= s.id ? "font-medium text-foreground" : "text-muted-foreground",
                )}
              >
                {s.name}
              </span>
              {i < steps.length - 1 && <ChevronRight className="h-4 w-4 text-border" />}
            </div>
          ))}
        </div>

        {/* Step 1: Address */}
        {step === 1 && (
          <div className="space-y-4 rounded-2xl bg-card p-6 shadow-sm">
            <h2 className="font-serif text-lg font-bold text-foreground">Адрес доставки</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="name" className="text-xs text-muted-foreground">Имя получателя</Label>
                <Input
                  id="name"
                  value={address.name}
                  onChange={(e) => setAddress({ ...address, name: e.target.value })}
                  placeholder="Анна Иванова"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-xs text-muted-foreground">Телефон</Label>
                <Input
                  id="phone"
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  placeholder="+7 (999) 123-45-67"
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="city" className="text-xs text-muted-foreground">Город</Label>
              <Input
                id="city"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                placeholder="Москва"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="street" className="text-xs text-muted-foreground">Улица, дом</Label>
              <Input
                id="street"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                placeholder="ул. Тверская 15"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="apt" className="text-xs text-muted-foreground">Квартира / офис</Label>
              <Input
                id="apt"
                value={address.apartment}
                onChange={(e) => setAddress({ ...address, apartment: e.target.value })}
                placeholder="кв. 42"
                className="mt-1"
              />
            </div>
            <Button className="mt-2 rounded-full" onClick={() => setStep(2)}>
              Далее <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Step 2: Delivery */}
        {step === 2 && (
          <div className="space-y-4 rounded-2xl bg-card p-6 shadow-sm">
            <h2 className="font-serif text-lg font-bold text-foreground">Способ доставки</h2>
            <RadioGroup value={delivery} onValueChange={setDelivery} className="space-y-3">
              {[
                { value: "courier", label: "Курьерская доставка", desc: "1-2 рабочих дня", price: total >= 5000 ? "Бесплатно" : "500 \u20BD" },
                { value: "cdek", label: "СДЭК", desc: "2-4 рабочих дня", price: total >= 5000 ? "Бесплатно" : "350 \u20BD" },
                { value: "post", label: "Почта России", desc: "5-10 рабочих дней", price: total >= 5000 ? "Бесплатно" : "250 \u20BD" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={cn(
                    "flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-colors",
                    delivery === opt.value ? "border-foreground bg-secondary" : "border-border",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value={opt.value} />
                    <div>
                      <p className="text-sm font-medium text-foreground">{opt.label}</p>
                      <p className="text-xs text-muted-foreground">{opt.desc}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-foreground">{opt.price}</span>
                </label>
              ))}
            </RadioGroup>
            <div className="flex gap-3">
              <Button variant="outline" className="rounded-full bg-transparent" onClick={() => setStep(1)}>
                Назад
              </Button>
              <Button className="rounded-full" onClick={() => setStep(3)}>
                Далее <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <div className="space-y-4 rounded-2xl bg-card p-6 shadow-sm">
            <h2 className="font-serif text-lg font-bold text-foreground">Способ оплаты</h2>
            <RadioGroup value={payment} onValueChange={setPayment} className="space-y-3">
              {[
                { value: "card", label: "Банковская карта", desc: "Visa, Mastercard, МИР" },
                { value: "sbp", label: "СБП", desc: "Система быстрых платежей" },
                { value: "cash", label: "При получении", desc: "Наличными или картой" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors",
                    payment === opt.value ? "border-foreground bg-secondary" : "border-border",
                  )}
                >
                  <RadioGroupItem value={opt.value} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{opt.label}</p>
                    <p className="text-xs text-muted-foreground">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </RadioGroup>
            <div className="flex gap-3">
              <Button variant="outline" className="rounded-full bg-transparent" onClick={() => setStep(2)}>
                Назад
              </Button>
              <Button className="rounded-full" onClick={() => setStep(4)}>
                Далее <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === 4 && (
          <div className="space-y-4 rounded-2xl bg-card p-6 shadow-sm">
            <h2 className="font-serif text-lg font-bold text-foreground">Подтверждение заказа</h2>
            <div className="space-y-3 text-sm">
              <div className="rounded-xl bg-secondary p-3">
                <p className="text-xs text-muted-foreground">Получатель</p>
                <p className="font-medium text-foreground">{address.name || "Не указано"}</p>
                <p className="text-muted-foreground">{address.phone || "Не указано"}</p>
              </div>
              <div className="rounded-xl bg-secondary p-3">
                <p className="text-xs text-muted-foreground">Адрес</p>
                <p className="font-medium text-foreground">
                  {[address.city, address.street, address.apartment].filter(Boolean).join(", ") || "Не указано"}
                </p>
              </div>
              <div className="rounded-xl bg-secondary p-3">
                <p className="text-xs text-muted-foreground">Доставка</p>
                <p className="font-medium text-foreground">
                  {delivery === "courier" ? "Курьерская доставка" : delivery === "cdek" ? "СДЭК" : "Почта России"}
                </p>
              </div>
              <div className="rounded-xl bg-secondary p-3">
                <p className="text-xs text-muted-foreground">Оплата</p>
                <p className="font-medium text-foreground">
                  {payment === "card" ? "Банковская карта" : payment === "sbp" ? "СБП" : "При получении"}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="rounded-full bg-transparent" onClick={() => setStep(3)}>
                Назад
              </Button>
              <Button
                className="rounded-full"
                onClick={() => {
                  clearCart()
                  setOrderPlaced(true)
                }}
              >
                Оплатить {formatPrice(grandTotal)}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Order summary sidebar */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 rounded-2xl bg-card p-6 shadow-sm">
          <h2 className="font-serif text-lg font-bold text-foreground">Ваш заказ</h2>
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-3">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="h-14 w-10 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="text-xs font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.color} / {item.size} x{item.quantity}
                  </p>
                </div>
                <span className="text-xs font-medium text-foreground">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t border-border pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Товары</span>
              <span className="text-foreground">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Доставка</span>
              <span className="text-foreground">{deliveryCost === 0 ? "Бесплатно" : formatPrice(deliveryCost)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2">
              <span className="font-semibold text-foreground">Итого</span>
              <span className="text-lg font-bold text-foreground">{formatPrice(grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
