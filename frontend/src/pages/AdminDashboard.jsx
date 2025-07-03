import { useEffect, useState } from "react";
import axios from "axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { FaUsers, FaWallet, FaExchangeAlt, FaRupeeSign } from "react-icons/fa";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.post(
          "http://localhost:8080/api/admin/stats",
          {},
          { headers }
        );
        setStats(res.data.data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await axios.post(
          "http://localhost:8080/api/admin/get-users",
          {},
          { headers }
        );
        const data = res.data?.data?.users;
        console.log(res);
        setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch users", error);
        setUsers([]); // fallback to avoid crash
      }
    };

    const fetchTransactions = async () => {
      try {
        const res = await axios.post(
          "http://localhost:8080/api/admin/get-all-transactions",
          {},
          { headers }
        );
        const allTxns = res.data.data || [];
        setTransactions(allTxns.slice(0, 5));

        const grouped = {};
        allTxns.forEach((txn) => {
          const date = new Date(txn.createdAt).toLocaleDateString();
          if (!grouped[date]) grouped[date] = { date, debit: 0, credit: 0 };
          txn.transaction_type === "debit"
            ? (grouped[date].debit += txn.amount)
            : (grouped[date].credit += txn.amount);
        });

        setChartData(Object.values(grouped).slice(-7));
      } catch (error) {
        console.error("Failed to fetch transactions", error);
      }
    };

    fetchStats();
    fetchUsers();
    fetchTransactions();
  }, []);

  const StatCard = ({ title, value, color, icon: Icon }) => (
    <div
      className={`bg-white p-5 rounded-xl shadow-md flex items-center gap-4 border-t-4 ${color}`}
    >
      <div className="text-3xl text-gray-600">
        <Icon />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        📊 Admin Dashboard
      </h1>

   
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats?.users || 0}
          color="border-blue-500"
          icon={FaUsers}
        />
        <StatCard
          title="Total Accounts"
          value={stats?.accounts || 0}
          color="border-green-500"
          icon={FaWallet}
        />
        <StatCard
          title="Total Transactions"
          value={stats?.transactions || 0}
          color="border-yellow-500"
          icon={FaExchangeAlt}
        />
        <StatCard
          title="Total Balance"
          value={`₹${stats?.totalBalance?.toLocaleString() || 0}`}
          color="border-purple-500"
          icon={FaRupeeSign}
        />
      </div>

    
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          📈 Transaction Trends (Last 7 days)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="creditColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="debitColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(val) => `₹${val}`} />
            <Legend />
            <CartesianGrid strokeDasharray="3 3" />
            <Area
              type="monotone"
              dataKey="credit"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#creditColor)"
            />
            <Area
              type="monotone"
              dataKey="debit"
              stroke="#ef4444"
              fillOpacity={1}
              fill="url(#debitColor)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          👥 Recent Users
        </h2>
        <table className="w-full text-left border border-gray-200 rounded overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Created</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter((user) => user.role !== "admin")
              .slice(0, 5)
              .map((user) => (
                <tr key={user._id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        user.isFrozen
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {user.isFrozen ? "Frozen" : "Active"}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Recent Transactions */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          💰 Recent Transactions
        </h2>
        <table className="w-full text-left border border-gray-200 rounded overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Type</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Account No</th>
              <th className="p-2">Date</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn._id} className="border-t hover:bg-gray-50">
                <td className="p-2 capitalize">{txn.transaction_type}</td>
                <td className="p-2">₹{txn.amount.toLocaleString()}</td>
                <td className="p-2">{txn.account?.accountNumber || "-"}</td>
                <td className="p-2">
                  {new Date(txn.createdAt).toLocaleDateString()}
                </td>
                <td className="p-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      txn.isSuccess
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {txn.isSuccess ? "Success" : "Failed"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
