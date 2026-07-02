import { Link } from "react-router-dom";

function CustomerFooter() {
  return (
    <footer className="border-t border-cafe-100 bg-white">
      <div className="landing-container py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-cafe-400 text-lg font-bold text-white">R</span>
              <span className="font-display text-2xl font-bold text-ink-900">Cafe Rubab</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-700">
              Fresh café food in Rutherglen — order online for collection or delivery. Taste you&apos;ll love, served with care.
            </p>

            <div className="mt-6 rounded-3xl border border-cafe-100 bg-cream/70 p-5">
              <h3 className="font-display text-lg font-bold text-ink-900">Visit Cafe Rubab</h3>
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
              <div className="mt-5">
                <h4 className="text-sm font-bold text-ink-900">Opening Hours</h4>
                <div className="mt-3 space-y-1.5 text-sm text-ink-700">
                  <p>Thursday: 4:00pm – 11:00pm</p>
                  <p>Friday: 4:00pm – 12:00am</p>
                  <p>Saturday: 4:00pm – 12:00am</p>
                  <p>Sunday: 4:00pm – 11:00pm</p>
                  <p>Monday: 4:00pm – 11:00pm</p>
                  <p>Tuesday: 4:00pm – 11:00pm</p>
                  <p>Wednesday: 4:00pm – 11:00pm</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm font-bold text-ink-900">Subscribe Our Newsletter</p>
              <form
                className="mt-3 flex max-w-sm overflow-hidden rounded-full border border-cafe-200 bg-cream"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-ink-500"
                />
                <button type="submit" className="btn-primary shrink-0 rounded-full px-4 py-2.5" aria-label="Subscribe">
                  →
                </button>
              </form>
              <div className="mt-5 flex gap-2">
                {["facebook", "twitter", "instagram", "youtube"].map((s) => (
                  <span
                    key={s}
                    className="grid h-9 w-9 place-items-center rounded-full border border-cafe-200 bg-cream text-xs font-bold uppercase text-cafe-700"
                    aria-hidden
                  >
                    {s[0]}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {[
            { title: "Service", links: ["Online Order", "Pre-Reservation", "24/7 Service", "Foodie Place"] },
            { title: "Quick Links", links: [{ label: "Home", to: "/" }, { label: "Menu", to: "/menu" }, { label: "Cart", to: "/cart" }, { label: "Track Order", to: "/my-orders" }] },
            { title: "About", links: [{ label: "About Us", to: "/#about" }, { label: "Our Menu", to: "/#menu-pack" }, { label: "Reservation", to: "/#reservation" }] },
            { title: "Help", links: ["Contact", "Privacy Policy", "Terms", "FAQ"] },
          ].map((col) => (
            <div key={col.title}>
              <h3 className="font-display text-lg font-bold text-ink-900">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => {
                  const label = typeof link === "string" ? link : link.label;
                  const to = typeof link === "string" ? "#" : link.to;
                  return (
                    <li key={label}>
                      {to.startsWith("/") ? (
                        <Link to={to} className="text-sm text-ink-700 transition hover:text-cafe-600">
                          {label}
                        </Link>
                      ) : (
                        <span className="text-sm text-ink-700">{label}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-12 border-t border-cafe-100 pt-6 text-center text-sm text-ink-500">
          © {new Date().getFullYear()} Cafe Rubab. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default CustomerFooter;
