import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const StatusBadge = ({ type, message }) => {
  const color = type === "error" ? "red" : "green";
  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
      <div
        className={`bg-white border border-${color}-300 w-80 rounded-lg shadow-lg p-5`}
      >
        <div className="flex items-center gap-3 mb-3">
          <svg
            className={`h-5 w-5 ${
              type === "error" ? "text-red-600" : "text-green-600"
            } animate-spin`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <p
            className={`text-sm font-medium ${
              color === "red" ? "text-red-600" : "text-gray-800"
            }`}
          >
            {message}
          </p>
        </div>
        <motion.div
          className={`h-1.5 rounded-full bg-${color}-500`}
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.5, ease: "linear" }}
        />
      </div>
    </div>
  );
};

const SignUp = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    account_type: "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!values.name.trim()) newErrors.name = "Full name is required";

    if (!values.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!values.password.trim()) {
      newErrors.password = "Password is required";
    } else if (values.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (!/[A-Z]/.test(values.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(values.password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter";
    } else if (!/[0-9]/.test(values.password)) {
      newErrors.password = "Password must contain at least one number";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(values.password)) {
      newErrors.password =
        "Password must include at least one special character";
    }

    if (!values.phone.trim()) newErrors.phone = "Phone number is required";

    if (!values.account_type.trim()) {
      newErrors.account_type = "Please select an account type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setStatus("loading");
      const response = await axios.post(
        "http://localhost:8080/api/user/register",
        values
      );
      console.log(response);

      await new Promise((res) => setTimeout(res, 2500));
      setStatus(null);

      navigate("/login");
    } catch (error) {
      setStatus("error");

      setTimeout(() => setStatus(null), 3000);

      if (error.response?.data?.message === "Email is already exists") {
        alert("❌ Email already exists");
      } else {
        alert(error.response?.data?.message || "Something went wrong");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-start mx-auto px-4 bg-white">
      {status === "loading" && (
        <StatusBadge type="loading" message="Creating your account..." />
      )}
      {status === "error" && (
        <StatusBadge type="error" message="Something went wrong!" />
      )}

      <motion.img
        src="https://static.vecteezy.com/system/resources/previews/035/584/500/large_2x/audit-process-in-business-professionals-evaluate-financial-records-internal-audit-third-party-verification-clear-reports-integrity-accuracy-transparency-in-finance-flat-illustration-vector.jpg"
        className="mt-5 min-h-screen w-full md:w-4/6 object-cover"
        alt="signup visual"
      />

      <motion.div
        className="p-6 flex flex-col justify-center w-full md:w-2/6 bg-gray-200 mt-10 rounded-xl mb-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="w-full max-w-md mx-auto text-black">
          <h2 className="text-center font-bold text-3xl mb-4">Sign Up</h2>

          {[
            { label: "Full Name", id: "name", type: "text" },
            { label: "Email", id: "email", type: "email" },
            { label: "Password", id: "password", type: "password" },
            { label: "Phone", id: "phone", type: "text" },
          ].map(({ label, id, type }) => (
            <div key={id} className="mb-4">
              <label htmlFor={id} className="block font-semibold mb-1">
                {label}
              </label>
              <input
                type={type}
                name={id}
                id={id}
                value={values[id]}
                onChange={handleChange}
                className={`w-full p-2 rounded-xl border ${
                  errors[id] ? "border-red-500" : "border-black"
                }`}
                placeholder={`Enter ${label.toLowerCase()}`}
              />
              {errors[id] && (
                <p className="text-red-500 text-sm mt-1">{errors[id]}</p>
              )}
            </div>
          ))}

          <div className="mb-6">
            <label htmlFor="account_type" className="block font-semibold mb-1">
              Account Type
            </label>
            <select
              name="account_type"
              id="account_type"
              value={values.account_type}
              onChange={handleChange}
              className={`w-full p-2 rounded-xl border ${
                errors.account_type ? "border-red-500" : "border-black"
              }`}
            >
              <option value="">-- Select --</option>
              <option value="saving">Saving</option>
              <option value="current">Current</option>
            </select>
            {errors.account_type && (
              <p className="text-red-500 text-sm mt-1">{errors.account_type}</p>
            )}
          </div>

          <div className="flex flex-col items-center gap-2">
            <button
              onClick={handleSubmit}
              className="bg-gray-800 text-white font-bold px-8 py-3 rounded-xl hover:scale-105 transition-transform"
            >
              Sign Up
            </button>
            <p className="text-sm font-semibold">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600">
                Login
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
