# MonDiva — Анализ и план доработки

## Часть 1. Текущее состояние проекта

### 1.1 Реализовано хорошо

| Функционал | Статус | Комментарий |
|-----------|--------|-------------|
| **Аутентификация** | ✅ | JWT access + refresh token в httpOnly cookie, bcrypt |
| **Роли** | ✅ | user, admin, moderator, logistics в User модели |
| **API-клиент** | ✅ | Централизованный `api.ts` с автоповтором при 401 (refresh) |
| **Каталог** | ✅ | Фильтры: категория, цена, цвет, размер, бренд. Сортировка: новинки, цена, популярность |
| **Карточка товара** | ✅ | Фото, размерная сетка, описание, цена/скидка, отзывы |
| **Корзина (UI)** | ✅ | Редактирование количества, удаление, localStorage для гостей |
| **Оформление заказа** | ✅ | Шаги: адрес → доставка → оплата → подтверждение. Курьер/СДЭК/Почта |
| **Checkout защищён** | ✅ | `ProtectedRoute` — гости перенаправляются (но не на регистрацию) |
| **Возвраты (модель)** | ✅ | ReturnRequest: pending, approved, rejected, refunded |
| **Отзывы (модель)** | ✅ | Review: rating, text, isApproved |
| **REST API** | ✅ | Products, Categories, Orders, Users, Reviews, Returns, Auth |
| **Валидация** | ✅ | express-validator на роутах |
| **CORS** | ✅ | Настроен (credential + origins) |
| **shadcn/ui** | ✅ | Используется на фронте |
| **Личный кабинет** | ✅ | Профиль, заказы, возвраты |
| **Admin: товары, заказы, пользователи, возвраты** | ✅ | CRUD, смена статусов |
| **Header** | ⚠️ | Базовый: логотип, навигация, поиск, избранное, корзина, кабинет |

---

### 1.2 Реализовано частично

| Функционал | Проблема |
|-----------|----------|
| **Регистрация: роли** | Backend принимает `role` из тела запроса. Блокирует только `admin`, но позволяет `moderator` и `logistics` при прямом POST |
| **Корзина для гостей** | По ТЗ: гости при оформлении → переход на страницу регистрации. Сейчас checkout закрыт ProtectedRoute, но явного "войдите/зарегистрируйтесь" при попытке оформить нет; корзина в localStorage — OK |
| **Сохранение корзины в БД** | Для зарегистрированных — только localStorage. Нет API `/api/cart` для сохранения |
| **Product: скидки** | Есть `oldPrice`, `discount`. Нет `discountPrice`, `discountStart`, `discountEnd` для временных скидок |
| **Product: stock** | Только `inStock` (boolean). Нет числового `stock` для списания остатков |
| **Product в админке** | Форма не редактирует discount, oldPrice, colors, sizes |
| **Каталог: пагинация** | Нет. Все товары грузятся сразу |
| **API products: фильтры** | Нет color, brand, size в query; только category, price, search |
| **Moderator панель** | UI есть, но данные из `mock-data` — не подключается к API |
| **Logistics панель** | UI есть, данные из `mock-data` — не подключается к API. Нет `trackingCode` в Order |
| **Admin: категории** | Ссылка в sidebar есть, страницы `/admin/categories` нет |
| **Admin: отзывы** | Ссылка есть, страницы `/admin/reviews` нет |
| **Admin: аналитика** | Ссылка есть, страницы `/admin/analytics` нет |
| **Избранное** | Только localStorage (`favorites-store.ts`). По ТЗ — только для зарег. пользователей + API |
| **ReturnRequest: фото** | В схеме нет поля `images`. По ТЗ — причина + фото |
| **Review: фото** | В схеме нет поля `images`. По ТЗ — фото в отзыве |
| **Order: трек-номер** | Нет поля `trackingCode` |

---

### 1.3 Не реализовано

