import { motion } from "framer-motion";

function Footer({
  businessEmail = "Egileweprecious1@gmail.com",
  businessPhoneDisplay = "+234 913 283 0290",
}) {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const menuLinks = [
    { label: "Fresh Akara", id: "menu" },
    { label: "Serving Ideas", id: "menu" },
    { label: "How To Order", id: "delivery" },
    { label: "Delivery Info", id: "delivery" },
  ];

  const companyLinks = [
    { label: "About Us", id: "about" },
    { label: "Our Story", id: "about" },
    { label: "Reviews", id: "reviews" },
    { label: "Contact", id: "contact" },
  ];

  const contactLinks = [
    { label: businessPhoneDisplay || "+234 913 283 0290" },
    { label: businessEmail || "Egileweprecious1@gmail.com" },
    { label: "Abraka, Delta State" },
    { label: "Mon–Sun 6AM–2PM" },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-950 via-gray-900 to-orange-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgba(249,115,22,0.15),transparent)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-16 pb-8 relative">
        <div className="grid md:grid-cols-4 gap-10 pb-10 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center font-black">
                MA
              </div>

              <div>
                <span className="text-white font-black text-xl">Mama</span>
                <span className="text-orange-400 font-black text-xl">
                  {" "}
                  Akara
                </span>
              </div>
            </div>

            <p className="text-white/50 text-sm leading-relaxed">
              Nigeria's finest akara, delivered hot to your door every morning.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">
              Menu
            </h4>

            <ul className="flex flex-col gap-2">
              {menuLinks.map((link) => (
                <li key={`menu-${link.label}`}>
                  <button
                    type="button"
                    onClick={() => scrollTo(link.id)}
                    className="text-white/50 hover:text-orange-400 text-sm transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">
              Company
            </h4>

            <ul className="flex flex-col gap-2">
              {companyLinks.map((link) => (
                <li key={`company-${link.label}`}>
                  <button
                    type="button"
                    onClick={() => scrollTo(link.id)}
                    className="text-white/50 hover:text-orange-400 text-sm transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">
              Contact
            </h4>

            <ul className="flex flex-col gap-2">
              {contactLinks.map((item, index) => (
                <li key={`contact-${index}-${item.label}`}>
                  <span className="text-white/50 text-sm">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="py-8 border-b border-white/10">
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="text-white font-black text-xl mb-2">
              Get exclusive offers
            </h4>

            <p className="text-white/50 text-sm mb-4">
              Join 10k+ subscribers for weekly deals
            </p>

            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:border-orange-500 outline-none"
              />

              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-2xl font-bold"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">
            © 2026 Mama Akara. Made with Beans in Abraka, Delta State.
          </p>

          <div className="flex gap-4 text-white/30 text-sm">
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>

            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;