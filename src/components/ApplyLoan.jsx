import { useState } from "react";
import axios from "axios";
import StatusBadge from "./StatusBadge";

const ApplyLoan = ({ setShowModel }) => {
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [purpose, setPurpose] = useState("");
  const [agreed, setAgreed] = useState(false);

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  const selectedAccountId = localStorage.getItem("selectedAccountId");
  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const validate = () => {
    const newErrors = {};
    if (!amount) newErrors.amount = "Amount is required.";
    else if (Number(amount) <= 0) newErrors.amount = "Amount must be positive.";

    if (!duration) newErrors.duration = "Duration is required.";
    else if (Number(duration) <= 0)
      newErrors.duration = "Duration must be greater than 0.";

    if (!purpose.trim()) newErrors.purpose = "Purpose is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApplyLoan = async () => {
    if (!validate()) return;

    setStatus("loading");
    setStatusMessage("Applying for loan...");
    await new Promise((res) => setTimeout(res, 3000));

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/loan/apply-loan`,
        {
          amount,
          durationMonths: duration,
          purpose,
          account: selectedAccountId,
        },
        { headers }
      );

      setStatus(null);
      setErrors({});
      if (response.status === 200) {
        setShowModel(false);
        alert("Request has been sent for Loan.");
      }
    } catch (error) {
      console.log(error);
      setStatus("error");
      setStatusMessage("Failed to request for loan");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center min-h-screen"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      {status && <StatusBadge status={status} message={statusMessage} />}
      <div className="relative w-full max-w-lg bg-white p-4 rounded-xl shadow-lg">
        <h1 className="text-gray-700 font-bold text-lg tracking-wide mb-4">
          Enter Details For Loan
        </h1>

        <div className="mb-3">
          <p className="text-sm font-medium">Amount of Loan</p>
          <input
            type="number"
            className={`w-full bg-gray-300 mt-1 rounded-md border px-3 py-1.5 text-sm ${
              errors.amount ? "border-red-500" : "border-gray-300"
            }`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          {errors.amount && (
            <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
          )}
        </div>

        <div className="mb-3">
          <p className="text-sm font-medium">Duration of Loan (in Months)</p>
          <input
            type="number"
            className={`w-full bg-gray-300 mt-1 rounded-md border px-3 py-1.5 text-sm ${
              errors.duration ? "border-red-500" : "border-gray-300"
            }`}
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          {errors.duration && (
            <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
          )}
        </div>

        <div className="mb-3">
          <p className="text-sm font-medium">Purpose of Loan</p>
          <input
            type="text"
            className={`w-full bg-gray-300 mt-1 rounded-md border px-3 py-1.5 text-sm ${
              errors.purpose ? "border-red-500" : "border-gray-300"
            }`}
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          />
          {errors.purpose && (
            <p className="text-red-500 text-sm mt-1">{errors.purpose}</p>
          )}
        </div>

        <div className="flex items-start mt-2 mb-3 text-sm text-gray-600">
          <input
            type="checkbox"
            className="mt-1"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <p className="ml-2">
            I agree to the terms and conditions to apply for loan with 10%
            interest provided by <strong>Nestcash</strong>.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            className={`font-semibold text-sm px-4 py-2 rounded-md shadow transition-transform duration-300 ${
              agreed
                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 hover:scale-105 focus:ring-2 focus:ring-cyan-400"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            onClick={handleApplyLoan}
            disabled={!agreed}
          >
            Apply For Loan
          </button>

          <button
            className="bg-gray-300 font-semibold text-sm px-4 py-2 hover:bg-gray-400 rounded-md shadow"
            onClick={() => setShowModel(false)}
          >
            Cancel
          </button>

          <button
            className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl font-bold cursor-pointer"
            onClick={() => setShowModel(false)}
          >
            &times;
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplyLoan;
