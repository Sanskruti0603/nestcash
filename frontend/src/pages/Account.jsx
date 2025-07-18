import { useState, useEffect } from "react";
import axios from "axios";
import.meta.env.VITE_API_URL;

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const Account = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [amount, setAmount] = useState("");
  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/account/get-all-account`,
        {},
        { headers }
      );
      console.log("Accounts Response:", res.data.data);
      setAccounts(res.data.data);
    } catch (err) {
      console.error("Failed to fetch accounts", err);
    }
  };
  useEffect(() => {
    fetchAccounts();
  }, []);

  const handlePayment = async () => {
    if (!selectedAccount || !amount) {
      alert("Please select an account and enter an amount.");
      return;
    }

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/account/add-money`,
        {
          account_no: selectedAccount._id,
          amount,
        },
        { headers }
      );

      const options = {
        key: data.key_id,
        amount: data.orderAmount,
        currency: "INR",
        name: "NestCash",
        description: "Add Money",
        order_id: data.order_id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${import.meta.env.VITE_API_URL}/api/account/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                txn_id: data.txn_id,
              },
              { headers }
            );
            // alert("✅ Payment Success");
            fetchAccounts();
            console.log("Verified", verifyRes.data);
            setAmount(""); // clear after success
          } catch (err) {
            console.error("Verification Failed:", err);
            alert("❌ Verification Failed");
          }
        },
        prefill: {
          name: "User",
          email: "user@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Razorpay Error:", err);
      alert("❌ Failed to initiate Razorpay payment.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl text-gray-900 font-bold mb-4 text-center tracking-wider">
        Your Accounts
      </h2>

      {accounts.length > 0 && (
        <div className="mt-10 bg-white p-6 rounded-xl shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">
            Account Balance Overview
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={accounts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="accountNumber"
                tick={{ fontSize: 12 }}
                label={{
                  value: "Account No",
                  position: "insideBottom",
                  offset: -5,
                }}
              />
              <YAxis />
              <Tooltip formatter={(val) => `₹${val}`} />
              <Legend layout="horizontal" verticalAlign="top" align="center" />
              <Bar dataKey="amount" fill="#10b981" name="Balance" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((acc) => {
          const isFrozen = acc.isFrozen;
          const isSelected = selectedAccount?._id === acc._id;

          return (
            <div
              key={acc._id}
              onClick={() => {
                if (!isFrozen) setSelectedAccount(acc);
              }}
              className={`cursor-pointer border rounded-lg p-4 shadow-md transition-all duration-200 hover:shadow-lg ${
                isSelected ? "border-blue-600 bg-blue-50" : "border-gray-300"
              } ${isFrozen ? "opacity-50 cursor-not-allowed" : ""}`}
              title={
                isFrozen ? "This account is frozen and cannot be used." : ""
              }
            >
              <p>
                <strong>Account No:</strong> {acc.accountNumber}
              </p>
              <p>
                <strong>Type:</strong> {acc.account_type}
              </p>
              <p>
                <strong>Balance:</strong> ₹{acc.amount}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={isFrozen ? "text-red-500" : "text-green-600"}>
                  {isFrozen ? "Frozen" : "Active"}
                </span>
              </p>
            </div>
          );
        })}
      </div>

      {selectedAccount && (
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex flex-wrap items-center gap-2">
            Add Money to Account:
            <span className="text-blue-600 font-mono text-base bg-blue-50 px-2 py-1 rounded-md border border-blue-200">
              {selectedAccount.accountNumber}
            </span>
          </h3>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none p-3 rounded-lg w-full sm:w-64 shadow-sm"
            />

            <button
              onClick={handlePayment}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-lg shadow-md transition duration-300 ease-in-out focus:ring-2 focus:ring-cyan-400"
            >
              Add Money
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