| Функционал | ТЗ |
|-----------|-----|
| **Безопасность** | Helmet, rate limiting |
| **Онлайн-оплата** | Stripe, Kaspi Pay, CloudPayments, webhook'и |
| **Uploadthing** | Загрузка изображений товаров и отзывов |
| **Транзакции** | createOrder без MongoDB session; нет списания stock |
| **Уведомления** | email / Telegram / SMS |
| **Чат поддержки** | Реальный (Socket.io или аналог), не mock |
| **Страницы** | О нас, Контакты |
| **Пагинация** | В каталоге, в админ-списках (товары, заказы, пользователи) |
| **Поиск в Header** | Инпут есть, но не ведёт на каталог с query |
| **Docker** | Docker-compose |
| **Swagger** | Документация API |
| **Константы** | Магические числа (5000, 500, 350, 250 и т.д.) |

---

## Часть 2. План доработки

### 2.1 Высокий приоритет (критические задачи)

| № | Задача | Сложность | Оценка | Детали |
|---|--------|-----------|--------|--------|
| 1 | **Безопасность: роли при регистрации** | Low | 0.5 ч | В `authController.register`: всегда `role: "user"`; игнорировать `role` из body для публичной регистрации |
| 2 | **Безопасность: Helmet + rate limiting** | Low | 1 ч | `helmet()`, `express-rate-limit` на /api/auth (регистрация, логин) |
| 3 | **Безопасность: CORS в production** | Low | 0.5 ч | Проверить `CORS_ORIGINS` в .env, запретить `*` в production |
| 4 | **Product: временные скидки + stock** | Medium | 1.5 ч | Добавить: `discountPrice`, `discountStart`, `discountEnd`, `stock` (number). Миграция/обновление seed |
| 5 | **Admin: страница категорий** | Medium | 2 ч | CRUD категорий, страница `/admin/categories` |
| 6 | **Admin: форма товара** | Medium | 1.5 ч | Редактирование discount, oldPrice, colors[], sizes[], stock в форме товара |
| 7 | **Moderator дашборд: подключение к API** | Medium | 2 ч | Отзывы из `/api/reviews`, возвраты из `/api/returns`, approve/reject через API |
| 8 | **Logistics дашборд: подключение к API** | Medium | 2 ч | Заказы из `/api/orders`, PATCH status, добавление `trackingCode` в Order + UI |
| 9 | **Пагинация + поиск в каталоге** | Medium | 2 ч | Backend: `?page=&limit=&search=&category=&...`; Frontend: бесконечный скролл или кнопка "Ещё" |
| 10 | **Пагинация в админ-списках** | Low | 1 ч | Products, Orders, Users — page/limit на бэке и UI |
| 11 | **Транзакции createOrder** | High | 2.5 ч | MongoDB `startSession`, в транзакции: создание Order + уменьшение Product.stock по items. Обработка конфликтов (нет остатков) |

**Итого High: ~16 ч**

---

### 2.2 Средний приоритет

| № | Задача | Сложность | Оценка | Детали |
|---|--------|-----------|--------|--------|
| 12 | **Uploadthing** | Medium | 2 ч | Настройка Uploadthing, route для backend (если нужен server-side), компонент загрузки в форме товара и отзыва |
| 13 | **ReturnRequest: поле images[]** | Low | 0.5 ч | Схема + форма запроса возврата с загрузкой фото |
| 14 | **Review: поле images[]** | Low | 0.5 ч | Схема + форма отзыва с фото |
| 15 | **Kaspi Pay** | High | 4 ч | Заглушка/интеграция Kaspi Pay API, webhook-роут для подтверждения оплаты, обновление статуса заказа |
| 16 | **Webhook Stripe (если используется)** | Medium | 2 ч | Роут `/api/webhooks/stripe`, проверка подписи, обновление Order |
| 17 | **Уведомления: nodemailer** | Medium | 2 ч | При создании заказа — email пользователю; при смене статуса — уведомление |
| 18 | **Чат поддержки** | High | 6 ч | Модель SupportTicket + Message, Socket.io или polling API, UI для модератора и пользователя |
| 19 | **Избранное: API** | Medium | 2 ч | Модель Favorite (userId, productId), API CRUD, favorites-store подключается к API для зарег. пользователей |
| 20 | **Корзина: сохранение в БД** | Medium | 2 ч | Модель Cart (userId, items), API sync, merge с localStorage при логине |
| 21 | **Страницы О нас, Контакты** | Low | 1 ч | Статические страницы /about, /contacts |
| 22 | **Header: поиск → каталог** | Low | 0.5 ч | Поиск перенаправляет на `/catalog?search=...` |
| 23 | **Header: доработка** | Low | 1 ч | Ссылки на О нас, Контакты; улучшение мобильной навигации |

