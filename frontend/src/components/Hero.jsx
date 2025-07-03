import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/autoplay";
import { Link } from "react-router-dom";
import { Pagination, Navigation } from "swiper/modules";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.7 },
  viewport: { once: true },
};

const Hero = () => {
  return (
    <>
      {/* ✅ Navbar */}
      <nav className="absolute top-0 left-0 w-full z-30 flex justify-between items-center px-6 py-4 bg-black bg-opacity-50 text-white">
        <h1 className="text-2xl font-bold">NestCash</h1>
        <div className="space-x-4">
          <Link
            to="/login"
            className="px-4 py-2 rounded bg-white text-black font-semibold hover:bg-gray-100 transition"
          >
            User Login
          </Link>
          <Link
            to="/admin/login"
            className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Admin Login
          </Link>
        </div>
      </nav>

      {/* ✅ Hero Section with Swiper Background */}
      <div className="relative h-screen w-full overflow-hidden">
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 3000 }}
          loop
          className="h-full w-full absolute inset-0 z-0"
        >
          <SwiperSlide>
            <img
              src="/slide1.jpg"
              alt="Slide 1"
              className="h-full w-full object-cover"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="/slide2.jpg"
              alt="Slide 2"
              className="h-full w-full object-cover"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="/slide3.jpg"
              alt="Slide 3"
              className="h-full w-full object-cover"
            />
          </SwiperSlide>
        </Swiper>

        <div
          className="absolute inset-0  bg-opacity-60 z-10"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        />

        <div className="absolute inset-0 z-20 flex items-center justify-center px-4 text-center">
          <div className="max-w-3xl text-white">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
              Manage Money Effortlessly
            </h1>
            <p className="text-xl md:text-2xl mb-6 font-medium text-gray-200">
              Welcome to{" "}
              <span className="text-blue-400 font-bold">NestCash</span> — your
              digital gateway to simple, smart living.
            </p>
            <Link
              to="/signUp"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition transform hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* ✅ Benefits Section */}
      <motion.div className="bg-gray-100 py-16 px-4 sm:px-8" {...fadeInUp}>
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-10">
            Why Choose <span className="text-blue-500">NestCash?</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Smart Tracking",
                desc: "Monitor your spending habits and get insights in real-time.",
              },
              {
                title: "Budget Goals",
                desc: "Set savings goals and track your progress automatically.",
              },
              {
                title: "Secure Platform",
                desc: "Your data is encrypted and securely stored on our servers.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition transform hover:scale-105"
              >
                <h3 className="text-xl font-semibold text-zinc-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-zinc-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div className="bg-white py-16 px-4 sm:px-8" {...fadeInUp}>
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-10 text-zinc-800">
            What Our Users Say
          </h2>

          <div className="block sm:hidden">
            <Swiper
              modules={[Pagination, Navigation]}
              spaceBetween={20}
              slidesPerView={1}
              loop
              pagination={{ clickable: true }}
              navigation
              className="pb-6"
            >
              {[
                [
                  "“NestCash helped me finally stick to a budget. Super easy to use!”",
                  "— Priya S.",
                ],
                [
                  "“I’ve saved more in 3 months with NestCash than in 3 years before.”",
                  "— Rahul K.",
                ],
                [
                  "“Clean UI, great features, and the reminders are a game changer.”",
                  "— Aditi M.",
                ],
                [
                  "“Now I know exactly where my money goes each month. It’s empowering.”",
                  "— Vikram N.",
                ],
                [
                  "“The design is beautiful and it actually makes finance feel fun!”",
                  "— Sneha R.",
                ],
              ].map(([quote, name], i) => (
                <SwiperSlide key={i}>
                  <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition transform hover:scale-105 mx-6">
                    <p className="text-zinc-600 italic mb-4">{quote}</p>
                    <h4 className="font-semibold text-zinc-800">{name}</h4>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* 👇 Grid for md and up */}
          <div className="hidden sm:grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              [
                "“NestCash helped me finally stick to a budget. Super easy to use!”",
                "— Priya S.",
              ],
              [
                "“I’ve saved more in 3 months with NestCash than in 3 years before.”",
                "— Rahul K.",
              ],
              [
                "“Clean UI, great features, and the reminders are a game changer.”",
                "— Aditi M.",
              ],
              [
                "“Now I know exactly where my money goes each month. It’s empowering.”",
                "— Vikram N.",
              ],
              [
                "“The design is beautiful and it actually makes finance feel fun!”",
                "— Sneha R.",
              ],
            ].map(([quote, name], i) => (
              <div
                key={i}
                className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition transform hover:scale-105"
              >
                <p className="text-zinc-600 italic mb-4">{quote}</p>
                <h4 className="font-semibold text-zinc-800">{name}</h4>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div className="bg-blue-50 py-16 px-4 text-center" {...fadeInUp}>
        <h2 className="text-4xl font-bold mb-4 text-zinc-800">
          Ready to take control of your finances?
        </h2>
        <p className="mb-6 text-lg text-zinc-600">
          Join thousands of users who manage their money with NestCash.
        </p>
        <Link
          to="/signUp"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition transform hover:scale-105"
        >
          Create Your Free Account
        </Link>
      </motion.div>
    </>
  );
};

export default Hero;
