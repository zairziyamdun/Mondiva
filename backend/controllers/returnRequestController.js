import ReturnRequest from "../models/ReturnRequest.js"

// GET /api/returns/my
export const getMyReturnRequests = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id
    const requests = await ReturnRequest.find({ userId }).sort({ createdAt: -1 })
    res.json(requests)
  } catch (error) {
    next(error)
  }
}

// GET /api/returns
export const getAllReturnRequests = async (req, res, next) => {
  try {
    const requests = await ReturnRequest.find().sort({ createdAt: -1 })
    res.json(requests)
  } catch (error) {
    next(error)
  }
}

// POST /api/returns
export const createReturnRequest = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id
    const { orderId, reason } = req.body

    const request = await ReturnRequest.create({
      orderId,
      userId,
      reason,
      status: "pending",
    })

    res.status(201).json(request)
  } catch (error) {
    next(error)
  }
}

// PATCH /api/returns/:id/status
export const updateReturnStatus = async (req, res, next) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const request = await ReturnRequest.findById(id)
    if (!request) {
      return res.status(404).json({ message: "Запрос на возврат не найден" })
    }

    request.status = status
    await request.save()

    res.json(request)
  } catch (error) {
    next(error)
  }
}

