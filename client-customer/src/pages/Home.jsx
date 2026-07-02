import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import CustomerNavbar from "../components/CustomerNavbar";
import CustomerFooter from "../components/CustomerFooter";
import DishCard from "../components/DishCard";
import CustomizationModal from "../components/CustomizationModal";
import { useCart } from "../context/CartContext";
import { API_BASE } from "../constants";
import { Helmet } from "react-helmet-async";

const HERO_CATEGORIES = [
  { label: "Pizza", icon: "🍕" },
  { label: "Burger", icon: "🍔" },
  { label: "Drinks", icon: "🥤" },
  { label: "Pasta", icon: "🍝" },
  { label: "Dessert", icon: "🍰" },
];

const SERVICES = [
  {
    label: "Online Order",
    icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4",
  },
  {
    label: "Pre-Reservation",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
  {
    label: "24/7 Service",
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    label: "Foodie Place",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1",
  },
  {
    label: "Clean Kitchen",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
  {
    label: "Super Chef",
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  },
];

const HERO_IMG =
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=600&fit=crop";

function SectionArrows({ onPrev, onNext }) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={onPrev}
        className="arrow-btn"
        aria-label="Previous"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        type="button"
        onClick={onNext}
        className="arrow-btn"
        aria-label="Next"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}

function Home() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [customizationModalOpen, setCustomizationModalOpen] = useState(false);
  const [selectedProductForCustomization, setSelectedProductForCustomization] =
    useState(null);
  const popularRef = useRef(null);
  const categoryScrollRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get(`${API_BASE}/api/products`),
          axios.get(`${API_BASE}/api/categories`),
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

  const popularProducts = useMemo(() => products.slice(0, 4), [products]);

  const menuProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products
      .filter((p) => !selectedCategory || p.category?._id === selectedCategory)
      .filter((p) => {
        if (!q) return true;
        return (
          (p.name || "").toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q)
        );
      })
      .slice(0, 8);
  }, [products, selectedCategory, searchQuery]);

  const scrollPopular = (dir) => {
    if (!popularRef.current) return;
    popularRef.current.scrollBy({ left: dir * 300, behavior: "smooth" });
  };

  const scrollCategories = (dir) => {
    const el = categoryScrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: dir * Math.max(160, el.clientWidth * 0.55),
      behavior: "smooth",
    });
  };

  const handleAddToCart = (product) => {
    if (product.customizationGroups?.length > 0) {
      setSelectedProductForCustomization(product);
      setCustomizationModalOpen(true);
    } else {
      addToCart(product);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <Helmet>
        <title>Cafe Rubab | Authentic Indian Restaurant</title>
        <meta
          name="description"
          content="Enjoy authentic Indian cuisine at Cafe Rubab. View our menu and order online."
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Restaurant",
            name: "Cafe Rubab",
            priceRange: "£10-£30",
            image: "https://caferubab.co.uk/cafe.jpg", // Replace with your actual logo/image URL
            url: "https://caferubab.co.uk",
            telephone: "+44 141 631 4400",
            servesCuisine: "Indian",
            address: {
              "@type": "PostalAddress",
              streetAddress: "11 Lovat Pl",
              addressLocality: "Rutherglen",
              addressRegion: "Glasgow",
              postalCode: "G73 5HS",
              addressCountry: "GB",
            },
            openingHoursSpecification: [
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Sunday",
                ],
                opens: "16:00",
                closes: "23:00",
              },
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Friday", "Saturday"],
                opens: "16:00",
                closes: "00:00",
              },
            ],
          })}
        </script>
      </Helmet>
      <CustomerNavbar />

      <section className="landing-container py-10 sm:py-16 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-8">
            <h1 className="font-display text-4xl font-bold leading-tight text-ink-900 sm:text-5xl lg:text-[3.25rem]">
              We Serve The Taste You Love{" "}
              <span role="img" aria-label="smile">
                😊
              </span>
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-ink-700 sm:text-lg">
              Cafe Rubab brings fresh café favourites to Rutherglen — browse our
              menu, order online, and enjoy delicious food made with care.
              Collection or delivery, your choice.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/menu" className="btn-primary px-8 py-3.5 text-base">
                Order Now
              </Link>
              <a
                href="#menu-pack"
                className="btn-outline gap-2 px-8 py-3.5 text-base"
              >
                <svg
                  className="h-5 w-5 text-cafe-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
                  />
                </svg>
                Search
              </a>
            </div>
          </div>

          <div className="relative flex items-center justify-center lg:justify-end">
            <div
              className="hero-glow pointer-events-none absolute h-105 w-105 rounded-full"
              aria-hidden
            />
            <div className="relative flex items-center gap-4 sm:gap-6">
              <div className="relative h-64 w-64 shrink-0 overflow-hidden rounded-full border-8 border-white shadow-cafe-lg sm:h-80 sm:w-80">
                <img
                  src={HERO_IMG}
                  alt="Fresh healthy bowl"
                  className="h-full w-full object-cover"
                />
              </div>
              <ul className="hidden flex-col gap-3 sm:flex">
                {HERO_CATEGORIES.map((cat) => (
                  <li
                    key={cat.label}
                    className="flex items-center gap-3 rounded-full border border-cafe-100 bg-white px-4 py-2.5 shadow-sm"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-cafe-100 text-lg">
                      {cat.icon}
                    </span>
                    <span className="text-sm font-bold text-ink-900">
                      {cat.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Dishes */}
      <section id="popular" className="landing-container py-12 sm:py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="section-heading">Popular Dishes</h2>
          <SectionArrows
            onPrev={() => scrollPopular(-1)}
            onNext={() => scrollPopular(1)}
          />
        </div>
        {popularProducts.length === 0 ? (
          <p className="text-center text-ink-700">Loading dishes…</p>
        ) : (
          <div
            ref={popularRef}
            className="flex gap-6 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4 [&::-webkit-scrollbar]:hidden"
          >
            {popularProducts.map((p) => (
              <DishCard key={p._id} product={p} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </section>

      {/* We Are More Than Multiple Service + About */}
      <section id="about" className="landing-container py-12 sm:py-16">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative mx-auto w-full max-w-md">
            <div
              className="hero-glow absolute inset-0 rounded-full"
              aria-hidden
            />
            <div className="relative mx-auto aspect-square max-w-85">
              <div className="absolute inset-8 overflow-hidden rounded-full border-4 border-white shadow-cafe-lg">
                <img
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=500&h=500&fit=crop"
                  alt="Our chef"
                  className="h-full w-full object-cover"
                />
              </div>
              {[
                "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=120&h=120&fit=crop",
                "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=120&h=120&fit=crop",
                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&h=120&fit=crop",
                "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=120&h=120&fit=crop",
              ].map((src, i) => {
                const positions = [
                  "left-0 top-1/2 -translate-y-1/2",
                  "right-0 top-8",
                  "bottom-4 right-4",
                  "bottom-8 left-4",
                ];
                return (
                  <div
                    key={i}
                    className={`absolute ${positions[i]} h-16 w-16 overflow-hidden rounded-full border-3 border-white shadow-md sm:h-20 sm:w-20`}
                  >
                    <img
                      src={src}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="section-heading">
              We Are More Than Multiple Service
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-700">
              At Cafe Rubab we combine a welcoming café atmosphere with fast
              online ordering. From morning coffee to hearty dinners, we&apos;re
              your local spot in Rutherglen for food you&apos;ll love.
            </p>

            <div className="mt-6 rounded-3xl border border-cafe-100 bg-white p-5 shadow-sm">
              <h3 className="font-display text-xl font-bold text-ink-900">
                Visit Us
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-ink-700">
                <li className="flex gap-2">
                  <span className="mt-0.5 text-cafe-600">📍</span>
                  <span>11 Lovat Pl, Rutherglen, Glasgow G73 5HS, United Kingdom</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 text-cafe-600">📞</span>
                  <span>+44 141 631 4400</span>
                </li>
              </ul>
              <div className="mt-4 border-t border-cafe-100 pt-4">
                <p className="text-sm font-semibold text-ink-900">Opening Hours</p>
                <p className="mt-2 text-sm text-ink-700">
                  Thu–Tue: 4:00pm – 11:00pm<br />
                  Fri–Sat: 4:00pm – 12:00am
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {SERVICES.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cafe-400/20 text-cafe-700">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.75}
                        d={s.icon}
                      />
                    </svg>
                  </span>
                  <span className="text-sm font-bold text-ink-900">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
            <a href="#menu-pack" className="btn-primary mt-8 px-7 py-3">
              Read More
            </a>
          </div>
        </div>
      </section>

      {/* Our Regular Menu Pack */}
      <section id="menu-pack" className="section-cream py-12 sm:py-16">
        <div className="landing-container">
          <h2 className="section-heading text-center">Our Regular Menu Pack</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-ink-700">
            Pick a category and add your favourites straight to the cart.
          </p>

          <div className="relative mt-8">
            <button
              type="button"
              aria-label="Scroll categories left"
              onClick={() => scrollCategories(-1)}
              className="absolute left-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-cafe-200 bg-white text-ink-700 shadow-sm transition hover:border-cafe-400 hover:text-cafe-700"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Scroll categories right"
              onClick={() => scrollCategories(1)}
              className="absolute right-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-cafe-200 bg-white text-ink-700 shadow-sm transition hover:border-cafe-400 hover:text-cafe-700"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            <div
              ref={categoryScrollRef}
              className="flex gap-2 overflow-x-auto px-10 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <button
                type="button"
                onClick={() => setSelectedCategory("")}
                className={[
                  "shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition",
                  selectedCategory === ""
                    ? "bg-cafe-400 text-white shadow-cafe"
                    : "border border-cafe-200 bg-white text-ink-800 hover:bg-cafe-50",
                ].join(" ")}
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c._id}
                  type="button"
                  onClick={() => setSelectedCategory(c._id)}
                  className={[
                    "shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition",
                    selectedCategory === c._id
                      ? "bg-cafe-400 text-white shadow-cafe"
                      : "border border-cafe-200 bg-white text-ink-800 hover:bg-cafe-50",
                  ].join(" ")}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mx-auto mt-6 max-w-md">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes…"
              className="w-full rounded-full border border-cafe-200 bg-white px-5 py-3 text-sm outline-none focus:border-cafe-400 focus:ring-2 focus:ring-cafe-400/25"
            />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {menuProducts.length === 0 ? (
              <p className="col-span-full text-center text-ink-700">
                No dishes found. Try another category.
              </p>
            ) : (
              menuProducts.map((p) => (
                <DishCard
                  key={p._id}
                  product={p}
                  onAddToCart={handleAddToCart}
                />
              ))
            )}
          </div>

          {products.length > 8 && (
            <div className="mt-10 text-center">
              <Link to="/menu" className="btn-primary px-8 py-3">
                View Full Menu
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Dinner Plan / Reservation */}
      <section id="reservation" className="landing-container py-12 sm:py-16">
        <div className="grid items-center gap-10 overflow-hidden rounded-4xl bg-cream p-8 sm:p-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-display text-3xl font-bold leading-tight text-ink-900 sm:text-4xl">
              Do You Have Any Dinner Plan Today? Reserve Your Table
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-700">
              Planning a meal out or a special evening? Get in touch to reserve
              your table at Cafe Rubab — or order online for collection and
              delivery anytime.
            </p>
            <Link to="/menu" className="btn-primary mt-8 px-8 py-3.5">
              Book A Table
            </Link>
          </div>
          <div className="relative flex justify-center">
            <div
              className="hero-glow absolute h-72 w-72 rounded-full"
              aria-hidden
            />
            <div className="relative h-56 w-56 overflow-hidden rounded-full border-8 border-white shadow-cafe-lg sm:h-72 sm:w-72">
              <img
                src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=500&fit=crop"
                alt="Gourmet dish"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <CustomerFooter />

      <CustomizationModal
        product={selectedProductForCustomization}
        isOpen={customizationModalOpen}
        onClose={() => {
          setCustomizationModalOpen(false);
          setSelectedProductForCustomization(null);
        }}
        onConfirm={(selections, customizationPrice, product) => {
          addToCart(
            product ?? selectedProductForCustomization,
            selections,
            customizationPrice,
          );
        }}
      />
    </div>
  );
}

export default Home;
