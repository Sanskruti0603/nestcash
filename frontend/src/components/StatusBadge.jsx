// components/StatusBadge.jsx
import { motion } from "framer-motion";


const StatusBadge = ({ status, message }) => {
  if (!status) return null;

  const isError = status === "error";

  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white border p-4 rounded-lg shadow-md w-80 text-center border-gray-200">
        <div className="flex items-center justify-center mb-2">
          <svg
            className={`h-5 w-5 mr-2 ${!isError ? "animate-spin" : ""}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke={isError ? "red" : "green"}
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill={isError ? "red" : "green"}
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <p
            className={`text-sm font-medium ${
              isError ? "text-red-600" : "text-gray-800"
            }`}
          >
            {message}
          </p>
        </div>

        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${isError ? "bg-red-500" : "bg-green-500"}`}
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.5, ease: "linear" }}
          />
        </div>
      </div>
    </div>
  );
};

export default StatusBadge;
