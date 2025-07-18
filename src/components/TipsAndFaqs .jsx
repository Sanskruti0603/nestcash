import {
  FaRupeeSign,
  FaRedoAlt,
  FaShieldAlt,
  FaCalendarTimes,
} from "react-icons/fa";

const TipsAndFaqs = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <ul className="space-y-6 text-gray-700">
        <li className="flex items-start gap-3">
          <FaRupeeSign className="text-blue-500 mt-1" />
          <div>
            <p className="font-semibold">Can I repay my loan early?</p>
            <p className="text-sm text-gray-600">
              Yes! Early repayment is allowed. There are no extra charges for
              early closure.
            </p>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <FaCalendarTimes className="text-red-500 mt-1" />
          <div>
            <p className="font-semibold">What happens if I miss an EMI?</p>
            <p className="text-sm text-gray-600">
              A penalty of ₹100 per missed EMI will be added. Consistent
              defaults may affect eligibility.
            </p>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <FaRedoAlt className="text-purple-500 mt-1" />
          <div>
            <p className="font-semibold">How often can I apply for a loan?</p>
            <p className="text-sm text-gray-600">
              Once your existing loan is fully paid off, you may apply again.
            </p>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <FaShieldAlt className="text-green-500 mt-1" />
          <div>
            <p className="font-semibold">Is my data secure?</p>
            <p className="text-sm text-gray-600">
              Yes. We use bank-grade encryption and never share your data.
            </p>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default TipsAndFaqs;
