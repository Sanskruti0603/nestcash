import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AtmDisplay from "./AtmDisplay";
import StatusBadge from "./StatusBadge";
import { motion } from "framer-motion";
import {
  FaUser,
  FaCreditCard,
  FaCalendarAlt,
  FaLock,
  FaTags,
  FaUniversity,
} from "react-icons/fa";

const AtmCardDetails = () => {
  const [error, setError] = useState("");
  const [isWithdraw, setIsWithdraw] = useState(false);
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [form, showForm] = useState(false);
  const [card, setCard] = useState();
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.post(
          `http://localhost:8080/api/atm/get-atm/${id}`,
          {},
          { headers }
        );
        setCard(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, [id]);

  const handleWithdrawMoney = async () => {
    setFormErrors({});
    setError("");

    const errors = {};
    if (!amount.trim()) errors.amount = "Amount is required";
    if (!pin.trim()) errors.pin = "PIN is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/api/atm/withdrawal/${id}`,
        { amount, pin },
        { headers }
      );

      setIsWithdraw(true);
      setTimeout(() => {
        setIsWithdraw(false);
        if (response.status === 200) {
          showForm(false);
          alert("Money withdrawn.");
        }
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
      setIsWithdraw(true);
      setTimeout(() => {
        setIsWithdraw(false);
        setError("");
      }, 3000);
    }
  };

  if (!card)
    return <p className="text-center mt-10">Loading card details...</p>;

  return (
    <>
      {isWithdraw && (
        <StatusBadge
          status={error ? "error" : "loading"}
          message={error || "Processing your withdrawal..."}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="max-w-2xl mx-auto mt-10 bg-white border border-gray-300 p-6 rounded-2xl shadow-lg space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-zinc-800 mb-4">
          💳 ATM Card Details
        </h2>

        <div className="space-y-3 text-zinc-700 text-sm sm:text-base">
          <p className="flex items-center gap-2">
            <FaUser className="text-indigo-600" />
            <span className="font-semibold">Cardholder:</span> {card.user?.name}
          </p>
          <p className="flex items-center gap-2">
            <FaCreditCard className="text-indigo-600" />
            <span className="font-semibold">Card Number:</span>{" "}
            {card.card_no?.replace(/(\d{4})(?=\d)/g, "$1 ").trim()}
          </p>
          <p className="flex items-center gap-2">
            <FaCalendarAlt className="text-indigo-600" />
            <span className="font-semibold">Expiry:</span>{" "}
            {new Date(card.expiry).toLocaleDateString()}
          </p>
          <p className="flex items-center gap-2">
            <FaLock className="text-indigo-600" />
            <span className="font-semibold">CVV:</span> {card.cvv}
          </p>
          <p className="flex items-center gap-2">
            <FaTags className="text-indigo-600" />
            <span className="font-semibold">Card Type:</span> {card.card_type}
          </p>
          <p className="flex items-center gap-2">
            <FaUniversity className="text-indigo-600" />
            <span className="font-semibold">Account No:</span>{" "}
            {card.account?.accountNumber}
          </p>
        </div>

        <div className="flex justify-center pt-4">
          <button
            onClick={() => showForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition hover:scale-105"
          >
            💸 Withdraw Money
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="my-10 flex justify-center"
      >
        <div className="w-full max-w-4xl bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 p-8 rounded-2xl shadow-xl border border-gray-300">
          <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
            🎉 Your Virtual ATM Card
          </h3>
          <div className="flex justify-center">
            <AtmDisplay atmCard={card} />
          </div>
        </div>
      </motion.div>

      {form && (
        <div
          className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="w-[90%] md:w-[500px] bg-white rounded-xl p-6 shadow-lg relative">
            <h1 className="text-xl font-bold text-gray-700 mb-4">
              Withdraw Money
            </h1>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setFormErrors((prev) => ({ ...prev, amount: "" }));
                  }}
                  className={`w-full px-3 py-2 mt-1 rounded-lg bg-gray-300 text-black border-2 ${
                    formErrors.amount ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.amount && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.amount}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  PIN
                </label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    setFormErrors((prev) => ({ ...prev, pin: "" }));
                  }}
                  className={`w-full px-3 py-2 mt-1 rounded-lg bg-gray-300 text-black border-2 ${
                    formErrors.pin ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.pin && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.pin}</p>
                )}
              </div>
            </div>

            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={handleWithdrawMoney}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-lg shadow-md cursor-pointer transition-transform hover:scale-105 focus:ring-2 focus:ring-cyan-400"
              >
                Withdraw
              </button>
              <button
                onClick={() => showForm(false)}
                className="px-6 py-3 bg-gray-300 rounded-lg hover:bg-gray-400 text-black transition-transform hover:scale-105 duration-300 cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <button
              className="absolute top-2 right-3 text-gray-400 hover:text-red-500 text-2xl cursor-pointer"
              onClick={() => showForm(false)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AtmCardDetails;
