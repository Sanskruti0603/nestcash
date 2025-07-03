import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import FixDepositDetail from "../components/FIxDepositDetail";
import AddFD from "../components/AddFD";
import { useSelector } from "react-redux";
import { AiOutlinePlus } from "react-icons/ai";

// React Icons
import {
  FaMoneyBillWave,
  FaRegCalendarAlt,
  FaPlusCircle,
} from "react-icons/fa";
import {
  MdOutlineTrackChanges,
  MdListAlt,
  MdSentimentDissatisfied,
} from "react-icons/md";
import { FaHourglassEnd } from "react-icons/fa";

import { AiOutlineFieldTime } from "react-icons/ai";

const FixDeposit = () => {
  const [fixDeposits, setFixDeposits] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [deposit, setDeposit] = useState();
  const [addFD, setAddFD] = useState(false);

  const selectedAccountId = useSelector(
    (store) => store.account.selectedAccountId
  );
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const fetchFD = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/fd/get-all-FD",
          { account: selectedAccountId },
          { headers }
        );
        setFixDeposits(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFD();
  }, []);

  const handleFixDeposit = async (fd) => {
    setShowModel(true);
    try {
      const id = fd._id;
      const response = await axios.post(
        `http://localhost:8080/api/fd/get-FD/${id}`,
        {},
        { headers }
      );
      console.log(response.data.data);
      setDeposit(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="bg-white mx-auto p-8 rounded-2xl shadow-xl max-w-4xl border border-gray-200">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2 flex items-center justify-center gap-2">
            <MdListAlt className="text-indigo-600" /> Your Fixed Deposits
          </h1>
          <p className="text-center text-gray-500 mb-6">
            Review all your ongoing fixed deposits, their durations, and
            maturity dates. Click on a card to view or manage details.
          </p>

          {fixDeposits && fixDeposits.length === 0 ? (
            <div className="text-center py-10">
              <h2 className="text-xl text-gray-600 mb-4 flex items-center justify-center gap-2">
                <MdSentimentDissatisfied className="text-gray-500" />
                No Fixed Deposits Found
              </h2>
              <p className="text-gray-500 text-sm">
                You haven't created any fixed deposits yet. Start saving today
                to grow your wealth securely.
              </p>
            </div>
          ) : (
            <div
              className={`grid gap-6 ${
                fixDeposits.length === 1
                  ? "grid-cols-1"
                  : "grid-cols-1 sm:grid-cols-2"
              }`}
            >
              {fixDeposits.map((fd) => (
                <div
                  key={fd._id}
                  onClick={() => handleFixDeposit(fd)}
                  className={`${
                    fixDeposits.length === 1 ? "w-full" : ""
                  } bg-gradient-to-br from-white to-gray-100 p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition duration-300 cursor-pointer`}
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <FaMoneyBillWave className="text-green-600" />₹{fd.amount}
                  </h3>
                  <p className="text-gray-700 mb-1 flex items-center gap-2">
                    <MdOutlineTrackChanges className="text-blue-600" />
                    <span className="font-medium">Purpose:</span> {fd.apply_for}
                  </p>
                  <p className="text-gray-700 mb-1 flex items-center gap-2">
                    <FaRegCalendarAlt className="text-purple-600" />
                    <span className="font-medium">Applied On:</span>{" "}
                    {fd.date
                      ? new Date(fd.date).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </p>
                  <p className="text-gray-700 mb-1 flex items-center gap-2">
                    <FaHourglassEnd className="text-red-500" />
                    <span className="font-medium">Maturity Date:</span>{" "}
                    {fd.maturity_date
                      ? new Date(fd.maturity_date).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </p>
                  <p className="text-gray-700 flex items-center gap-2">
                    <AiOutlineFieldTime className="text-orange-500" />
                    <span className="font-medium">Duration:</span> {fd.duration}{" "}
                    month{fd.duration > 1 ? "s" : ""}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={() => setAddFD(true)}
            className="flex flex-row bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-lg shadow-md cursor-pointer duration-300 ease-in-out transition-transform hover:scale-105 focus:ring-2 focus:ring-cyan-400 gap-2"
          >
            <AiOutlinePlus size={20} style={{ marginTop: "3px" }} />
            Create New Fixed Deposit
          </button>
        </div>
      </div>

      {addFD && <AddFD setAddFD={setAddFD} />}
      {showModel && (
        <FixDepositDetail setShowModel={setShowModel} deposit={deposit} />
      )}
    </>
  );
};

export default FixDeposit;
