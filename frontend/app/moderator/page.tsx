"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Check,
  Home,
  Headphones,
  MessageSquare,
  Send,
  Shield,
  Star,
  X,
} from "lucide-react"
import { reviews, returnRequests, products, orders, users } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { ReturnStatus } from "@/lib/types"

// -- Mock support tickets ---------------------------------------------------
interface SupportTicket {
  id: string
  userId: string
  subject: string
  messages: { sender: "user" | "support"; text: string; date: string }[]
  status: "open" | "closed"
  createdAt: string
}

const initialTickets: SupportTicket[] = [
  {
    id: "TKT-001",
    userId: "1",
    subject: "Не пришёл трек-номер",
    messages: [
      {
        sender: "user",
        text: "Здравствуйте! Заказ ORD-002 отправлен, но я не получила трек-номер для отслеживания.",
        date: "2025-12-13",
      },
    ],
    status: "open",
    createdAt: "2025-12-13",
  },
  {
    id: "TKT-002",
    userId: "2",
    subject: "Вопрос о возврате",
    messages: [
      {
        sender: "user",
        text: "Добрый день, подскажите, как оформить возврат товара? Заказ ORD-003.",
        date: "2025-12-19",
      },
      {
        sender: "support",
        text: "Здравствуйте! Вы можете оформить возврат через личный кабинет в разделе «Мои заказы». Нажмите кнопку «Возврат» рядом с нужным заказом.",
        date: "2025-12-19",
      },
      {
        sender: "user",
        text: "Спасибо, нашла!",
        date: "2025-12-20",
      },
    ],
    status: "closed",
    createdAt: "2025-12-19",
  },
]

