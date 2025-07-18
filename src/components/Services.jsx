import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.7 },
  viewport: { once: true },
};

const Services = () => {
  const services = [
    {
      img: "https://th.bing.com/th/id/R.635c213a0b76e178c52e7f053886dcce?rik=7ej%2fDwX1CHx4Xg&riu=http%3a%2f%2fwww.beamoneyblogger.com%2fwp-content%2fuploads%2f2017%2f12%2fmoney-saving.jpg&ehk=d1WRmbsAxC9rc7cUjSUu0b1kZpikTOgnBAd%2bTBT6pvs%3d&risl=&pid=ImgRaw&r=0",
      title: "🎯 Saving Goals",
      text: "Set personal goals, like a vacation or emergency fund, and track your progress automatically with visual progress bars and smart notifications.",
      button: "Start Saving Smarter",
    },
    {
      img: "https://www.thebritishacademy.ac.uk/media/images/Infographics_Update_.width-1000.jpg",
      title: "📈 Expense Analytics",
      text: "Visualize your spending habits with smart charts and actionable insights to help optimize your monthly expenses.",
      button: "Visualize the Data",
    },
    {
      img: "https://th.bing.com/th/id/OIP.aG_OZyb6fq0qWjWaQ-oymAHaDt?rs=1&pid=ImgDetMain",
      title: "💳 Instant ATM Card",
      text: "Generate a virtual ATM card instantly and start using it for secure online transactions anytime, anywhere.",
      button: "Get Your Virtual Card",
    },
    {
      img: "https://monomousumi.com/wp-content/uploads/Fixed-Deposit.jpg",
      title: "🏦 High-Interest Fixed Deposit",
      text: "Lock your savings in a secure fixed deposit and enjoy higher returns. Ideal for long-term financial growth and peace of mind.",
      button: "Start Fixed Deposit",
      list: [
        "Flexible tenure options (3 months to 5 years)",
        "Up to 8.5% annual interest",
        "Safe & insured investment",
      ],
    },
  ];

  const testimonials = [
    {
      quote:
        "“NestCash helped me finally stick to a budget. Super easy to use!”",
      name: "— Priya S.",
    },
    {
      quote:
        "“I’ve saved more in 3 months with NestCash than in 3 years before.”",
      name: "— Rahul K.",
    },
    {
      quote:
        "“Clean UI, great features, and the reminders are a game changer.”",
      name: "— Aditi M.",
    },
  ];

  return (
    <>
      <div className="bg-gray-200">
        <motion.div
          className="flex flex-col items-center justify-center text-center p-10"
          {...fadeInUp}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-800">
            Smart, Secure, and Simple Finance Management
          </h1>
          <p className="text-xl text-zinc-600 mt-4 max-w-2xl">
            Explore how NestCash helps you budget, track, and save — all in one
            place.
          </p>
        </motion.div>
      </div>

      <div className="bg-white py-16 px-4 sm:px-8">
        <motion.h2
          className="text-3xl font-bold text-center text-zinc-800 mb-12"
          {...fadeInUp}
        >
          Services NestCash Provides
        </motion.h2>

        <div className="space-y-20">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className={`max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12 ${
                index % 2 !== 0 ? "md:flex-row-reverse" : ""
              }`}
              {...fadeInUp}
            >
              <img
                src={service.img}
                alt={service.title}
                className="rounded-xl shadow-md w-full h-80 object-cover"
              />
              <div>
                <h3 className="text-2xl font-bold text-zinc-800 mb-4">
                  {service.title}
                </h3>
                <p className="text-zinc-600 text-lg mb-4">{service.text}</p>
                {service.list && (
                  <ul className="list-disc pl-6 text-zinc-600 mb-4 space-y-1">
                    {service.list.map((item, i) => (
                      <li key={i}>
                        {item.includes("8.5%") ? (
                          <span className="text-green-600 font-semibold">
                            {item}
                          </span>
                        ) : (
                          item
                        )}
                      </li>
                    ))}
                  </ul>
                )}
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition">
                  {service.button}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-gray-100 py-16 px-4 sm:px-8">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center text-zinc-800 mb-10"
          {...fadeInUp}
        >
          Why Users Love NestCash
        </motion.h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="bg-white p-6 rounded-xl shadow-md hover:scale-105 hover:bg-zinc-50 transition-transform duration-300"
              {...fadeInUp}
            >
              <p className="text-zinc-600 italic mb-4">{t.quote}</p>
              <h4 className="font-semibold text-zinc-800">{t.name}</h4>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        className="bg-blue-50 py-16 px-4 text-center text-zinc-800"
        {...fadeInUp}
      >
        <h2 className="text-3xl font-bold mb-4">
          Join Us Now and Save Your Money
        </h2>
        <p className="mb-6 text-lg">
          Start budgeting, saving, and investing with confidence.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-transform duration-300 hover:scale-105">
          Create Your Free Account
        </button>
      </motion.div>
    </>
  );
};

export default Services;
