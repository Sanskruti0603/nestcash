import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, User, CreditCard, PlusSquare, List } from "lucide-react";
import { motion } from "framer-motion";
import { authSliceActions } from "../store/authSlice";
import { Mail, Phone, Calendar, Banknote } from "lucide-react";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedAccountId = useSelector(
    (store) => store.account.selectedAccountId
  );
  const isLoggedIn = useSelector((store) => store.auth.isLoggedIn);
  const [data, setData] = useState();
  const [account, setAccount] = useState();
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/user/get-profile",
          {},
          { headers }
        );
        setData(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, []);
  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/account/get-all-account",
          {},
          { headers }
        );
        const accounts = response.data.data;

        const selectedAccount = accounts.find(
          (acc) => acc._id === selectedAccountId
        );

        setAccount(selectedAccount);
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, [selectedAccountId]);

  const handleLogOut = () => {
    dispatch(authSliceActions.logout(true));
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("selectedAccountId");
    navigate("/");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <aside className="w-full sm:w-64 bg-white border-r border-gray-200 p-6 shadow-md sm:h-[10%] md:min-h-screen lg:min-h-screen ">
        <h2 className="text-xl sm:text-2xl font-extrabold text-indigo-700 mb-6 text-center flex items-center justify-center gap-2">
          User Profile
        </h2>

        <nav className="flex flex-col gap-2 text-gray-700">
          <Link
            to="/profile"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition text-sm sm:text-base"
          >
            <User size={20} />
            <span className="font-medium">Profile</span>
          </Link>

          <Link
            to="/transactions"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition text-sm sm:text-base"
          >
            <List size={20} />
            <span className="font-medium">Transactions</span>
          </Link>

          <Link
            to="/add-account"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition text-sm sm:text-base"
          >
            <PlusSquare size={20} />
            <span className="font-medium">Add Account</span>
          </Link>

          <Link
            to="/atm/view-atms"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition text-sm sm:text-base"
          >
            <CreditCard size={20} />
            <span className="font-medium">ATM Cards</span>
          </Link>

          <button
            onClick={handleLogOut}
            className="flex items-center gap-3 px-4 py-2 mt-4 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition text-sm sm:text-base"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </nav>
      </aside>

      <main className="w-full md:w-3/4 bg-gray-50 p-6 flex justify-center items-start">
        <motion.div
          className="bg-gray-200 border border-gray-200 p-8 shadow-2xl w-full max-w-2xl rounded-3xl space-y-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <motion.img
              src="https://static.vecteezy.com/system/resources/previews/018/765/757/original/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg"
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-indigo-500 shadow-md object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
            />
            <h2 className="text-3xl font-extrabold text-gray-800 tracking-wide text-center">
              {data?.name?.toUpperCase()}
            </h2>
            <span className="text-sm font-medium text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full uppercase">
              {data?.account_type} Account
            </span>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 text-gray-700 text-base">
            <p className="flex items-center gap-2">
              <Mail className="text-indigo-600" size={18} />
              <span className="font-semibold text-gray-600">Email:</span>{" "}
              {data?.email}
            </p>

            <p className="flex items-center gap-2">
              <Phone className="text-indigo-600" size={18} />
              <span className="font-semibold text-gray-600">
                Phone:
              </span> +91 {data?.phone}
            </p>

            {data?.profile?.account?._id && (
              <p className="flex items-center gap-2 sm:col-span-2">
                <Banknote className="text-indigo-600" size={18} />
                <span className="font-semibold text-gray-600">
                  Account No:
                </span>{" "}
                {account?.accountNumber}
              </p>
            )}

            <p className="flex items-center gap-2">
              <Calendar className="text-indigo-600" size={18} />
              <span className="font-semibold text-gray-600">
                Joined On:
              </span>{" "}
              {new Date(data?.createdAt).toLocaleDateString()}
            </p>
          </div>

          <motion.div
            className="flex justify-center pt-6"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              to="/update-profile"
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-lg shadow-md cursor-pointer duration-300 ease-in-out transition-transform hover:scale-105 focus:ring-2 focus:ring-cyan-400"
            >
              Edit Profile
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;
