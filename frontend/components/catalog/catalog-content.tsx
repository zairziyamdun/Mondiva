"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { SlidersHorizontal, X, ChevronDown } from "lucide-react"
import { products, categories } from "@/lib/mock-data"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

const allBrands = [...new Set(products.map((p) => p.brand))]
const allColors = [...new Set(products.flatMap((p) => p.colors))]
const allSizes = [...new Set(products.flatMap((p) => p.sizes))]

type SortOption = "new" | "price-asc" | "price-desc" | "popular"

export function CatalogContent() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get("category") || ""
  const initialFilter = searchParams.get("filter") || ""

  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 25000])
  const [sortBy, setSortBy] = useState<SortOption>(
    initialFilter === "new" ? "new" : initialFilter === "sale" ? "price-asc" : "new",
  )
  const [showOnlySale, setShowOnlySale] = useState(initialFilter === "sale")
  const [showOnlyNew, setShowOnlyNew] = useState(initialFilter === "new")

  const filteredProducts = useMemo(() => {
    let result = [...products]

    if (selectedCategory) {
      result = result.filter((p) => p.categorySlug === selectedCategory)
    }
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand))
    }
    if (selectedColors.length > 0) {
      result = result.filter((p) => p.colors.some((c) => selectedColors.includes(c)))
    }
    if (selectedSizes.length > 0) {
      result = result.filter((p) => p.sizes.some((s) => selectedSizes.includes(s)))
    }
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])
    if (showOnlySale) {
      result = result.filter((p) => p.discount)
    }
    if (showOnlyNew) {
      result = result.filter((p) => p.isNew)
    }

    switch (sortBy) {
      case "new":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "price-asc":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        result.sort((a, b) => b.price - a.price)
        break
      case "popular":
        result.sort((a, b) => b.reviewCount - a.reviewCount)
        break
    }

    return result
  }, [selectedCategory, selectedBrands, selectedColors, selectedSizes, priceRange, sortBy, showOnlySale, showOnlyNew])

  const toggleArrayItem = (arr: string[], item: string) =>
    arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]

  const hasActiveFilters =
    selectedCategory || selectedBrands.length > 0 || selectedColors.length > 0 || selectedSizes.length > 0 || showOnlySale || showOnlyNew || priceRange[0] > 0 || priceRange[1] < 25000

  const clearFilters = () => {
    setSelectedCategory("")
    setSelectedBrands([])
    setSelectedColors([])
    setSelectedSizes([])
    setPriceRange([0, 25000])
    setShowOnlySale(false)
    setShowOnlyNew(false)
  }

  const filterContent = (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Категория</h3>
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setSelectedCategory("")}
            className={`block w-full text-left text-sm transition-colors ${!selectedCategory ? "font-semibold text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Все категории
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.slug)}
              className={`block w-full text-left text-sm transition-colors ${selectedCategory === cat.slug ? "font-semibold text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Цена</h3>
        <Slider
          min={0}
          max={25000}
          step={500}
          value={priceRange}
          onValueChange={(v) => setPriceRange(v as [number, number])}
          className="mb-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{priceRange[0].toLocaleString("ru-RU")} &#8381;</span>
          <span>{priceRange[1].toLocaleString("ru-RU")} &#8381;</span>
        </div>
      </div>

      {/* Brand */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Бренд</h3>
        <div className="space-y-2">
          {allBrands.map((brand) => (
            <label key={brand} className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
              <Checkbox
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => setSelectedBrands(toggleArrayItem(selectedBrands, brand))}
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Цвет</h3>
        <div className="flex flex-wrap gap-2">
          {allColors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setSelectedColors(toggleArrayItem(selectedColors, color))}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                selectedColors.includes(color)
                  ? "border-foreground bg-foreground text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Size */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Размер</h3>
        <div className="flex flex-wrap gap-2">
          {allSizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setSelectedSizes(toggleArrayItem(selectedSizes, size))}
              className={`flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-xs font-medium transition-colors ${
                selectedSizes.includes(size)
                  ? "border-foreground bg-foreground text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Extra */}
      <div className="space-y-2">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
          <Checkbox checked={showOnlyNew} onCheckedChange={(c) => setShowOnlyNew(!!c)} />
          Только новинки
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
          <Checkbox checked={showOnlySale} onCheckedChange={(c) => setShowOnlySale(!!c)} />
          Только со скидкой
        </label>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" size="sm" onClick={clearFilters} className="w-full bg-transparent">
          <X className="mr-1 h-3 w-3" /> Сбросить фильтры
        </Button>
      )}
    </div>
  )

  return (
    <div className="flex gap-8">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 lg:block">{filterContent}</aside>

      {/* Main content */}
      <div className="flex-1">
        {/* Top bar */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "товар" : filteredProducts.length < 5 ? "товара" : "товаров"}
          </p>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-44 text-sm">
                <SelectValue placeholder="Сортировка" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">Новинки</SelectItem>
                <SelectItem value="price-asc">Цена: по возрастанию</SelectItem>
                <SelectItem value="price-desc">Цена: по убыванию</SelectItem>
                <SelectItem value="popular">Популярность</SelectItem>
              </SelectContent>
            </Select>

            {/* Mobile filter */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden bg-transparent">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto bg-background">
                <h2 className="mb-6 text-lg font-semibold text-foreground">Фильтры</h2>
                {filterContent}
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Products grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="font-serif text-xl font-semibold text-foreground">
              Ничего не найдено
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Попробуйте изменить параметры фильтрации
            </p>
            <Button variant="outline" size="sm" onClick={clearFilters} className="mt-4 bg-transparent">
              Сбросить фильтры
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
