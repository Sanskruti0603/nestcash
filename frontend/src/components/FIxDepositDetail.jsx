import axios from "axios";
import { motion } from "framer-motion";
import { useState } from "react";

import {
  FaMoneyBillWave,
  FaRegCalendarAlt,
  FaCreditCard,
  FaPiggyBank,
  FaCoins,
  FaHourglassEnd,
} from "react-icons/fa";
import { MdOutlineTrackChanges, MdPerson, MdDescription } from "react-icons/md";
import { TbPercentage } from "react-icons/tb";
import { AiOutlineFieldTime } from "react-icons/ai";
import { BsBookmarkCheck } from "react-icons/bs";
import { BiTimeFive } from "react-icons/bi";

const FixDepositDetail = ({ setShowModel, deposit }) => {
  const [isClaiming, setIsClaiming] = useState(false);
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const handleClaimFD = async (deposit) => {
    try {
      setIsClaiming(true);
      const id = deposit._id;
      const response = await axios.post(
        `http://localhost:8080/api/fd/claim-FD/${id}`,
        {},
        { headers }
      );
      setTimeout(() => {
        setIsClaiming(false);
        if (response.status === 200) {
          setShowModel(false);
          alert("FD has been claimed.");
        }
      }, 3000);
    } catch (error) {
      setIsClaiming(false);
      console.log(error);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 max-w-screen"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 rounded-2xl w-[80%] md:w-[35%] mx-auto mt-8 shadow-lg space-y-3 relative  hover:bg-gray-100"
      >
        <h1 className="font-bold text-gray-700 text-2xl mb-4 flex items-center gap-2">
          <MdDescription className="text-blue-500" />
          Fixed Deposit Details
        </h1>

        <p className="text-gray-800 flex items-center gap-2">
          <FaMoneyBillWave className="text-green-600" />
          <span className="font-semibold">Amount:</span> ₹{deposit?.amount}
        </p>

        <p className="text-gray-800 flex items-center gap-2">
          <MdOutlineTrackChanges className="text-blue-600" />
          <span className="font-semibold">Apply For:</span> {deposit?.apply_for}
        </p>

        <p className="text-gray-800 flex items-center gap-2">
          <FaCreditCard className="text-purple-600" />
          <span className="font-semibold">Account:</span> {deposit?.account}
        </p>

        <p className="text-gray-800 flex items-center gap-2">
          <FaRegCalendarAlt className="text-orange-500" />
          <span className="font-semibold">Created On:</span>{" "}
          {new Date(deposit?.date).toLocaleDateString("en-IN")}
        </p>

        <p className="text-gray-800 flex items-center gap-2">
          <AiOutlineFieldTime className="text-yellow-600" />
          <span className="font-semibold">Duration:</span>{" "}
          {deposit?.durationInMonths} month
          {deposit?.durationInMonths > 1 ? "s" : ""}
        </p>

        <p className="text-gray-800 flex items-center gap-2">
          <FaHourglassEnd className="text-red-500" />
          <span className="font-semibold">Maturity Date:</span>{" "}
          {new Date(deposit?.maturityDate).toLocaleDateString("en-IN")}
        </p>

        <p className="text-gray-800 flex items-center gap-2">
          <TbPercentage className="text-pink-500" />
          <span className="font-semibold">Interest Rate:</span>{" "}
          {deposit?.interestRate}% per day
        </p>

        <p className="text-gray-800 flex items-center gap-2">
          <FaCoins className="text-yellow-700" />
          <span className="font-semibold">Total Interest:</span> ₹
          {Number(deposit?.totalInterest).toFixed(2)}
        </p>

        <p className="text-gray-800 flex items-center gap-2">
          <FaPiggyBank className="text-teal-600" />
          <span className="font-semibold">Amount at Maturity:</span> ₹
          {Number(deposit?.totalAmountAtMaturity).toFixed(2)}
        </p>

        <p className="text-gray-800 flex items-center gap-2">
          <BsBookmarkCheck />
          <span className="font-semibold">Claimed:</span>{" "}
          {deposit?.isClaimed ? "✅ Yes" : "❌ No"}
        </p>

        <p className="text-gray-800 flex items-center gap-2">
          <BiTimeFive />
          <span className="font-semibold">Matured:</span>{" "}
          {deposit?.isMatured ? "✅ Yes" : "❌ No"}
        </p>

        <p className="text-gray-800 flex items-center gap-2">
          <MdPerson />
          <span className="font-semibold">User:</span>{" "}
          {deposit?.user?.name || "N/A"}
        </p>

        <div className="flex items-center justify-center">
          <button
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-lg shadow-md cursor-pointer duration-300 ease-in-out transition-transform hover:scale-105 focus:ring-2 focus:ring-cyan-400"
            onClick={() => handleClaimFD(deposit)}
          >
            Claim Fix Deposit Now
          </button>
        </div>

        <button
          className="top-4 right-4 absolute cursor-pointer text-2xl text-gray-500 hover:text-red-500"
          onClick={() => setShowModel(false)}
        >
          &times;
        </button>
      </motion.div>

      {isClaiming && (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-white w-80 rounded-lg shadow-lg border border-gray-200 p-5 relative flex flex-col items-center space-y-3">
            <div className="flex items-center space-x-3">
              <svg
                className="animate-spin h-5 w-5 text-green-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              <p className="text-gray-800 font-medium text-sm">
                Processing your Fixed Deposit claim...
              </p>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-green-500"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "linear" }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FixDepositDetail;
