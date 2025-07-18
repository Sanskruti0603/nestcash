import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { authSliceActions } from "../store/authSlice";
import { useDispatch } from "react-redux";

const AdminLogin = () => {
  const [values, setValues] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!values.email || !values.password) {
      alert("Email and password are required.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/login`,
        values
      );
      console.log(response);
      const token = response.data?.data?.token;
      const role = response.data?.data?.role;
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        dispatch(authSliceActions.login());
        dispatch(authSliceActions.changeRole("admin"));
        navigate("/admin/dashboard");
      }
    } catch (err) {
      console.log("Admin login failed", err);
      alert("Invalid credentials or not authorized.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>

        <input
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          placeholder="Admin Email"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4"
        />

        <input
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4"
        />

        <button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-lg shadow-md cursor-pointer duration-300 ease-in-out transition-transform hover:scale-105 focus:ring-2 focus:ring-cyan-400 w-full"
        >
          Login as Admin
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
