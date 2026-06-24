import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import cafeLogo from "../cafe.jpg";

const navLinkClass = ({ isActive }) =>
  [
    "rounded-full px-3 py-2 text-sm font-semibold transition-colors lg:px-4",
    isActive ? "bg-cafe-100 text-cafe-700" : "text-ink-700 hover:bg-cafe-50 hover:text-cafe-600",
  ].join(" ");

const mobileNavLinkClass = ({ isActive }) =>
  [
    "block rounded-2xl px-4 py-3.5 text-base font-semibold transition-colors",
    isActive ? "bg-cafe-100 text-cafe-800" : "text-ink-800 hover:bg-cafe-50",
  ].join(" ");

const NAV_ITEMS = [
  { to: "/", label: "Home", end: true },
  { to: "/#about", label: "About", hash: true },
  { to: "/menu", label: "Menu" },
  { to: "/cart", label: "Cart" },
  { to: "/my-orders", label: "Track Order" },
];

function CustomerNavbar() {
  const { getCartItemCount } = useCart();
  const count = getCartItemCount();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-cafe-100/80 bg-white/95 backdrop-blur-md">
      <div className="landing-container">
        <div className="flex min-h-17 items-center justify-between gap-2 py-2 sm:gap-3 sm:py-3">
          <Link
            to="/"
            className="flex min-w-0 shrink items-center gap-2 sm:gap-2.5"
            onClick={closeMobile}
          >
            <span className="grid h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-cafe-100 sm:h-10 sm:w-10">
              <img src={cafeLogo} alt="" className="h-full w-full object-cover" />
            </span>
            <span className="truncate font-display text-lg font-bold text-ink-900 sm:text-xl lg:text-2xl">
              Cafe Rubab
            </span>
          </Link>

          <nav
            className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 overflow-x-auto px-2 md:flex lg:gap-1"
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map((item) =>
              item.hash ? (
                <a
                  key={item.label}
                  href={item.to}
                  className="shrink-0 rounded-full px-3 py-2 text-sm font-semibold text-ink-700 transition-colors hover:bg-cafe-50 hover:text-cafe-600 lg:px-4"
                >
                  {item.label}
                </a>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => `${navLinkClass({ isActive })} shrink-0`}
                >
                  {item.label}
                </NavLink>
              ),
            )}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Link
              to="/my-orders"
              className="inline-flex h-10 items-center gap-1.5 rounded-full border border-cafe-200 bg-white px-2.5 text-xs font-bold text-ink-900 transition hover:border-cafe-300 hover:bg-cafe-50 sm:h-11 sm:px-4 sm:text-sm md:hidden"
              aria-label="Track order"
            >
              <svg className="h-4 w-4 shrink-0 text-cafe-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span className="hidden min-[380px]:inline">Track</span>
            </Link>

            <Link
              to="/cart"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-cafe-200 bg-white text-ink-900 transition hover:border-cafe-300 hover:bg-cafe-50 sm:h-11 sm:w-11"
              aria-label={`Cart${count > 0 ? `, ${count} items` : ""}`}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 6h15l-1.5 9h-12zM6 6l-1-2H3M9 20a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm8 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid min-h-[1.1rem] min-w-[1.1rem] place-items-center rounded-full bg-cafe-400 px-1 text-[0.6rem] font-bold text-white">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </Link>

            <Link
              to="/menu"
              className="btn-primary hidden px-4 py-2.5 text-sm sm:inline-flex lg:px-5"
            >
              Order Now
            </Link>

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-cafe-200 bg-white md:hidden sm:h-11 sm:w-11"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            aria-label="Close menu"
            onClick={closeMobile}
          />
          <div className="fixed inset-x-0 top-17 z-50 max-h-[calc(100dvh-4.25rem)] overflow-y-auto border-t border-cafe-100 bg-white shadow-cafe-lg md:hidden">
            <nav className="landing-container flex flex-col gap-1 py-4" aria-label="Mobile navigation">
              {NAV_ITEMS.map((item) =>
                item.hash ? (
                  <a
                    key={item.label}
                    href={item.to}
                    className="block rounded-2xl px-4 py-3.5 text-base font-semibold text-ink-800 hover:bg-cafe-50"
                    onClick={closeMobile}
                  >
                    {item.label}
                  </a>
                ) : (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={mobileNavLinkClass}
                    onClick={closeMobile}
                  >
                    {item.label}
                    {item.to === "/cart" && count > 0 ? ` (${count})` : ""}
                  </NavLink>
                ),
              )}
              <Link to="/menu" className="btn-primary mt-2 justify-center py-3.5" onClick={closeMobile}>
                Order Now
              </Link>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}

export default CustomerNavbar;
