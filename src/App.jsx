// import { Routes, Route } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import SignUp from "./pages/SignUp";
// import Header from "./components/Header";
// import Footer from "./components/Footer";
// import Services from "./components/services";
// import AboutUs from "./components/AboutUs";
// import ContactUs from "./pages/ContactUs";
// import Profile from "./pages/Profile";
// import { useEffect } from "react";
// import { authSliceActions } from "./store/authSlice";
// import UpdateUser from "./pages/UpdateUser";
// import Dashboard from "./pages/Dashboard";
// import Atm from "./pages/Atm";
// import AddAtm from "./components/AddAtm";
// import AtmCardDetails from "./components/AtmCardDetails";
// import Atms from "./pages/Atms";
// import Transactions from "./pages/Transactions";
// import TransactionDetail from "./components/TransactionDetail";
// import Account from "./pages/Account";
// import FixDeposit from "./pages/FixDeposit";
// import AddAccount from "./components/AddAccount";
// import AdminLogin from "./pages/AdminLogin";
// import AdminDashboard from "./pages/AdminDashboard";
// import AdminUsersPage from "./pages/AdminUsersPage";
// import AdminTransactionsPage from "./pages/AdminTransactionsPage";
// import Loan from "./pages/Loan";
// import VerifyOtp from "./pages/VerifyOtp";
// import ResetPassword from "./components/ResetPassword";

// const App = () => {
//   const dispatch = useDispatch();
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const role = localStorage.getItem("role");
//     if (token) {
//       dispatch(authSliceActions.login());
//       dispatch(authSliceActions.changeRole(role));
//       dispatch(authSliceActions.changeRole(role));
//     }
//   }, []);
//   return (
//     <>
//       <Header />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/services" element={<Services />} />
//         <Route path="/update-profile" element={<UpdateUser />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/atm" element={<Atm />} />
//         <Route path="/atm/add-atm" element={<AddAtm />} />
//         <Route path="/atm/:id" element={<AtmCardDetails />} />
//         <Route path="/atm/view-atms" element={<Atms />} />
//         <Route path="/about" element={<AboutUs />} />
//         <Route path="/contact" element={<ContactUs />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/verify-otp" element={<VerifyOtp />} />
//         <Route path="/reset-password" element={<ResetPassword />}/>
//         <Route path="/signUp" element={<SignUp />} />
//         <Route path="/profile" element={<Profile />} />
//         <Route path="/transactions" element={<Transactions />} />
//         <Route path="/transactions/:id" element={<TransactionDetail />} />
//         <Route path="/account" element={<Account />} />
//         <Route path="/fixdeposit" element={<FixDeposit />} />
//         <Route path="/loan" element={<Loan />} />
//         <Route path="/add-account" element={<AddAccount />} />
//         <Route path="/admin/login" element={<AdminLogin />} />
//         <Route path="/admin/dashboard" element={<AdminDashboard />} />
//         <Route path="/admin/users" element={<AdminUsersPage />} />
//         <Route path="/admin/transactions" element={<AdminTransactionsPage />} />
//       </Routes>

//       <Footer />
//     </>
//   );
// };

// export default App;

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { authSliceActions } from "./store/authSlice";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MainRoutes from "./routes/MainRoutes";
import AdminRoutes from "./routes/AdminRoutes";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      dispatch(authSliceActions.login());
      dispatch(authSliceActions.changeRole(role));
    }
  }, []);

  return (
    <>
      <Header />
      <MainRoutes />
      <AdminRoutes />
      <Footer />
    </>
  );
};

export default App;
