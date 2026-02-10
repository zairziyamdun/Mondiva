import Product from "../models/Product.js"

// GET /api/products
export const getProducts = async (req, res, next) => {
  try {
    const { category, categorySlug, minPrice, maxPrice, slug, search } = req.query

    const filter = {}

    if (category) {
      filter.category = category
    }
    if (categorySlug) {
      filter.categorySlug = categorySlug
    }
    if (slug) {
      filter.slug = slug
    }
    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number(minPrice)
      if (maxPrice) filter.price.$lte = Number(maxPrice)
    }
    if (search) {
      filter.name = { $regex: search, $options: "i" }
    }

    const products = await Product.find(filter)
    res.json(products)
  } catch (error) {
    next(error)
  }
}

// GET /api/products/:idOrSlug
export const getProductByIdOrSlug = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params

    let product = null
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(idOrSlug)
    }
    if (!product) {
      product = await Product.findOne({ slug: idOrSlug })
    }

    if (!product) {
      return res.status(404).json({ message: "Товар не найден" })
    }

    res.json(product)
  } catch (error) {
    next(error)
  }
}

// POST /api/products
export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body)
    res.status(201).json(product)
  } catch (error) {
    next(error)
  }
}

// PUT /api/products/:id
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!product) {
      return res.status(404).json({ message: "Товар не найден" })
    }

    res.json(product)
  } catch (error) {
    next(error)
  }
}

// DELETE /api/products/:id
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params
    const product = await Product.findByIdAndDelete(id)

    if (!product) {
      return res.status(404).json({ message: "Товар не найден" })
    }

    res.status(204).send()
  } catch (error) {
    next(error)
  }
}

