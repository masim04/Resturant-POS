import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import cafeLogo from "../cafe.jpg";
const centerLinkClass = ({ isActive }) =>
  [
    "px-3 py-2 text-sm font-semibold transition-colors lg:px-4",
    isActive ? "text-cafe-600" : "text-ink-700 hover:text-cafe-600",
  ].join(" ");

function CustomerNavbar() {
  const { getCartItemCount } = useCart();
  const count = getCartItemCount();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-cafe-100/80 bg-white/95 backdrop-blur-md">
      <div className="landing-container relative flex items-center justify-between gap-4 py-4">
        <Link to="/" className="flex shrink-0 items-center gap-2" onClick={closeMobile}>
          <span className="grid h-10 w-10 place-items-center text-lg font-bold text-white ">
            <img src={cafeLogo} alt="Cafe Rubab" />
          </span>
          <span className="font-display text-xl font-bold text-ink-900 sm:text-2xl">Cafe Rubab</span>
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex lg:gap-2">
          <NavLink to="/" end className={centerLinkClass}>
            Home
          </NavLink>
          <a href="/#about" className="px-3 py-2 text-sm font-semibold text-ink-700 transition hover:text-cafe-600 lg:px-4">
            About Us
          </a>
          <NavLink to="/menu" className={centerLinkClass}>
            Menu
          </NavLink>
          <NavLink to="/cart" className={centerLinkClass}>
            Cart
          </NavLink>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/cart"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-cafe-200 bg-white text-ink-900 transition hover:border-cafe-300 hover:bg-cafe-50"
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

          <Link to="/menu" className="btn-primary hidden px-5 py-2.5 text-sm sm:inline-flex">
            Order Now
          </Link>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-cafe-200 bg-white lg:hidden"
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

      {mobileOpen && (
        <div className="border-t border-cafe-100 bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            <NavLink to="/" end className={centerLinkClass} onClick={closeMobile}>
              Home
            </NavLink>
            <a href="/#about" className="px-3 py-2 text-sm font-semibold text-ink-700" onClick={closeMobile}>
              About Us
            </a>
            <NavLink to="/menu" className={centerLinkClass} onClick={closeMobile}>
              Menu
            </NavLink>
            <NavLink to="/cart" className={centerLinkClass} onClick={closeMobile}>
              Cart {count > 0 && `(${count})`}
            </NavLink>
            <Link to="/menu" className="btn-primary mt-3 justify-center py-3" onClick={closeMobile}>
              Order Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export default CustomerNavbar;
