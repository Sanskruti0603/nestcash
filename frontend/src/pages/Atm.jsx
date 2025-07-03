import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AddAtm from "../components/AddAtm";
import AtmDisplay from "../components/AtmDisplay";
import axios from "axios";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { CreditCard, ShieldCheck, Users } from "lucide-react";
import { AiOutlineEye } from "react-icons/ai";
import { AiOutlinePlus } from "react-icons/ai";

const Atm = () => {
  const [atm, setAtm] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const selectedAccountId = useSelector(
    (store) => store.account.selectedAccountId
  );

  const handleCardCreated = (cardData) => {};

  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const fetchATM = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/atm/get-atms",
          { account: selectedAccountId },
          { headers }
        );
        setAtm(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchATM();
  }, []);

  return (
    <div className="relative min-h-screen bg-white text-zinc-800 p-4 sm:p-10">
      <section className="text-center mb-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold text-zinc-800"
        >
          <p>Manage Your Virtual ATM Cards Easily</p>
        </motion.h1>
        <p className="text-gray-500 mt-2">
          Create, view, and manage your ATM cards all in one place with
          NestCash.
        </p>
      </section>

      <div className="flex flex-col md:flex-row items-center justify-center gap-6 max-w-xl mx-auto mb-12">
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-lg shadow-md cursor-pointer duration-300 ease-in-out transition-transform hover:scale-105 focus:ring-2 flex flex-row gap-2 focus:ring-cyan-400"
        >
          <AiOutlinePlus size={20} style={{ marginTop: "3px" }} />
          Create ATM Card
        </button>

        <Link
          to="/atm/view-atms"
          className="bg-white border flex flex-row border-indigo-600 text-indigo-600 font-medium px-6 py-3 rounded-xl hover:bg-indigo-50 transition-transform hover:scale-105 w-full md:w-auto gap-2"
        >
          <AiOutlineEye size={20} style={{ marginTop: "3px" }} />
          View All ATM Cards
        </Link>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-14">
        <div className="bg-indigo-50 p-6 rounded-xl shadow-md text-center">
          <CreditCard className="mx-auto text-indigo-600 mb-3" size={32} />
          <h4 className="font-semibold text-lg mb-1">Virtual & Instant</h4>
          <p className="text-sm text-gray-600">
            Generate cards instantly with secure online access.
          </p>
        </div>
        <div className="bg-indigo-50 p-6 rounded-xl shadow-md text-center">
          <ShieldCheck className="mx-auto text-indigo-600 mb-3" size={32} />
          <h4 className="font-semibold text-lg mb-1">Safe & Secure</h4>
          <p className="text-sm text-gray-600">
            All cards are encrypted and protected by advanced security
            protocols.
          </p>
        </div>
        <div className="bg-indigo-50 p-6 rounded-xl shadow-md text-center">
          <Users className="mx-auto text-indigo-600 mb-3" size={32} />
          <h4 className="font-semibold text-lg mb-1">User-Friendly</h4>
          <p className="text-sm text-gray-600">
            Easy-to-use interface tailored for everyone.
          </p>
        </div>
      </section>

      <section className="max-w-xl mx-auto">
        <h2 className="text-xl font-semibold text-center mb-6">
          Your Most Recent ATM Card
        </h2>
        {atm.length > 0 ? (
          <AtmDisplay
            key={atm[atm.length - 1]._id}
            atmCard={atm[atm.length - 1]}
            total={1}
          />
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center shadow-md">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1170/1170678.png"
              alt="No ATM"
              className="w-16 h-16 mx-auto mb-4"
            />
            <h3 className="text-lg font-semibold mb-1">No ATM Card Found</h3>
            <p className="text-gray-500 text-sm mb-4">
              Looks like you haven’t created any ATM card yet.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-lg shadow-md cursor-pointer duration-300 ease-in-out transition-transform hover:scale-105 focus:ring-2 focus:ring-cyan-400"
            >
              Create Your First Card
            </button>
          </div>
        )}
      </section>

      {showModal && (
        <AddAtm
          onClose={() => setShowModal(false)}
          onCreated={handleCardCreated}
        />
      )}
    </div>
  );
};

export default Atm;
