import { useRef } from "react";
import { Link } from "react-router-dom";
import * as htmlToImage from "html-to-image";
import jsPDF from "jspdf";

const AtmDisplay = ({ atmCard, total }) => {
  const cardRef = useRef();

  const handleExportImage = async () => {
    if (!cardRef.current) return;

    const dataUrl = await htmlToImage.toPng(cardRef.current);
    const link = document.createElement("a");
    link.download = "atm-card.png";
    link.href = dataUrl;
    link.click();
  };

  const handleExportPDF = async () => {
    if (!cardRef.current) return;

    const dataUrl = await htmlToImage.toPng(cardRef.current);
    const pdf = new jsPDF();
    pdf.addImage(dataUrl, "PNG", 15, 15, 180, 90);
    pdf.save("atm-card.pdf");
  };

  return (
    <div className="flex flex-col items-center gap-2 mt-10">
      <Link to={`/atm/${atmCard._id}`} className="w-full flex justify-center">
        <div
          ref={cardRef}
          className={`w-full max-w-[450px] sm:w-[550px]
    h-[250px]
    p-5 rounded-2xl shadow-2xl text-white font-mono relative 
    mx-auto ${
      atmCard.card_type === "basic"
        ? "bg-gradient-to-r from-slate-600 to-gray-900"
        : atmCard.card_type === "classic"
        ? "bg-gradient-to-r from-indigo-500 to-blue-500"
        : "bg-gradient-to-r from-yellow-400 via-red-400 to-pink-500"
    }`}
        >
          <div className="w-14 h-7 bg-yellow-300 rounded-sm mb-6 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[repeating-linear-gradient(to_bottom,_#b8860b_0px,_#b8860b_1px,_transparent_1px,_transparent_3px)]" />
          </div>

          <div className="text-2xl tracking-widest mb-6">
            {atmCard.card_no?.replace(/(\d{4})(?=\d)/g, "$1 ").trim()}
          </div>

          <div className="flex justify-between text-sm">
            <div>
              <p className="text-xs text-gray-200">EXPIRY</p>
              <p>{new Date(atmCard.expiry).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-200">CVV</p>
              <p>{atmCard.cvv}</p>
            </div>
          </div>

          <div className="absolute bottom-4 left-6 text-xs font-bold uppercase tracking-wider opacity-80">
            {atmCard.card_type} Card
          </div>

          <div className="absolute bottom-4 right-6">
            <img
              src={
                atmCard.card_type === "gold"
                  ? "https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
                  : "https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
              }
              alt="Card Provider"
              className="w-14 h-auto"
            />
          </div>
        </div>
      </Link>

      <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
        <button
          onClick={handleExportImage}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300 shadow-sm text-sm"
        >
          📸 PNG
        </button>

        <button
          onClick={handleExportPDF}
          className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-md hover:bg-indigo-200 transition duration-300 shadow-sm text-sm"
        >
          📄 PDF
        </button>

        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("Card link copied!");
          }}
          className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-200 transition duration-300 shadow-sm"
        >
          🔗 Share Card
        </button>
      </div>
    </div>
  );
};

export default AtmDisplay;
