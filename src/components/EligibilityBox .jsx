const EligibilityBox = () => {
  return (
    <div className="bg-yellow-50 p-4 border-l-4 border-yellow-400 rounded-md shadow-md">
      <h3 className="text-lg font-semibold text-yellow-700">
        Loan Eligibility
      </h3>
      <ul className="list-disc list-inside text-gray-700 mt-2">
        <li>Must have an active NestCash account</li>
        <li>Minimum balance of ₹500</li>
        <li>Account must be older than 30 days</li>
        <li>No previous loan defaults</li>
        <li>Monthly income above ₹10,000 (for personal loans)</li>
      </ul>
    </div>
  );
};

export default EligibilityBox;
