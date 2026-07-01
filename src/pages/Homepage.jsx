import { useState, useEffect, createContext, useContext, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";

import Navbar from "../component/Navbar.jsx";
import Footer from "../component/Footer.jsx";

import monday from "../assets/monday.jpg";
import Enjoy from "../assets/Enjoy.jpg";
import Pap from "../assets/Pap.jpg";
import Sugar from "../assets/Sugar.jpg";
import Sweet from "../assets/Sweet.jpg";

export const BUSINESS_EMAIL = "Egileweprecious1@gmail.com";
export const BUSINESS_PHONE_DISPLAY = "+234 913 283 0290";
const BUSINESS_WHATSAPP_NUMBER = "2349132830290";

// ─── Toast Context ────────────────────────────────────────────────────────────
const ToastContext = createContext();
const useToast = () => useContext(ToastContext);

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const showToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-24 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              transition={{ type: "spring", damping: 20 }}
              className={`pointer-events-auto px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-3 min-w-[280px] ${
                t.type === "success"
                  ? "bg-green-500/90 text-white border-green-300/30"
                  : t.type === "error"
                  ? "bg-red-500/90 text-white border-red-300/30"
                  : "bg-orange-500/90 text-white border-orange-300/30"
              }`}
            >
              <span className="text-xl">
                {t.type === "success" ? "✅" : t.type === "error" ? "❌" : "🔔"}
              </span>
              <span className="font-semibold text-sm">{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

// ─── Theme Context ────────────────────────────────────────────────────────────
const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

function ThemeProvider({ children }) {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  return (
    <ThemeContext.Provider value={{ dark, setDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ─── Scroll Progress ──────────────────────────────────────────────────────────
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 z-[100] origin-left"
      style={{ scaleX }}
    />
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function Hero({ onOrderClick }) {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  const stats = [
    { val: "10k+", label: "Happy Customers" },
    { val: "4.9★", label: "Average Rating" },
    { val: "Fast", label: "Swift Delivery" },
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-orange-950/60 to-gray-900" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(249,115,22,0.35),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_75%_60%,rgba(239,68,68,0.2),transparent)]" />

      <motion.div
        style={{ y: y1 }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-[128px]"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-500/15 rounded-full blur-[100px]"
        animate={{ scale: [1.2, 1, 1.2] }}
        transition={{ duration: 7, repeat: Infinity }}
      />

      {[
        { emoji: "🌶️", top: "12%", left: "8%", delay: 0 },
        { emoji: "🫘", top: "20%", left: "78%", delay: 0.5 },
        { emoji: "✨", top: "60%", left: "5%", delay: 1 },
        { emoji: "🌿", top: "75%", left: "82%", delay: 1.5 },
        { emoji: "⭐", top: "10%", left: "55%", delay: 0.8 },
        { emoji: "🔥", top: "50%", left: "92%", delay: 1.2 },
      ].map((p, i) => (
        <motion.span
          key={i}
          className="absolute text-2xl sm:text-3xl pointer-events-none select-none"
          style={{ top: p.top, left: p.left }}
          animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4 + i, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        >
          {p.emoji}
        </motion.span>
      ))}

      <motion.div
        style={{ opacity }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-20 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full"
      >
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-1.5 w-fit backdrop-blur-sm"
          >
            <motion.span
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-orange-400"
            />
            <span className="text-orange-400 text-xs sm:text-sm font-semibold tracking-wide">
              🔥 Fresh & Hot · Delivered Daily
            </span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight">
            Nigeria's{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-orange-400 via-red-400 to-orange-500 bg-clip-text text-transparent">
                Finest
              </span>
              <motion.svg
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 1, duration: 1.5 }}
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 8"
                fill="none"
              >
                <motion.path
                  d="M0 6 Q50 0 100 5 Q150 10 200 4"
                  stroke="url(#underlineGrad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
                <defs>
                  <linearGradient id="underlineGrad" x1="0" y1="0" x2="200" y2="0">
                    <stop stopColor="#f97316" />
                    <stop offset="1" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
              </motion.svg>
            </span>{" "}
            <br />
            Akara,{" "}
            <span className="text-white/60">Delivered Hot</span>
          </h1>

          <p className="text-white/60 text-base sm:text-lg lg:text-xl leading-relaxed max-w-lg">
            Crispy on the outside, fluffy on the inside. Made fresh every morning
            from premium black-eyed beans by Mama herself — straight to your door.
          </p>

          <div className="flex gap-6 sm:gap-8 py-2">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <div className="text-xl sm:text-2xl font-black text-orange-400">{s.val}</div>
                <div className="text-white/50 text-xs mt-0.5">{s.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 sm:gap-4 mt-2">
            <motion.button
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOrderClick}
              className="group relative bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-bold text-base sm:text-lg overflow-hidden shadow-2xl shadow-orange-500/40"
            >
              <span className="relative z-10 flex items-center gap-2">
                Order Now
                <motion.svg
                  className="w-5 h-5"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </motion.svg>
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}
              className="border border-white/20 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-bold text-base sm:text-lg backdrop-blur-sm hover:border-orange-500/50 hover:bg-orange-500/10 flex items-center gap-2"
            >
              <span>🍽️</span> View Menu
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative flex items-center justify-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute w-80 h-80 lg:w-[480px] lg:h-[480px] rounded-full border border-orange-500/10"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute w-64 h-64 lg:w-96 lg:h-96 rounded-full border border-orange-500/15"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute w-72 h-72 lg:w-[420px] lg:h-[420px] bg-gradient-to-br from-orange-600/40 via-red-600/25 to-amber-500/30 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ y: [0, -15, 0], rotateZ: [0, 2, 0, -2, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.05 }}
            className="relative z-10 w-72 h-72 sm:w-80 sm:h-80 lg:w-[420px] lg:h-[420px] rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.05)]"
          >
            <img src={monday} alt="Premium Akara" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-orange-950/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="bg-black/50 backdrop-blur-md rounded-xl px-3 py-1.5 border border-white/10">
                <span className="text-orange-400 text-xs font-bold">⭐ 4.9 Rating</span>
              </div>
              <div className="bg-orange-500/80 backdrop-blur-md rounded-xl px-3 py-1.5">
                <span className="text-white text-xs font-bold">🔥 Hot & Fresh</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -top-2 -right-2 sm:-top-6 sm:-right-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3 shadow-xl"
          >
            <div className="text-2xl mb-1">🫘</div>
            <div className="text-white text-xs font-bold">Premium Beans</div>
            <div className="text-white/50 text-[10px]">100% Natural</div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute -bottom-2 -left-2 sm:-bottom-6 sm:-left-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3 shadow-xl"
          >
            <div className="text-2xl mb-1">🚚</div>
            <div className="text-white text-xs font-bold">Fast Delivery</div>
            <div className="text-orange-400 text-[10px] font-bold">Swift & Quick</div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ badge, title, highlight, sub, dark = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12 sm:mb-16"
    >
      <div className={`inline-flex items-center gap-2 ${dark ? "bg-white/5 border-white/10" : "bg-orange-50 border-orange-200"} border rounded-full px-4 py-1.5 mb-4`}>
        <span className={`${dark ? "text-orange-400" : "text-orange-600"} text-sm font-semibold`}>{badge}</span>
      </div>
      <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight ${dark ? "text-white" : "text-gray-900"}`}>
        {title}{" "}
        <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
          {highlight}
        </span>
      </h2>
      {sub && (
        <p className={`${dark ? "text-white/50" : "text-gray-500"} mt-4 text-base sm:text-lg max-w-xl mx-auto`}>
          {sub}
        </p>
      )}
    </motion.div>
  );
}

// ─── Gallery Images ───────────────────────────────────────────────────────────
const GALLERY = [
  { id: 1, name: "Akara & Creamy Pap", desc: "Pair your akara with smooth, warm pap for a classic breakfast.", img: Pap, tag: "Classic Pairing" },
  { id: 2, name: "Akara & Custard", desc: "Crispy akara with rich, creamy custard — breakfast royalty.", img: Enjoy, tag: "Sweet Combo" },
  { id: 3, name: "Akara Sandwich", desc: "Stuff fresh akara into soft bread with greens and chilled juice.", img: Sugar, tag: "On-The-Go" },
  { id: 4, name: "Akara On Its Own", desc: "Just our golden, crispy akara — fluffy inside, perfect anytime.", img: Sweet, tag: "Pure & Simple" },
];

const AKARA_PRODUCT = {
  id: "akara-single",
  name: "Fresh Akara (Beans Cake)",
  desc: "Crispy on the outside, fluffy on the inside. Made fresh every morning from premium black-eyed beans.",
  price: 100,
  img: monday,
};

// ─── Menu / Order Section ─────────────────────────────────────────────────────
function ProductSection({ cart, setCart }) {
  const { showToast } = useToast();
  const inCart = cart[AKARA_PRODUCT.id]?.qty || 0;
  const totalPrice = inCart * AKARA_PRODUCT.price;

  const increment = () => {
    setCart((c) => ({
      ...c,
      [AKARA_PRODUCT.id]: {
        ...AKARA_PRODUCT,
        qty: (c[AKARA_PRODUCT.id]?.qty || 0) + 1,
      },
    }));
  };

  const decrement = () => {
    setCart((c) => {
      const current = c[AKARA_PRODUCT.id]?.qty || 0;
      if (current <= 1) {
        const next = { ...c };
        delete next[AKARA_PRODUCT.id];
        return next;
      }
      return {
        ...c,
        [AKARA_PRODUCT.id]: { ...AKARA_PRODUCT, qty: current - 1 },
      };
    });
  };

  const tagColor = {
    "Classic Pairing": "bg-orange-500",
    "Sweet Combo": "bg-purple-500",
    "On-The-Go": "bg-pink-500",
    "Pure & Simple": "bg-blue-500",
  };

  return (
    <section id="menu" className="py-20 sm:py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-200/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative">
        <SectionHeader
          badge="🛒 Order Now"
          title="Get Your Fresh"
          highlight="Akara"
          sub="Just ₦100 per piece. Use the buttons to set your quantity — your cart updates instantly."
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-24"
        >
          <div className="grid md:grid-cols-2">
            <div className="relative h-72 md:h-auto overflow-hidden bg-gradient-to-br from-orange-100 to-amber-50">
              <motion.img
                src={AKARA_PRODUCT.img}
                alt={AKARA_PRODUCT.name}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <span className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                🔥 Fresh & Hot
              </span>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="bg-black/50 backdrop-blur-md rounded-lg px-3 py-1.5 flex items-center gap-1">
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-white text-sm font-bold">4.9</span>
                </div>
                <div className="bg-black/50 backdrop-blur-md rounded-lg px-3 py-1.5">
                  <span className="text-white text-sm font-bold">⚡ Swift</span>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                  {AKARA_PRODUCT.name}
                </h3>
                <p className="text-gray-500 mt-3 leading-relaxed">{AKARA_PRODUCT.desc}</p>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-gray-400 text-sm">Price per piece:</span>
                  <span className="text-orange-500 font-black text-xl">₦{AKARA_PRODUCT.price}</span>
                </div>
              </div>

              <div className="mt-6">
                <label className="text-sm font-bold text-gray-700 mb-3 block">
                  Select Quantity
                </label>

                <div className="flex items-center justify-between bg-orange-50 rounded-2xl p-3 border-2 border-orange-100">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={decrement}
                    disabled={inCart <= 0}
                    className="w-12 h-12 rounded-xl bg-white text-orange-600 font-black text-2xl shadow-md hover:bg-orange-500 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-orange-600"
                  >
                    −
                  </motion.button>

                  <div className="text-center">
                    <motion.div
                      key={inCart}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-4xl font-black text-gray-900"
                    >
                      {inCart}
                    </motion.div>
                    <div className="text-xs text-gray-500 font-semibold">
                      {inCart === 1 ? "piece" : "pieces"}
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={increment}
                    className="w-12 h-12 rounded-xl bg-orange-500 text-white font-black text-2xl shadow-md hover:bg-orange-600 transition-colors"
                  >
                    +
                  </motion.button>
                </div>

                <AnimatePresence>
                  {inCart > 0 && (
                    <motion.div
                      key={totalPrice}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      className="mt-4 flex items-center justify-between p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl text-white"
                    >
                      <span className="font-bold">Total in cart</span>
                      <span className="text-2xl font-black">₦{totalPrice.toLocaleString()}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`mt-4 w-full py-4 rounded-2xl font-black shadow-lg flex items-center justify-center gap-2 text-white transition-colors ${
                    inCart > 0
                      ? "bg-gray-900 cursor-default"
                      : "bg-gray-300 cursor-default"
                  }`}
                >
                  {inCart > 0
                    ? `${inCart} ${inCart === 1 ? "piece" : "pieces"} in cart — open cart to checkout`
                    : "Use + to add akara to your cart"}
                  <span>🛒</span>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        <SectionHeader
          badge="💡 Serving Ideas"
          title="How To Enjoy Your"
          highlight="Akara"
          sub="Akara goes great with many sides. Here are some delicious ways to enjoy it."
        />

        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {GALLERY.map((g, i) => (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -8 }}
              className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-500 border border-gray-100"
            >
              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-orange-100 to-amber-50">
                <motion.img
                  src={g.img}
                  alt={g.name}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full text-white ${tagColor[g.tag]} shadow-lg`}>
                  {g.tag}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-black text-gray-900 text-lg leading-tight">{g.name}</h3>
                <p className="text-gray-500 text-sm mt-2 leading-relaxed">{g.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-gray-400 text-sm mt-8 italic"
        >
          * Images shown are serving suggestions. We only sell freshly fried akara.
        </motion.p>
      </div>
    </section>
  );
}

// ─── Cart Drawer ──────────────────────────────────────────────────────────────
function CartDrawer({ open, onClose, cart, setCart, onCheckout }) {
  const items = Object.values(cart);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const total = subtotal;

  const update = (id, delta) => {
    setCart((c) => {
      const next = { ...c };
      if (!next[id]) return next;
      next[id] = { ...next[id], qty: next[id].qty + delta };
      if (next[id].qty <= 0) delete next[id];
      return next;
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[440px] bg-white z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-orange-500 to-red-500 text-white">
              <div>
                <h3 className="text-2xl font-black">Your Cart</h3>
                <p className="text-white/80 text-sm">
                  {items.length} item{items.length !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <div className="text-7xl mb-4">🛒</div>
                  <h4 className="text-xl font-black text-gray-900">Your cart is empty</h4>
                  <p className="text-gray-500 mt-2">Add some delicious akara to get started!</p>
                  <button
                    onClick={onClose}
                    className="mt-6 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-2xl font-bold"
                  >
                    Browse Menu
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex gap-3 p-3 bg-gray-50 rounded-2xl"
                      >
                        <img src={item.img} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                          <p className="text-orange-500 font-black text-base">₦{item.price.toLocaleString()}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => update(item.id, -1)}
                              className="w-7 h-7 rounded-lg bg-white border border-gray-200 font-black text-gray-700 hover:bg-orange-500 hover:text-white hover:border-transparent transition-colors"
                            >
                              −
                            </button>
                            <span className="font-bold text-sm w-6 text-center">{item.qty}</span>
                            <button
                              onClick={() => update(item.id, 1)}
                              className="w-7 h-7 rounded-lg bg-white border border-gray-200 font-black text-gray-700 hover:bg-orange-500 hover:text-white hover:border-transparent transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => update(item.id, -item.qty)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          🗑️
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl text-xs text-blue-700 flex items-start gap-2">
                  <span>🚚</span>
                  <span>
                    <strong>Delivery fee</strong> is paid directly to the rider upon arrival.
                  </span>
                </div>
                <div className="flex justify-between text-lg font-black text-gray-900 pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-orange-500">₦{total.toLocaleString()}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onCheckout}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-2xl font-black shadow-lg shadow-orange-500/40"
                >
                  Proceed to Checkout →
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Env / Config ─────────────────────────────────────────────────────────────
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

async function sendDeliveryDetailsEmail(form, cart = {}) {
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    console.warn("EmailJS is not configured — skipping delivery details email.");
    return;
  }
  const items = Object.values(cart);
  const orderSummary = items.length
    ? items.map((i) => `• ${i.name} x${i.qty} — ₦${(i.price * i.qty).toLocaleString()}`).join("\n")
    : "No items in cart yet";
  const totalAmount = items.reduce((s, i) => s + i.price * i.qty, 0);
  const fullMessage = `ORDER DETAILS:\n${orderSummary}\n\nTotal Amount: ₦${totalAmount.toLocaleString()}\n\nSpecial Instructions:\n${form.note || "None"}`;
  try {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: {
          fullname: form.name,
          email: form.email || "Not provided",
          phone: form.phone,
          address: form.address,
          message: fullMessage,
          time: new Date().toLocaleString("en-NG", { dateStyle: "full", timeStyle: "short" }),
          title: "New Delivery Request",
        },
      }),
    });
    if (!response.ok) throw new Error(await response.text());
    console.log("Delivery details emailed to business successfully.");
  } catch (err) {
    console.error("Failed to send delivery details email:", err);
  }
}

async function createorderToSupabase({ form, items, total, transaction }) {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/create-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      customerName: form.name,
      customerEmail: form.email,
      customerPhone: form.phone,
      deliveryAddress: form.address,
      orderNotes: form.note || "",
      items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
      subtotal: total,
      totalAmount: total,
      paymentChannel: transaction.channel || "card",
      paystackReference: transaction.reference,
    }),
  });
  if (!response.ok) throw new Error(`Edge function error: ${await response.text()}`);
  return response.json();
}

