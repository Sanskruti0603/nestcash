import { motion } from "framer-motion";
const TransactionPopup = ({ txn, onClose }) => {
  if (!txn) return null;

  return (
    <div
      className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg relative"
      >
        <button
          className="absolute top-2 right-4 text-gray-500 hover:text-red-800 text-2xl cursor-pointer"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Transaction Details
        </h2>

        <div className="space-y-2 text-sm text-gray-700">
          <p>
            <strong>Type:</strong> {txn.transaction_type}
          </p>
          <p>
            <strong>Amount:</strong> ₹{txn.amount}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {txn.isSuccess ? (
              <span className="text-green-600 font-semibold">Success</span>
            ) : (
              <span className="text-red-500 font-semibold">Failed</span>
            )}
          </p>
          <p>
            <strong>Date:</strong> {new Date(txn.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Account Number:</strong> {txn.account?.accountNumber}
          </p>
          <p>
            <strong>Account Type:</strong> {txn.account?.account_type}
          </p>
          <p>
            <strong>User Email:</strong> {txn.user?.email}
          </p>
          <p>
            <strong>User Name:</strong> {txn.user?.name}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default TransactionPopup;
