import { Routes, Route } from "react-router-dom";
import AdminLogin from "../pages/AdminLogin";
import AdminDashboard from "../pages/AdminDashboard";
import AdminUsersPage from "../pages/AdminUsersPage";
import AdminTransactionsPage from "../pages/AdminTransactionsPage";

const AdminRoutes = () => (
  <Routes>
    <Route path="/admin/login" element={<AdminLogin />} />
    <Route path="/admin/dashboard" element={<AdminDashboard />} />
    <Route path="/admin/users" element={<AdminUsersPage />} />
    <Route path="/admin/transactions" element={<AdminTransactionsPage />} />
  </Routes>
);

export default AdminRoutes;
