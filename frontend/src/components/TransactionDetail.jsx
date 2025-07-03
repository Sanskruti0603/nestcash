import { motion } from "framer-motion";
const TransactionDetail = ({ showModal, onClose, loading, transaction }) => {
  if (!showModal) return null;
  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center z-50"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md relative t hover:bg-gray-100"
        >
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl font-bold cursor-pointer"
            onClick={onClose}
          >
            &times;
          </button>

          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : transaction ? (
            <div className="text-sm space-y-2 text-gray-700">
              <h2 className="text-xl font-bold mb-4 text-indigo-700">
                Transaction Details
              </h2>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(transaction.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Type:</strong> {transaction.transaction_type}
              </p>
              <p>
                <strong>Amount:</strong> ₹ {transaction.amount}
              </p>
              <p>
                <strong>Description:</strong> {transaction.remark}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {transaction.isSuccess ? "✅ Success" : "❌ Failed"}
              </p>
              <p>
                <strong>Account Holder:</strong> {transaction.user?.name}
              </p>
              <p>
                <strong>Email:</strong> {transaction.user?.email}
              </p>
              <p>
                <strong>Account Number:</strong>{" "}
                {transaction.account?.accountNumber}
              </p>
            </div>
          ) : (
            <p className="text-center text-red-500">
              Failed to load transaction.
            </p>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default TransactionDetail;
