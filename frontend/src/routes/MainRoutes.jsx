import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Services from "../components/services";
import AboutUs from "../components/AboutUs";
import ContactUs from "../pages/ContactUs";
import Profile from "../pages/Profile";
import UpdateUser from "../pages/UpdateUser";
import Dashboard from "../pages/Dashboard";
import Atm from "../pages/Atm";
import AddAtm from "../components/AddAtm";
import AtmCardDetails from "../components/AtmCardDetails";
import Atms from "../pages/Atms";
import Transactions from "../pages/Transactions";
import TransactionDetail from "../components/TransactionDetail";
import Account from "../pages/Account";
import FixDeposit from "../pages/FixDeposit";
import AddAccount from "../components/AddAccount";
import Loan from "../pages/Loan";
import VerifyOtp from "../pages/VerifyOtp";
import ResetPassword from "../components/ResetPassword";

const MainRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/services" element={<Services />} />
    <Route path="/update-profile" element={<UpdateUser />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/atm" element={<Atm />} />
    <Route path="/atm/add-atm" element={<AddAtm />} />
    <Route path="/atm/:id" element={<AtmCardDetails />} />
    <Route path="/atm/view-atms" element={<Atms />} />
    <Route path="/about" element={<AboutUs />} />
    <Route path="/contact" element={<ContactUs />} />
    <Route path="/login" element={<Login />} />
    <Route path="/verify-otp" element={<VerifyOtp />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route path="/signUp" element={<SignUp />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/transactions" element={<Transactions />} />
    <Route path="/transactions/:id" element={<TransactionDetail />} />
    <Route path="/account" element={<Account />} />
    <Route path="/fixdeposit" element={<FixDeposit />} />
    <Route path="/loan" element={<Loan />} />
    <Route path="/add-account" element={<AddAccount />} />
  </Routes>
);

export default MainRoutes;
