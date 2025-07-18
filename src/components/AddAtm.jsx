import { useState } from "react";
import axios from "axios";
import AtmDisplay from "./AtmDisplay";
import StatusBadge from "./StatusBadge";

const AddAtm = ({ onClose, onCreated }) => {
  const selectedAccountId = localStorage.getItem("selectedAccountId");
  const [pin, setPin] = useState("");
  const [cardType, setCardType] = useState("basic");
  const [loading, setLoading] = useState(false);
  const [atmCard, setAtmCard] = useState(null);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const validate = () => {
    const newErrors = {};
    if (!pin.trim()) newErrors.pin = "PIN is required";
    if (!cardType.trim()) newErrors.cardType = "Card Type is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddATM = async () => {
    if (!validate()) return;

    setLoading(true);
    setStatus("loading");
    setStatusMessage("Creating ATM card...");

    await new Promise((res) => setTimeout(res, 3000));

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/atm/add-atm`,
        { account: selectedAccountId, pin, card_type: cardType },
        { headers }
      );
      setAtmCard(response.data.data);
      setStatus(null);
      onCreated && onCreated(response.data.data);
    } catch (err) {
      setStatus("error");
      setStatusMessage("Failed to create ATM card");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex justify-center items-center p-4"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg overflow-y-auto max-h-[90vh]">
          {status && <StatusBadge status={status} message={statusMessage} />}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">
              {atmCard ? "🎉 ATM Card Created" : "🧾 Create ATM Card"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-red-800 cursor-pointer text-2xl font-bold"
            >
              &times;
            </button>
          </div>

          {!atmCard ? (
            <div className="space-y-3 text-gray-800">
              <div>
                <label className="block text-sm font-medium">PIN</label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    setErrors((prev) => ({ ...prev, pin: "" }));
                  }}
                  className={`w-full px-3 py-2 border rounded text-black bg-gray-300 mt-2 ${
                    errors.pin ? "border-red-500" : ""
                  }`}
                />
                {errors.pin && (
                  <p className="text-red-500 text-sm mt-1">{errors.pin}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium">Card Type</label>
                <select
                  value={cardType}
                  onChange={(e) => {
                    setCardType(e.target.value);
                    setErrors((prev) => ({ ...prev, cardType: "" }));
                  }}
                  className={`w-full px-3 py-2 border rounded text-black bg-gray-300 mt-2 ${
                    errors.cardType ? "border-red-500" : ""
                  }`}
                >
                  <option value="">-- Select --</option>
                  <option value="basic">Basic</option>
                  <option value="classic">Classic</option>
                  <option value="platinum">Platinum</option>
                </select>
                {errors.cardType && (
                  <p className="text-red-500 text-sm mt-1">{errors.cardType}</p>
                )}
              </div>

              <div className="flex justify-center items-center gap-2 pt-2">
                <button
                  onClick={handleAddATM}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-lg shadow-md cursor-pointer duration-300 ease-in-out transition-transform hover:scale-105 focus:ring-2 focus:ring-cyan-400"
                >
                  {loading ? "Creating..." : "Create"}
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-300 rounded-lg hover:bg-gray-400 text-black transition-transform hover:scale-105 duration-300 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <AtmDisplay atmCard={atmCard} />
          )}
        </div>
      </div>
    </>
  );
};

export default AddAtm;
