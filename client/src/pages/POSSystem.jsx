import { useState, useEffect, useRef } from "react";
import axios from "axios";
import CustomizationModal from "../components/CustomizationModal";
import { getFinalPrice, getDiscountBadgeText } from "../utils/priceHelper";
import { printOrderReceipts } from "../utils/printReceipt";
import { API_URL, assetUrl } from "../config";
import toast from "react-hot-toast";

function POSSystem() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [orderType, setOrderType] = useState("walk-in");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [deliveryCharges, setDeliveryCharges] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const categoryScrollRef = useRef(null);
  const [extraNotes, setExtraNotes] = useState("");
  const [customizationModalOpen, setCustomizationModalOpen] = useState(false);
  const [selectedProductForCustomization, setSelectedProductForCustomization] =
    useState(null);

  const scrollCategoryRow = (direction) => {
    const el = categoryScrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction * Math.max(160, el.clientWidth * 0.55),
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await axios.get(`${API_URL}/categories`);
      setCategories(res.data);
      if (res.data.length > 0) {
        setSelectedCategory((prev) => prev || res.data[0]._id);
      }
    };

    const fetchProducts = async () => {
      const res = await axios.get(`${API_URL}/products`);
      setProducts(res.data);
    };

    fetchCategories();
    fetchProducts();
  }, []);

  const q = searchQuery.trim().toLowerCase();
  const filteredProducts =
    q.length > 0
      ? products.filter((p) => p?.name?.toLowerCase().includes(q))
      : selectedCategory
        ? products.filter(
            (p) => p.category && p.category._id === selectedCategory,
          )
        : products;

  const addToCart = (product) => {
    // If product has customization groups, open modal; otherwise add directly
    if (product.customizationGroups && product.customizationGroups.length > 0) {
      setSelectedProductForCustomization(product);
      setCustomizationModalOpen(true);
    } else {
      addToCartWithCustomizations(product, {}, 0);
    }
  };

  const addToCartWithCustomizations = (
    product,
    selections,
    customizationPrice,
  ) => {
    if (!product) return;
    // Create unique ID for this product-customization combo
    const customizationKey = JSON.stringify(selections);
    const itemId = `${product._id}-${customizationKey}`;

    // Calculate final price with discount
    const priceData = getFinalPrice(
      product.price,
      product.discountEnabled,
      product.discountType,
      product.discountValue
    );

    const cartItem = {
      _id: itemId,
      productId: product._id,
      name: product.name,
      basePrice: product.price,
      originalPrice: priceData.originalPrice,
      discountedPrice: priceData.finalPrice,
      discountAmount: priceData.discountAmount,
      discountEnabled: product.discountEnabled,
      discountType: product.discountType,
      discountValue: product.discountValue,
      customizationPrice: customizationPrice,
      price: priceData.finalPrice + customizationPrice,
      customizations: selections,
      quantity: 1,
    };

    const existing = cart.find((item) => item._id === itemId);

    if (existing) {
      setCart(
        cart.map((item) =>
          item._id === itemId ? { ...item, quantity: item.quantity + 1 } : item,
        ),
      );
    } else {
      setCart([...cart, cartItem]);
    }
  };

  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const decreaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item._id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    );
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  const getTotal = () => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const total =
      orderType === "delivery" ? subtotal + deliveryCharges : subtotal;
    return total.toFixed(2);
  };
  const createOrder = async () => {
    try {
      if (!customerName || !phone) {
        toast.error("Customer name and phone are required");
        return;
      }

      if (orderType === "delivery" && !address) {
        toast.error("Address is required for delivery orders");
        return;
      }

      if (cart.length === 0) {
        toast.error("Cart is empty");
        return;
      }

      const orderData = {
        source: "pos",
        customerName,
        phone,
        orderType,
        address: orderType === "delivery" ? address : "",
        paymentMethod,
        paymentStatus: isPaid ? "paid" : "pending",
        deliveryCharges: orderType === "delivery" ? deliveryCharges : 0,
        extraNotes,
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
        total: getTotal(),
      };

      const res = await axios.post(
        `${API_URL}/orders`,
        orderData,
      );

      const savedOrder = res.data;

      setShowCheckout(false);

      setCart([]);
      setCustomerName("");
      setPhone("");
      setAddress("");
      setExtraNotes("");
      setDeliveryCharges(0);
      setIsPaid(false);

      toast.success("Order created successfully");

      printOrderReceipts(savedOrder).catch((error) => {
        console.error("Print failed:", error);
        toast.error("Order saved but printing failed. Check printer and try again.");
      });
    } catch (error) {
      console.error("FULL ERROR:", error);

      console.log("Response:", error.response);

      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Failed to create order",
      );
    }
  };
  return (
    <div className="flex min-h-screen min-w-0 max-w-full flex-col overflow-x-hidden bg-pos-bg">
      <header className="sticky top-0 z-20 flex min-w-0 items-center gap-4 border-b border-pos-border bg-white px-4 py-3 shadow-sm sm:px-6">
        <div className="hidden shrink-0 sm:block">
          <p className="text-lg font-bold tracking-tight text-pos-text">
            Cafe Rubab
          </p>
          <p className="text-xs font-medium text-pos-muted">Point of Sale</p>
        </div>
        <div className="relative min-w-0 flex-1 sm:mx-auto sm:max-w-xl">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-pos-muted">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-pos-border bg-pos-bg py-2.5 pl-10 pr-4 text-sm text-pos-text placeholder:text-pos-muted focus:border-pos-orange focus:outline-none focus:ring-2 focus:ring-pos-peach"
          />
        </div>
        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-full border border-pos-border text-pos-muted"
            title="Notifications"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </span>
          <span
            className="flex h-10 w-10 items-center justify-center rounded-full bg-pos-peach text-sm font-semibold text-pos-orange"
            title="Staff"
          >
            A
          </span>
        </div>
      </header>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-6 overflow-x-hidden p-4 lg:flex-row lg:items-start lg:p-6">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-6">
          <div className="min-w-0 max-w-full overflow-hidden rounded-[10px] border border-pos-border bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-pos-text">
                Categories
              </h2>
            </div>
            <div className="relative min-w-0">
              <button
                type="button"
                aria-label="Scroll categories left"
                onClick={() => scrollCategoryRow(-1)}
                className="absolute left-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md border border-pos-border bg-white text-pos-muted shadow-sm transition hover:border-pos-orange hover:text-pos-orange"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
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
                onClick={() => scrollCategoryRow(1)}
                className="absolute right-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md border border-pos-border bg-white text-pos-muted shadow-sm transition hover:border-pos-orange hover:text-pos-orange"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
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
                className="scrollbar-pos-hide -mb-px flex gap-1 overflow-x-auto overflow-y-hidden border-b border-pos-border pl-10 pr-10 [-webkit-overflow-scrolling:touch]"
              >
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    type="button"
                    onClick={() => setSelectedCategory(cat._id)}
                    className={`relative shrink-0 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                      selectedCategory === cat._id
                        ? "-mb-px border-pos-orange text-pos-orange"
                        : "border-transparent text-pos-muted hover:text-pos-text"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="min-h-0 min-w-0 flex-1 rounded-[10px] border border-pos-border bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-pos-text">
                Products
              </h2>
            </div>
            <div className="scrollbar-pos-y grid max-h-[calc(100vh-280px)] min-h-0 grid-cols-2 gap-4 overflow-y-auto pb-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredProducts.length === 0 ? (
                <div className="col-span-full py-16 text-center text-pos-muted">
                  No products available
                </div>
              ) : (
                filteredProducts.map((p) => (
                  <button
                    key={p._id}
                    type="button"
                    onClick={() => addToCart(p)}
                    className="group flex flex-col items-center rounded-[10px] border border-pos-border bg-white p-4 text-left shadow-sm transition-all hover:border-pos-orange/40 hover:shadow-md"
                  >
                    <div className="mb-3 flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full bg-pos-bg ring-1 ring-pos-border relative">
                      {p.image ? (
                        <img
                          src={assetUrl(p.image)}
                          alt="Product"
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <span className="text-xs text-pos-muted">No image</span>
                      )}
                      {p.discountEnabled && p.discountValue > 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">
                          {getDiscountBadgeText(p.discountType, p.discountValue)}
                        </div>
                      )}
                    </div>
                    <h3 className="line-clamp-2 w-full text-center text-sm font-bold text-pos-text">
                      {p.name}
                    </h3>
                    <div className="mt-2 flex flex-col items-center gap-1">
                      {p.discountEnabled && p.discountValue > 0 ? (
                        <>
                          <p className="text-xs text-pos-muted line-through">
                            £ {p.price}
                          </p>
                          <p className="text-sm font-bold text-pos-orange">
                            £ {getFinalPrice(p.price, p.discountEnabled, p.discountType, p.discountValue).finalPrice.toFixed(2)}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm font-medium text-pos-muted">
                          £ {p.price}
                        </p>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        <aside className="w-full shrink-0 lg:w-95 lg:min-w-95 lg:max-w-95">
          <div className="sticky top-24 flex max-h-[calc(100vh-120px)] min-w-0 flex-col rounded-[10px] border border-pos-border bg-white shadow-sm">
            <div className="border-b border-pos-border px-5 py-4">
              <h2 className="text-lg font-bold text-pos-text">Current order</h2>
              <p className="text-xs text-pos-muted">
                Review items before checkout
              </p>
            </div>

            <div className="scrollbar-pos-y flex-1 overflow-y-auto px-5 py-4">
              {cart.length === 0 ? (
                <p className="py-10 text-center text-sm text-pos-muted">
                  No items in cart
                </p>
              ) : (
                <ul className="divide-y divide-pos-border">
                  {cart.map((item) => (
                    <li
                      key={item._id}
                      className="flex flex-col gap-2 py-3 first:pt-0"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <span className="text-sm font-semibold text-pos-text line-clamp-2">
                            {item.name}
                          </span>
                          {item.customizationPrice > 0 && (
                            <p className="text-xs text-pos-orange mt-1">
                              +£{item.customizationPrice.toFixed(2)}{" "}
                              customizations
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item._id)}
                          className="shrink-0 text-lg leading-none text-pos-muted hover:text-red-600"
                          aria-label="Remove item"
                        >
                          ×
                        </button>
                      </div>
                      <p className="text-xs text-pos-muted">
                        £ {item.price.toFixed(2)} each
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 rounded-md border border-pos-border p-0.5">
                          <button
                            type="button"
                            onClick={() => decreaseQty(item._id)}
                            className="flex h-8 w-8 items-center justify-center rounded text-pos-text hover:bg-pos-bg"
                          >
                            −
                          </button>
                          <span className="min-w-6 text-center text-sm font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => increaseQty(item._id)}
                            className="flex h-8 w-8 items-center justify-center rounded text-pos-text hover:bg-pos-bg"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm font-bold text-pos-text">
                          £ {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-pos-border px-5 py-4">
                <div className="mb-3 flex justify-between text-sm text-pos-muted">
                  <span>Total items</span>
                  <span className="font-semibold text-pos-text">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
                <div className="mb-4 flex justify-between text-base font-bold text-pos-text">
                  <span>Total</span>
                  <span className="text-pos-green">£ {getTotal()}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCheckout(true)}
                  disabled={cart.length === 0}
                  className="w-full rounded-md bg-pos-green py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-pos-green-hover disabled:cursor-not-allowed disabled:bg-pos-border disabled:text-pos-muted"
                >
                  Checkout
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>

      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[10px] border border-pos-border bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-pos-text">Checkout</h2>
              <button
                type="button"
                onClick={() => setShowCheckout(false)}
                className="rounded-lg p-2 text-pos-muted hover:bg-pos-bg hover:text-pos-text"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-pos-text">
                    Customer Name *
                  </label>
                  <input
                    className="w-full rounded-md border border-pos-border px-4 py-2.5 text-pos-text focus:border-pos-orange focus:outline-none focus:ring-2 focus:ring-pos-peach"
                    placeholder="Full Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-pos-text">
                    Phone *
                  </label>
                  <input
                    className="w-full rounded-md border border-pos-border px-4 py-2.5 text-pos-text focus:border-pos-orange focus:outline-none focus:ring-2 focus:ring-pos-peach"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-pos-text">
                    Order Type *
                  </label>
                  <select
                    className="w-full rounded-md border border-pos-border bg-white px-4 py-2.5 text-pos-text focus:border-pos-orange focus:outline-none focus:ring-2 focus:ring-pos-peach"
                    value={orderType}
                    onChange={(e) => {
                      setOrderType(e.target.value);
                      if (e.target.value === "walk-in") {
                        setDeliveryCharges(0);
                      }
                    }}
                  >
                    <option value="walk-in">Walk In</option>
                    <option value="delivery">Delivery</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-pos-text">
                    Notes
                  </label>
                  <input
                    className="w-full rounded-md border border-pos-border px-4 py-2.5 text-pos-text focus:border-pos-orange focus:outline-none focus:ring-2 focus:ring-pos-peach"
                    placeholder="Extra Toppings, Allergies, etc."
                    value={extraNotes}
                    onChange={(e) => setExtraNotes(e.target.value)}
                  />
                </div>
                {orderType === "delivery" && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-pos-text">
                      Address *
                    </label>
                    <input
                      className="w-full rounded-md border border-pos-border px-4 py-2.5 text-pos-text focus:border-pos-orange focus:outline-none focus:ring-2 focus:ring-pos-peach"
                      placeholder="Delivery Address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                )}
                {orderType === "delivery" && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-pos-text">
                      Delivery Charges
                    </label>
                    <input
                      type="number"
                      className="w-full rounded-md border border-pos-border px-4 py-2.5 text-pos-text focus:border-pos-orange focus:outline-none focus:ring-2 focus:ring-pos-peach"
                      placeholder="0"
                      value={deliveryCharges}
                      onChange={(e) =>
                        setDeliveryCharges(Number(e.target.value))
                      }
                    />
                  </div>
                )}
                <div>
                  <label className="mb-2 block text-sm font-medium text-pos-text">
                    Payment Method
                  </label>
                  <select
                    className="w-full rounded-md border border-pos-border bg-white px-4 py-2.5 text-pos-text focus:border-pos-orange focus:outline-none focus:ring-2 focus:ring-pos-peach"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="online">Online</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 md:col-span-2">
                  <input
                    id="paid-checkbox"
                    type="checkbox"
                    checked={isPaid}
                    onChange={(e) => setIsPaid(e.target.checked)}
                    className="h-4 w-4 rounded border-pos-border text-pos-green focus:ring-pos-orange"
                  />
                  <label
                    htmlFor="paid-checkbox"
                    className="text-sm font-medium text-pos-text"
                  >
                    Customer has already paid
                  </label>
                </div>
              </div>

              <div className="border-t border-pos-border pt-4">
                <h3 className="mb-3 text-base font-semibold text-pos-text">
                  Order Summary
                </h3>
                <div className="mb-4 space-y-2 rounded-md border border-pos-border bg-pos-bg p-3">
                  {cart.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-pos-muted">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-semibold text-pos-text">
                        £ {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                {orderType === "delivery" && (
                  <div className="mb-4 space-y-2 rounded-md border border-pos-border bg-pos-peach/50 p-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-pos-muted">Subtotal</span>
                      <span className="font-semibold text-pos-text">
                        £{" "}
                        {cart
                          .reduce(
                            (sum, item) => sum + item.price * item.quantity,
                            0,
                          )
                          .toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-pos-muted">Delivery Charges</span>
                      <span className="font-semibold text-pos-text">
                        £ {deliveryCharges.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
                <div className="flex justify-between rounded-md border border-pos-border bg-pos-peach px-4 py-3">
                  <span className="text-lg font-bold text-pos-text">Total</span>
                  <span className="text-lg font-bold text-pos-green">
                    £ {getTotal()}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={createOrder}
              className="w-full rounded-md bg-pos-green py-3 text-base font-bold text-white transition-colors hover:bg-pos-green-hover"
            >
              Create Order
            </button>
          </div>
        </div>
      )}

      <CustomizationModal
        product={selectedProductForCustomization}
        isOpen={customizationModalOpen}
        onClose={() => {
          setCustomizationModalOpen(false);
          setSelectedProductForCustomization(null);
        }}
        onConfirm={(selections, customizationPrice, product) => {
          addToCartWithCustomizations(
            product ?? selectedProductForCustomization,
            selections,
            customizationPrice,
          );
        }}
      />
    </div>
  );
}

export default POSSystem;
