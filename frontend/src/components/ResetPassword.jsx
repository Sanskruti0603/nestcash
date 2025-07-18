import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import StatusBadge from "../components/StatusBadge";

const ResetPassword = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const user_id = state?.user_id || localStorage.getItem("user_id");

  const [values, setValues] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!values.password.trim()) newErrors.password = "Password is required";
    if (!values.confirmPassword.trim())
      newErrors.confirmPassword = "Confirm Password is required";
    if (values.password !== values.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReset = async () => {
    if (!validate()) return;

    try {
      setStatus("loading");
      await axios.post("http://localhost:8080/api/user/reset-password", {
        user_id,
        newPassword: values.password,
      });

      await new Promise((res) => setTimeout(res, 1500));
      setStatus(null);
      alert("Password has been reset successfully.");
      navigate("/login");
    } catch (err) {
      setStatus("error");
      setTimeout(() => setStatus(null), 3000);
      alert(err.response?.data?.message || "Password reset failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <StatusBadge
        status={status}
        message={
          status === "loading"
            ? "Resetting password..."
            : status === "error"
            ? "Something went wrong!"
            : ""
        }
      />

      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>

        {["password", "confirmPassword"].map((field) => (
          <div className="mb-4" key={field}>
            <label className="block font-semibold mb-1">
              {field === "password" ? "New Password" : "Confirm Password"}
            </label>
            <input
              type="password"
              name={field}
              value={values[field]}
              onChange={handleChange}
              className={`w-full p-3 border rounded-xl ${
                errors[field] ? "border-red-500" : "border-black"
              }`}
              placeholder={
                field === "password" ? "Enter new password" : "Confirm password"
              }
            />
            {errors[field] && (
              <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
            )}
          </div>
        ))}

        <button
          onClick={handleReset}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
