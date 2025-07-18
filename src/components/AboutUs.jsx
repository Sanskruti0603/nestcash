import React from "react";
import { motion } from "framer-motion";

const teamMembers = [
  {
    name: "Aarav Mehta",
    role: "CEO & Co-Founder",
    image: "https://th.bing.com/th/id/OIP.59hYtOrco0EZe3thkO8j1AHaE7?rs=1&pid=ImgDetMain",
  },
  {
    name: "Riya Sharma",
    role: "Chief Product Officer",
    image:
      "https://media.istockphoto.com/id/1492942816/photo/business-happy-woman-and-thinking-with-arms-crossed-in-city-pride-and-opportunity-for-success.webp?b=1&s=170667a&w=0&k=20&c=AnbHt8E9O6ORYRt-hHNn7aZAOzLoA1bcvfnMzvCgOno=",
  },
  {
    name: "Kabir Patel",
    role: "Lead Developer",
    image: "https://i1.rgstatic.net/ii/profile.image/1162860822577152-1654259033461_Q512/Lucas-Dubs.jpg",
  },
];

const AboutUs = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-10 px-5 md:px-20">

      <div className="flex flex-col md:flex-row items-center gap-10 max-w-7xl mx-auto">
        
        <motion.img
          src="https://img.freepik.com/premium-vector/banking-industry-concept-illustration_86047-688.jpg"
          alt="NestCash Team"
          className="rounded-2xl shadow-xl w-full md:w-1/2 h-[75vh] transform transition-transform duration-300 hover:scale-105"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        />

        
        <motion.div
          className="md:w-1/2"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-nestcash mb-6">
            About NestCash
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            NestCash is your trusted digital banking partner. From savings to
            instant transactions and secure deposits—we help you take charge of
            your finances with confidence.
          </p>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-nestcash mb-2">
              Our Mission
            </h2>
            <p className="text-gray-600">
              Empowering people with smart financial tools that are easy to use
              and built for the future.
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-nestcash mb-2">
              Our Vision
            </h2>
            <p className="text-gray-600">
              A world where digital banking is secure, inclusive, and designed
              for real life.
            </p>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="max-w-5xl mx-auto mt-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-nestcash">
          Our Core Values
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            {
              title: "Trust",
              desc: "Building honest and long-term relationships.",
            },
            {
              title: "Innovation",
              desc: "Designing smarter and modern financial tools.",
            },
            { title: "Security", desc: "Protecting your money and data." },
            {
              title: "Accessibility",
              desc: "Banking for everyone, everywhere.",
            },
            { title: "Growth", desc: "Helping you grow wealth with insights." },
            { title: "Support", desc: "Always here to guide you." },
          ].map((val, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-xl shadow hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold mb-2">{val.title}</h3>
              <p className="text-gray-600 text-sm">{val.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

     
      <motion.div
        className="max-w-6xl mx-auto mt-20 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold mb-10 text-nestcash">
          Meet Our Team
        </h2>
        <div className="flex flex-wrap justify-center gap-10">
          {teamMembers.map((member, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-md w-60">
              <img
                src={member.image}
                alt={member.name}
                className="rounded-full w-24 h-24 mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-sm text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AboutUs;
