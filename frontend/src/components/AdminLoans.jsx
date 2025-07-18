import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const AdminLoans = ({ setShowLoans }) => {
  const [loans, setLoans] = useState([]);
  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/admin/get-all-loans`,
          {},
          { headers }
        );
        setLoans(response.data.data.loans || []);
      } catch (error) {
        console.error("Error fetching loans:", error);
      }
    };
    fetchLoans();
  }, []);

  const updateLoanStatus = async (loanId, status) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/update-loan-status/${loanId}`,
        { status },
        { headers }
      );
      console.log(res);
      setLoans((prev) =>
        prev.map((loan) => (loan._id === loanId ? { ...loan, status } : loan))
      );
    } catch (err) {
      console.error("Error updating loan status:", err);
      alert("Failed to update loan status.");
    }
  };

  const renderStatus = (status) => {
    const base = "px-3 py-1 rounded-full text-sm font-semibold";
    if (status === "approved")
      return (
        <span className={`bg-green-100 text-green-700 ${base}`}>Approved</span>
      );
    if (status === "rejected")
      return (
        <span className={`bg-red-100 text-red-700 ${base}`}>Rejected</span>
      );
    return (
      <span className={`bg-yellow-100 text-yellow-700 ${base}`}>Requested</span>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-7xl max-h-[90vh] overflow-y-auto relative"
      >
        <button
          className="absolute top-2 right-4 text-gray-500 hover:text-red-800 cursor-pointer text-2xl"
          onClick={() => setShowLoans(false)}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          🧾 User Loan Requests
        </h2>

        <div className="overflow-auto">
          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 text-sm font-semibold">
              <tr>
                <th className="px-4 py-3 text-left">User Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Purpose</th>
                <th className="px-4 py-3 text-left">Applied On</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 text-sm">
              {loans.length > 0 ? (
                loans.map((loan, idx) => (
                  <tr
                    key={loan._id}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-4 py-3">
                      {loan.user?.name || "Unknown"}
                    </td>
                    <td className="px-4 py-3">{loan.user?.email || "N/A"}</td>
                    <td className="px-4 py-3 font-semibold">₹ {loan.amount}</td>
                    <td className="px-4 py-3">{loan.purpose}</td>
                    <td className="px-4 py-3">
                      {new Date(loan.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">{renderStatus(loan.status)}</td>
                    <td className="px-4 py-3 space-x-2">
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm "
                        disabled={loan.status !== "pending"}
                        onClick={() => updateLoanStatus(loan._id, "approved")}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm "
                        disabled={loan.status !== "pending"}
                        onClick={() => updateLoanStatus(loan._id, "rejected")}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-6 text-gray-500 font-medium"
                  >
                    No loan requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLoans;
