import { useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import CustomerNavbar from "../components/CustomerNavbar";
import { API_URL, DELIVERY_CHARGE_RS } from "../constants";
import { Helmet } from "react-helmet-async";
function Checkout() {
  const { cart, getTotal, setCart } = useCart();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [orderType, setOrderType] = useState("walk-in");

  const placeOrder = async () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    if (!customerName.trim() || !phone.trim()) {
      alert("Please fill customer name and phone");
      return;
    }

    if (orderType === "delivery" && !address.trim()) {
      alert("Please provide delivery address");
      return;
    }

    try {
      const subtotal = getTotal();
      const total = orderType === "delivery" ? subtotal + DELIVERY_CHARGE_RS : subtotal;

      const orderData = {
        source: "online",
        customerName,
        phone,
        address: orderType === "delivery" ? address : "",
         items: cart.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.basePrice,
          customizationPrice: item.customizationPrice,
          customizations: item.customizations,
          quantity: item.quantity,
          discountEnabled: item.discountEnabled,
          discountType: item.discountType,
          discountValue: item.discountValue,
          discountAmount: item.discountAmount,
        })),
        total: total,
        orderType: orderType,
        deliveryCharges: orderType === "delivery" ? DELIVERY_CHARGE_RS : 0,
      };

      const res = await axios.post(`${API_URL}/orders`, orderData);

      alert("Order placed successfully!");
      setCart([]);
      navigate("/success", { state: { order: res.data } });
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Failed to place order");
    }
  };

  const subtotal = getTotal();
  const deliveryFee = orderType === "delivery" ? DELIVERY_CHARGE_RS : 0;
  const grandTotal = subtotal + deliveryFee;
  const canSubmit =
    cart.length > 0 &&
    customerName.trim() &&
    phone.trim() &&
    (orderType !== "delivery" || address.trim());

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Cafe Rubab | Checkout</title>
        <meta name="description" content="Checkout page for Cafe Rubab. Review your order and provide your details." />
      </Helmet>
      <CustomerNavbar />
      <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-10">
        <div className="card-surface mx-auto max-w-5xl overflow-hidden shadow-cafe-lg">
          <div className="border-b border-cafe-100 bg-cream px-6 py-8 text-center sm:px-10 sm:py-10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cafe-700">Checkout</p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900 sm:text-4xl">Almost there</h1>
            <p className="mt-2 text-ink-700">Your details are only used for this order and tracking.</p>
          </div>

          <div className="grid gap-8 p-6 lg:grid-cols-[1.25fr_0.95fr] lg:gap-10 lg:p-10">
            <div className="space-y-6">
              <section className="card-surface border-cafe-100/90 p-6 shadow-cafe sm:p-7">
                <h2 className="font-display text-xl font-semibold text-ink-900">Contact</h2>
                <div className="mt-5 space-y-4">
                  <div>
                    <label htmlFor="checkout-name" className="text-sm font-medium text-ink-800">
                      Full name
                    </label>
                    <input
                      id="checkout-name"
                      type="text"
                      className="mt-2 w-full rounded-2xl border border-cafe-200/80 bg-white px-4 py-3 text-ink-900 outline-none ring-cafe-400/25 transition focus:border-cafe-400 focus:ring-2"
                      placeholder="As you'd like it on the order"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="checkout-phone" className="text-sm font-medium text-ink-800">
                      Phone
                    </label>
                    <input
                      id="checkout-phone"
                      type="tel"
                      className="mt-2 w-full rounded-2xl border border-cafe-200/80 bg-white px-4 py-3 text-ink-900 outline-none ring-cafe-400/25 transition focus:border-cafe-400 focus:ring-2"
                      placeholder="Mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  {orderType === "delivery" && (
                    <div>
                      <label htmlFor="checkout-address" className="text-sm font-medium text-ink-800">
                        Delivery address
                      </label>
                      <textarea
                        id="checkout-address"
                        rows={3}
                        className="mt-2 w-full resize-none rounded-2xl border border-cafe-200/80 bg-white px-4 py-3 text-ink-900 outline-none ring-cafe-400/25 transition focus:border-cafe-400 focus:ring-2"
                        placeholder="House / flat, street, postcode"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </section>

              <section className="card-surface border-cafe-100/90 p-6 shadow-cafe sm:p-7">
                <h2 className="font-display text-xl font-semibold text-ink-900">How do you want it?</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label
                    className={[
                      "flex cursor-pointer flex-col rounded-2xl border-2 p-4 transition",
                      orderType === "walk-in"
                        ? "border-cafe-400 bg-cafe-50 shadow-sm"
                        : "border-cafe-100 bg-white hover:border-cafe-200",
                    ].join(" ")}
                  >
                    <span className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="orderType"
                        value="walk-in"
                        checked={orderType === "walk-in"}
                        onChange={(e) => setOrderType(e.target.value)}
                        className="mt-1 h-4 w-4 text-cafe-600 focus:ring-cafe-500"
                      />
                      <span>
                        <span className="block font-semibold text-ink-900">Collection</span>
                        <span className="mt-1 block text-sm text-ink-600">Pick up in store—no delivery fee.</span>
                      </span>
                    </span>
                  </label>
                  <label
                    className={[
                      "flex cursor-pointer flex-col rounded-2xl border-2 p-4 transition",
                      orderType === "delivery"
                        ? "border-cafe-400 bg-cafe-50 shadow-sm"
                        : "border-cafe-100 bg-white hover:border-cafe-200",
                    ].join(" ")}
                  >
                    <span className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="orderType"
                        value="delivery"
                        checked={orderType === "delivery"}
                        onChange={(e) => setOrderType(e.target.value)}
                        className="mt-1 h-4 w-4 text-cafe-600 focus:ring-cafe-500"
                      />
                      <span>
                        <span className="block font-semibold text-ink-900">Delivery</span>
                        <span className="mt-1 block text-sm text-ink-600">£ {DELIVERY_CHARGE_RS} delivery fee applies.</span>
                      </span>
                    </span>
                  </label>
                </div>
              </section>
            </div>

            <aside className="space-y-5">
              <div className="card-surface border-cafe-100/90 p-6 shadow-cafe sm:p-7">
                <h2 className="font-display text-xl font-semibold text-ink-900">Order summary</h2>
                <ul className="mt-5 divide-y divide-cafe-100">
                  {cart.map((item) => (
                    <li key={item._id} className="flex items-start justify-between gap-4 py-4 first:pt-0">
                      <div className="min-w-0">
                        <p className="font-medium text-ink-900">{item.name}</p>
                        <p className="text-sm text-ink-600">Qty {item.quantity}</p>
                      </div>
                      <p className="shrink-0 font-semibold tabular-nums text-ink-900">£ {item.price * item.quantity}</p>
                    </li>
                  ))}
                </ul>
                <dl className="mt-2 space-y-2 border-t border-cafe-100 pt-4 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-600">Subtotal</dt>
                    <dd className="font-medium tabular-nums text-ink-900">£ {subtotal}</dd>
                  </div>
                  {orderType === "delivery" && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-ink-600">Delivery</dt>
                      <dd className="font-medium tabular-nums text-ink-900">£ {DELIVERY_CHARGE_RS}</dd>
                    </div>
                  )}
                  <div className="flex justify-between gap-4 border-t border-cafe-100 pt-3 text-base font-semibold">
                    <dt className="text-ink-900">Total</dt>
                    <dd className="tabular-nums text-cafe-800">£ {grandTotal}</dd>
                  </div>
                </dl>
              </div>

              <button
                type="button"
                onClick={placeOrder}
                disabled={!canSubmit}
                className={[
                  "w-full rounded-full py-3.5 text-sm font-semibold text-white shadow-cafe transition",
                  canSubmit
                    ? "btn-primary py-3.5"
                    : "cursor-not-allowed rounded-full bg-ink-500/35 py-3.5",
                ].join(" ")}
              >
                Place order
              </button>

              <p className="text-center text-sm text-ink-600">
                <Link to="/cart" className="font-semibold text-cafe-800 hover:text-cafe-900">
                  ← Back to cart
                </Link>
              </p>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
