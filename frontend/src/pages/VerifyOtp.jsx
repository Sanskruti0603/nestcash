import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import StatusBadge from "../components/StatusBadge";

const VerifyOtp = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState(null);
  const [cooldown, setCooldown] = useState(0); // resend OTP cooldown
  const [otpTimer, setOtpTimer] = useState(60); // main OTP validity timer

  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const handleVerify = async () => {
    if (otpTimer <= 0) {
      alert("OTP has expired. Please request a new one.");
      return;
    }

    try {
      setStatus("loading");
      const response = await axios.post(
        "http://localhost:8080/api/user/verify-otp",
        {
          otp,
          user_id,
        },
        { headers }
      );

      await new Promise((res) => setTimeout(res, 1500));
      const { token: newToken, role } = response.data.data || {};

      if (newToken) localStorage.setItem("token", newToken);
      if (role) localStorage.setItem("role", role);

      setStatus(null);

     
      if (state?.resetPassword) {
        navigate("/reset-password", {
          state: { user_id: state.user_id || user_id },
        });
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setStatus("error");
      setTimeout(() => setStatus(null), 3000);
      alert(error.response?.data?.message || "OTP verification failed");
    }
  };

  const handleResend = async () => {
    try {
      setStatus("loading");

      await axios.post(
        "http://localhost:8080/api/user/resend-otp",
        { user_id },
        { headers }
      );

      setStatus(null);
      alert("A new OTP has been sent to your email.");

      setCooldown(30);
      setOtpTimer(60);
    } catch (error) {
      setStatus("error");
      setTimeout(() => setStatus(null), 3000);
      alert("Failed to resend OTP. Try again later.");
    }
  };

  useEffect(() => {
    if (otpTimer === 0) return;
    const interval = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [otpTimer]);

  useEffect(() => {
    if (cooldown === 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <StatusBadge
        status={status}
        message={
          status === "loading"
            ? "Processing..."
            : status === "error"
            ? "Something went wrong!"
            : ""
        }
      />
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-center text-xl font-bold mb-4">Verify OTP</h2>

        <p className="text-center text-sm mb-2 text-gray-600">
          {otpTimer > 0
            ? `OTP expires in ${otpTimer}s`
            : "OTP expired. Please resend OTP."}
        </p>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full p-3 rounded-xl border border-black mb-4"
        />

        <button
          onClick={handleVerify}
          disabled={otpTimer <= 0}
          className={`w-full text-white py-2 rounded-xl ${
            otpTimer <= 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Verify OTP
        </button>

        <button
          onClick={handleResend}
          disabled={cooldown > 0}
          className={`w-full mt-3 font-semibold ${
            cooldown > 0
              ? "text-gray-400 cursor-not-allowed"
              : "text-blue-600 hover:underline"
          }`}
        >
          {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
        </button>
      </div>
    </div>
  );
};

export default VerifyOtp;
