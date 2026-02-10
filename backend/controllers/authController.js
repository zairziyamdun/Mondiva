import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

const ACCESS_EXPIRES_IN = process.env.JWT_EXPIRE || "15m"
const REFRESH_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRE || "7d"
const REFRESH_COOKIE_NAME = "refreshToken"

const signAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: ACCESS_EXPIRES_IN,
  })
}

const signRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  })
}

const setRefreshCookie = (res, token) => {
  const isProd = process.env.NODE_ENV === "production"

  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "lax" : "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
  })
}

const buildUserResponse = (user) => {
  const { _id, name, email, phone, role, avatar, createdAt } = user
  return { id: _id, name, email, phone, role, avatar, createdAt }
}

// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "Пользователь с таким email уже существует" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      // роль можно указать только если уже есть админ, в противном случае всегда user
      role: role && role !== "admin" ? role : "user",
    })

    const accessToken = signAccessToken(user._id)
    const refreshToken = signRefreshToken(user._id)
    setRefreshCookie(res, refreshToken)

    res.status(201).json({
      user: buildUserResponse(user),
      accessToken,
    })
  } catch (error) {
    next(error)
  }
}

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Неверный email или пароль" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Неверный email или пароль" })
    }

    const accessToken = signAccessToken(user._id)
    const refreshToken = signRefreshToken(user._id)
    setRefreshCookie(res, refreshToken)

    res.json({
      user: buildUserResponse(user),
      accessToken,
    })
  } catch (error) {
    next(error)
  }
}

// POST /api/auth/refresh
export const refreshToken = async (req, res, next) => {
  try {
    const tokenFromCookie = req.cookies?.[REFRESH_COOKIE_NAME]
    if (!tokenFromCookie) {
      return res.status(401).json({ message: "Refresh token отсутствует" })
    }

    const decoded = jwt.verify(tokenFromCookie, process.env.REFRESH_TOKEN_SECRET)

    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(401).json({ message: "Пользователь не найден" })
    }

    const newAccessToken = signAccessToken(user._id)
    const newRefreshToken = signRefreshToken(user._id)
    setRefreshCookie(res, newRefreshToken)

    res.json({ accessToken: newAccessToken })
  } catch (error) {
    if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Refresh token недействителен" })
    }
    next(error)
  }
}

// POST /api/auth/logout
export const logout = async (req, res, next) => {
  try {
    res.clearCookie(REFRESH_COOKIE_NAME)
    res.status(200).json({ message: "Вы вышли из системы" })
  } catch (error) {
    next(error)
  }
}

