import { motion } from "framer-motion";
import axios from "axios";
import { useEffect, useState } from "react";

const UpdateUser = () => {
  const [data, setData] = useState(null);
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    account_type: "",
  });

  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // Fetch profile on load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/user/get-profile`,
          {},
          { headers }
        );
        const userData = response.data.data;
        setData(userData);

        // Initialize form values
        setValues({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          password: "", // password is usually not updated unless user inputs it
          account_type: userData.account_type || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit updated data
  const handleSubmit = async () => {
    try {
      const { name, email, phone } = values;

      if (!name || !email || !phone) {
        alert("All fields are required");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/update-profile`,
        values,
        { headers }
      );
      console.log(response);
      if (response.data.code === 200) {
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Network error or server not responding");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col sm:flex-col md:flex-row items-start mx-auto px-4">
      <motion.img
        src="https://static.vecteezy.com/system/resources/previews/035/584/500/large_2x/audit-process-in-business-professionals-evaluate-financial-records-internal-audit-third-party-verification-clear-reports-integrity-accuracy-transparency-in-finance-flat-illustration-vector.jpg"
        className="mt-5 min-h-screen w-full sm:max-w-3/6 md:w-4/6 lg:w-3/6"
        alt="Profile update banner"
      />

      <motion.div
        className="p-6 sm:p-4 flex flex-col sm:flex-col md:flex-row lg:flex-col justify-center sm:w-5/6 md:w-2/6 lg:w-2/6 bg-gray-200 sm:mt-5 md:mt-8 lg:mt-30 rounded-xl mx-auto mb-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <div className="w-full max-w-lg flex flex-col items-center text-black">
          <p className="text-center font-bold text-2xl">Update Profile</p>

          <div className="mt-4 w-full px-4 sm:px-2">
            <label htmlFor="name" className="text-lg font-semibold">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={values.name}
              onChange={handleChange}
              className="bg-white border border-black rounded-xl p-2 w-full mt-1"
              placeholder="Your name"
            />
          </div>

          <div className="mt-4 w-full px-4 sm:px-2">
            <label htmlFor="email" className="text-lg font-semibold">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              className="bg-white border border-black rounded-xl p-2 w-full mt-1"
              placeholder="you@example.com"
            />
          </div>

          <div className="mt-4 w-full px-4 sm:px-2">
            <label htmlFor="phone" className="text-lg font-semibold">
              Mobile Number
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={values.phone}
              onChange={handleChange}
              className="bg-white border border-black rounded-xl p-2 w-full mt-1"
              placeholder="+91 9876543210"
            />
          </div>

          {/* Add other fields if needed (password, account_type, etc.) */}

          <div className="mt-5 w-full flex flex-col items-center">
            <button
              onClick={handleSubmit}
              className="bg-gray-800 text-white font-bold px-8 py-3 rounded-xl transition-transform duration-300 hover:scale-105 hover:bg-gray-600"
            >
              Update Profile
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UpdateUser;
