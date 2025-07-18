import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedAccountId } from "../store/accountSlice";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [user, setUser] = useState();
  const [accounts, setAccounts] = useState([]);
  const selectedAccountId = useSelector(
    (store) => store.account.selectedAccountId
  );
  const dispatch = useDispatch();
  const [showAccounts, setShowAccounts] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [data, setData] = useState("");

  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/account/get-all-account`,
          {},
          { headers }
        );
        const accData = response.data.data;
        const filteredData = accData.find(
          (acc) => acc._id === selectedAccountId
        );
        setData(filteredData);
        setAccounts(accData);
        if (accData.length > 0 && !selectedAccountId) {
          dispatch(setSelectedAccountId(accData[0]._id));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAccount();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/user/get-profile`,
          {},
          { headers }
        );
        setUser(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      if (!selectedAccountId) return;

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/account/get-all-transactions`,
          { account: selectedAccountId },
          { headers }
        );

        const data = response.data.data.slice(0, 4);
        setTransactions(data);

        let totalDebit = 0;
        let totalCredit = 0;

        data.forEach((txn) => {
          if (txn.transaction_type === "debit") {
            totalDebit += txn.amount;
          } else if (txn.transaction_type === "credit") {
            totalCredit += txn.amount;
          }
        });
        if (totalDebit === 0 && totalCredit === 0) {
          // Placeholder chart data
          setChartData([
            { name: "No Transactions", value: 1, color: "#e5e7eb" }, // Tailwind gray-200
          ]);
        } else {
          setChartData([
            { name: "Debit", value: totalDebit, color: "#f87171" },
            { name: "Credit", value: totalCredit, color: "#34d399" },
          ]);
        }

        // setChartData([
        //   { name: "Debit", value: totalDebit },
        //   { name: "Credit", value: totalCredit },
        // ]);
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, [selectedAccountId]);

  const COLORS = ["#f87171", "#34d399"];
  const selectedAccount = accounts.find((acc) => acc._id === selectedAccountId);

  return (
    <div className="p-6 space-y-8">
      <div
        className="bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg rounded-xl px-6 py-4 flex items-center justify-between cursor-pointer transition hover:brightness-105"
        onClick={() => setShowAccounts(!showAccounts)}
      >
        <h3 className="text-lg md:text-xl font-semibold">Your Bank Accounts</h3>
        {showAccounts ? <ChevronUp /> : <ChevronDown />}
      </div>

      {showAccounts && (
        <>
          {accounts.length === 0 ? (
            <p className="text-gray-500 italic">No accounts found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {accounts.map((acc) => (
                <div
                  key={acc._id}
                  onClick={() => dispatch(setSelectedAccountId(acc._id))}
                  className={`bg-white rounded-xl p-5 shadow-md transition transform hover:scale-105 cursor-pointer ${
                    selectedAccountId === acc._id
                      ? "ring-2 ring-indigo-500"
                      : "hover:ring-1 hover:ring-gray-300"
                  }`}
                >
                  <p className="text-sm text-gray-500">
                    Account No:{" "}
                    <span className="font-medium">{acc.accountNumber}</span>
                  </p>
                  <h3 className="text-xl font-bold text-gray-800 mt-2">
                    ₹{acc.amount?.toLocaleString()}
                  </h3>
                  <p className="text-sm text-gray-600 capitalize mt-1">
                    Type: {acc.account_type || "N/A"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-gray-800">
          👋 Welcome back, {user?.name}!
        </h2>
        <div className="bg-white p-6 shadow-lg rounded-xl">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            💰 Total Balance
          </h3>
          <p className="text-3xl font-bold text-green-600">
            ₹{selectedAccount?.amount?.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 shadow-lg rounded-xl">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
          📊 Transaction Overview
          <span className="text-sm text-gray-500">
            (Account ID: {data?.accountNumber})
          </span>
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              dataKey="value"
              label={({ name, percent }) =>
                chartData.length === 1 && name === "No Data"
                  ? "No Transactions"
                  : `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.fill || COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `₹${value}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-3">
          Recent Transactions
        </h3>
        {transactions.length === 0 ? (
          <p className="text-gray-500 italic">
            No transactions for this account.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Date</th>
                  <th className="p-2">Description</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn, i) => (
                  <tr key={i} className="border-t even:bg-gray-50">
                    <td className="p-2">
                      {new Date(txn.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-2">{txn.transaction_type}</td>
                    <td
                      className={`p-2 ${
                        txn.transaction_type === "debit"
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      ₹{txn.amount}
                    </td>
                    <td
                      className={`p-2 font-semibold ${
                        txn.isSuccess ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {txn.isSuccess ? "Success" : "Failed"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
