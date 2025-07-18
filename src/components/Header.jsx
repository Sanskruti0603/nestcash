import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaGripLines } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { authSliceActions } from "../store/authSlice";
import { motion } from "framer-motion";

const Header = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = useSelector((store) => store.auth.isLoggedin);
  const role = useSelector((store) => store.auth.role);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showAdminLink, setShowAdminLink] = useState(false);

  useEffect(() => {
    const handleShortcut = (e) => {
      if (e.shiftKey && e.key.toLowerCase() === "a") {
        setShowAdminLink(true);
        navigate("/admin/login");
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("selectedAccountId");
    dispatch(authSliceActions.logout());
  };

  const isActive = (path) => location.pathname === path;

  const commonLinks = [
    { title: "Home", link: "/" },
    { title: "Services", link: "/services" },
    { title: "About Us", link: "/about" },
    { title: "Contact", link: "/contact" },
  ];

  const loggedInLinks = [
    { title: "Home", link: "/" },
    { title: "Account", link: "/account" },
    { title: "Dashboard", link: "/dashboard" },
    { title: "ATM Cards", link: "/atm" },
    { title: "Fix Deposits", link: "/fixdeposit" },
    { title: "Loan", link: "/loan" },
    { title: "Profile", link: "/profile" },
  ];

  const adminLinks = [
    { title: "Dashboard", link: "/admin/dashboard" },
    { title: "Users", link: "/admin/users" },
    { title: "Transactions", link: "/admin/transactions" },
    { title: "Logout", link: "/" },
  ];

  const navLinks = !isLoggedIn
    ? commonLinks
    : role === "admin"
    ? adminLinks
    : loggedInLinks;

  return (
    <>
      <nav className="z-50 relative flex items-center justify-between bg-slate-900 text-white px-6 py-6 shadow-md h-[90px]">
        <Link to="/">
          <img
            src="/Preview-2.png"
            className="h-14 w-auto object-contain"
            alt="NestCash Logo"
          />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <Link
                to={item.link}
                onClick={() => item.title === "Logout" && handleLogout()}
                className={`font-medium transition duration-300 ${
                  isActive(item.link) ? "text-indigo-400" : "text-white"
                }`}
              >
                {item.title}
              </Link>
              <span
                className={`absolute left-0 bottom-[-4px] h-[2px] w-full bg-indigo-400 transform transition-all duration-300 origin-left scale-x-0 group-hover:scale-x-100 ${
                  isActive(item.link) ? "scale-x-100" : ""
                }`}
              />
            </motion.div>
          ))}

          {!isLoggedIn && !showAdminLink && (
            <>
              <Link
                to="/login"
                className="px-4 py-2 border border-indigo-500 rounded hover:bg-indigo-600 hover:text-white transition duration-300"
              >
                Login
              </Link>
              <Link
                to="/signUp"
                className="px-4 py-2 bg-indigo-600 text-white border border-indigo-600 rounded hover:bg-indigo-700 transition duration-300"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-2xl text-white hover:text-indigo-300"
          onClick={() => setMobileNavOpen((prev) => !prev)}
        >
          <FaGripLines />
        </button>
      </nav>

      <div
        className={`${
          mobileNavOpen ? "block" : "hidden"
        } md:hidden bg-slate-900 w-full h-screen fixed top-0 left-0 z-40 flex flex-col items-center justify-center space-y-8`}
      >
        {navLinks.map((item, i) => (
          <Link
            key={i}
            to={item.link}
            onClick={() => {
              if (item.title === "Logout") handleLogout();
              setMobileNavOpen(false);
            }}
            className={`text-white text-2xl font-medium hover:text-indigo-400 transition duration-300 ${
              isActive(item.link)
                ? "underline underline-offset-4 text-indigo-400"
                : ""
            }`}
          >
            {item.title}
          </Link>
        ))}

        {showAdminLink && (
          <Link
            to="/admin/login"
            onClick={() => setMobileNavOpen(false)}
            className="text-yellow-400 underline text-xl"
          >
            Admin Login
          </Link>
        )}

        {!isLoggedIn && !showAdminLink && (
          <>
            <Link
              to="/login"
              onClick={() => setMobileNavOpen(false)}
              className="text-white px-6 py-2 text-xl border border-indigo-500 rounded hover:bg-indigo-600 transition duration-300"
            >
              Login
            </Link>
            <Link
              to="/signUp"
              onClick={() => setMobileNavOpen(false)}
              className="text-white px-6 py-2 text-xl border border-indigo-500 rounded hover:bg-indigo-600 transition duration-300"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </>
  );
};

export default Header;
