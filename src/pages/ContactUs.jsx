import { motion } from "framer-motion";

const ContactUs = () => {
  return (
    <>
      <motion.div
        className="max-w-5xl mx-auto mt-8 mb-8 flex flex-col sm:flex-row items-start gap-8 px-4"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="sm:w-1/2 w-full">
          <p className="font-bold text-4xl mb-4 mt-18">Contact Us</p>
          <p className="text-lg text-gray-700">
            Contact us via our email{" "}
            <span className="text-black font-medium">nestcash2@gmail.com</span>{" "}
            or direct DM us via this form. We'll connect with you soon.
          </p>
        </div>

        <div className="sm:w-1/2 w-full">
          <form className="flex flex-col gap-4 bg-gray-100 p-6 rounded-xl shadow-md">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 rounded border border-gray-300"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-3 rounded border border-gray-300"
            />
            <textarea
              placeholder="Your Message"
              rows="5"
              className="w-full p-3 rounded border border-gray-300"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </motion.div>
    </>
  );
};

export default ContactUs;
