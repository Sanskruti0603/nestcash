import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AddAtm from "../components/AddAtm";
import { useEffect } from "react";
import axios from "axios";
import AtmDisplay from "../components/AtmDisplay";
import { useSelector } from "react-redux";
const Atms = () => {
  const [atm, setAtm] = useState([]);
  const token = localStorage.getItem("token");
  const selectedAccountId = useSelector(
    (store) => store.account.selectedAccountId
  );
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const fetcATM = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/atm/get-atms`,
          { account: selectedAccountId },
          { headers }
        );
        setAtm(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetcATM();
  }, []);

  return (
    <>
      <>
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-black mb-6 mt-5">
          🏦 Welcome to NestCash ATM
        </h1>

        {atm.length > 0 && (
          <h2 className="text-base sm:text-xl font-semibold text-center mb-6 text-black">
            Here are your {atm.length} ATM Cards and their details:
          </h2>
        )}

        <div
          className={`grid grid-cols-1 md:grid-cols-2 place-items-center gap-4 px-15 lg:px-40 sm:px-8 pb-10 overflow-hidden`}
        >
          {atm &&
            atm.map((card) => (
              <AtmDisplay key={card._id} atmCard={card} total={card.length} />
            ))}
          {atm.length === 0 && (
            <div className="w-full flex justify-center px-4 mt-8 mb-24 sm:ml-0  md:ml-[100%] lg:ml-[100%]">
              <div className="w-full max-w-3xl bg-white p-12 rounded-3xl shadow-xl border border-gray-200 flex flex-col items-center text-center">
                <div className="bg-indigo-100 p-6 rounded-full mb-6">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/1170/1170678.png"
                    alt="No ATM"
                    className="w-16 h-16"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  No ATM Card Found
                </h3>
                <p className="text-gray-500 text-sm mb-6 max-w-sm text-center">
                  Looks like you haven’t created any ATM card yet. Click the
                  button below to get started.
                </p>
              </div>
            </div>
          )}
        </div>
      </>
    </>
  );
};

export default Atms;
