import Review from "../models/Review.js"

// GET /api/reviews/product/:productId
export const getReviewsForProduct = async (req, res, next) => {
  try {
    const { productId } = req.params
    const reviews = await Review.find({ productId }).sort({ createdAt: -1 })
    res.json(reviews)
  } catch (error) {
    next(error)
  }
}

// POST /api/reviews
export const createReview = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id
    const { productId, rating, text } = req.body

    const review = await Review.create({
      userId,
      userName: req.user.name,
      productId,
      rating,
      text,
      isApproved: false,
    })

    res.status(201).json(review)
  } catch (error) {
    next(error)
  }
}

// PATCH /api/reviews/:id
export const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params
    const { rating, text, isApproved } = req.body

    const review = await Review.findById(id)
    if (!review) {
      return res.status(404).json({ message: "Отзыв не найден" })
    }

    if (typeof rating !== "undefined") review.rating = rating
    if (typeof text !== "undefined") review.text = text
    if (typeof isApproved !== "undefined") review.isApproved = isApproved

    await review.save()

    res.json(review)
  } catch (error) {
    next(error)
  }
}

// DELETE /api/reviews/:id
export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params
    const review = await Review.findByIdAndDelete(id)

    if (!review) {
      return res.status(404).json({ message: "Отзыв не найден" })
    }

    res.status(204).send()
  } catch (error) {
    next(error)
  }
}

