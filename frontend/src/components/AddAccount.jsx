import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";

const AddAccount = () => {
  const [accountType, setAccountType] = useState("");
  const [initialAmount, setInitialAmount] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!accountType) errors.accountType = "Please select account type.";
    if (!initialAmount) errors.initialAmount = "Initial deposit is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddAccount = async () => {
    if (!validateForm()) return;

    setStatus("loading");
    setStatusMessage("Creating your account...");

    try {
      const res = await axios.post(
        "http://localhost:8080/api/account/add-account",
        {
          account_type: accountType,
          amount: 0,
        },
        { headers }
      );

      const createdAccount = res.data.data;

      setStatusMessage("✅ Account created.");

      if (Number(initialAmount) > 0) {
        setStatusMessage("🔄 Redirecting to Razorpay...");
        await handleRazorpayPayment(createdAccount._id, initialAmount);
      }

      setStatus("success");
      setStatusMessage("✅ Account setup complete!");

      setTimeout(() => {
        setStatus(null);
        navigate("/profile");
      }, 2500);
    } catch (err) {
      console.error("Account creation failed:", err);
      setStatus("error");
      setStatusMessage("❌ Failed to create account.");
      setTimeout(() => setStatus(null), 3000);
    }
  };

  const handleRazorpayPayment = async (accountId, amount) => {
    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/account/add-money",
        {
          account_no: accountId,
          amount,
        },
        { headers }
      );

      const options = {
        key: data.key_id,
        amount: data.orderAmount,
        currency: "INR",
        name: "NestCash",
        description: "Initial Deposit",
        order_id: data.order_id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              "http://localhost:8080/api/account/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                txn_id: data.txn_id,
              },
              { headers }
            );
            console.log("✅ Payment Verified:", verifyRes.data);
            navigate("/account");
          } catch (err) {
            console.error("❌ Verification Failed:", err);
            alert("❌ Payment verification failed.");
          }
        },
        prefill: {
          name: "User",
          email: "user@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#4F46E5",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("❌ Razorpay Error:", err);
      alert("❌ Failed to initiate payment.");
    }
  };

  return (
    <>
      {status && <StatusBadge status={status} message={statusMessage} />}
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-indigo-100 flex items-center justify-center px-4 py-10">
        <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-6 border border-gray-200">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-indigo-700">
               Open a New Account
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Select your account type and initial deposit to get started.
            </p>
          </div>

          
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Type
            </label>
            <select
              value={accountType}
              onChange={(e) => {
                setAccountType(e.target.value);
                setFormErrors((prev) => ({ ...prev, accountType: "" }));
              }}
              className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition ${
                formErrors.accountType
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-indigo-400"
              }`}
            >
              <option value="">-- Choose Account Type --</option>
              <option value="saving">Savings Account</option>
              <option value="current">Current Account</option>
            </select>
            {formErrors.accountType && (
              <p className="text-sm text-red-500 mt-1">
                {formErrors.accountType}
              </p>
            )}
          </div>

          {/* Initial Amount */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Initial Deposit (₹)
            </label>
            <input
              type="number"
              value={initialAmount}
              onChange={(e) => {
                setInitialAmount(e.target.value);
                setFormErrors((prev) => ({ ...prev, initialAmount: "" }));
              }}
              placeholder="Enter amount"
              className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition ${
                formErrors.initialAmount
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-indigo-400"
              }`}
            />
            {formErrors.initialAmount && (
              <p className="text-sm text-red-500 mt-1">
                {formErrors.initialAmount}
              </p>
            )}
          </div>

          <button
            onClick={handleAddAccount}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-lg shadow-md cursor-pointer duration-300 ease-in-out transition-transform hover:scale-105 focus:ring-2 focus:ring-cyan-400 w-full"
          >
            Create Account
          </button>
        </div>
      </div>
    </>
  );
};

export default AddAccount;