function generatePaystackRef() {
  return `AKARA_${Date.now()}_${Math.floor(Math.random() * 1_000_000)}`;
}

function getPaystackChannels(method) {
  const map = { card: ["card"], bank_transfer: ["bank_transfer"], ussd: ["ussd"], qr: ["qr"], bank: ["bank"] };
  return map[method] ?? ["card", "bank_transfer", "ussd", "qr"];
}

// ─── Checkout Modal ───────────────────────────────────────────────────────────
function CheckoutModal({ open, onClose, cart, setCart }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", note: "" });
  const [payMethod, setPayMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { showToast } = useToast();

  const items = Object.values(cart);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const total = subtotal;

  const reset = () => {
    setStep(1);
    setForm({ name: "", phone: "", email: "", address: "", note: "" });
    setPayMethod("card");
    setSuccess(false);
    setLoading(false);
  };

  const close = () => {
    onClose();
    setTimeout(reset, 400);
  };

  const handlePay = () => {
    if (typeof window.PaystackPop === "undefined") {
      showToast("Payment gateway not loaded. Please refresh the page.", "error");
      return;
    }
    if (!form.email) {
      showToast("Please go back and enter your email address.", "error");
      return;
    }
    if (!PAYSTACK_PUBLIC_KEY) {
      showToast("Payment configuration error. Please contact support.", "error");
      return;
    }
    if (total < 100) {
      showToast("Minimum order amount is ₦100.", "error");
      return;
    }

    setLoading(true);
    const reference = generatePaystackRef();
    const popup = new window.PaystackPop();

    popup.newTransaction({
      key: PAYSTACK_PUBLIC_KEY,
      email: form.email,
      firstName: form.name.split(" ")[0] || "",
      lastName: form.name.split(" ").slice(1).join(" ") || "",
      phone: form.phone,
      amount: total * 100,
      currency: "NGN",
      ref: reference,
      channels: getPaystackChannels(payMethod),
      metadata: {
        custom_fields: [
          { display_name: "Customer Name", variable_name: "customer_name", value: form.name },
          { display_name: "Phone Number", variable_name: "phone_number", value: form.phone },
          { display_name: "Delivery Address", variable_name: "delivery_address", value: form.address },
          { display_name: "Order Notes", variable_name: "order_notes", value: form.note || "None" },
          { display_name: "Items Ordered", variable_name: "items_ordered", value: items.map((i) => `${i.name} x${i.qty}`).join(", ") },
        ],
      },
      onSuccess: async (transaction) => {
        try {
          await createorderToSupabase({ form, items, total, transaction });
          showToast("Order saved! Your akara is being prepared.");
        } catch (err) {
          console.error("Failed to save order to Supabase:", err);
          showToast("Payment received! Note: order record may need manual review.", "info");
        }
        setLoading(false);
        setSuccess(true);
        showToast("Payment successful! Your akara is on the way!");
        setTimeout(() => { setCart({}); close(); }, 3500);
      },
      onCancel: () => {
        setLoading(false);
        showToast("Payment was cancelled. Try again when you're ready.", "info");
      },
      onError: (error) => {
        setLoading(false);
        console.error("Paystack error:", JSON.stringify(error, null, 2));
        showToast(`Payment failed: ${error?.message || "Unknown error"}`, "error");
      },
    });
  };

  const canNext1 = form.name && form.phone && form.address;
  const canNext2 = items.length > 0;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          onClick={close}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
          >
            <div className="p-6 bg-gradient-to-r from-orange-500 to-red-500 text-white relative">
              <button onClick={close} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center">✕</button>
              <h2 className="text-2xl font-black">Checkout</h2>
              <p className="text-white/80 text-sm mt-1">Complete your order in 3 easy steps</p>
              <div className="flex items-center gap-2 mt-4">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex-1 flex items-center gap-2">
                    <motion.div
                      animate={{ backgroundColor: step >= s ? "#fff" : "rgba(255,255,255,0.2)", scale: step === s ? 1.2 : 1 }}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-orange-600 font-black text-sm"
                    >
                      {success && s === 3 ? "✓" : s}
                    </motion.div>
                    {s < 3 && (
                      <div className="flex-1 h-1 rounded-full bg-white/20 overflow-hidden">
                        <motion.div animate={{ width: step > s ? "100%" : "0%" }} className="h-full bg-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs mt-2 text-white/80 font-semibold">
                <span>Details</span><span>Review</span><span>Payment</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                    <h3 className="text-lg font-black text-gray-900">Delivery Details</h3>
                    {[
                      { key: "name", label: "Full Name", type: "text", icon: "👤" },
                      { key: "phone", label: "Phone Number", type: "tel", icon: "📱" },
                      { key: "email", label: "Email (for receipt)", type: "email", icon: "✉️" },
                      { key: "address", label: "Delivery Address (Abraka)", type: "text", icon: "📍" },
                    ].map((f) => (
                      <div key={f.key} className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">{f.icon}</span>
                        <input
                          type={f.type}
                          value={form[f.key]}
                          onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                          placeholder={f.label}
                          className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all"
                        />
                      </div>
                    ))}
                    <textarea
                      value={form.note}
                      onChange={(e) => setForm({ ...form, note: e.target.value })}
                      placeholder="Special instructions (optional)"
                      rows={3}
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all resize-none"
                    />
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 flex items-start gap-2">
                      <span className="text-base">ℹ️</span>
                      <span><strong>Note:</strong> We deliver within Abraka, Delta State. Delivery fee is paid directly to the rider upon arrival.</span>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                    <h3 className="text-lg font-black text-gray-900">Order Summary</h3>
                    <div className="space-y-3">
                      {items.map((i) => (
                        <div key={i.id} className="flex gap-3 p-3 bg-gray-50 rounded-2xl">
                          <img src={i.img} alt={i.name} className="w-16 h-16 rounded-xl object-cover" />
                          <div className="flex-1">
                            <p className="font-bold text-gray-900 text-sm">{i.name}</p>
                            <p className="text-xs text-gray-500">Qty: {i.qty}</p>
                          </div>
                          <p className="font-black text-orange-500">₦{(i.price * i.qty).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 bg-orange-50 rounded-2xl space-y-2">
                      <div className="flex justify-between text-sm text-gray-700">
                        <span>Subtotal</span>
                        <span className="font-bold">₦{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-700">
                        <span>Delivery</span>
                        <span className="font-bold text-blue-600">Paid on Delivery</span>
                      </div>
                      <div className="flex justify-between font-black text-lg text-orange-600 pt-2 border-t border-orange-200">
                        <span>Total to Pay Now</span>
                        <span>₦{total.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-2xl text-sm text-blue-700">
                      <strong>Delivering to:</strong> {form.address}
                    </div>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-2xl text-xs text-green-800 flex items-start gap-2">
                      <span>⚡</span>
                      <span><strong>Fast & Swift Delivery:</strong> Your akara will be delivered immediately once payment is received.</span>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                    {loading && (
                      <div className="py-12 text-center">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-16 h-16 mx-auto border-4 border-orange-200 border-t-orange-500 rounded-full" />
                        <p className="mt-4 font-bold text-gray-900">Opening payment window...</p>
                        <p className="text-sm text-gray-500 mt-1">Please don't close this window</p>
                      </div>
                    )}
                    {success && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 15 }} className="py-8 text-center">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: 360 }} transition={{ delay: 0.2, type: "spring" }} className="w-24 h-24 mx-auto bg-green-500 rounded-full flex items-center justify-center text-5xl shadow-2xl shadow-green-500/40">✓</motion.div>
                        <h3 className="text-2xl font-black text-gray-900 mt-6">Order Confirmed!</h3>
                        <p className="text-gray-500 mt-2">Your akara is being prepared</p>
                        <p className="text-sm text-orange-500 font-bold mt-3">Fast & swift delivery on the way!</p>
                      </motion.div>
                    )}
                    {!loading && !success && (
                      <>
                        <h3 className="text-lg font-black text-gray-900">Choose Payment Method</h3>
                        <div className="grid grid-cols-1 gap-3">
                          {[
                            { id: "card", icon: "💳", label: "ATM / Debit Card", sub: "Visa, Mastercard, Verve" },
                            { id: "bank_transfer", icon: "🏦", label: "Bank Transfer", sub: "Transfer from any Nigerian bank" },
                            { id: "ussd", icon: "📱", label: "USSD", sub: "Dial a shortcode from your phone" },
                            { id: "qr", icon: "📷", label: "QR Code", sub: "Scan and pay instantly" },
                            { id: "bank", icon: "🏧", label: "Pay with Bank", sub: "Direct debit from your bank account" },
                          ].map((method) => (
                            <motion.button
                              key={method.id}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setPayMethod(method.id)}
                              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${payMethod === method.id ? "border-orange-500 bg-orange-50" : "border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50/50"}`}
                            >
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm flex-shrink-0 ${payMethod === method.id ? "bg-orange-500" : "bg-gray-100"}`}>{method.icon}</div>
                              <div className="flex-1">
                                <p className={`font-black text-sm ${payMethod === method.id ? "text-orange-600" : "text-gray-900"}`}>{method.label}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{method.sub}</p>
                              </div>
                              {payMethod === method.id && (
                                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-xs font-bold text-white bg-orange-500 px-2.5 py-1 rounded-full flex-shrink-0">Selected</motion.span>
                              )}
                            </motion.button>
                          ))}
                        </div>
                        <div className="p-4 bg-gray-50 rounded-2xl">
                          <div className="flex justify-between font-black text-xl">
                            <span className="text-gray-900">You'll pay</span>
                            <span className="text-orange-500">₦{total.toLocaleString()}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">+ Delivery fee paid to rider on arrival</p>
                        </div>
                        <div className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
                          Secured by <span className="font-bold text-gray-700">Paystack</span>. We never store your card details.
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {!loading && !success && (
              <div className="p-6 border-t border-gray-100 flex gap-3">
                {step > 1 && (
                  <button onClick={() => setStep(step - 1)} className="px-6 py-3 rounded-2xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-50">Back</button>
                )}
                <button
                  onClick={() => {
                    if (step === 3) { handlePay(); }
                    else if (step === 1) { sendDeliveryDetailsEmail(form, cart); setStep(step + 1); }
                    else { setStep(step + 1); }
                  }}
                  disabled={(step === 1 && !canNext1) || (step === 2 && !canNext2)}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-2xl font-black shadow-lg shadow-orange-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {step === 3 ? `Pay ₦${total.toLocaleString()} with Paystack` : "Continue"}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Why Us ───────────────────────────────────────────────────────────────────
function WhyUs() {
  const features = [
    { icon: "🔥", title: "Made Fresh Daily", desc: "Every batch is prepared at dawn with freshly soaked beans. Zero compromise.", color: "from-orange-400 to-red-500", bg: "bg-orange-50" },
    { icon: "🚀", title: "Lightning Delivery", desc: "Fast and swift delivery immediately once payment is received.", color: "from-blue-400 to-purple-500", bg: "bg-blue-50" },
    { icon: "💎", title: "Premium Quality", desc: "We use only the finest local black-eyed beans and pure palm oil.", color: "from-amber-400 to-orange-500", bg: "bg-amber-50" },
    { icon: "💰", title: "Unbeatable Prices", desc: "Restaurant-quality akara at street-food prices. Just ₦100 per piece.", color: "from-green-400 to-emerald-500", bg: "bg-green-50" },
    { icon: "🛡️", title: "Hygienic & Safe", desc: "Top food safety standards. Sealed packaging every time.", color: "from-pink-400 to-rose-500", bg: "bg-pink-50" },
    { icon: "📱", title: "Easy Ordering", desc: "Order in seconds. Pay online securely with Paystack.", color: "from-violet-400 to-purple-500", bg: "bg-violet-50" },
  ];

  return (
    <section id="about" className="py-20 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <SectionHeader badge="💡 Why Us" title="Why Thousands Choose" highlight="Mama Akara" sub="We deliver joy, culture, and memories — not just food." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -8 }}
              className="group p-8 rounded-3xl border border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-500 bg-white"
            >
              <motion.div whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }} className={`w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center text-3xl mb-5`}>
                {f.icon}
              </motion.div>
              <h3 className="text-xl font-black text-gray-900 mb-3">{f.title}</h3>
              <p className="text-gray-500 leading-relaxed">{f.desc}</p>
              <motion.div initial={{ width: "3rem" }} whileHover={{ width: "100%" }} className={`mt-5 h-1 rounded-full bg-gradient-to-r ${f.color}`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
  const reviews = [
    { name: "Chioma Okonkwo", role: "Food Blogger · Abraka", avatar: "CO", rating: 5, text: "Hands-down the best akara I've ever had. The crispiness, the flavor — unmatched. I order every weekend!", color: "from-orange-400 to-red-400" },
    { name: "Emeka Nwosu", role: "Engineer · Abraka", avatar: "EN", rating: 5, text: "Having fresh hot akara delivered every morning has been a game changer. Consistently excellent quality.", color: "from-purple-400 to-blue-400" },
    { name: "Fatima Aliyu", role: "Nurse · Delta", avatar: "FA", rating: 5, text: "My kids absolutely devoured the family pack! Will definitely order again. Fast delivery too.", color: "from-green-400 to-emerald-400" },
    { name: "Tunde Adeyemi", role: "Business Owner", avatar: "TA", rating: 5, text: "Catered our office breakfast and everyone was blown away. Professional, on-time, delicious. 10/10!", color: "from-pink-400 to-rose-400" },
    { name: "Blessing Eze", role: "Teacher · Abraka", avatar: "BE", rating: 5, text: "The akara takes me back to my grandmother's kitchen. Authentic taste, fair price.", color: "from-amber-400 to-orange-400" },
    { name: "David Obi", role: "Student · DELSU", avatar: "DO", rating: 5, text: "Best breakfast deal for students! The akara is fire. Delivers to campus too.", color: "from-blue-400 to-violet-400" },
  ];

  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % reviews.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="reviews" className="py-20 sm:py-24 bg-gray-950 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(249,115,22,0.15),transparent)]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative">
        <SectionHeader badge="⭐ Customer Love" title="What Our" highlight="Customers Say" sub="Over 10,000 happy customers and counting." dark />

        <div className="max-w-3xl mx-auto mb-12 h-64 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col justify-center"
            >
              <div className="flex gap-1 mb-4">
                {Array(reviews[index].rating).fill(0).map((_, i) => <span key={i} className="text-orange-400 text-xl">⭐</span>)}
              </div>
              <p className="text-white/80 text-lg leading-relaxed mb-6 italic">"{reviews[index].text}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${reviews[index].color} flex items-center justify-center text-white font-black`}>{reviews[index].avatar}</div>
                <div>
                  <div className="text-white font-bold">{reviews[index].name}</div>
                  <div className="text-white/40 text-xs">{reviews[index].role}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-2 mb-12">
          {reviews.map((_, i) => (
            <button key={i} onClick={() => setIndex(i)} className={`h-2 rounded-full transition-all ${i === index ? "w-8 bg-orange-500" : "w-2 bg-white/20"}`} />
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all"
            >
              <div className="flex gap-0.5 mb-3">
                {Array(r.rating).fill(0).map((_, j) => <span key={j} className="text-orange-400">⭐</span>)}
              </div>
              <p className="text-white/70 text-sm leading-relaxed mb-4">{r.text}</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${r.color} flex items-center justify-center text-white text-sm font-black`}>{r.avatar}</div>
                <div>
                  <div className="text-white font-bold text-sm">{r.name}</div>
                  <div className="text-white/40 text-xs">{r.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Delivery ─────────────────────────────────────────────────────────────────
function DeliveryProcess() {
  const steps = [
    { step: "01", icon: "📱", title: "Place Order", desc: "Choose your items in less than 60 seconds." },
    { step: "02", icon: "💳", title: "Make Payment", desc: "Pay securely online via Paystack." },
    { step: "03", icon: "👩‍🍳", title: "We Prepare", desc: "Mama springs into action, frying fresh — immediately." },
    { step: "04", icon: "🏠", title: "Swift Delivery", desc: "Hot akara arrives at your doorstep fast." },
  ];

  return (
    <section id="delivery" className="py-20 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <SectionHeader badge="🚀 How It Works" title="Order in" highlight="4 Simple Steps" sub="From your phone to your door — fast and delicious." />
        <div className="relative">
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-orange-200 via-orange-400 to-orange-200" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }} className="relative text-center group">
                <div className="relative inline-flex items-center justify-center mb-6">
                  <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="w-16 h-16 rounded-full bg-white border-2 border-orange-200 group-hover:border-orange-500 group-hover:shadow-lg group-hover:shadow-orange-500/30 transition-all flex items-center justify-center text-3xl relative z-10">
                    {s.icon}
                  </motion.div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white text-xs font-black flex items-center justify-center shadow-md">{s.step}</div>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            {[
              { icon: "📍", label: "Delivery Zones", value: "Within Abraka, Delta State" },
              { icon: "⚡", label: "Average Time", value: "Fast & Swift Delivery" },
              { icon: "💵", label: "Delivery Fee", value: "Paid on Delivery" },
            ].map((stat, i) => (
              <div key={i} className="p-4">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
                <div className="text-lg sm:text-xl lg:text-2xl font-black text-gray-900 mt-1">{stat.value}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-100 rounded-2xl text-center text-sm text-gray-700">
            ⚡ <strong>Immediate delivery</strong> once payment is received — your akara is on the way!
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Contact Section ──────────────────────────────────────────────────────────
function Contact() {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
    showToast("Message sent! We'll get back to you soon.");
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section id="contact" className="py-20 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <SectionHeader badge="📞 Get In Touch" title="Let's" highlight="Connect" sub="Questions? Catering inquiries? We're here for you." />

        <div className="grid lg:grid-cols-2 gap-10">
          <div className="space-y-4">
            {[
              { icon: "📍", title: "Visit Us", text: "Abraka, Delta State, Nigeria" },
              { icon: "📞", title: "Call Us", text: BUSINESS_PHONE_DISPLAY },
              { icon: "✉️", title: "Email", text: BUSINESS_EMAIL },
              { icon: "🕒", title: "Hours", text: "Mon – Sun, 6:00 AM – 2:00 PM" },
            ].map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ x: 8 }}
                className="flex items-center gap-4 p-5 bg-orange-50 rounded-2xl border border-orange-100"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-2xl shadow-lg">{c.icon}</div>
                <div>
                  <p className="font-black text-gray-900">{c.title}</p>
                  <p className="text-gray-600 text-sm">{c.text}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onSubmit={submit}
            className="bg-gradient-to-br from-gray-50 to-orange-50/50 p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4"
          >
            <h3 className="text-xl font-black text-gray-900 mb-2">Send us a message</h3>

            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 bg-green-50 border border-green-200 rounded-2xl"
                >
                  <p className="text-green-800 font-bold text-sm">Your message has been sent successfully.</p>
                  <p className="text-green-600 text-xs mt-1">We will get back to you as soon as possible.</p>
                </motion.div>
              )}
            </AnimatePresence>

            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your Name"
              className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all"
            />
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email Address"
              className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all"
            />
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Your message..."
              className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all resize-none"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3.5 rounded-2xl font-black shadow-lg shadow-orange-500/40"
            >
              Send Message
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

// ─── Floating Buttons ─────────────────────────────────────────────────────────
function FloatingButtons() {
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.a
        href={`https://wa.me/${BUSINESS_WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-green-500 text-white shadow-2xl shadow-green-500/40 flex items-center justify-center"
      >
        <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-2xl">💬</motion.span>
        <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20" />
      </motion.a>

      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: 20 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-24 right-6 z-40 w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-xl shadow-orange-500/40 flex items-center justify-center font-bold"
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const cartCount = useMemo(
    () => Object.values(cart).reduce((s, i) => s + i.qty, 0),
    [cart]
  );

  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="bg-white font-sans antialiased min-h-screen">
          <ScrollProgress />
          <Navbar onCartClick={() => setCartOpen(true)} cartCount={cartCount} />
          <Hero onOrderClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })} />

          <ProductSection cart={cart} setCart={setCart} />

          <WhyUs />
          <Testimonials />
          <DeliveryProcess />
          <Contact />
          <Footer />

          <CartDrawer
            open={cartOpen}
            onClose={() => setCartOpen(false)}
            cart={cart}
            setCart={setCart}
            onCheckout={() => {
              setCartOpen(false);
              setTimeout(() => setCheckoutOpen(true), 300);
            }}
          />

          <CheckoutModal
            open={checkoutOpen}
            onClose={() => setCheckoutOpen(false)}
            cart={cart}
            setCart={setCart}
          />

          <FloatingButtons />
        </div>

        <style>{`
          html { scroll-behavior: smooth; }
          body { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-track { background: #f1f1f1; }
          ::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #f97316, #ef4444); border-radius: 8px; }
        `}</style>
      </ToastProvider>
    </ThemeProvider>
  );
}