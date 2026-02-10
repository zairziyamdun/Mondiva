import User from "../models/User.js"

const buildUserResponse = (user) => {
  const { _id, name, email, phone, role, avatar, createdAt } = user
  return { id: _id, name, email, phone, role, avatar, createdAt }
}

// GET /api/users/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id || req.user._id).select("-password")
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" })
    }
    res.json(buildUserResponse(user))
  } catch (error) {
    next(error)
  }
}

// GET /api/users
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 })
    res.json(users.map(buildUserResponse))
  } catch (error) {
    next(error)
  }
}

// PATCH /api/users/:id/role
export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params
    const { role } = req.body

    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" })
    }

    user.role = role
    await user.save()

    res.json(buildUserResponse(user))
  } catch (error) {
    next(error)
  }
}

// DELETE /api/users/:id
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await User.findByIdAndDelete(id)

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" })
    }

    res.status(204).send()
  } catch (error) {
    next(error)
  }
}

