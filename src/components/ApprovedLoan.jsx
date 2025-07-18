import axios from "axios";
import { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaMoneyBillWave,
  FaCheckCircle,
  FaUser,
} from "react-icons/fa";
import { AiOutlineFieldTime } from "react-icons/ai";
import { MdOutlineEmail, MdDateRange } from "react-icons/md";
import { BsGraphUp, BsFileText } from "react-icons/bs";
import { motion } from "framer-motion";

const ApprovedLoan = ({ setShowApprovedLoan }) => {
  const [loans, setLoans] = useState([]);
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/admin/get-all-loans`,
          {},
          { headers }
        );
        setLoans(response.data.data.approvedLoan || []);
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto relative"
      >
        <button
          className="absolute top-2 right-4 text-gray-500 hover:text-red-800 cursor-pointer text-2xl"
          onClick={() => setShowApprovedLoan(false)}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FaCheckCircle className="text-green-600" />
          Approved Loans
        </h2>

        {loans.length === 0 ? (
          <p className="text-center text-gray-500">No approved loans found.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {loans.map((loan) => (
              <div
                key={loan._id}
                className="bg-gray-100 p-4 rounded-lg shadow border border-gray-200 space-y-2"
              >
                <div className="flex items-center text-sm text-gray-700">
                  <FaUser className="mr-2 text-gray-500" />
                  <span className="font-semibold">
                    {loan.user?.name || "N/A"}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <MdOutlineEmail className="mr-2 text-gray-500" />
                  {loan.user?.email || "N/A"}
                </div>

                <div className="flex items-center text-sm text-gray-700">
                  <FaCalendarAlt className="mr-2 text-gray-500" />
                  Applied on:{" "}
                  <span className="ml-1 font-medium">
                    {new Date(loan.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-700">
                  <FaMoneyBillWave className="mr-2 text-green-600" />
                  Amount: ₹ {loan.amount}
                </div>

                <div className="flex items-center text-sm text-gray-700">
                  <AiOutlineFieldTime className="mr-2 text-blue-600" />
                  Duration: {loan.durationMonths} months
                </div>

                <div className="flex items-center text-sm text-gray-700">
                  <BsGraphUp className="mr-2 text-purple-600" />
                  Interest: {loan.interestRate}%
                </div>

                <div className="flex items-center text-sm text-gray-700">
                  <BsFileText className="mr-2 text-gray-600" />
                  Purpose: {loan.purpose}
                </div>

                <div className="flex items-center text-sm text-gray-700">
                  <MdDateRange className="mr-2 text-teal-600" />
                  Start Date:{" "}
                  {loan.startDate
                    ? new Date(loan.startDate).toLocaleDateString()
                    : "N/A"}
                </div>

                <div className="text-green-700 text-sm font-semibold flex items-center mt-2">
                  <FaCheckCircle className="mr-2" />
                  Status: Approved
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ApprovedLoan;
