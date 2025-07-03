import { useEffect, useState } from "react";
import ApplyLoan from "../components/ApplyLoan";
import LoanList from "../components/LoanList";
import TipsAndFaqs from "../components/TipsAndFaqs ";
import LoanSummaryCard from "../components/LoanSummaryCard";
import EligibilityBox from "../components/EligibilityBox ";
import axios from "axios";
import { BsBank2 } from "react-icons/bs";
import { FaUniversity } from "react-icons/fa";
import { BsBarChartFill } from "react-icons/bs";
import { AiFillFileText } from "react-icons/ai";
import { RiQuestionAnswerFill } from "react-icons/ri";

const Loan = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showModel, setShowModel] = useState(false);
  const [totalLoan, setTotalLoan] = useState(0);
  const [accountBalance, setAccountBalance] = useState(0);
  const [nextEMI, setNextEMI] = useState(null);

  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/loan/get-all-loans",
          {},
          { headers }
        );

        const loans = response.data.data;
        const approvedLoans = loans.filter(
          (loan) => loan.status === "approved"
        );

        const totalAmount = approvedLoans.reduce(
          (sum, loan) => sum + loan.amount,
          0
        );
        setTotalLoan(totalAmount);

     
        const upcomingEMIs = approvedLoans.map((loan) => {
          const nextDueDate = new Date(loan.startDate);
          nextDueDate.setMonth(nextDueDate.getMonth() + loan.paidEMIs);

          return {
            emiAmount: loan.emiAmount,
            nextDueDate,
            purpose: loan.purpose,
            accountNumber: loan.account?.accountNumber || "N/A",
          };
        });

        if (upcomingEMIs.length > 0) {
          upcomingEMIs.sort((a, b) => a.nextDueDate - b.nextDueDate);
          setNextEMI(upcomingEMIs[0]);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchLoans();
  }, []);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/account/get-all-account",
          {},
          { headers }
        );
        const data = response.data.data;
        const totalBalance = Math.round(
          data.reduce((sum, acc) => sum + acc.amount, 0)
        );
        setAccountBalance(totalBalance);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAccounts();
  }, []);

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-gray-100">
      <aside className="w-full sm:w-64 bg-white shadow-md p-6 space-y-6 top-20 z-50 sm:h-screen">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FaUniversity size={24} />
          Loan Menu
        </h1>
        <ul className="space-y-3">
          <li
            className={`cursor-pointer font-medium hover:text-blue-500 flex items-center gap-2 ${
              activeTab === "dashboard" ? "text-blue-600 font-bold" : ""
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            <BsBarChartFill size={18} />
            Dashboard
          </li>

          <li
            className={`cursor-pointer font-medium hover:text-blue-500 flex items-center gap-2 ${
              activeTab === "applications" ? "text-blue-600 font-bold" : ""
            }`}
            onClick={() => setActiveTab("applications")}
          >
            <AiFillFileText size={20} />
            View Applications
          </li>

          <li
            className={`cursor-pointer font-medium hover:text-blue-500 flex items-center gap-2 ${
              activeTab === "tips" ? "text-blue-600 font-bold" : ""
            }`}
            onClick={() => setActiveTab("tips")}
          >
            <RiQuestionAnswerFill size={20} />
            Tips & FAQs
          </li>
        </ul>
      </aside>

      <main className="flex-1 p-8 space-y-8 pt-12 sm:pt-8 sm:ml-64 md:ml-10 lg:ml-10">
        {activeTab === "dashboard" && (
          <>
            <h1 className="text-3xl font-bold text-gray-800">
              🏦 Loan Dashboard
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <LoanSummaryCard
                title="Total Loan Taken"
                value={`₹ ${totalLoan}`}
              />
              <LoanSummaryCard
                title="Remaining Balance"
                value={`₹ ${accountBalance}`}
              />
              <LoanSummaryCard
                title="Next EMI Due"
                value={
                  nextEMI
                    ? `₹${
                        nextEMI.emiAmount
                      } on ${nextEMI.nextDueDate.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })} (A/C ${nextEMI.accountNumber})`
                    : "No EMI Scheduled"
                }
              />
            </div>
            <EligibilityBox />
            <button
              className="flex flex-row items-center gap-2 justify-center mx-auto bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-lg shadow-md cursor-pointer duration-300 ease-in-out transition-transform hover:scale-105 focus:ring-2 focus:ring-cyan-400"
              onClick={() => setShowModel(true)}
            >
              <BsBank2 /> Apply For Loan
            </button>
            {showModel && <ApplyLoan setShowModel={setShowModel} />}
          </>
        )}

        {activeTab === "applications" && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              📄 Your Loan Applications
            </h2>
            <LoanList />
          </>
        )}

        {activeTab === "tips" && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              💡 Loan Tips & FAQs
            </h2>
            <TipsAndFaqs />
          </>
        )}
      </main>
    </div>
  );
};

export default Loan;
