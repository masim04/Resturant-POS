import { useState } from "react";
import axios from "axios";
import CustomerNavbar from "../components/CustomerNavbar";

function MyOrders() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState([]);
  const [searched, setSearched] = useState(false);

  const fetchOrders = async () => {
    setSearched(true);
    const res = await axios.get(`http://localhost:5000/api/orders?phone=${encodeURIComponent(phone)}`);
    setOrders(res.data);
  };

  return (
    <div className="min-h-screen">
      <CustomerNavbar />
      <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-10">
        <div className="card-surface mx-auto max-w-3xl overflow-hidden shadow-cafe-lg">
          <div className="border-b border-cafe-100 bg-cream px-6 py-10 text-center sm:px-10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cafe-700">Track</p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900 sm:text-4xl">Find your order</h1>
            <p className="mx-auto mt-3 max-w-lg text-ink-700">
              Enter the phone number you used at checkout to see status and totals.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
              <input
                type="tel"
                className="min-h-12 flex-1 rounded-2xl border border-cafe-200/80 bg-white px-4 py-3 text-ink-900 outline-none ring-cafe-400/25 transition focus:border-cafe-400 focus:ring-2"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") fetchOrders();
                }}
              />
              <button
                type="button"
                onClick={fetchOrders}
                className="btn-primary min-h-12 shrink-0 px-6 sm:rounded-full"
              >
                Look up
              </button>
            </div>

            {orders.length > 0 && (
              <ul className="mt-10 space-y-4">
                {orders.map((o) => (
                  <li key={o._id} className="card-surface border-cafe-100/90 p-5 shadow-cafe transition hover:border-cafe-200 hover:shadow-cafe-lg sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-2">
                        <h2 className="font-display text-lg font-semibold text-ink-900">
                          Order #{String(o._id).slice(-5).toUpperCase()}
                        </h2>
                        <p className="text-sm text-ink-700">
                          <span className="font-medium text-ink-900">Total</span> £ {o.total}
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-medium text-ink-600">Status</span>
                          {o.status === "Pending" && (
                            <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
                              Pending
                            </span>
                          )}
                          {o.status === "Preparing" && (
                            <span className="inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-900">
                              Preparing
                            </span>
                          )}
                          {o.status === "Ready" && (
                            <span className="inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-900">
                              Ready
                            </span>
                          )}
                          {o.status === "Completed" && (
                            <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900">
                              Completed
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-ink-500 sm:text-right">
                        {o.createdAt
                          ? new Date(o.createdAt).toLocaleDateString(undefined, {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {searched && orders.length === 0 && phone.trim() && (
              <div className="mt-12 text-center">
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-cafe-100 text-cafe-700">
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="font-display text-lg font-semibold text-ink-900">No orders for that number</p>
                <p className="mt-2 text-sm text-ink-600">Double-check the digits, including any leading zero.</p>
                <button
                  type="button"
                  onClick={() => {
                    setPhone("");
                    setOrders([]);
                    setSearched(false);
                  }}
                  className="mt-6 text-sm font-semibold text-cafe-800 hover:text-cafe-900"
                >
                  Clear and try again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyOrders;