export default function ModeratorPage() {
  const [reviewList, setReviewList] = useState(reviews)
  const [returnStatuses, setReturnStatuses] = useState<
    Record<string, ReturnStatus>
  >(Object.fromEntries(returnRequests.map((r) => [r.id, r.status])))
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets)
  const [activeTicket, setActiveTicket] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")

  // ---- Reviews ----
  const approveReview = (id: string) => {
    setReviewList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isApproved: true } : r))
    )
  }
  const rejectReview = (id: string) => {
    setReviewList((prev) => prev.filter((r) => r.id !== id))
  }
  const pendingReviews = reviewList.filter((r) => !r.isApproved)
  const approvedReviews = reviewList.filter((r) => r.isApproved)

  // ---- Returns ----
  const updateReturnStatus = (id: string, status: ReturnStatus) => {
    setReturnStatuses((prev) => ({ ...prev, [id]: status }))
  }

  // ---- Tickets ----
  const selectedTicket = tickets.find((t) => t.id === activeTicket)

  const sendReply = () => {
    if (!activeTicket || !replyText.trim()) return
    setTickets((prev) =>
      prev.map((t) =>
        t.id === activeTicket
          ? {
              ...t,
              messages: [
                ...t.messages,
                { sender: "support" as const, text: replyText, date: "2025-12-21" },
              ],
            }
          : t
      )
    )
    setReplyText("")
  }

  const closeTicket = (id: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "closed" as const } : t))
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card lg:block">
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link
            href="/"
            className="font-serif text-xl font-bold text-foreground"
          >
            MonDiva
          </Link>
          <span className="ml-2 rounded-full bg-foreground px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
            Модератор
          </span>
        </div>
        <nav className="space-y-1 p-4">
          <Link
            href="/moderator"
            className="flex items-center gap-3 rounded-xl bg-secondary px-3 py-2.5 text-sm font-medium text-foreground"
          >
            <Shield className="h-4 w-4" />
            Модерация
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Home className="h-4 w-4" />
            На сайт
          </Link>
        </nav>
      </aside>

      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-foreground">Модерация</h1>
          <p className="text-xs text-muted-foreground">
            Отзывы, возвраты и обращения клиентов
          </p>
        </div>

        <Tabs defaultValue="reviews" className="space-y-6">
          <TabsList>
            <TabsTrigger value="reviews" className="gap-1">
              <Star className="h-3.5 w-3.5" />
              Отзывы
              {pendingReviews.length > 0 && (
                <span className="ml-1 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-accent-foreground">
                  {pendingReviews.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="returns" className="gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              Возвраты
              {returnRequests.filter((r) => r.status === "pending").length >
                0 && (
                <span className="ml-1 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-accent-foreground">
                  {returnRequests.filter((r) => r.status === "pending").length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="tickets" className="gap-1">
              <Headphones className="h-3.5 w-3.5" />
              Поддержка
              {tickets.filter((t) => t.status === "open").length > 0 && (
                <span className="ml-1 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-accent-foreground">
                  {tickets.filter((t) => t.status === "open").length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* ===================== REVIEWS TAB ===================== */}
          <TabsContent value="reviews" className="space-y-4">
            {pendingReviews.length > 0 && (
              <div>
                <h2 className="mb-3 text-sm font-semibold text-foreground">
                  На модерации ({pendingReviews.length})
                </h2>
                <div className="space-y-3">
                  {pendingReviews.map((review) => {
                    const product = products.find(
                      (p) => p.id === review.productId
                    )
                    return (
                      <div
                        key={review.id}
                        className="rounded-2xl bg-card p-4 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground">
                                {review.userName}
                              </span>
                              <div className="flex items-center gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={`pending-${review.id}-${i}`}
                                    className={cn(
                                      "h-3 w-3",
                                      i < review.rating
                                        ? "fill-amber-400 text-amber-400"
                                        : "text-border"
                                    )}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {review.text}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Товар: {product?.name || "N/A"} |{" "}
                              {review.createdAt}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent text-green-600"
                              onClick={() => approveReview(review.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent text-destructive"
                              onClick={() => rejectReview(review.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div>
              <h2 className="mb-3 text-sm font-semibold text-foreground">
                Одобренные ({approvedReviews.length})
              </h2>
              <div className="space-y-3">
                {approvedReviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-2xl bg-card p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        {review.userName}
                      </span>
                      <Badge variant="default">Одобрен</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {review.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* ===================== RETURNS TAB ===================== */}
          <TabsContent value="returns" className="space-y-4">
            <div className="rounded-2xl bg-card shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs text-muted-foreground">
                      <th className="p-4">ID</th>
                      <th className="p-4">Заказ</th>
                      <th className="p-4">Клиент</th>
                      <th className="p-4">Причина</th>
                      <th className="p-4">Статус</th>
                      <th className="p-4">Дата</th>
                      <th className="p-4">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {returnRequests.map((ret) => {
                      const user = users.find((u) => u.id === ret.userId)
                      const currentStatus = returnStatuses[ret.id]
                      return (
                        <tr
                          key={ret.id}
                          className="border-b border-border last:border-0"
                        >
                          <td className="p-4 font-medium text-foreground">
                            {ret.id}
                          </td>
                          <td className="p-4 text-foreground">{ret.orderId}</td>
                          <td className="p-4 text-foreground">
                            {user?.name || "N/A"}
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {ret.reason}
                          </td>
                          <td className="p-4">
                            <Badge
                              variant={
                                currentStatus === "approved"
                                  ? "default"
                                  : currentStatus === "rejected"
                                    ? "destructive"
                                    : currentStatus === "refunded"
                                      ? "outline"
                                      : "secondary"
                              }
                            >
                              {currentStatus === "pending"
                                ? "Ожидает"
                                : currentStatus === "approved"
                                  ? "Одобрен"
                                  : currentStatus === "rejected"
                                    ? "Отклонён"
                                    : "Возвращён"}
                            </Badge>
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {ret.createdAt}
                          </td>
                          <td className="p-4">
                            {currentStatus === "pending" ? (
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="bg-transparent text-green-600"
                                  onClick={() =>
                                    updateReturnStatus(ret.id, "approved")
                                  }
                                >
                                  Одобрить
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="bg-transparent text-destructive"
                                  onClick={() =>
                                    updateReturnStatus(ret.id, "rejected")
                                  }
                                >
                                  Отклонить
                                </Button>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                ---
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* ===================== SUPPORT TICKETS TAB ===================== */}
          <TabsContent value="tickets" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
              {/* Ticket list */}
              <div className="space-y-2">
                {tickets.map((ticket) => {
                  const user = users.find((u) => u.id === ticket.userId)
                  return (
                    <button
                      key={ticket.id}
                      type="button"
                      onClick={() => setActiveTicket(ticket.id)}
                      className={cn(
                        "w-full rounded-2xl p-4 text-left transition-colors",
                        activeTicket === ticket.id
                          ? "bg-secondary ring-1 ring-border"
                          : "bg-card shadow-sm hover:bg-secondary/60"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">
                          {ticket.id}
                        </span>
                        <Badge
                          variant={
                            ticket.status === "open" ? "default" : "secondary"
                          }
                        >
                          {ticket.status === "open" ? "Открыт" : "Закрыт"}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm font-medium text-foreground">
                        {ticket.subject}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {user?.name || "N/A"} | {ticket.createdAt}
                      </p>
                    </button>
                  )
                })}
              </div>

              {/* Ticket detail / chat */}
              <div className="rounded-2xl bg-card p-5 shadow-sm">
                {selectedTicket ? (
                  <div className="flex h-full flex-col">
                    <div className="mb-4 flex items-center justify-between border-b border-border pb-4">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">
                          {selectedTicket.subject}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {selectedTicket.id} |{" "}
                          {
                            users.find((u) => u.id === selectedTicket.userId)
                              ?.name
                          }
                        </p>
                      </div>
                      {selectedTicket.status === "open" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-transparent text-xs"
                          onClick={() => closeTicket(selectedTicket.id)}
                        >
                          Закрыть тикет
                        </Button>
                      )}
                    </div>

                    {/* Messages */}
                    <div className="flex-1 space-y-3 overflow-y-auto">
                      {selectedTicket.messages.map((msg, idx) => (
                        <div
                          key={`${selectedTicket.id}-msg-${idx}`}
                          className={cn(
                            "max-w-[80%] rounded-2xl p-3 text-sm",
                            msg.sender === "user"
                              ? "bg-secondary text-foreground"
                              : "ml-auto bg-foreground text-primary-foreground"
                          )}
                        >
                          <p>{msg.text}</p>
                          <p
                            className={cn(
                              "mt-1 text-[10px]",
                              msg.sender === "user"
                                ? "text-muted-foreground"
                                : "text-primary-foreground/60"
                            )}
                          >
                            {msg.date}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Reply */}
                    {selectedTicket.status === "open" && (
                      <div className="mt-4 flex gap-2">
                        <Textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Введите ответ..."
                          className="min-h-[60px] flex-1 resize-none rounded-xl text-sm"
                        />
                        <Button
                          size="icon"
                          className="h-[60px] w-[60px] shrink-0 rounded-xl"
                          onClick={sendReply}
                          disabled={!replyText.trim()}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
                    Выберите тикет из списка
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
