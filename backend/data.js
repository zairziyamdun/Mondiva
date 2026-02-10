// data.js
export const categories = [
    { id: "1", name: "Платья", slug: "dresses", image: "..." },
    { id: "2", name: "Блузки", slug: "blouses", image: "..." },
    // остальные категории
  ];
  
  export const products = [
    {
      id: "1",
      name: "Шёлковое платье Aurelia",
      slug: "silk-dress-aurelia",
      description: "Элегантное шёлковое платье...",
      price: 12900,
      images: ["...", "..."],
      category: "Платья",
      categorySlug: "dresses",
      brand: "MonDiva",
      colors: ["Чёрный", "Бежевый", "Бордовый"],
      sizes: ["XS", "S", "M", "L"],
      rating: 4.8,
      reviewCount: 24,
      isNew: true,
      isPopular: true,
      inStock: true,
      createdAt: "2025-12-01",
    },
    // остальные продукты
  ];
  
  export const users = [
    { id: "1", email: "anna@example.com", name: "Анна Крылова", role: "user", createdAt: "2025-01-15" },
    { id: "2", email: "maria@example.com", name: "Мария Смирнова", role: "user", createdAt: "2025-03-20" },
    // остальные пользователи
  ];
  