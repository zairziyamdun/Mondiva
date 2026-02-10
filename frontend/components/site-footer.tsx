import Link from "next/link"

const footerLinks = {
  shop: {
    title: "Магазин",
    links: [
      { name: "Новинки", href: "/catalog?filter=new" },
      { name: "Платья", href: "/catalog?category=dresses" },
      { name: "Блузки", href: "/catalog?category=blouses" },
      { name: "Юбки", href: "/catalog?category=skirts" },
      { name: "Верхняя одежда", href: "/catalog?category=outerwear" },
      { name: "Аксессуары", href: "/catalog?category=accessories" },
    ],
  },
  company: {
    title: "Компания",
    links: [
      { name: "О нас", href: "#" },
      { name: "Контакты", href: "#" },
      { name: "Вакансии", href: "#" },
    ],
  },
  support: {
    title: "Помощь",
    links: [
      { name: "Доставка и оплата", href: "#" },
      { name: "Возврат и обмен", href: "#" },
      { name: "Таблица размеров", href: "#" },
      { name: "FAQ", href: "#" },
    ],
  },
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-foreground text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold tracking-wider">MonDiva</h2>
            <p className="text-sm leading-relaxed opacity-70">
              Стильно жить не запретишь. Премиальная женская одежда для тех, кто ценит качество и элегантность.
            </p>
          </div>

          {/* Links */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-xs font-medium uppercase tracking-widest opacity-50">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm opacity-70 transition-opacity hover:opacity-100"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/10 pt-8 sm:flex-row">
          <p className="text-xs opacity-50">
            {"MonDiva \u00A9 2026. Все права защищены."}
          </p>
          <div className="flex gap-4">
            <span className="text-xs opacity-50">Telegram</span>
            <span className="text-xs opacity-50">Instagram</span>
            <span className="text-xs opacity-50">VK</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
