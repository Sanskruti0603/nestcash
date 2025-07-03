import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import TransactionDetail from "../components/TransactionDetail";
import StatusBadge from "../components/StatusBadge";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [successFailedData, setSuccessFailedData] = useState([]);
  const [chartData, setChartData] = useState([]);

  const [downloading, setDownloading] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const downloadPDF = async () => {
    
    setStatus("loading");
    setStatusMessage("Downloading Transactions...");

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const doc = new jsPDF("landscape");
    doc.setFontSize(18);
    doc.text("Transaction Report", 14, 20);

    const tableColumn = [
      "Txn ID",
      "Date & Time",
      "Account No.",
      "Type",
      "Amount (₹)",
      "Status",
      "Remark",
    ];

    const tableRows = transactions.map((txn) => [
      txn._id.slice(-6),
      new Date(txn.createdAt).toLocaleString(),
      txn.accountNumber || "N/A",
      txn.transaction_type.toUpperCase(),
      txn.amount,
      txn.isSuccess ? "Success" : "Failed",
      txn.remark || "-",
    ]);

    autoTable(doc, {
      startY: 30,
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [59, 130, 246] },
    });

    doc.save("Transaction_Report.pdf");

    setStatus(null);
    setTimeout(() => setShowSuccessBadge(false), 3000);
  };

  const selectedAccountId = useSelector(
    (store) => store.account.selectedAccountId
  );
  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/account/get-all-transactions",
          { account: selectedAccountId },
          { headers }
        );

        const data = response.data.data;
        const successFailed = [
          { name: "Success", value: data.filter((t) => t.isSuccess).length },
          { name: "Failed", value: data.filter((t) => !t.isSuccess).length },
        ];
        setSuccessFailedData(successFailed);
        setTransactions(data);

        const grouped = {};
        data.forEach((transaction) => {
          const date = new Date(transaction.createdAt).toLocaleDateString();
          if (!grouped[date]) grouped[date] = { date, debit: 0, credit: 0 };
          if (transaction.transaction_type === "credit")
            grouped[date].credit += transaction.amount;
          if (transaction.transaction_type === "debit")
            grouped[date].debit += transaction.amount;
        });

        setChartData(Object.values(grouped));
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, []);

  const [loading, setLoading] = useState(false);
  const [transaction, setTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleRowClick = async (t) => {
    setLoading(true);
    setShowModal(true);
    try {
      const response = await axios.post(
        `http://localhost:8080/api/account/get-transaction-byId/${t._id}`,
        {},
        { headers }
      );
      setTransaction(response.data.data);
    } catch (error) {
      console.log("Error fetching details", error);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">
          📊 Transaction Dashboard
        </h2>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-6"
        >
          <div className="bg-white p-4 rounded-2xl shadow-lg border">
            <h3 className="text-lg font-semibold text-center text-gray-700 mb-3">
              💰 Credit vs Debit (by Date)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                <Bar
                  dataKey="credit"
                  fill="#3b82f6"
                  name="Credit ₹"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="debit"
                  fill="#f97316"
                  name="Debit ₹"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

       
          <div className="bg-white p-4 rounded-2xl shadow-lg border">
            <h3 className="text-lg font-semibold text-center text-gray-700 mb-3">
              ✅ Success vs ❌ Failed Transactions
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={successFailedData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  dataKey="value"
                >
                  <Cell fill="#14b8a6" />
                  <Cell fill="#f43f5e" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mt-10 bg-white p-6 rounded-2xl shadow-lg border"
        >
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            📄 Transaction History
          </h3>

          {transactions.length === 0 ? (
            <div className="text-gray-500 italic text-center p-4">
              No transactions available for this account.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-gray-600">
                <thead className="bg-gray-100 text-xs uppercase tracking-wider text-gray-700">
                  <tr>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Description</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, i) => (
                    <tr
                      key={i}
                      onClick={() => handleRowClick(transaction)}
                      className={`cursor-pointer border-b ${
                        i % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-gray-100 transition`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </td>
                      <td
                        className={`px-6 py-4 font-semibold uppercase ${
                          transaction.transaction_type === "credit"
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {transaction.transaction_type}
                      </td>
                      <td
                        className={`px-6 py-4 font-bold ${
                          transaction.amount <= 0
                            ? "text-red-600"
                            : "text-green-700"
                        }`}
                      >
                        ₹ {transaction.amount}
                      </td>
                      <td className="px-6 py-4">{transaction.remark}</td>
                      <td
                        className={`px-6 py-4 font-medium uppercase ${
                          transaction.isSuccess
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {transaction.isSuccess ? "Success" : "Failed"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {transactions.length >= 1 && (
          <button
            onClick={downloadPDF}
            className=" bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-lg shadow-md cursor-pointer flex items-center justify-center mt-4 mx-auto duration-300 ease-in-out transition-transform hover:scale-105 focus:ring-2 focus:ring-cyan-400"
          >
            Click to download transactions
          </button>
        )}
      </div>

      {status && <StatusBadge status={status} message={statusMessage} />}

      <TransactionDetail
        showModal={showModal}
        onClose={() => {
          setShowModal(false);
          setTransaction(null);
        }}
        loading={loading}
        transaction={transaction}
      />
    </>
  );
};

export default Transactions;
