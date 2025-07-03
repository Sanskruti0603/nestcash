// // const axios = require("axios");

// // const sendSMS = async () => {
// //   const data = {
// //     route: "dlt",
// //     requests: [
// //       {
// //         sender_id: "FSTSMS", // use your actual sender ID
// //         message: "1707167349928089092", // your DLT-approved template ID
// //         variables_values: "John|OTP123", // based on your template placeholders
// //         flash: 0,
// //         numbers: "9999999999",
// //       },
// //     ],
// //   };

// //   try {
// //     const response = await axios.post(
// //       "https://www.fast2sms.com/dev/custom",
// //       data,
// //       {
// //         headers: {
// //           Authorization:
// //             "Fp0GlfSGCrGIn3dpYrpez0TmLRNDOhNTZ5mvj1FWA17XFWjknT09q3jVr0sp",
// //           "Content-Type": "application/json",
// //         },
// //       }
// //     );
// //     console.log("SMS sent:", response.data);
// //   } catch (error) {
// //     console.error("Error sending SMS:", error.response?.data || error.message);
// //   }
// // };

// // sendSMS();

// const axios = require("axios");

// const data = {
//   sender_id: "FSTSMS", // Default sender for testing
//   message: "Your OTP is 123456", // Plain text message
//   language: "english",
//   route: "q", // 'q' = Quick route (no DLT required)
//   numbers: "6359482594", // Replace with your number
// };

// axios
//   .post("https://www.fast2sms.com/dev/bulkV2", data, {
//     headers: {
//       authorization:
//         "Fp0GlfSGCrGIn3dpYrpez0TmLRNDOhNTZ5mvj1FWA17XFWjknT09q3jVr0sp", // Replace with your actual API key
//       "Content-Type": "application/json",
//     },
//   })
//   .then((res) => {
//     console.log("SMS Sent Successfully", res.data);
//   })
//   .catch((err) => {
//     console.error("Error sending SMS:", err.response.data);
//   });
