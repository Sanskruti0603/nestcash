const LoanSummaryCard = ({ title, value }) => {
  return (
    <div className="bg-indigo-100 rounded-xl p-4 shadow-md">
      <h4 className="text-gray-700 font-medium">{title}</h4>
      <p className="text-xl font-bold text-indigo-800 mt-1">{value}</p>
    </div>
  );
};

export default LoanSummaryCard;
