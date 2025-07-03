import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white pt-10 pb-6 px-4 text-sm">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand Info */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img
              src="./Preview-2.png"
              alt="NestCash Logo"
              className="h-8 w-8"
            />
            <h2 className="text-xl font-bold">NestCash</h2>
          </div>
          <p className="text-gray-400 leading-relaxed text-xs sm:text-sm">
            Your digital gateway to smart living — explore, save, and manage
            with ease.
          </p>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white text-base font-semibold mb-3">Contact</h3>
          <p className="text-gray-400 hover:underline mb-2 transition cursor-pointer">
            📧 support@nestcash.com
          </p>
          <p className="text-gray-400 hover:underline transition cursor-pointer">
            📞 +91 98765 43210
          </p>
        </div>

        {/* Navigation or Resources (Optional) */}
        <div>
          <h3 className="text-white text-base font-semibold mb-3">
            Quick Links
          </h3>
          <ul className="text-gray-400 space-y-2 text-sm">
            <li className="hover:text-white transition cursor-pointer">
              <Link to="/">Home</Link>
            </li>
            <li className="hover:text-white transition cursor-pointer">
              <Link to="/about">About Us</Link>
            </li>
            <li className="hover:text-white transition cursor-pointer">
              <Link to="/services">Services</Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-white text-base font-semibold mb-3">Follow Us</h3>
          <div className="flex gap-4 text-xl text-gray-400">
            <a href="#" className="hover:text-white transition duration-300">
              <FaFacebook />
            </a>
            <a href="#" className="hover:text-white transition duration-300">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-white transition duration-300">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-white transition duration-300">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      <hr className="my-6 border-gray-700" />

      <div className="text-center text-gray-500 text-xs">
        &copy; {new Date().getFullYear()}{" "}
        <span className="font-medium">NestCash</span>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
