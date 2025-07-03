import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { authSliceActions } from "../../../../book-store/frontend/src/store/auth";
import StatusBadge from "../components/StatusBadge";
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // "loading" | "error" | null

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!values.email.trim()) newErrors.email = "Email is required";
    if (!values.password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleSubmit = async () => {

  //   if (!validate()) return;

  //   try {
  //     setStatus("loading");

  //     const response = await axios.post(
  //       "http://localhost:8080/api/user/login",
  //       values
  //     );

  //     await new Promise((res) => setTimeout(res, 2500)); // Simulate delay

  //     dispatch(authSliceActions.login());
  //     dispatch(authSliceActions.changeRole("user"));
  //     localStorage.setItem("token", response.data.data.token);
  //     localStorage.setItem("role", response.data.data.role);

  //     setStatus(null);
  //     navigate("/dashboard");
  //   } catch (error) {
  //     setStatus("error");
  //     setTimeout(() => setStatus(null), 3000);
  //     alert(error.response?.data?.message || "Something went wrong");
  //   }
  // };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setStatus("loading");

      const response = await axios.post(
        "http://localhost:8080/api/user/login",
        values
      );

      await new Promise((res) => setTimeout(res, 2500)); 

      const { token, role, isVerified, user_id } = response.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("user_id", user_id);

      dispatch(authSliceActions.login());
      dispatch(authSliceActions.changeRole(role));

      setStatus(null);

      if (!isVerified) {
        navigate("/verify-otp", { state: { user_id } });
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setStatus("error");
      setTimeout(() => setStatus(null), 3000);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-start mr-3  px-4">
      {/* ✅ Loading/Error Badge */}
      <StatusBadge
        status={status} // "loading" | "error" | null
        message={
          status === "loading"
            ? "Logging you in..."
            : status === "error"
            ? "Something went wrong!"
            : ""
        }
      />
      {/* Left Visual */}
      <motion.img
        src="https://static.vecteezy.com/system/resources/previews/035/584/500/large_2x/audit-process-in-business-professionals-evaluate-financial-records-internal-audit-third-party-verification-clear-reports-integrity-accuracy-transparency-in-finance-flat-illustration-vector.jpg"
        className="mt-5 min-h-screen w-full md:w-4/6 object-cover"
        alt="login visual"
      />

      {/* Login Form */}
      <motion.div
        className="p-6 flex flex-col justify-center w-full md:w-2/6 bg-gray-200 mt-40 mr-10 rounded-xl mb-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <div className="w-full max-w-md mx-auto text-black">
          <h2 className="text-center font-bold text-3xl mb-4">Login</h2>

          {["email", "password"].map((field) => (
            <div className="mb-4" key={field}>
              <label
                htmlFor={field}
                className="block font-semibold text-lg mb-1"
              >
                {field === "email" ? "Email" : "Password"}
              </label>
              <input
                type={field}
                id={field}
                name={field}
                value={values[field]}
                onChange={handleChange}
                className={`w-full p-2 rounded-xl border ${
                  errors[field] ? "border-red-500" : "border-black"
                }`}
                placeholder={
                  field === "email" ? "xyz@gmail.com" : "Enter password"
                }
              />
              {errors[field] && (
                <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
              )}
            </div>
          ))}

          <div className="flex flex-col items-center gap-2 mt-4">
            <button
              onClick={handleSubmit}
              className="bg-gray-800 text-white font-bold px-8 py-3 rounded-xl hover:scale-105 transition-transform"
            >
              Sign In
            </button>
            <p className="text-sm font-semibold">
              Don't have an account?{" "}
              <Link to="/signUp" className="text-blue-600">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
