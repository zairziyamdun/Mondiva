// data.js — исходные данные для seed.js (MonDiva)
// ВАЖНО: пароли здесь в открытом виде, но при сидинге ВСЕГДА хешируются в seed.js перед вставкой в БД.

// ===== Users (plain passwords, будут захешированы в seed.js) =====
export const users = [
  {
    name: "Администратор",
    email: "admin@mondiva.com",
    phone: "+7 (999) 000-00-01",
    role: "admin",
    password: "Admin123!",
    createdAt: "2025-01-01",
  },
  {
    name: "Анна Крылова",
    email: "anna@example.com",
    phone: "+7 (999) 123-45-67",
    role: "user",
    password: "Password123",
    createdAt: "2025-01-15",
  },
  {
    name: "Мария Смирнова",
    email: "maria@example.com",
    phone: "+7 (999) 234-56-78",
    role: "user",
    password: "Password123",
    createdAt: "2025-03-20",
  },
  {
    name: "Елена Волкова",
    email: "elena@example.com",
    role: "moderator",
    password: "Password123",
    createdAt: "2025-02-10",
  },
  {
    name: "Логист Иванов",
    email: "logistics@mondiva.com",
    role: "logistics",
    password: "Password123",
    createdAt: "2025-01-01",
  },
]

// ===== Categories =====
export const categories = [
  {
    name: "Платья",
    slug: "dresses",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop",
  },
  {
    name: "Блузки",
    slug: "blouses",
    image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&h=800&fit=crop",
  },
  {
    name: "Юбки",
    slug: "skirts",
    image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&h=800&fit=crop",
  },
  {
    name: "Брюки",
    slug: "pants",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop",
  },
  {
    name: "Верхняя одежда",
    slug: "outerwear",
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&h=800&fit=crop",
  },
  {
    name: "Аксессуары",
    slug: "accessories",
    image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&h=800&fit=crop",
  },
]

// ===== Products (используем slug для связей) =====
export const products = [
  {
    name: "Шёлковое платье Aurelia",
    slug: "silk-dress-aurelia",
    description:
      "Элегантное шёлковое платье с V-образным вырезом и струящимся силуэтом. Идеально для вечерних мероприятий и особых случаев.",
    price: 18900,
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&h=800&fit=crop",
    ],
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
  {
    name: "Блузка Stella из органзы",
    slug: "organza-blouse-stella",
    description: "Воздушная блузка из органзы с объёмными рукавами.",
    price: 5900,
    images: [
      "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=600&h=800&fit=crop",
    ],
    category: "Блузки",
    categorySlug: "blouses",
    brand: "Elegance",
    colors: ["Белый", "Пудровый"],
    sizes: ["XS", "S", "M", "L", "XL"],
    rating: 4.5,
    reviewCount: 18,
    isNew: true,
    isPopular: false,
    inStock: true,
    createdAt: "2025-11-20",
  },
  {
    name: "Тренч Classic Beige",
    slug: "trench-classic-beige",
    description: "Классический тренч из водоотталкивающей ткани.",
    price: 21000,
    images: [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=800&fit=crop",
    ],
    category: "Верхняя одежда",
    categorySlug: "outerwear",
    brand: "MonDiva",
    colors: ["Бежевый", "Чёрный"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.9,
    reviewCount: 42,
    isNew: false,
    isPopular: true,
    inStock: true,
    createdAt: "2025-08-10",
  },
  {
    name: "Кожаная сумка Firenze",
    slug: "leather-bag-firenze",
    description: "Компактная сумка из натуральной кожи с золотой фурнитурой.",
    price: 9800,
    images: [
      "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=800&fit=crop",
    ],
    category: "Аксессуары",
    categorySlug: "accessories",
    brand: "Luxe",
    colors: ["Чёрный", "Коричневый", "Бежевый"],
    sizes: ["One Size"],
    rating: 4.4,
    reviewCount: 12,
    isNew: true,
    isPopular: false,
    inStock: true,
    createdAt: "2025-12-10",
  },
]

// ===== Reviews (связи по email и slug, будут преобразованы в ObjectId в seed.js) =====
export const reviews = [
  {
    userEmail: "anna@example.com",
    productSlug: "silk-dress-aurelia",
    userName: "Анна К.",
    rating: 5,
    text: "Потрясающее платье! Ткань очень приятная, села идеально по фигуре.",
    isApproved: true,
    createdAt: "2025-12-05",
  },
  {
    userEmail: "maria@example.com",
    productSlug: "silk-dress-aurelia",
    userName: "Мария С.",
    rating: 4,
    text: "Красивое, но размер чуть больше, чем ожидала.",
    isApproved: true,
    createdAt: "2025-12-10",
  },
  {
    userEmail: "elena@example.com",
    productSlug: "trench-classic-beige",
    userName: "Елена В.",
    rating: 5,
    text: "Лучший тренч, который у меня был! Качество на высшем уровне.",
    isApproved: true,
    createdAt: "2025-11-20",
  },
]

// ===== Orders (userEmail + productSlug, будут преобразованы в ObjectId) =====
export const orders = [
  {
    code: "ORD-001",
    userEmail: "anna@example.com",
    items: [
      {
        productSlug: "silk-dress-aurelia",
        size: "S",
        color: "Чёрный",
        quantity: 1,
        price: 12900,
      },
      {
        productSlug: "leather-bag-firenze",
        size: "One Size",
        color: "Чёрный",
        quantity: 1,
        price: 9800,
      },
    ],
    total: 22700,
    status: "delivered",
    address: "Москва, ул. Тверская 15, кв. 42",
    deliveryMethod: "Курьерская доставка",
    paymentMethod: "Банковская карта",
    createdAt: "2025-11-15",
    updatedAt: "2025-11-20",
  },
]

// ===== Return Requests (orderCode + userEmail, будут преобразованы в ObjectId) =====
export const returnRequests = [
  {
    code: "RET-001",
    orderCode: "ORD-001",
    userEmail: "anna@example.com",
    reason: "Не подошёл размер",
    status: "approved",
    createdAt: "2025-11-22",
  },
]
