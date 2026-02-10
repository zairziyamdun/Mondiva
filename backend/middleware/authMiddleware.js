import jwt from "jsonwebtoken"
import User from "../models/User.js"

// Проверка Access Token (Bearer токен)
export const protect = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      const user = await User.findById(decoded.id).select("-password")
      if (!user) {
        return res.status(401).json({ message: "Пользователь не найден" })
      }

      req.user = { ...user.toObject(), id: user._id }
      return next()
    } catch (error) {
      console.error(error)
      return res.status(401).json({ message: "Не авторизован, токен недействителен" })
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Не авторизован, токен отсутствует" })
  }
}

// Проверка роли пользователя
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "У вас нет доступа к этому ресурсу" })
    }
    next()
  }
}

