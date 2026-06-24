import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import socket from "../socket";
import { API_URL } from "../config";

const API = API_URL;

function PaymentsOrders() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("payments");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [loading, setLoading] = useState(true);

  const fetchPayments = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/payments`);
      setPayments(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load payments");
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/orders`);
      setOrders(res.data);
      return res.data;
    } catch (err) {
      console.error(err);
      toast.error("Failed to load orders");
      return [];
    }
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchPayments(), fetchOrders()]);
    setLoading(false);
  }, [fetchPayments, fetchOrders]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAll();
  }, [loadAll]);

  useEffect(() => {
    const refresh = () => {
      fetchPayments();
      fetchOrders();
    };
    socket.on("newOrder", refresh);
    socket.on("orderUpdated", refresh);
    return () => {
      socket.off("newOrder", refresh);
      socket.off("orderUpdated", refresh);
    };
  }, [fetchPayments, fetchOrders]);

  const refreshSelectedOrder = (orderList, orderId) => {
    const updated = orderList.find((o) => o._id === orderId);
    if (updated) {
      setSelectedOrder(updated);
      setPaymentMethod(updated.paymentMethod || "cash");
      setPaymentStatus(updated.paymentStatus || "pending");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API}/orders/${id}`, { status });
      const orderList = await fetchOrders();
      if (selectedOrder?._id === id) {
        refreshSelectedOrder(orderList, id);
      }
      toast.success(`Order marked as ${status}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update order status");
    }
  };

  const markPaymentPaid = async (paymentId, orderId) => {
    try {
      await axios.put(`${API}/payments/${paymentId}`, {
        status: "paid",
        paidAt: new Date(),
      });
      const orderList = await fetchOrders();
      await fetchPayments();
      if (selectedOrder?._id === orderId) {
        refreshSelectedOrder(orderList, orderId);
      }
      toast.success("Payment marked as paid");
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark payment as paid");
    }
  };

  const markOrderPaid = async () => {
    if (!selectedOrder || paymentStatus === "paid") return;

    try {
      await axios.put(`${API}/orders/${selectedOrder._id}`, {
        paymentStatus: "paid",
        paymentMethod,
      });

      await axios.put(`${API}/payments/by-order/${selectedOrder._id}`, {
        status: "paid",
        method: paymentMethod,
        paidAt: new Date(),
      });

      setPaymentStatus("paid");
      const orderList = await fetchOrders();
      await fetchPayments();
      refreshSelectedOrder(orderList, selectedOrder._id);
      toast.success("Payment marked as paid");
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark payment as paid");
    }
  };

  const statusBadge = (status) => {
    if (status === "paid") return "bg-pos-peach text-pos-green";
    if (status === "failed") return "bg-rose-100 text-rose-800";
    return "bg-pos-peach text-pos-orange";
  };

  const orderStatusClass = (status) => {
    if (status === "Completed") return "bg-pos-peach text-pos-green";
    if (status === "Ready" || status === "Preparing")
      return "bg-pos-peach text-pos-orange";
    return "bg-pos-bg text-pos-muted";
  };

  const openOrder = (order) => {
    setSelectedOrder(order);
    setPaymentMethod(order.paymentMethod || "cash");
    setPaymentStatus(order.paymentStatus || "pending");
  };

  const posOrders = orders.filter((o) => !o.source || o.source === "pos");
  const onlineOrders = orders.filter((o) => o.source === "online");

  const renderOrderList = (list, emptyMessage) => {
    if (list.length === 0) {
      return (
        <div className="py-12 text-center">
          <p className="text-lg text-pos-muted">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {list.map((o) => (
          <div
            key={o._id}
            role="button"
            tabIndex={0}
            className="cursor-pointer rounded-[10px] border border-pos-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            onClick={() => openOrder(o)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") openOrder(o);
            }}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-lg font-semibold text-pos-text">
                    {o.customerName}
                  </p>
                  {o.source === "online" && (
                    <span className="inline-flex rounded-full bg-pos-peach px-2.5 py-0.5 text-xs font-semibold text-pos-orange">
                      Website
                    </span>
                  )}
                  <span className="inline-flex rounded-full bg-pos-bg px-2.5 py-0.5 text-xs font-medium capitalize text-pos-muted">
                    {o.orderType === "walk-in" ? "Collection" : "Delivery"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-pos-muted">
                  <span>{o.phone}</span>
                  <span>£ {o.total}</span>
                  <span>{o.items?.length || 0} items</span>
                  <span className="capitalize">
                    {o.paymentStatus || "pending"}
                  </span>
                </div>
                <p className="text-sm">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${orderStatusClass(
                      o.status,
                    )}`}
                  >
                    {o.status}
                  </span>
                </p>
              </div>

              {["Pending", "Preparing", "Ready"].includes(o.status) && (
                <div className="flex flex-wrap gap-2">
                  {o.status !== "Preparing" && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(o._id, "Preparing");
                      }}
                      className="inline-flex items-center justify-center rounded-md bg-pos-orange px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pos-orange-hover"
                    >
                      Preparing
                    </button>
                  )}
                  {o.status !== "Ready" && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(o._id, "Ready");
                      }}
                      className="inline-flex items-center justify-center rounded-md border-2 border-pos-orange bg-white px-4 py-2 text-sm font-semibold text-pos-orange shadow-sm hover:bg-pos-peach"
                    >
                      Ready
                    </button>
                  )}
                  {o.status !== "Completed" && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(o._id, "Completed");
                      }}
                      className="inline-flex items-center justify-center rounded-md bg-pos-green px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pos-green-hover"
                    >
                      Completed
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-12 text-center text-pos-muted">
        Loading...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-pos-text">Payments & Orders</h1>
        <button
          type="button"
          onClick={() => navigate("/admin")}
          className="font-medium text-pos-muted transition-colors hover:text-pos-text"
        >
          ← Back
        </button>
      </div>

      <div className="-mb-px flex gap-1 border-b border-pos-border">
        <button
          type="button"
          onClick={() => setActiveTab("payments")}
          className={`relative px-5 py-3 text-sm font-semibold transition-colors ${
            activeTab === "payments"
              ? "-mb-px border-b-2 border-pos-orange text-pos-orange"
              : "border-b-2 border-transparent text-pos-muted hover:text-pos-text"
          }`}
        >
          Payments ({payments.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("orders-pos")}
          className={`relative px-5 py-3 text-sm font-semibold transition-colors ${
            activeTab === "orders-pos"
              ? "-mb-px border-b-2 border-pos-orange text-pos-orange"
              : "border-b-2 border-transparent text-pos-muted hover:text-pos-text"
          }`}
        >
          POS Orders ({posOrders.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("orders-online")}
          className={`relative px-5 py-3 text-sm font-semibold transition-colors ${
            activeTab === "orders-online"
              ? "-mb-px border-b-2 border-pos-orange text-pos-orange"
              : "border-b-2 border-transparent text-pos-muted hover:text-pos-text"
          }`}
        >
          Online Orders ({onlineOrders.length})
        </button>
      </div>

      {activeTab === "payments" && (
        <div className="mt-6">
          {payments.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-lg text-pos-muted">No payments yet</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {payments.map((p) => (
                <div
                  key={p._id}
                  className="rounded-[10px] border border-pos-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-pos-muted">
                        Order ID
                      </p>
                      <p className="mt-1 text-sm font-medium text-pos-text">
                        {p.orderId?._id
                          ? String(p.orderId._id).slice(-8)
                          : "N/A"}
                      </p>
                      {p.orderId?.customerName && (
                        <p className="mt-1 text-xs text-pos-muted">
                          {p.orderId.customerName}
                        </p>
                      )}
                    </div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(
                        p.status,
                      )}`}
                    >
                      {p.status || "pending"}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="mb-1 text-sm text-pos-muted">Amount</p>
                      <p className="text-2xl font-bold text-pos-green">
                        £ {p.amount}
                      </p>
                    </div>

                    <div>
                      <p className="mb-1 text-sm text-pos-muted">
                        Payment Method
                      </p>
                      <p className="text-sm font-medium capitalize text-pos-text">
                        {p.method || "cash"}
                      </p>
                    </div>

                    {p.paidAt && (
                      <div>
                        <p className="mb-1 text-sm text-pos-muted">Paid At</p>
                        <p className="text-sm text-pos-muted">
                          {new Date(p.paidAt).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {p.status !== "paid" && (
                    <button
                      type="button"
                      onClick={() =>
                        markPaymentPaid(
                          p._id,
                          p.orderId?._id || p.orderId,
                        )
                      }
                      className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-pos-green px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-pos-green-hover"
                    >
                      Mark as Paid
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "orders-pos" && (
        <div className="mt-6">
          {renderOrderList(posOrders, "No POS orders yet")}
        </div>
      )}

      {activeTab === "orders-online" && (
        <div className="mt-6">
          {renderOrderList(
            onlineOrders,
            "No online orders yet — orders from the customer website appear here",
          )}
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[10px] border border-pos-border bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-pos-text">
                  Order Details
                </h2>
                {selectedOrder.source === "online" && (
                  <span className="mt-1 inline-flex rounded-full bg-pos-peach px-2.5 py-0.5 text-xs font-semibold text-pos-orange">
                    Customer website
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg p-2 text-pos-muted transition-colors hover:bg-pos-bg hover:text-pos-text"
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
                  <p className="text-sm font-medium text-pos-muted">
                    Customer Name
                  </p>
                  <p className="mt-1 text-lg font-semibold text-pos-text">
                    {selectedOrder.customerName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-pos-muted">Phone</p>
                  <p className="mt-1 text-lg font-semibold text-pos-text">
                    {selectedOrder.phone}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-pos-muted">Address</p>
                  <p className="mt-1 text-lg text-pos-text">
                    {selectedOrder.address ||
                      (selectedOrder.orderType === "walk-in"
                        ? "Collection"
                        : "—")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-pos-muted">
                    Order Type
                  </p>
                  <p className="mt-1 text-lg capitalize text-pos-text">
                    {selectedOrder.orderType}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-pos-muted">
                    Total Amount
                  </p>
                  <p className="mt-1 text-lg font-bold text-pos-green">
                    £ {selectedOrder.total}
                  </p>
                </div>
                 <div>
                  <p className="text-sm font-medium text-pos-muted">
                    Extra Notes
                  </p>
                  <p className="mt-1 text-lg font-bold text-pos-text">
                    {selectedOrder.extraNotes}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-[10px] border border-pos-border bg-pos-bg p-5">
                <h3 className="mb-4 text-sm font-semibold text-pos-text">
                  Payment Details
                </h3>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-2 text-sm text-pos-text">
                    <span className="font-semibold">Payment Status:</span>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold text-white ${
                        paymentStatus === "paid"
                          ? "bg-pos-green"
                          : "bg-pos-orange"
                      }`}
                    >
                      {paymentStatus}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                    <label className="font-semibold text-pos-text">
                      Payment Method:
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="rounded-md border border-pos-border bg-white px-3 py-2 text-sm text-pos-text shadow-sm focus:border-pos-orange focus:outline-none focus:ring-2 focus:ring-pos-peach"
                      disabled={paymentStatus === "paid"}
                    >
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="online">Online</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={markOrderPaid}
                    disabled={paymentStatus === "paid"}
                    className={`mt-2 self-start rounded-md px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors ${
                      paymentStatus === "paid"
                        ? "cursor-not-allowed bg-pos-border"
                        : "bg-pos-green hover:bg-pos-green-hover"
                    }`}
                  >
                    {paymentStatus === "paid" ? "Already Paid" : "Mark as Paid"}
                  </button>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-pos-muted">
                  Order Status
                </p>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${orderStatusClass(
                    selectedOrder.status,
                  )}`}
                >
                  {selectedOrder.status}
                </span>
              </div>
            </div>

            <div className="mb-6 border-t border-pos-border pt-6">
              <h3 className="mb-4 text-lg font-semibold text-pos-text">
                Order Items
              </h3>
              <div className="space-y-4">
                {selectedOrder.items?.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-pos-border bg-pos-bg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-pos-text">
                            {item.name}
                          </span>
                          <span className="text-sm text-pos-muted">
                            x {item.quantity}
                          </span>
                        </div>

                        {/* CUSTOMIZATIONS */}
                        {item.customizations &&
                          Object.keys(item.customizations).length > 0 && (
                            <div className="mt-2 ml-0 space-y-1 border-l-2 border-pos-orange pl-3">
                              {Object.values(item.customizations).map(
                                (custom, idx) => (
                                  <div
                                    key={`custom-${idx}`}
                                    className="text-sm text-pos-muted"
                                  >
                                    <span className="text-pos-orange">+</span> {custom.groupTitle}:{" "}
                                    <span className="font-medium text-pos-text">
                                      {custom.optionName}
                                    </span>
                                    {custom.extraPrice > 0 && (
                                      <span className="text-pos-orange">
                                        {" "}
                                        (+£{custom.extraPrice})
                                      </span>
                                    )}
                                  </div>
                                ),
                              )}
                            </div>
                          )}
                      </div>
                      <span className="font-semibold text-pos-text">
                        £{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-pos-border pt-6">
              {["Pending", "Preparing", "Ready"].includes(
                selectedOrder.status,
              ) && (
                <div className="flex flex-wrap gap-3">
                  {selectedOrder.status !== "Preparing" && (
                    <button
                      type="button"
                      onClick={() => updateStatus(selectedOrder._id, "Preparing")}
                      className="inline-flex items-center justify-center rounded-md bg-pos-orange px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-pos-orange-hover"
                    >
                      Mark as Preparing
                    </button>
                  )}

                  {selectedOrder.status !== "Ready" && (
                    <button
                      type="button"
                      onClick={() => updateStatus(selectedOrder._id, "Ready")}
                      className="inline-flex items-center justify-center rounded-md border-2 border-pos-orange bg-white px-6 py-3 text-sm font-semibold text-pos-orange shadow-sm hover:bg-pos-peach"
                    >
                      Mark as Ready
                    </button>
                  )}

                  {selectedOrder.status !== "Completed" && (
                    <button
                      type="button"
                      onClick={() =>
                        updateStatus(selectedOrder._id, "Completed")
                      }
                      className="inline-flex items-center justify-center rounded-md bg-pos-green px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-pos-green-hover"
                    >
                      Mark as Completed
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentsOrders;
