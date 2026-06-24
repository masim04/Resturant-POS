import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EditMenu from "./pages/EditMenu";
import POSSystem from "./pages/POSSystem";
import PaymentsOrders from "./pages/PaymentsOrders";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import ChangePassword from "./pages/ChangePassword";
import { Toaster, toast } from "react-hot-toast";
import socket from "./socket";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const handleNewOrder = (order) => {
      toast.success(
        `🍽️ New ${order.orderType} order from ${order.customerName} - £ ${order.total}`,
        {
          duration: 5000,
        }
      )
    };
      const handleUpdate = (order) => {
    toast(`Order updated: ${order.status}`, {
      icon: "🔄",
      duration: 3000,
    });
  };
    socket.on("newOrder", handleNewOrder);
    socket.on("orderUpdated", handleUpdate);
    return () => {
      socket.off("newOrder", handleNewOrder);
      socket.off("orderUpdated", handleUpdate);
    };
  }, []);
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/edit-menu"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <EditMenu />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/pos-system"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <POSSystem />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/payments-orders"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <PaymentsOrders />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/change-password"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <ChangePassword />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
