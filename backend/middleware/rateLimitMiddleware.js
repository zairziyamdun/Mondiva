import rateLimit from "express-rate-limit"

// Строгий лимит для auth (защита от брутфорса)
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 20, // 20 запросов (register + login + refresh)
  message: { message: "Слишком много попыток. Попробуйте позже." },
  standardHeaders: true,
  legacyHeaders: false,
})

// Умеренный лимит для products (защита от скрапинга)
export const productRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 минута
  max: 100, // 100 запросов в минуту
  message: { message: "Слишком много запросов. Подождите минуту." },
  standardHeaders: true,
  legacyHeaders: false,
})
