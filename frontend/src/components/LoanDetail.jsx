import { FaCalendarAlt, FaMoneyBillWave } from "react-icons/fa";
import { AiOutlineFieldTime } from "react-icons/ai";
import { BsGraphUp } from "react-icons/bs";
import {
  MdDescription,
  MdDateRange,
  MdCheckCircle,
  MdCancel,
  MdOutlinePending,
  MdClose,
  MdPerson,
  MdEmail,
} from "react-icons/md";
import { FiCreditCard } from "react-icons/fi";
import axios from "axios";
import { useState } from "react";
import StatusBadge from "./StatusBadge";
import { MdDelete } from "react-icons/md";
import { motion } from "framer-motion";
import { RiMoneyDollarCircleFill } from "react-icons/ri";

const LoanDetail = ({ loan, onClose }) => {
  // Compute dates
  const startDate = new Date(loan.startDate);
  const endDate = new Date(startDate);
  endDate.setMonth(startDate.getMonth() + loan.durationMonths);

  const remainingMonths = loan.durationMonths - (loan.paidEMIs || 0);
  const remainingAmount = remainingMonths * loan.emiAmount;

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  const handlePayEmi = async () => {
    setStatus("loading");
    setStatusMessage("Paying Your EMI...");
    await new Promise((res) => setTimeout(res, 3000));
    try {
      const response = await axios.post(
        `http://localhost:8080/api/loan/pay-emi/${loan._id}`,
        {},
        { headers }
      );
      setStatus(null);
      setErrors({});
      console.log(response);
      if (response.status === 200) {
        alert("Emi is paid");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setStatusMessage("Failed to Pay EMI");
    }
  };

  const handleDeleteLoan = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/loan/delete-loan/${loan._id}`,
        {
          headers,
        }
      );
      if (response.status === 200) {
        alert("Loan Request is deleted.");
      }
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const StatusIcon = () => {
    if (loan.status === "approved")
      return <MdCheckCircle className="text-green-600" />;
    if (loan.status === "rejected")
      return <MdCancel className="text-red-600" />;
    return <MdOutlinePending className="text-yellow-600" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 sm:p-4 rounded-lg shadow-lg w-11/12 sm:w-full max-w-md relative"
      >
        {status && <StatusBadge status={status} message={statusMessage} />}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-700 text-2xl cursor-pointer"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
          <MdPerson /> {loan.user?.name}
        </h2>
        <div className="flex items-center text-gray-600 mb-4">
          <MdEmail /> {loan.user?.email}
        </div>

        <div className="space-y-4 text-gray-700">
          <Row
            icon={<FaMoneyBillWave className="text-green-600" />}
            label="Amount"
            value={`₹ ${loan.amount}`}
          />

          {loan.status !== "rejected" && (
            <>
              <Row
                icon={<FiCreditCard className="text-blue-600" />}
                label="EMI Amount"
                value={`₹ ${loan.emiAmount}`}
              />
              <Row
                icon={<AiOutlineFieldTime className="text-red-600" />}
                label="Remaining Months"
                value={remainingMonths}
              />
              <Row
                icon={<FaMoneyBillWave className="text-red-600" />}
                label="Remaining Amount"
                value={`₹ ${remainingAmount}`}
              />
            </>
          )}

          <Row
            icon={<BsGraphUp className="text-purple-600" />}
            label="Interest Rate"
            value={`${loan.interestRate}%`}
          />
          <Row
            icon={<AiOutlineFieldTime className="text-blue-600" />}
            label="Duration"
            value={`${loan.durationMonths} months`}
          />
          <Row
            icon={<MdDateRange className="text-teal-600" />}
            label="Start Date"
            value={startDate.toLocaleDateString()}
          />
          <Row
            icon={<MdDateRange className="text-pink-600" />}
            label="End Date"
            value={endDate.toLocaleDateString()}
          />
          <Row
            icon={<FaCalendarAlt className="text-gray-600" />}
            label="Applied On"
            value={new Date(loan.createdAt).toLocaleDateString()}
          />
          <Row
            icon={<MdDescription className="text-gray-600" />}
            label="Purpose"
            value={loan.purpose}
          />
          <Row
            icon={<StatusIcon />}
            label="Status"
            value={loan.status}
            valueClass={
              loan.status === "approved"
                ? "text-green-600"
                : loan.status === "rejected"
                ? "text-red-600"
                : "text-yellow-600"
            }
          />

          <div className="mt-6 flex justify-center gap-4">
            {loan.status === "approved" && (
              <button
                onClick={handlePayEmi}
                className="flex flex-row gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-lg shadow-md cursor-pointer duration-300 ease-in-out transition-transform hover:scale-105 focus:ring-2 focus:ring-cyan-400"
              >
                <RiMoneyDollarCircleFill size={20} /> Pay EMI Now
              </button>
            )}
            {(loan.status === "rejected" || loan.status === "pending") && (
              <button
                onClick={handleDeleteLoan}
                className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg shadow-md cursor-pointer duration-300 ease-in-out transition-transform hover:scale-105 focus:ring-2 focus:ring-red-400"
              >
                <MdDelete size={20} />
                Delete
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Row = ({ icon, label, value, valueClass = "" }) => (
  <div className="flex justify-between items-center text-base sm:text-sm">
    <span className="flex items-center gap-2">
      {icon}
      {label}
    </span>
    <span className={`font-semibold ${valueClass}`}>{value}</span>
  </div>
);

export default LoanDetail;
