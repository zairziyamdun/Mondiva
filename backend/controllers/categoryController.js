import Category from "../models/Category.js"

// GET /api/categories
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 })
    res.json(categories)
  } catch (error) {
    next(error)
  }
}

// GET /api/categories/:idOrSlug
export const getCategoryByIdOrSlug = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params

    let category = null
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(idOrSlug)
    }
    if (!category) {
      category = await Category.findOne({ slug: idOrSlug })
    }

    if (!category) {
      return res.status(404).json({ message: "Категория не найдена" })
    }

    res.json(category)
  } catch (error) {
    next(error)
  }
}

// POST /api/categories
export const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body)
    res.status(201).json(category)
  } catch (error) {
    next(error)
  }
}

// PUT /api/categories/:id
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params
    const category = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!category) {
      return res.status(404).json({ message: "Категория не найдена" })
    }

    res.json(category)
  } catch (error) {
    next(error)
  }
}

// DELETE /api/categories/:id
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params
    const category = await Category.findByIdAndDelete(id)

    if (!category) {
      return res.status(404).json({ message: "Категория не найдена" })
    }

    res.status(204).send()
  } catch (error) {
    next(error)
  }
}

