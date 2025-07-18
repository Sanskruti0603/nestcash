import axios from "axios";
import { useState } from "react";
import { motion } from "framer-motion";

const UserPopup = ({ user, onClose }) => {
  if (!user) return null;

  const { name, email, createdAt } = user.user || {};
  const [accounts, setAccounts] = useState(user.accounts || []);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const handleFreezeToggle = async (accountId, shouldFreeze) => {
    const endpoint = shouldFreeze
      ?  `${import.meta.env.VITE_API_URL}/api/admin/freeze-account`
      : `${import.meta.env.VITE_API_URL}/api/admin/unfreeze-account`;

    try {
      const res = await axios.post(
        endpoint,
        {
          user_id: user.user._id,
          account: accountId,
        },
        { headers }
      );

      const updated = accounts.map((acc) =>
        acc._id === accountId ? { ...acc, isFrozen: shouldFreeze } : acc
      );
      setAccounts(updated);
    } catch (err) {
      console.error(
        "Freeze/Unfreeze failed:",
        err.response?.data || err.message
      );
      alert("Unable to update account status.");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl relative"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        <button
          className="absolute top-3 right-4 text-gray-500 hover:text-red-800 text-2xl font-bold cursor-pointer"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
          👤 User Information
        </h2>

        <div className="grid grid-cols-2 gap-4 text-gray-700 mb-4">
          <div>
            <p className="font-semibold">Name</p>
            <p>{name}</p>
          </div>
          <div>
            <p className="font-semibold">Email</p>
            <p>{email}</p>
          </div>
          <div>
            <p className="font-semibold">Status</p>
            <p>
              {user.user?.isFrozen ? (
                <span className="text-red-500 font-semibold">Frozen</span>
              ) : (
                <span className="text-green-600 font-semibold">Active</span>
              )}
            </p>
          </div>
          <div>
            <p className="font-semibold">Joined On</p>
            <p>{new Date(createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          🏦 Linked Accounts
        </h3>

        {accounts.length > 0 ? (
          <div className="space-y-3">
            {accounts.map((acc) => (
              <div
                key={acc._id}
                className="bg-gray-50 p-4 rounded-md shadow-sm border"
              >
                <p>
                  <span className="font-semibold">Account Number:</span>{" "}
                  {acc.accountNumber}
                </p>
                <p>
                  <span className="font-semibold">Type:</span>{" "}
                  {acc.account_type}
                </p>
                <p>
                  <span className="font-semibold">Balance:</span> ₹
                  {acc.amount.toLocaleString()}
                </p>
                <p>
                  <span className="font-semibold">Created:</span>{" "}
                  {new Date(acc.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  {acc.isFrozen ? (
                    <span className="text-red-500 font-semibold">Frozen</span>
                  ) : (
                    <span className="text-green-600 font-semibold">Active</span>
                  )}
                </p>

                <button
                  onClick={() => handleFreezeToggle(acc._id, !acc.isFrozen)}
                  className={`mt-3 px-4 py-2 rounded font-semibold shadow ${
                    acc.isFrozen
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-red-500 hover:bg-red-600 text-white"
                  }`}
                >
                  {acc.isFrozen ? "🔓 Unfreeze Account" : "❄️ Freeze Account"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No accounts found.</p>
        )}
      </motion.div>
    </div>
  );
};

export default UserPopup;
