import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CustomerNavbar from "../components/CustomerNavbar";
import CustomizationModal from "../components/CustomizationModal";
import TodaysOffers from "../components/TodaysOffers";

function Menu() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [query, setQuery] = useState("");
  const { addToCart, getCartItemCount } = useCart();
  const [customizationModalOpen, setCustomizationModalOpen] = useState(false);
  const [selectedProductForCustomization, setSelectedProductForCustomization] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get("http://localhost:5000/api/products"),
          axios.get("http://localhost:5000/api/categories"),
        ]);
        if (!cancelled) {
          setProducts(prodRes.data);
          setCategories(catRes.data);
        }
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const catOk = !selectedCategory || p.category?._id === selectedCategory;
      if (!catOk) return false;
      if (!q) return true;
      const name = (p.name || "").toLowerCase();
      const desc = (p.description || "").toLowerCase();
      return name.includes(q) || desc.includes(q);
    });
  }, [products, selectedCategory, query]);

  const cartCount = getCartItemCount();

  const handleAddToCart = (product) => {
    // If product has customization groups, open modal; otherwise add directly
    if (product.customizationGroups && product.customizationGroups.length > 0) {
      setSelectedProductForCustomization(product);
      setCustomizationModalOpen(true);
    } else {
      addToCart(product);
    }
  };

  return (
    <div className="min-h-screen pb-24">
      <CustomerNavbar />
      <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-10">
        <div className="card-surface mb-8 overflow-hidden shadow-cafe-lg sm:mb-10">
          <div className="relative bg-cream p-6 sm:p-10">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cafe-300/25 blur-3xl" aria-hidden />
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cafe-700">Menu</p>
                <h1 className="font-display text-balance text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl lg:text-5xl">
                  Order café takeaway with zero friction.
                </h1>
                <p className="text-base leading-relaxed text-ink-700 sm:text-lg">
                  Filter by category, search by name, then add to cart. Your running total stays visible in the header and on the floating cart button.
                </p>
              </div>
              <Link
                to="/cart"
                className="btn-primary shrink-0 gap-2 self-start px-6 py-3 lg:self-auto"
              >
                View cart
                {cartCount > 0 && (
                  <span className="grid min-h-[1.35rem] min-w-[1.35rem] place-items-center rounded-full bg-white/20 px-1.5 text-xs font-bold">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>
            </div>

            <div className="relative mt-8">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-500" aria-hidden>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
                </svg>
              </span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search dishes…"
                className="w-full rounded-2xl border border-cafe-200/80 bg-white/90 py-3.5 pl-12 pr-4 text-ink-900 shadow-inner outline-none ring-cafe-400/30 placeholder:text-ink-500 focus:border-cafe-400 focus:ring-2"
              />
            </div>
          </div>
        </div>

        {/* Today's Offers Section */}
        <TodaysOffers 
          products={products} 
          onAddToCart={handleAddToCart} 
        />

        <div className="sticky top-17 z-30 -mx-4 border-y border-cafe-100 bg-white/95 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={() => setSelectedCategory("")}
              className={[
                "shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition",
                selectedCategory === ""
                  ? "bg-cafe-400 text-white shadow-cafe"
                  : "border border-cafe-200/90 bg-white/90 text-ink-800 hover:border-cafe-300 hover:bg-cafe-50",
              ].join(" ")}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                type="button"
                key={c._id}
                onClick={() => setSelectedCategory(c._id)}
                className={[
                  "shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition",
                  selectedCategory === c._id
                    ? "bg-cafe-400 text-white shadow-cafe"
                    : "border border-cafe-200/90 bg-white/90 text-ink-800 hover:border-cafe-300 hover:bg-cafe-50",
                ].join(" ")}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="card-surface mx-auto mt-10 max-w-lg p-10 text-center shadow-cafe">
            <p className="font-display text-xl font-semibold text-ink-900">Nothing matches yet</p>
            <p className="mt-2 text-ink-700">Try another search or pick a different category.</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSelectedCategory("");
              }}
              className="mt-6 inline-flex rounded-full border border-cafe-300 bg-white px-5 py-2.5 text-sm font-semibold text-cafe-800 hover:bg-cafe-50"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((p) => (
              <article
                key={p._id}
                className="group card-surface flex flex-col overflow-hidden shadow-cafe transition hover:-translate-y-0.5 hover:border-cafe-200 hover:shadow-cafe-lg"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-cafe-100">
                  {p.image ? (
                    <img
                      src={`http://localhost:5000${p.image}`}
                      alt=""
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-linear-to-br from-cafe-100 to-cafe-50 text-sm font-medium text-cafe-700/80">
                      Photo coming soon
                    </div>
                  )}
                  <span className="absolute left-3 top-3 rounded-full border border-white/60 bg-white/90 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-cafe-800 shadow-sm backdrop-blur-sm">
                    {p.category?.name || "Menu"}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <h2 className="font-display text-xl font-semibold text-ink-900 sm:text-2xl">{p.name}</h2>
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-700">
                        {p.description || "A delicious option from our kitchen."}
                      </p>
                    </div>
                    <p className="shrink-0 font-display text-2xl font-bold text-cafe-600 sm:text-right">
                      £ {p.price}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddToCart(p)}
                    className="btn-primary mt-5 w-full gap-2 py-3"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add to cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        <Link
          to="/cart"
          className="fixed bottom-5 right-4 z-40 inline-flex items-center gap-2 rounded-full border border-cafe-200/80 bg-white/95 px-5 py-3.5 text-sm font-semibold text-cafe-900 shadow-cafe-lg backdrop-blur-md transition hover:bg-cafe-50 sm:bottom-6 sm:right-6"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-cafe-400 text-white shadow-cafe">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h10a2 2 0 002-2v-3" />
            </svg>
          </span>
          Cart
          {cartCount > 0 && (
            <span className="rounded-full bg-cafe-100 px-2 py-0.5 text-xs font-bold text-cafe-800">{cartCount}</span>
          )}
        </Link>
        
        <CustomizationModal
          product={selectedProductForCustomization}
          isOpen={customizationModalOpen}
          onClose={() => {
            setCustomizationModalOpen(false);
            setSelectedProductForCustomization(null);
          }}
          onConfirm={(selections, customizationPrice) => {
            addToCart(selectedProductForCustomization, selections, customizationPrice);
          }}
        />
      </div>
    </div>
  );
}

export default Menu;
