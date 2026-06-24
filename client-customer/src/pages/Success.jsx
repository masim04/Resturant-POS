import { useLocation, Link } from "react-router-dom";
import CustomerNavbar from "../components/CustomerNavbar";

function Success() {
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="min-h-screen">
      <CustomerNavbar />
      <div className="container mx-auto flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-10 sm:px-6">
        <div className="card-surface w-full max-w-lg overflow-hidden p-8 shadow-cafe-lg sm:p-10">
          <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-linear-to-br from-emerald-500 to-emerald-700 text-2xl text-white shadow-cafe" aria-hidden>
            ✓
          </div>
          <h1 className="text-center font-display text-2xl font-semibold text-ink-900 sm:text-3xl">Thank you—order received</h1>
          <p className="mt-2 text-center text-ink-700">We&apos;ll use your phone number if we need to reach you about this order.</p>

          <div className="mt-8 rounded-2xl border border-cafe-100 bg-cafe-50/50 p-5">
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-600">Reference</dt>
                <dd className="font-mono text-xs font-semibold uppercase text-ink-900">
                  {order?._id ? `…${String(order._id).slice(-6)}` : "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-600">Name</dt>
                <dd className="font-medium text-ink-900">{order?.customerName || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-600">Phone</dt>
                <dd className="font-medium text-ink-900">{order?.phone || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-cafe-100 pt-3">
                <dt className="text-ink-600">Total paid</dt>
                <dd className="font-display text-lg font-semibold text-cafe-800">£ {order?.total ?? 0}</dd>
              </div>
            </dl>
          </div>

          {order?.items?.length > 0 && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-500">Items</h2>
              <ul className="mt-3 space-y-2">
                {order.items.map((item, i) => (
                  <li key={i} className="flex justify-between gap-4 text-sm text-ink-800">
                    <span className="min-w-0 truncate">
                      {item.name}{" "}
                      <span className="text-ink-500">×{item.quantity}</span>
                    </span>
                    <span className="shrink-0 tabular-nums font-medium">£ {item.price * item.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/my-orders"
              className="inline-flex flex-1 items-center justify-center rounded-full border border-cafe-200 bg-white py-3 text-sm font-semibold text-cafe-900 hover:bg-cafe-50"
            >
              Track order
            </Link>
            <Link
              to="/menu"
              className="btn-primary flex-1 py-3"
            >
              Order more
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Success;