**Итого Medium: ~24 ч**

---

### 2.3 Низкий приоритет

| № | Задача | Сложность | Оценка |
|---|--------|-----------|--------|
| 24 | Docker-compose | Low | 2 ч |
| 25 | Swagger | Medium | 3 ч |
| 26 | Константы (ценовые пороги, лимиты) | Low | 1 ч |
| 27 | Индексы MongoDB | Low | 1 ч |
| 28 | Кэширование (опционально) | Medium | 2 ч |

**Итого Low: ~9 ч**

---

## Часть 3. Рекомендуемый порядок реализации

### Фаза 1 — Безопасность (сразу)
1. Пункты 1–3 (роли, Helmet, rate limit, CORS)

### Фаза 2 — Критичные доработки
2. Пункты 4–6 (Product + Admin категории + форма товара)
3. Пункты 7–8 (Moderator и Logistics дашборды на API)
4. Пункты 9–10 (пагинация)
5. Пункт 11 (транзакции createOrder)

### Фаза 3 — Средний приоритет
6. Пункты 12–14 (Uploadthing, фото в возвратах и отзывах)
7. Пункты 15–16 (Kaspi Pay / Stripe webhook)
8. Пункт 17 (nodemailer)
9. Пункты 18–20 (чат, избранное, корзина в БД)
10. Пункты 21–23 (страницы, Header)

### Фаза 4 — Низкий приоритет
11. Docker, Swagger, константы, индексы

---

## Часть 4. Конкретные технические изменения

### 4.1 Backend

- **authController.js**: `role: "user"` всегда (убрать `role` из body для публичной регистрации).
- **index.js**: добавить `helmet()`, `rateLimit` на `/api/auth`.
- **Product.js**: поля `discountPrice`, `discountStart`, `discountEnd` (Date), `stock` (Number, default 0). При `discountStart <= now <= discountEnd` — показывать скидку.
- **Order.js**: поле `trackingCode: String`.
- **ReturnRequest.js**: поле `images: [String]`.
- **Review.js**: поле `images: [String]`.
- **productController.getProducts**: добавить `page`, `limit`, `color`, `brand`, `size` в query; вернуть `{ products, total, page, limit }`.
- **orderController.createOrder**: использовать `mongoose.startSession()`, в транзакции — создание Order + `Product.updateOne` с `$inc: { stock: -quantity }`. Проверка `stock >= quantity`.
- **orderController.updateOrderStatus**: добавить опционально `trackingCode` в body.
- **Новый роут**: `PATCH /api/orders/:id` — для logistics: обновление status + trackingCode.
- **categoryController** + **routes**: CRUD уже есть, нужна только страница админки.

### 4.2 Frontend

- **Admin**: страницы `/admin/categories`, `/admin/reviews` (опционально `/admin/analytics`).
- **Admin Products**: форма с discount, oldPrice, colors, sizes, stock.
- **Moderator**: `api.get("/api/reviews")`, `api.get("/api/returns")`, `api.patch(...)` вместо mock-data.
- **Logistics**: `api.get("/api/orders")`, `api.patch("/api/orders/:id/status", { status, trackingCode })`.
- **Catalog**: пагинация (page, limit), кнопка "Загрузить ещё" или бесконечный скролл.
- **Header**: поиск → `router.push("/catalog?search=" + query)`.

---

## Часть 5. Итоговая сводка

| Категория | Статус |
|-----------|--------|
| Реализовано хорошо | ~60% основного функционала по ТЗ |
| Частично | ~25% (много "почти", но без API или с mock) |
| Не реализовано | ~15% (оплата, уведомления, чат, Uploadthing, Docker, Swagger) |

**Оценка времени до полного соответствия ТЗ:** ~50 ч (High + Medium + Low).

Можно приступать к реализации по фазам. Рекомендую начать с Фазы 1 (безопасность), затем Фаза 2.
