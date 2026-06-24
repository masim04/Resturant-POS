import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import cafe from "../assets/cafe.jpg";
import { API_URL } from "../config";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8"];

const formatDecimal = (value) => {
  return typeof value === "number" ? value.toFixed(2) : value;
};

const fetchAnalyticsData = async () => {
  try {
    const res = await axios.get(`${API_URL}/analytics/dashboard`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch analytics:", error);
    return null;
  }
};

function Dashboard() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      const data = await fetchAnalyticsData();
      if (data) setAnalytics(data);
    };
    loadAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 via-gray-50 to-gray-100 px-4 py-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-12 text-center">
          <img src={cafe} alt="Cafe" className="mx-auto h-32 w-40 drop-shadow-lg" />
          <h1 className="mt-4 text-3xl font-bold text-gray-800">Restaurant Dashboard</h1>
          <p className="mt-1 text-base text-gray-500">Real-time analytics & management</p>
        </div>

        <div className="mb-10 grid gap-5 md:grid-cols-3">
          <button
            type="button"
            onClick={() => navigate("/admin/edit-menu")}
            className="group relative overflow-hidden rounded-xl border border-orange-100 bg-white p-7 text-left shadow-md transition-all duration-300 hover:shadow-lg hover:border-orange-300"
          >
            <div className="absolute inset-0 bg-linear-to-r from-orange-50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-2xl">
              📋
            </div>
            <h3 className="relative font-bold text-gray-800">Edit Menu</h3>
            <p className="relative text-sm text-gray-600">Categories & products</p>
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/pos-system")}
            className="group relative overflow-hidden rounded-xl border border-blue-100 bg-white p-7 text-left shadow-md transition-all duration-300 hover:shadow-lg hover:border-blue-300"
          >
            <div className="absolute inset-0 bg-linear-to-r from-blue-50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-2xl">
              🛒
            </div>
            <h3 className="relative font-bold text-gray-800">POS System</h3>
            <p className="relative text-sm text-gray-600">Take orders & payments</p>
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/payments-orders")}
            className="group relative overflow-hidden rounded-xl border border-green-100 bg-white p-7 text-left shadow-md transition-all duration-300 hover:shadow-lg hover:border-green-300"
          >
            <div className="absolute inset-0 bg-linear-to-r from-green-50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl">
              💳
            </div>
            <h3 className="relative font-bold text-gray-800">Payments</h3>
            <p className="relative text-sm text-gray-600">History & reports</p>
          </button>
        </div>
        {analytics ? (
          <div className="space-y-8">
            {/* PHASE 2: 6 METRIC CARDS */}
            {/* TODAY'S METRICS - ROW 1 */}
            <div className="grid gap-5 md:grid-cols-3">
              <div className="rounded-xl bg-linear-to-br from-amber-500 to-amber-600 p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-amber-100">📅 Today's Revenue</p>
                    <p className="mt-3 text-3xl font-bold">£{(analytics.todayRevenue || 0).toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              <div className="rounded-xl bg-linear-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-blue-100">📦 Today's Orders</p>
                    <p className="mt-3 text-3xl font-bold">{analytics.todayOrders}</p>
                  </div>
                </div>
              </div>
              
              <div className="rounded-xl bg-linear-to-br from-purple-500 to-purple-600 p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-purple-100">💷 Avg Order Value</p>
                    <p className="mt-3 text-3xl font-bold">£{(analytics.todayAvgOrderValue || 0).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* TOTAL METRICS - ROW 2 */}
            <div className="grid gap-5 md:grid-cols-3">
              <div className="rounded-xl bg-linear-to-br from-green-500 to-green-600 p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-green-100">💰 Total Revenue</p>
                    <p className="mt-3 text-3xl font-bold">£{(analytics.totalRevenue || 0).toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              <div className="rounded-xl bg-linear-to-br from-indigo-500 to-indigo-600 p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-indigo-100">📊 Total Orders</p>
                    <p className="mt-3 text-3xl font-bold">{analytics.totalOrders}</p>
                  </div>
                </div>
              </div>
              
              <div className="rounded-xl bg-linear-to-br from-rose-500 to-rose-600 p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-rose-100">🍔 Products Sold</p>
                    <p className="mt-3 text-3xl font-bold">{analytics.totalProductsSold}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* PHASE 3 & 4: RECENT ORDERS + TOP PRODUCTS */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* RECENT ORDERS - LEFT (Takes 2 columns) */}
              <div className="lg:col-span-2 rounded-xl bg-white p-8 shadow-md">
                <h3 className="mb-6 text-xl font-bold text-gray-800">📋 Recent Orders</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-4 font-bold text-gray-700">Order ID</th>
                        <th className="text-left py-3 px-4 font-bold text-gray-700">Amount</th>
                        <th className="text-left py-3 px-4 font-bold text-gray-700">Payment</th>
                        <th className="text-left py-3 px-4 font-bold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-bold text-gray-700">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.recentOrders?.length > 0 ? (
                        analytics.recentOrders.map((order) => (
                          <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 font-mono text-gray-800">#{order._id.toString().slice(-4).toUpperCase()}</td>
                            <td className="py-3 px-4 font-bold text-gray-800">£{(order.total || 0).toFixed(2)}</td>
                            <td className="py-3 px-4 capitalize text-gray-600">{order.paymentMethod}</td>
                            <td className="py-3 px-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                order.paymentStatus === 'paid' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {order.paymentStatus}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-600 text-xs">
                              {new Date(order.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="py-8 text-center text-gray-500">No recent orders</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* TOP SELLING ITEMS TODAY - RIGHT */}
              <div className="rounded-xl bg-white p-8 shadow-md">
                <h3 className="mb-6 text-xl font-bold text-gray-800">🔥 Top Items Today</h3>
                <div className="space-y-3">
                  {analytics.topProductsToday?.length > 0 ? (
                    analytics.topProductsToday.map((product, index) => (
                      <div key={product._id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-b-0">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-xs">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 truncate">{product._id}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {product.quantity} sold • £{(product.revenue || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-8 text-gray-500">No sales today</p>
                  )}
                </div>
              </div>
            </div>

            {/* PAYMENT METHODS & OVERALL TOP PRODUCTS */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* PAYMENTS PIE */}
              <div className="rounded-xl bg-white p-8 shadow-md">
                <h3 className="mb-6 text-xl font-bold text-gray-800">💳 Payment Methods</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      formatter={(value) => `£ ${formatDecimal(value)}`}
                      data={analytics.payments}
                      dataKey="total"
                      nameKey="_id"
                      outerRadius={90}
                      label
                    >
                      {analytics.payments?.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => `£ ${formatDecimal(value)}`}
                      contentStyle={{ borderRadius: "8px", backgroundColor: "#fff", border: "1px solid #e5e7eb" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* TOP PRODUCTS BAR */}
              <div className="rounded-xl bg-white p-8 shadow-md">
                <h3 className="mb-6 text-xl font-bold text-gray-800">📊 Top Products (All Time)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.topProducts}>
                    <XAxis dataKey="_id" angle={-45} textAnchor="end" height={100} tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value) => `£ ${formatDecimal(value)}`}
                      contentStyle={{ borderRadius: "8px", backgroundColor: "#fff", border: "1px solid #e5e7eb" }}
                    />
                    <Bar dataKey="quantity" fill="#FF6B6B" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-xl bg-white py-16 shadow-md">
            <div className="text-center">
              <p className="text-lg text-gray-500">Loading analytics...</p>
              <div className="mt-3 inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
