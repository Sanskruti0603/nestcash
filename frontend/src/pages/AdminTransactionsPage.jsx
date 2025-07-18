import { useEffect, useState } from "react";
import axios from "axios";
import TransactionPopup from "../components/TransactionPopup";
import { FaSearch, FaExchangeAlt } from "react-icons/fa";

const AdminTransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTxns, setFilteredTxns] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/admin/get-all-transactions`,
          {},
          { headers }
        );
        const cleaned = res.data.data.filter(
          (txn) => txn.amount > 0 && txn.account
        );
        setTransactions(cleaned);
        setFilteredTxns(cleaned);
      } catch (error) {
        console.error("Failed to fetch transactions", error);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = transactions.filter((txn) => {
      return (
        txn.transaction_type.toLowerCase().includes(query) ||
        txn.account?.accountNumber?.toLowerCase().includes(query) ||
        txn.account?.user?.email?.toLowerCase().includes(query)
      );
    });
    setFilteredTxns(filtered);
  }, [searchQuery, transactions]);

  const handleRowClick = async (txnId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/account/get-transaction-byId/${txnId}`,
        {},
        { headers }
      );
      setSelectedTxn(res.data.data);
      setShowPopup(true);
    } catch (err) {
      console.error("Failed to fetch transaction details", err);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-6 mx-4">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <FaExchangeAlt className="text-blue-600" /> All Transactions
        </h1>
        <div className="bg-white px-4 py-2 rounded shadow flex items-center gap-2">
          <span className="font-semibold text-gray-600">Total:</span>
          <span className="text-blue-600 font-bold">{transactions.length}</span>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 mx-4 max-w-md">
        <div className="relative">
          <FaSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by email, account number, or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow p-4 mx-4 overflow-x-auto">
        <table className="w-full text-left border border-gray-200">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="p-3">Type</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Account</th>
              <th className="p-3">User Email</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTxns.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 py-6">
                  No transactions found.
                </td>
              </tr>
            ) : (
              filteredTxns.map((txn, index) => (
                <tr
                  key={txn._id}
                  onClick={() => handleRowClick(txn._id)}
                  className={`cursor-pointer ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition`}
                >
                  <td className="p-3 capitalize">
                    <span
                      className={`px-2 py-1 text-sm rounded-full font-semibold ${
                        txn.transaction_type === "debit"
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {txn.transaction_type}
                    </span>
                  </td>
                  <td className="p-3 font-medium text-gray-700">
                    ₹{txn.amount.toLocaleString()}
                  </td>
                  <td className="p-3">{txn.account.accountNumber}</td>
                  <td className="p-3">{txn.account.user?.email || "N/A"}</td>
                  <td className="p-3">
                    {new Date(txn.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    {txn.isSuccess ? (
                      <span className="text-green-600 font-semibold">
                        Success
                      </span>
                    ) : (
                      <span className="text-red-500 font-semibold">Failed</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showPopup && selectedTxn && (
        <TransactionPopup
          txn={selectedTxn}
          onClose={() => {
            setShowPopup(false);
            setSelectedTxn(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminTransactionsPage;
