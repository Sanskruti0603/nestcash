import axios from "axios";
import { useEffect, useState } from "react";
import { FaCalendarAlt, FaMoneyBillWave } from "react-icons/fa";
import {
  MdOutlinePending,
  MdCheckCircle,
  MdCancel,
  MdDescription,
} from "react-icons/md";
import LoanDetail from "./LoanDetail";
import { FaFileInvoiceDollar } from "react-icons/fa";

const LoanList = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  // track both modal visibility and which loan is selected
  const [loanModal, setLoanModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);

  const token = localStorage.getItem("token");
  const selectedAccountId = localStorage.getItem("selectedAccountId");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/loan/get-loans",
          { account: selectedAccountId },
          { headers }
        );
        setLoans(response.data.data);
      } catch (error) {
        console.error("Error fetching loans:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, [selectedAccountId]);

  const renderStatusIcon = (status) => {
    if (status === "approved")
      return <MdCheckCircle className="inline text-green-600 mr-1" />;
    if (status === "rejected")
      return <MdCancel className="inline text-red-600 mr-1" />;
    return <MdOutlinePending className="inline text-yellow-600 mr-1" />;
  };

  const handleLoanClick = (loan) => {
    setSelectedLoan(loan);
    setLoanModal(true);
  };

  const handleCloseModal = () => {
    setLoanModal(false);
    setSelectedLoan(null);
  };

  return (
    <div className="bg-white min-h-screen p-4">
      <h1 className="text-2xl font-bold text-gray-700 mb-4">
        Your Loan History
      </h1>

      {loading ? (
        <div className="text-center text-gray-500">Loading loans...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loans.length > 0 ? (
            loans.map((loan) => (
              <div
                key={loan._id}
                className="bg-gray-50 shadow-md p-5 rounded-xl border border-gray-200 hover:shadow-lg cursor-pointer"
                onClick={() => handleLoanClick(loan)}
              >
                <p className="text-sm text-gray-500 mb-2 flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  Applied on:{" "}
                  <span className="font-medium ml-1">
                    {new Date(loan.createdAt).toLocaleDateString()}
                  </span>
                </p>

                <p className="text-lg font-semibold text-gray-800 mb-1 flex items-center">
                  <FaMoneyBillWave className="mr-2 text-green-600" />₹{" "}
                  {loan.amount}
                </p>

                <p className="text-sm font-bold uppercase tracking-wide mb-1 flex items-center">
                  {renderStatusIcon(loan.status)}
                  <span
                    className={
                      loan.status === "approved"
                        ? "text-green-600"
                        : loan.status === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }
                  >
                    {loan.status || "pending"}
                  </span>
                </p>

                <p className="text-sm text-gray-600 flex items-center">
                  <MdDescription className="mr-2 text-gray-500" />
                  {loan.purpose}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center text-center bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <FaFileInvoiceDollar className="text-4xl text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-1">
                No Loans Found
              </h3>
              <p className="text-gray-500 text-sm">
                You haven’t applied for any loans yet. Apply now to get started!
              </p>
            </div>
          )}
        </div>
      )}

      {loanModal && selectedLoan && (
        <LoanDetail loan={selectedLoan} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default LoanList;
