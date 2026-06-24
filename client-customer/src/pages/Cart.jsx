import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import CustomerNavbar from "../components/CustomerNavbar";
import { DELIVERY_CHARGE_RS } from "../constants";

function Cart() {
  const { cart, increaseQty, decreaseQty, removeFromCart, getTotal } = useCart();
  const subtotal = getTotal();
  const totalWithDelivery = subtotal + DELIVERY_CHARGE_RS;

  return (
    <div className="min-h-screen">
      <CustomerNavbar />

      <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-6xl">
          <header className="mb-8 text-center sm:mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cafe-700">Your basket</p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900 sm:text-4xl">Review before checkout</h1>
            <p className="mt-2 text-ink-700">
              {cart.length === 0
                ? "Nothing here yet—let’s fix that."
                : `${cart.length} line${cart.length > 1 ? "s" : ""} · tweak quantities anytime`}
            </p>
          </header>

          {cart.length === 0 ? (
            <div className="card-surface mx-auto max-w-md p-10 text-center shadow-cafe-lg">
              <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-cafe-100 text-cafe-700">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
              </div>
              <p className="text-ink-700">Add dishes from the menu—photos and prices stay visible as you shop.</p>
              <Link
                to="/menu"
                className="btn-primary mt-6 w-full py-3.5"
              >
                Go to menu
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1.65fr_1fr] lg:items-start">
              <ul className="space-y-4">
                {cart.map((item) => (
                  <li key={item._id} className="card-surface p-4 shadow-cafe sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 gap-4">
                        {item.image ? (
                          <img
                            src={`http://localhost:5000${item.image}`}
                            alt=""
                            className="h-20 w-20 shrink-0 rounded-2xl object-cover ring-1 ring-cafe-100"
                          />
                        ) : (
                          <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-cafe-100 text-xs font-medium text-cafe-700">
                            No photo
                          </div>
                        )}
                        <div className="min-w-0">
                          <h2 className="font-display text-lg font-semibold text-ink-900">{item.name}</h2>
                          {item.customizationPrice > 0 && (
                            <p className="mt-0.5 text-xs font-medium text-cafe-600">
                              Customizations +£{item.customizationPrice.toFixed(2)}
                            </p>
                          )}
                          <p className="mt-1 text-sm text-ink-600">
                            £ {item.price.toFixed(2)} each ·{" "}
                            <span className="font-medium text-ink-900">Line £ {(item.price * item.quantity).toFixed(2)}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                        <div className="inline-flex items-center rounded-full border border-cafe-200 bg-white p-1 shadow-sm">
                          <button
                            type="button"
                            onClick={() => decreaseQty(item._id)}
                            className="grid h-9 w-9 place-items-center rounded-full text-lg font-medium text-ink-900 transition hover:bg-cafe-50"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="min-w-9 text-center text-sm font-semibold tabular-nums text-ink-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => increaseQty(item._id)}
                            className="grid h-9 w-9 place-items-center rounded-full text-lg font-medium text-ink-900 transition hover:bg-cafe-50"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item._id)}
                          className="rounded-full px-3 py-2 text-sm font-semibold text-red-600/90 hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <aside className="card-surface sticky top-28 h-fit p-6 shadow-cafe-lg sm:p-7">
                <h2 className="font-display text-xl font-semibold text-ink-900">Summary</h2>
                <p className="mt-1 text-sm text-ink-600">
                  Delivery fee applies only when you choose delivery at checkout (£ {DELIVERY_CHARGE_RS}).
                </p>
                <dl className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-600">Subtotal</dt>
                    <dd className="font-semibold tabular-nums text-ink-900">£ {subtotal.toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-t border-cafe-100 pt-3 text-xs text-ink-500">
                    <dt>Est. with delivery</dt>
                    <dd className="font-medium tabular-nums text-ink-800">£ {totalWithDelivery.toFixed(2)}</dd>
                  </div>
                </dl>
                <Link
                  to="/checkout"
                  className="btn-primary mt-6 w-full py-3.5"
                >
                  Continue to checkout
                </Link>
                <Link to="/menu" className="mt-3 block text-center text-sm font-semibold text-cafe-800 hover:text-cafe-900">
                  Add more items
                </Link>
              </aside>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cart;
