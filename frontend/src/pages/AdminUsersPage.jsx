import { useEffect, useState } from "react";
import axios from "axios";
import UserPopup from "../components/UserPopup";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FaUsers } from "react-icons/fa";
import AdminLoans from "../components/AdminLoans";
import ApprovedLoan from "../components/ApprovedLoan";
import RejectedLoan from "../components/RejectedLoan";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [accountCounts, setAccountCounts] = useState({});
  const [loanCounts, setLoanCounts] = useState({});
  const [loanStatusCounts, setLoanStatusCounts] = useState({});
  const [latestLoanStatus, setLatestLoanStatus] = useState({});
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [showloans, setShowLoans] = useState(false);
  const [showApprovedLoan, setShowApprovedLoan] = useState(false);
  const [showRejectedLoan, setShowRejectedLoan] = useState(false);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [loans, setLoans] = useState([]);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/admin/get-all-loans",
          {},
          { headers }
        );
        setLoans(response.data.data || []);
      } catch (error) {
        console.error("Error fetching loans:", error);
      }
    };
    fetchLoans();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.post(
          "http://localhost:8080/api/admin/get-users",
          {},
          { headers }
        );

        const allUsers = res.data.data.users || [];
        const allLoans = res.data.data.loans || [];
        const statusCounts = res.data.data.loanStatusCounts || {};

        const nonAdmins = allUsers.filter((user) => user.role !== "admin");
        setUsers(nonAdmins);
        setFilteredUsers(nonAdmins);
        setLoanStatusCounts(statusCounts);

        const accountMap = {};
        const loanMap = {};
        const latestLoanMap = {};

        for (const user of nonAdmins) {
          try {
            const userDetails = await axios.post(
              `http://localhost:8080/api/admin/get-user/${user._id}`,
              {},
              { headers }
            );
            const accs = userDetails.data.data.accounts || [];
            accountMap[user._id] = accs.length;
          } catch (e) {
            accountMap[user._id] = 0;
          }
        }

        for (const loan of allLoans) {
          const uid = loan.user._id;

          // Only count pending loans
          if (loan.status === "pending") {
            loanMap[uid] = (loanMap[uid] || 0) + 1;
          }

          // Track latest loan status (store the string, not a boolean)
          if (
            !latestLoanMap[uid] ||
            new Date(loan.createdAt) > new Date(latestLoanMap[uid].createdAt)
          ) {
            latestLoanMap[uid] = {
              status: loan.status, // store "pending" | "approved" | "rejected"
              createdAt: loan.createdAt,
            };
          }
        }

        setAccountCounts(accountMap);
        setLoanCounts(loanMap); // now only pending counts
        setLatestLoanStatus(latestLoanMap);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleRowClick = async (userId) => {
    try {
      const res = await axios.post(
        `http://localhost:8080/api/admin/get-user/${userId}`,
        {},
        { headers }
      );
      setSelectedUser(res.data.data);
      setShowPopup(true);
    } catch (err) {
      console.error("Failed to fetch user details", err);
    }
  };

  const pieData = [
    {
      name: "No Accounts",
      value: filteredUsers.filter((u) => accountCounts[u._id] === 0).length,
    },
    {
      name: "1 Account",
      value: filteredUsers.filter((u) => accountCounts[u._id] === 1).length,
    },
    {
      name: "2+ Accounts",
      value: filteredUsers.filter((u) => accountCounts[u._id] > 1).length,
    },
  ];

  const renderLoanStatusBadge = (status) => {
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
      <span className={`bg-yellow-100 text-yellow-700 ${base}`}>Pending</span>
    );
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-6 mx-4">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <FaUsers className="text-blue-600" /> All Users
        </h1>
        <div className="bg-white px-4 py-2 rounded shadow text-gray-700 font-semibold">
          Total Users: {filteredUsers.length}
        </div>
      </div>

      <div className="mb-6 mx-4 max-w-md">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mx-4 mb-6">
        <div
          className="bg-blue-100 p-4 rounded shadow cursor-pointer"
          onClick={() => setShowApprovedLoan(true)}
        >
          <p className="text-sm text-blue-800 font-semibold">Approved Loans</p>
          <p className="text-2xl font-bold text-blue-900">
            {loanStatusCounts.approved || 0}
          </p>
        </div>
        <div
          className="bg-yellow-100 p-4 rounded shadow cursor-pointer"
          onClick={() => setShowLoans(true)}
        >
          <p className="text-sm text-yellow-800 font-semibold">Pending Loans</p>
          <p className="text-2xl font-bold text-yellow-900">
            {loanStatusCounts.pending || 0}
          </p>
        </div>
        <div
          className="bg-red-100 p-4 rounded shadow cursor-pointer"
          onClick={() => setShowRejectedLoan(true)}
        >
          <p className="text-sm text-red-800 font-semibold ">Rejected Loans</p>
          <p className="text-2xl font-bold text-red-900">
            {loanStatusCounts.rejected || 0}
          </p>
        </div>
      </div>

      {pieData.reduce((a, b) => a + b.value, 0) > 0 && (
        <div className="bg-white rounded shadow p-4 mx-4 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            📊 User Account Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="bg-white rounded shadow mx-4 p-4 overflow-auto">
        <table className="w-full border border-gray-200 text-left">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Status</th>
              <th className="p-3">Loans</th>
              <th className="p-3">Latest Loan Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 py-6">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, idx) => (
                <tr
                  key={user._id}
                  className={`cursor-pointer hover:bg-blue-50 ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } transition`}
                  onClick={() => handleRowClick(user._id)}
                >
                  <td className="p-3 font-medium text-gray-800">{user.name}</td>
                  <td className="p-3 text-gray-600">{user.email}</td>
                  <td className="p-3">
                    {user.isFrozen ? (
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                        Frozen
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center text-gray-700 font-semibold">
                    {loanCounts[user._id] || 0}
                  </td>
                  <td className="p-3">
                    {latestLoanStatus[user._id] ? (
                      renderLoanStatusBadge(latestLoanStatus[user._id].status)
                    ) : (
                      <span className="text-gray-500 text-sm">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showPopup && selectedUser && (
        <UserPopup
          user={selectedUser}
          onClose={() => {
            setShowPopup(false);
            setSelectedUser(null);
          }}
        />
      )}

      {showloans && <AdminLoans setShowLoans={setShowLoans} />}
      {showApprovedLoan && (
        <ApprovedLoan setShowApprovedLoan={setShowApprovedLoan} />
      )}
      {showRejectedLoan && (
        <RejectedLoan setShowRejectedLoan={setShowRejectedLoan} />
      )}
    </div>
  );
};

export default AdminUsersPage;
