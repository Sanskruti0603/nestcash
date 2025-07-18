import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedAccountId } from "../store/accountSlice";
import StatusBadge from "./StatusBadge";
import { AiOutlinePlus } from "react-icons/ai";

const AddFD = ({ setAddFD }) => {
  const [duration, setDuration] = useState("");
  const [amount, setAmount] = useState("");
  const [applyFor, setApplyFor] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [status, setStatus] = useState(null); // "loading" | "error" | null
  const [statusMessage, setStatusMessage] = useState("");

  const selectedAccountId = localStorage.getItem("selectedAccountId");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const validateForm = () => {
    const errors = {};
    if (!amount.trim()) errors.amount = "Amount is required";
    if (!applyFor.trim()) errors.applyFor = "Apply For is required";
    if (!duration.trim()) errors.duration = "Duration is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddFd = async () => {
    if (!validateForm()) return;

    setStatus("loading");
    setStatusMessage("Creating Fixed Deposit...");
    await new Promise((res) => setTimeout(res, 3000));

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/fd/add-FD`,
        {
          account: selectedAccountId,
          amount,
          apply_for: applyFor,
          duration,
        },
        { headers }
      );

      if (response.status === 200) {
        setStatus(null);
        setAddFD(false);
        alert("FD has been created.");
      }
    } catch (error) {
      setStatus("error");
      setStatusMessage(error.response?.data?.message || "Failed to create FD");
      setTimeout(() => {
        setStatus(null);
        setStatusMessage("");
      }, 3000);
    }
  };

  return (
    <>
      <div
        className="fixed z-50 flex inset-0 items-center justify-center max-w-screen"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <div className="w-[80%] md:w-[35%] bg-white rounded-xl p-5 shadow-lg relative">
          {status && <StatusBadge status={status} message={statusMessage} />}
          <h1 className="font-bold  text-gray-700 tracking-wider text-xl">
            Enter Fixed Deposit Details
          </h1>

          <div className="flex flex-col mt-2 space-y-2">
            <p className="text-md font-semibold">Amount:</p>
            <input
              type="number"
              className={`bg-gray-300 text-black rounded-lg w-[90%] p-1 px-2 border-2 ${
                formErrors.amount ? "border-red-400" : "border-gray-300"
              }`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            {formErrors.amount && (
              <p className="text-red-500 text-sm border-red-500">
                {formErrors.amount}
              </p>
            )}
          </div>

          <div className="flex flex-col mt-2 space-y-2">
            <p className="text-md font-semibold">Apply For:</p>
            <input
              type="text"
              className={`bg-gray-300 text-black rounded-lg w-[90%] p-1 px-2 border-2 ${
                formErrors.applyFor ? "border-red-400" : "border-gray-300"
              }`}
              value={applyFor}
              onChange={(e) => setApplyFor(e.target.value)}
            />

            {formErrors.applyFor && (
              <p className="text-red-500 text-sm border-red-500">
                {formErrors.applyFor}
              </p>
            )}
          </div>

          <div className="flex flex-col mt-2 space-y-2">
            <p className="text-md font-semibold">Duration (in months):</p>
            <input
              type="number"
              className={`bg-gray-300 text-black rounded-lg w-[90%] p-1 px-2 border-2 ${
                formErrors.duration ? "border-red-400" : "border-gray-300"
              }`}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />

            {formErrors.duration && (
              <p className="text-red-500 text-sm border-red-500">
                {formErrors.duration}
              </p>
            )}
          </div>

          <div className="flex justify-center items-center gap-2 pt-2">
            <button
              onClick={handleAddFd}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-lg shadow-md cursor-pointer duration-300 ease-in-out transition-transform hover:scale-105 focus:ring-2 focus:ring-cyan-400"
            >
              Add FD
            </button>
            <button
              onClick={() => setAddFD(false)}
              className="px-6 py-3 bg-gray-300 rounded-lg hover:bg-gray-400 text-black transition-transform hover:scale-105 duration-300 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl cursor-pointer font-bold"
            onClick={() => setAddFD(false)}
          >
            &times;
          </button>
        </div>
      </div>
    </>
  );
};

export default AddFD;
