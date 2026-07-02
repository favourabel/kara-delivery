import { useState, useEffect, useRef, createContext, useContext, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { useNavigate } from "react-router-dom";

import Navbar from "../component/Navbar.jsx";
import Footer from "../component/Footer.jsx";
import { useAdminAuth } from "../lib/context/AuthContext.jsx";
import { supabase } from "../lib/supabase";

import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineShieldCheck,
  HiX,
} from "react-icons/hi";
import { RiAdminLine } from "react-icons/ri";
import { BiLoader } from "react-icons/bi";

import MAMA from "../assets/MAMA.jpeg";
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
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ type: "spring", damping: 22 }}
              className={`pointer-events-auto px-5 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-3 min-w-[280px] ${
                t.type === "success"
                  ? "bg-white/95 text-slate-900 border-emerald-200 shadow-emerald-500/10"
                  : t.type === "error"
                  ? "bg-white/95 text-slate-900 border-red-200 shadow-red-500/10"
                  : "bg-white/95 text-slate-900 border-amber-200 shadow-amber-500/10"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${
                t.type === "success" ? "bg-emerald-500" : t.type === "error" ? "bg-red-500" : "bg-amber-500"
              }`} />
              <span className="font-medium text-sm">{t.message}</span>
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
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red-600 via-amber-500 to-red-600 z-[100] origin-left"
      style={{ scaleX }}
    />
  );
}

// ─── Admin Login Popup ────────────────────────────────────────────────────────
function AdminLoginPopup({ open, onClose }) {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const emailRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => emailRef.current?.focus(), 300);
      setEmail("");
      setPassword("");
      setError("");
      setShowPass(false);
    }
  }, [open]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      triggerShake();
      return;
    }
    setLoginLoading(true);
    setError("");

    const result = await login(email, password);

    if (result.success) {
      setLoginLoading(false);
      onClose();
      navigate("/admin/dashboard");
    } else {
      setLoginLoading(false);
      setError(result.error);
      triggerShake();
    }
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
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[200]"
          />

          <div className="fixed inset-0 z-[210] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={
                shake
                  ? {
                      opacity: 1,
                      scale: 1,
                      y: 0,
                      x: [-8, 8, -8, 8, -4, 4, 0],
                      transition: { x: { duration: 0.4 } },
                    }
                  : { opacity: 1, scale: 1, y: 0 }
              }
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 24, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md"
            >
              <div className="relative bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/60">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                <button
                  onClick={onClose}
                  className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
                >
                  <HiX className="w-4 h-4" />
                </button>

                <div className="relative p-8 sm:p-10">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.1, type: "spring", damping: 15 }}
                    className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-xl shadow-red-500/30 ring-1 ring-white/10"
                  >
                    <RiAdminLine className="w-8 h-8 text-white" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-center mb-8"
                  >
                    <h2 className="text-2xl font-bold text-white tracking-tight">Admin Portal</h2>
                    <p className="text-slate-400 text-sm mt-1.5">
                      Secure access · Management Dashboard
                    </p>
                  </motion.div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="relative"
                    >
                      <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        ref={emailRef}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Admin Email"
                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-red-500/50 focus:bg-white/10 focus:ring-2 focus:ring-red-500/20 outline-none transition-all text-sm"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="relative"
                    >
                      <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        type={showPass ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-red-500/50 focus:bg-white/10 focus:ring-2 focus:ring-red-500/20 outline-none transition-all text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass((v) => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                      >
                        {showPass ? (
                          <HiOutlineEyeOff className="w-5 h-5" />
                        ) : (
                          <HiOutlineEye className="w-5 h-5" />
                        )}
                      </button>
                    </motion.div>

                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                          <span className="text-red-300 text-sm font-medium">{error}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="submit"
                      disabled={loginLoading}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold text-sm shadow-lg shadow-red-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 tracking-wide"
                    >
                      {loginLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                          >
                            <BiLoader className="w-5 h-5" />
                          </motion.div>
                          Authenticating...
                        </>
                      ) : (
                        <>
                          <HiOutlineShieldCheck className="w-5 h-5" />
                          Sign In Securely
                        </>
                      )}
                    </motion.button>
                  </form>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center text-slate-500 text-xs mt-6"
                  >
                    Restricted access · Authorized personnel only
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function Hero({ onOrderClick, onAdminClick }) {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  const stats = [
    { val: "10k+", label: "Happy Customers" },
    { val: "4.9", label: "Average Rating" },
    { val: "24/7", label: "Order Ready" },
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(220,38,38,0.15),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_80%_60%,rgba(245,158,11,0.08),transparent)]" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_50%,transparent_100%)]" />

      <motion.div
        style={{ y: y1 }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[128px]"
      />

      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/8 rounded-full blur-[100px]"
      />

      <motion.div
        style={{ opacity }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-20 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-7"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 w-fit"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="text-slate-200 text-xs sm:text-sm font-medium tracking-wide">
              Fresh Batches Available Now
            </span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.05] tracking-tight">
            Nigeria's{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-amber-300 via-red-400 to-red-500 bg-clip-text text-transparent">
                Finest
              </span>
            </span>{" "}
            <br />
            Akara,{" "}
            <span className="text-slate-400 font-light">Delivered Hot</span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-lg font-light">
            Crispy on the outside, fluffy on the inside. Handcrafted every morning
            from premium black-eyed beans — straight to your doorstep.
          </p>

          <div className="flex gap-8 sm:gap-12 py-2">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="border-l border-white/10 pl-4 first:border-l-0 first:pl-0"
              >
                <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{s.val}</div>
                <div className="text-slate-500 text-xs mt-1 uppercase tracking-wider">{s.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 sm:gap-4 mt-2">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOrderClick}
              className="group relative bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-7 py-3.5 rounded-xl font-semibold text-sm sm:text-base shadow-xl shadow-red-500/25 transition-all"
            >
              <span className="relative z-10 flex items-center gap-2">
                Order Now
                <motion.svg
                  className="w-4 h-4"
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
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={onAdminClick}
              className="border border-white/15 bg-white/5 backdrop-blur-sm text-white px-7 py-3.5 rounded-xl font-semibold text-sm sm:text-base hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2"
            >
              <HiOutlineShieldCheck className="w-4 h-4" />
              Admin Login
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative flex items-center justify-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute w-80 h-80 lg:w-[480px] lg:h-[480px] rounded-full border border-white/5"
          />

          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute w-64 h-64 lg:w-96 lg:h-96 rounded-full border border-white/10"
          />

          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-72 h-72 lg:w-[420px] lg:h-[420px] bg-gradient-to-br from-red-600/30 via-amber-500/20 to-red-500/20 rounded-full blur-3xl"
          />

          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 w-72 h-72 sm:w-80 sm:h-80 lg:w-[420px] lg:h-[420px] rounded-[2rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.08)]"
          >
            <img src={monday} alt="Premium Akara" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="bg-white/10 backdrop-blur-xl rounded-xl px-3 py-2 border border-white/20">
                <span className="text-white text-xs font-semibold flex items-center gap-1.5">
                  <span className="text-amber-400">★</span> 4.9 Rating
                </span>
              </div>
              <div className="bg-red-500/90 backdrop-blur-xl rounded-xl px-3 py-2 border border-red-400/30">
                <span className="text-white text-xs font-semibold">Hot & Fresh</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -top-2 -right-2 sm:-top-6 sm:-right-6 bg-white/10 backdrop-blur-2xl border border-white/15 rounded-2xl p-4 shadow-2xl"
          >
            <div className="text-white text-xs font-semibold">Premium Beans</div>
            <div className="text-slate-400 text-[10px] mt-0.5">100% Natural</div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute -bottom-2 -left-2 sm:-bottom-6 sm:-left-6 bg-white/10 backdrop-blur-2xl border border-white/15 rounded-2xl p-4 shadow-2xl"
          >
            <div className="text-white text-xs font-semibold">Fast Delivery</div>
            <div className="text-red-400 text-[10px] font-semibold mt-0.5">Swift & Quick</div>
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center mb-14 sm:mb-20"
    >
      <div className={`inline-flex items-center gap-2 ${dark ? "bg-white/5 border-white/10 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-700"} border rounded-full px-4 py-1.5 mb-5`}>
        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
        <span className="text-xs font-semibold tracking-wider uppercase">{badge}</span>
      </div>

      <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${dark ? "text-white" : "text-slate-900"}`}>
        {title}{" "}
        <span className="bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent">
          {highlight}
        </span>
      </h2>

      {sub && (
        <p className={`${dark ? "text-slate-400" : "text-slate-500"} mt-5 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed`}>
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
    "Classic Pairing": "bg-red-600",
    "Sweet Combo": "bg-slate-800",
    "On-The-Go": "bg-amber-600",
    "Pure & Simple": "bg-slate-700",
  };

  return (
    <section id="menu" className="py-20 sm:py-28 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-red-100/40 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative">
        <SectionHeader
          badge="Order Now"
          title="Get Your Fresh"
          highlight="Akara"
          sub="Just ₦100 per piece. Adjust your quantity and add to cart instantly."
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden mb-24"
        >
          <div className="grid md:grid-cols-2">
            <div className="relative h-72 md:h-auto overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
              <motion.img
                src={AKARA_PRODUCT.img}
                alt={AKARA_PRODUCT.name}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg tracking-wide">
                Fresh & Hot
              </span>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="bg-white/15 backdrop-blur-xl rounded-lg px-3 py-1.5 flex items-center gap-1.5 border border-white/20">
                  <span className="text-amber-400 text-sm">★</span>
                  <span className="text-white text-sm font-semibold">4.9</span>
                </div>
                <div className="bg-white/15 backdrop-blur-xl rounded-lg px-3 py-1.5 border border-white/20">
                  <span className="text-white text-sm font-semibold">Swift Delivery</span>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight tracking-tight">
                  {AKARA_PRODUCT.name}
                </h3>
                <p className="text-slate-500 mt-3 leading-relaxed text-sm sm:text-base">{AKARA_PRODUCT.desc}</p>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-slate-400 text-sm">From</span>
                  <span className="text-slate-900 font-bold text-2xl">₦{AKARA_PRODUCT.price}</span>
                  <span className="text-slate-400 text-sm">/ piece</span>
                </div>
              </div>

              <div className="mt-8">
                <label className="text-xs font-semibold text-slate-600 mb-3 block uppercase tracking-wider">
                  Select Quantity
                </label>

                <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-3 border border-slate-200">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={decrement}
                    disabled={inCart <= 0}
                    className="w-11 h-11 rounded-xl bg-white text-slate-700 font-bold text-xl shadow-sm border border-slate-200 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-700 disabled:hover:border-slate-200"
                  >
                    −
                  </motion.button>

                  <div className="text-center">
                    <motion.div
                      key={inCart}
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-3xl font-bold text-slate-900"
                    >
                      {inCart}
                    </motion.div>
                    <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-0.5">
                      {inCart === 1 ? "piece" : "pieces"}
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={increment}
                    className="w-11 h-11 rounded-xl bg-red-600 text-white font-bold text-xl shadow-md hover:bg-red-700 transition-all"
                  >
                    +
                  </motion.button>
                </div>

                <AnimatePresence>
                  {inCart > 0 && (
                    <motion.div
                      key={totalPrice}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="mt-4 flex items-center justify-between p-4 bg-slate-900 rounded-2xl text-white"
                    >
                      <span className="font-medium text-sm">Cart Total</span>
                      <span className="text-xl font-bold">₦{totalPrice.toLocaleString()}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div
                  className={`mt-4 w-full py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${
                    inCart > 0
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-slate-100 text-slate-500 border border-slate-200"
                  }`}
                >
                  {inCart > 0
                    ? `${inCart} ${inCart === 1 ? "piece" : "pieces"} · Open cart to checkout`
                    : "Tap + to add akara to your cart"}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <SectionHeader
          badge="Serving Ideas"
          title="How To Enjoy Your"
          highlight="Akara"
          sub="Elevate your akara experience with these delicious pairings."
        />

        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {GALLERY.map((g, i) => (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-300/40 transition-all duration-500 border border-slate-100"
            >
              <div className="relative h-56 overflow-hidden bg-slate-100">
                <motion.img
                  src={g.img}
                  alt={g.name}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.6 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <span className={`absolute top-3 left-3 text-[10px] font-semibold px-2.5 py-1 rounded-full text-white ${tagColor[g.tag]} shadow-lg uppercase tracking-wider`}>
                  {g.tag}
                </span>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-slate-900 text-base leading-tight">{g.name}</h3>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">{g.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-slate-400 text-xs mt-10 italic"
        >
          Images shown are serving suggestions. We only sell freshly fried akara.
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
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[60]"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[440px] bg-white z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-br from-slate-900 to-slate-800 text-white">
              <div>
                <h3 className="text-xl font-bold tracking-tight">Your Cart</h3>
                <p className="text-slate-300 text-xs mt-0.5">
                  {items.length} item{items.length !== 1 ? "s" : ""} · Ready to checkout
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-colors"
              >
                <HiX className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-slate-100 flex items-center justify-center">
                    <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">Your cart is empty</h4>
                  <p className="text-slate-500 mt-2 text-sm">Add some delicious akara to get started</p>
                  <button
                    onClick={onClose}
                    className="mt-6 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
                  >
                    Browse Menu
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100"
                      >
                        <img src={item.img} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-900 text-sm truncate">{item.name}</h4>
                          <p className="text-slate-900 font-bold text-base mt-1">₦{item.price.toLocaleString()}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => update(item.id, -1)}
                              className="w-7 h-7 rounded-lg bg-white border border-slate-200 font-bold text-slate-700 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors text-sm"
                            >
                              −
                            </button>
                            <span className="font-semibold text-sm w-6 text-center">{item.qty}</span>
                            <button
                              onClick={() => update(item.id, 1)}
                              className="w-7 h-7 rounded-lg bg-white border border-slate-200 font-bold text-slate-700 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors text-sm"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => update(item.id, -item.qty)}
                          className="text-slate-400 hover:text-red-500 transition-colors self-start"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-3">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">₦{subtotal.toLocaleString()}</span>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700 flex items-start gap-2">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    <strong className="font-semibold">Delivery fee</strong> is paid directly to the rider upon arrival.
                  </span>
                </div>

                <div className="flex justify-between text-lg font-bold text-slate-900 pt-3 border-t border-slate-200">
                  <span>Total</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={onCheckout}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-red-500/25 text-sm tracking-wide transition-all"
                >
                  Proceed to Checkout
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

// ─── Email Helper ─────────────────────────────────────────────────────────────
async function sendDeliveryDetailsEmail(form, cart = {}) {
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    console.warn("EmailJS not configured — skipping email.");
    return { ok: false, reason: "EmailJS env vars missing." };
  }

  const items = Object.values(cart);
  const orderSummary = items.length
    ? items
        .map((i) => `• ${i.name} x${i.qty} — ₦${(i.price * i.qty).toLocaleString()}`)
        .join("\n")
    : "No items";

  const totalAmount = items.reduce((s, i) => s + i.price * i.qty, 0);
  const fullMessage = `ORDER DETAILS:\n${orderSummary}\n\nTotal: ₦${totalAmount.toLocaleString()}\n\nNotes:\n${form.note || "None"}`;

  try {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: {
          name: form.name,
          fullName: form.name,
          fullname: form.name,
          email: form.email || "Not provided",
          phone: form.phone,
          address: form.address,
          message: fullMessage,
          time: new Date().toLocaleString("en-NG", {
            dateStyle: "full",
            timeStyle: "short",
          }),
          title: "New Delivery Request",
        },
      }),
    });

    const text = await response.text();
    if (!response.ok) {
      console.error("EmailJS error:", response.status, text);
      return { ok: false, reason: text };
    }

    return { ok: true };
  } catch (err) {
    console.error("EmailJS failed:", err);
    return { ok: false, reason: err?.message };
  }
}

// ─── WhatsApp Redirect After Payment ─────────────────────────────────────────
function redirectToWhatsAppSeller({ form, cart, transaction, total }) {
  try {
    const items = Object.values(cart);
    const orderSummary = items
      .map((i) => `• ${i.name} x${i.qty} — ₦${(i.price * i.qty).toLocaleString()}`)
      .join("\n");

    const message =
      `🎉 *NEW ORDER — PAYMENT CONFIRMED* 🎉\n\n` +
      `Hello Mama Akara! A customer has just successfully placed and paid for an order via Paystack.\n\n` +
      `👤 *Customer Details*\n` +
      `Name: ${form.name}\n` +
      `Phone: ${form.phone}\n` +
      `Email: ${form.email || "Not provided"}\n` +
      `Address: ${form.address}\n\n` +
      `🛒 *Order Summary*\n${orderSummary}\n\n` +
      `💰 *Total Paid:* ₦${total.toLocaleString()}\n` +
      `💳 *Payment Method:* ${transaction?.channel || "card"}\n` +
      `🔖 *Reference:* ${transaction?.reference || "N/A"}\n\n` +
      `📝 *Notes:* ${form.note || "None"}\n\n` +
      `Please prepare this order for immediate delivery. Thank you! 🙏`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  } catch (err) {
    console.error("WhatsApp redirect failed:", err);
  }
}

// ─── Supabase Edge Function ───────────────────────────────────────────────────
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
      items: items.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        qty: i.qty,
      })),
      subtotal: total,
      totalAmount: total,
      paymentChannel: transaction.channel || "card",
      paystackReference: transaction.reference,
    }),
  });

  if (!response.ok) {
    throw new Error(`Edge function error: ${await response.text()}`);
  }

  return response.json();
}

// ─── Generate Order Number ────────────────────────────────────────────────────
function generateOrderNumber() {
  return `AKARA-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

// ─── Save Order Directly to Supabase REST ────────────────────────────────────
async function createOrderDirectly({
  form,
  items,
  total,
  status = "pending",
  paymentChannel = "pending",
  paystackReference,
}) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      order_number: generateOrderNumber(),
      customer_name: form.name,
      customer_email: form.email || "",
      customer_phone: form.phone,
      delivery_address: form.address,
      order_notes: form.note || "",
      items: items.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        qty: i.qty,
      })),
      subtotal: total,
      total_amount: total,
      payment_status: status,
      delivery_status: "pending",
      payment_channel: paymentChannel,
      paystack_reference: paystackReference || `PENDING_${Date.now()}`,
      created_at: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Supabase insert failed: ${errText}`);
  }

  return response.json();
}

// ─── Update Order Payment After Paystack Success ──────────────────────────────
async function updateOrderPayment({ orderId, reference, channel }) {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        payment_status: "paid",
        payment_channel: channel || "card",
        paystack_reference: reference,
        updated_at: new Date().toISOString(),
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to update order: ${errText}`);
  }

  return response.json();
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function generatePaystackRef() {
  return `AKARA_${Date.now()}_${Math.floor(Math.random() * 1_000_000)}`;
}

function getPaystackChannels(method) {
  const map = {
    card: ["card"],
    bank_transfer: ["bank_transfer"],
    ussd: ["ussd"],
    qr: ["qr"],
    bank: ["bank"],
  };
  return map[method] ?? ["card", "bank_transfer", "ussd", "qr"];
}

// ─── Checkout Modal ───────────────────────────────────────────────────────────
function CheckoutModal({ open, onClose, cart, setCart }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    note: "",
  });
  const [payMethod, setPayMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [deliverySaved, setDeliverySaved] = useState(false);
  const [deliverySaving, setDeliverySaving] = useState(false);
  const [savedOrderId, setSavedOrderId] = useState(null);
  const [infoSavedMessage, setInfoSavedMessage] = useState(false);

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
    setDeliverySaved(false);
    setDeliverySaving(false);
    setSavedOrderId(null);
    setInfoSavedMessage(false);
  };

  const close = () => {
    onClose();
    setTimeout(reset, 400);
  };

  // ─── STEP 1: User fills delivery info → clicks green Save button
  // → shows success message → info saved to Supabase as "pending"
  // → admin dashboard now shows the order as pending
  const handleSaveDelivery = async () => {
    if (!form.name || !form.phone || !form.address) {
      showToast("Please fill in Name, Phone and Address first.", "error");
      return;
    }

    setDeliverySaving(true);

    try {
      // Save order to Supabase with payment_status = "pending"
      // This immediately reflects in the admin dashboard
      const result = await createOrderDirectly({
        form,
        items,
        total,
        status: "pending",
        paymentChannel: "pending",
        paystackReference: `PENDING_${Date.now()}`,
      });

      const savedOrder = Array.isArray(result) ? result[0] : result;
      if (savedOrder?.id) {
        setSavedOrderId(savedOrder.id);
      }

      // Mark delivery as saved so the green button turns into success message
      setDeliverySaved(true);
      // Show the "information has been saved" message to user
      setInfoSavedMessage(true);

      // Send email to business owner in background
      sendDeliveryDetailsEmail(form, cart).catch(console.error);

      // Show toast confirming info saved
      showToast("✅ Delivery information saved! You can now proceed to payment.", "success");

    } catch (err) {
      console.error("Save delivery failed:", err);
      showToast(
        `Failed to save delivery info: ${err?.message || "Check connection"}`,
        "error"
      );
    } finally {
      setDeliverySaving(false);
    }
  };

  // ─── STEP 3: User clicks Pay → Paystack opens
  // → on payment success → updates order in Supabase to "paid"
  // → admin dashboard now shows payment_status = "paid"
  // → shows success message to user → redirects to WhatsApp
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
          {
            display_name: "Customer Name",
            variable_name: "customer_name",
            value: form.name,
          },
          {
            display_name: "Phone Number",
            variable_name: "phone_number",
            value: form.phone,
          },
          {
            display_name: "Delivery Address",
            variable_name: "delivery_address",
            value: form.address,
          },
          {
            display_name: "Order Notes",
            variable_name: "order_notes",
            value: form.note || "None",
          },
          {
            display_name: "Items Ordered",
            variable_name: "items_ordered",
            value: items.map((i) => `${i.name} x${i.qty}`).join(", "),
          },
        ],
      },

      onSuccess: async (transaction) => {
        console.log("Paystack success:", transaction);

        // ─── Payment successful in Paystack
        // Now update the order in Supabase from "pending" to "paid"
        // This will reflect in the admin dashboard as payment confirmed
        if (savedOrderId) {
          try {
            await updateOrderPayment({
              orderId: savedOrderId,
              reference: transaction.reference,
              channel: transaction.channel,
            });
            // Admin dashboard will now show payment_status = "paid"
            // and the transaction reference will also be updated
          } catch (err) {
            console.error("Failed to update order payment:", err);
            showToast(
              "Payment received but update failed. We will review manually.",
              "info"
            );
          }
        } else {
          // No pre-saved order — create full order now as "paid"
          try {
            await createorderToSupabase({ form, items, total, transaction });
          } catch (err) {
            console.error("Failed to save order:", err);
            showToast(
              "Payment received! Order may need manual review.",
              "info"
            );
          }
        }

        // Send delivery email to business in background
        sendDeliveryDetailsEmail(form, cart)
          .then((emailResult) => {
            if (!emailResult.ok) {
              console.warn("Delivery email failed:", emailResult.reason);
            }
          })
          .catch(console.error);

        setLoading(false);

        // Show payment success message to user
        setSuccess(true);
        showToast("🎉 Payment successful! Your order is confirmed.");

        // After showing payment success, redirect to WhatsApp seller
        setTimeout(() => {
          redirectToWhatsAppSeller({ form, cart, transaction, total });
        }, 1200);

        // Clear cart and close modal
        setTimeout(() => {
          setCart({});
          close();
        }, 3500);
      },

      onCancel: () => {
        setLoading(false);
        showToast("Payment cancelled. Try again when ready.", "info");
      },

      onError: (error) => {
        setLoading(false);
        console.error("Paystack error:", error);
        showToast(
          `Payment failed: ${error?.message || "Unknown error"}`,
          "error"
        );
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
          className="fixed inset-0 z-[80] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4"
          onClick={close}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl"
          >
            {/* ── Modal Header ── */}
            <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative">
              <button
                onClick={close}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-colors"
              >
                <HiX className="w-4 h-4" />
              </button>

              <h2 className="text-xl font-bold tracking-tight">Checkout</h2>
              <p className="text-slate-300 text-xs mt-1">
                Complete your order in 3 simple steps
              </p>

              {/* Step Indicators */}
              <div className="flex items-center gap-2 mt-5">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex-1 flex items-center gap-2">
                    <motion.div
                      animate={{
                        backgroundColor:
                          step >= s ? "#dc2626" : "rgba(255,255,255,0.15)",
                        scale: step === s ? 1.1 : 1,
                      }}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                    >
                      {success && s === 3 ? "✓" : s}
                    </motion.div>
                    {s < 3 && (
                      <div className="flex-1 h-0.5 rounded-full bg-white/15 overflow-hidden">
                        <motion.div
                          animate={{ width: step > s ? "100%" : "0%" }}
                          className="h-full bg-red-500"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-[10px] mt-2 text-slate-400 font-semibold uppercase tracking-wider">
                <span>Details</span>
                <span>Review</span>
                <span>Payment</span>
              </div>
            </div>

            {/* ── Modal Body ── */}
            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">

                {/* ────────────── STEP 1: Delivery Details ────────────── */}
                {step === 1 && (
                  <motion.div
                    key="s1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <h3 className="text-base font-bold text-slate-900">
                      Delivery Details
                    </h3>

                    {[
                      { key: "name", label: "Full Name", type: "text" },
                      { key: "phone", label: "Phone Number", type: "tel" },
                      { key: "email", label: "Email Address (for receipt)", type: "email" },
                      { key: "address", label: "Delivery Address (Abraka)", type: "text" },
                    ].map((f) => (
                      <div key={f.key}>
                        <input
                          type={f.type}
                          value={form[f.key]}
                          onChange={(e) =>
                            setForm({ ...form, [f.key]: e.target.value })
                          }
                          placeholder={f.label}
                          className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-100 outline-none transition-all text-sm"
                        />
                      </div>
                    ))}

                    <textarea
                      value={form.note}
                      onChange={(e) =>
                        setForm({ ...form, note: e.target.value })
                      }
                      placeholder="Special instructions (optional)"
                      rows={3}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-100 outline-none transition-all resize-none text-sm"
                    />

                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2.5">
                      <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>
                        <strong className="font-semibold">Note:</strong> We deliver within Abraka, Delta
                        State. Delivery fee is paid directly to the rider upon arrival.
                      </span>
                    </div>

                    {/* ── Green Save Button: appears when user fills required fields ── */}
                    <AnimatePresence>
                      {canNext1 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                        >
                          {/* After saving: show success message that info is saved */}
                          {deliverySaved ? (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="w-full flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl"
                            >
                              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-emerald-800 text-sm">
                                  Your information has been saved!
                                </p>
                                <p className="text-emerald-700 text-xs mt-1 leading-relaxed">
                                  Your delivery details have been recorded. Please click{" "}
                                  <strong className="font-semibold">Continue</strong> below to
                                  review your order and proceed to payment.
                                </p>
                              </div>
                            </motion.div>
                          ) : (
                            /* Green Save Button — shows when fields are filled but not yet saved */
                            <motion.button
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              onClick={handleSaveDelivery}
                              disabled={deliverySaving}
                              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              {deliverySaving ? (
                                <>
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{
                                      duration: 0.8,
                                      repeat: Infinity,
                                      ease: "linear",
                                    }}
                                    className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                                  />
                                  Saving your information...
                                </>
                              ) : (
                                <>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  Save Delivery Information
                                </>
                              )}
                            </motion.button>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* ────────────── STEP 2: Order Summary ────────────── */}
                {step === 2 && (
                  <motion.div
                    key="s2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <h3 className="text-base font-bold text-slate-900">
                      Order Summary
                    </h3>

                    {/* Show that delivery info is already saved in admin dashboard */}
                    {deliverySaved && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl"
                      >
                        <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-emerald-800 text-xs">
                            Delivery information saved ✓
                          </p>
                          <p className="text-emerald-700 text-xs">
                            Complete payment below to finalize your order
                          </p>
                        </div>
                      </motion.div>
                    )}

                    <div className="space-y-3">
                      {items.map((i) => (
                        <div
                          key={i.id}
                          className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100"
                        >
                          <img
                            src={i.img}
                            alt={i.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900 text-sm">
                              {i.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              Qty: {i.qty}
                            </p>
                          </div>
                          <p className="font-bold text-slate-900">
                            ₦{(i.price * i.qty).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
                      <div className="flex justify-between text-sm text-slate-700">
                        <span>Subtotal</span>
                        <span className="font-semibold">
                          ₦{subtotal.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-slate-700">
                        <span>Delivery</span>
                        <span className="font-semibold text-blue-600">
                          Paid on Delivery
                        </span>
                      </div>
                      <div className="flex justify-between font-bold text-lg text-slate-900 pt-2 border-t border-slate-200">
                        <span>Total to Pay Now</span>
                        <span>₦{total.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700">
                      <strong className="font-semibold">Delivering to:</strong>{" "}
                      {form.address}
                    </div>

                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                      <strong className="font-semibold">Fast & Swift Delivery:</strong>{" "}
                      Your akara will be delivered immediately once payment is received.
                    </div>
                  </motion.div>
                )}

                {/* ────────────── STEP 3: Payment ────────────── */}
                {step === 3 && (
                  <motion.div
                    key="s3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    {/* Loading spinner while Paystack is opening */}
                    {loading && (
                      <div className="py-12 text-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-14 h-14 mx-auto border-4 border-slate-100 border-t-red-600 rounded-full"
                        />
                        <p className="mt-4 font-semibold text-slate-900 text-sm">
                          Opening payment window...
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Please don't close this window
                        </p>
                      </div>
                    )}

                    {/* Payment success message — shown after Paystack confirms payment */}
                    {success && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 18 }}
                        className="py-8 text-center"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.15, type: "spring" }}
                          className="w-20 h-20 mx-auto bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/30"
                        >
                          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.div>
                        <h3 className="text-2xl font-bold text-slate-900 mt-6 tracking-tight">
                          Payment Successful!
                        </h3>
                        <p className="text-slate-500 mt-2 text-sm">
                          Your order has been confirmed and updated in our system.
                        </p>
                        <p className="text-xs text-emerald-600 font-semibold mt-3">
                          Redirecting you to WhatsApp to confirm with the seller...
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Fast & swift delivery on the way! 🎉
                        </p>
                      </motion.div>
                    )}

                    {/* Payment method selection — shown when not loading and not success */}
                    {!loading && !success && (
                      <>
                        <h3 className="text-base font-bold text-slate-900">
                          Choose Payment Method
                        </h3>

                        {/* Show delivery saved reminder on payment step */}
                        {deliverySaved && (
                          <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl"
                          >
                            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-semibold text-emerald-800 text-sm">
                                Delivery information saved ✓
                              </p>
                              <p className="text-emerald-700 text-xs mt-0.5 leading-relaxed">
                                Complete payment below to finalize your order.
                              </p>
                            </div>
                          </motion.div>
                        )}

                        {/* Payment Methods */}
                        <div className="grid grid-cols-1 gap-2.5">
                          {[
                            {
                              id: "card",
                              label: "Debit / Credit Card",
                              sub: "Visa, Mastercard, Verve",
                            },
                            {
                              id: "bank_transfer",
                              label: "Bank Transfer",
                              sub: "Transfer from any Nigerian bank",
                            },
                            {
                              id: "ussd",
                              label: "USSD Code",
                              sub: "Dial a shortcode from your phone",
                            },
                            {
                              id: "qr",
                              label: "QR Code",
                              sub: "Scan and pay instantly",
                            },
                            {
                              id: "bank",
                              label: "Pay with Bank",
                              sub: "Direct debit from your account",
                            },
                          ].map((method) => (
                            <motion.button
                              key={method.id}
                              whileTap={{ scale: 0.99 }}
                              onClick={() => setPayMethod(method.id)}
                              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                                payMethod === method.id
                                  ? "border-red-500 bg-red-50"
                                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                              }`}
                            >
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                  payMethod === method.id
                                    ? "border-red-500 bg-red-500"
                                    : "border-slate-300 bg-white"
                                }`}
                              >
                                {payMethod === method.id && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-2 h-2 rounded-full bg-white"
                                  />
                                )}
                              </div>
                              <div className="flex-1">
                                <p
                                  className={`font-semibold text-sm ${
                                    payMethod === method.id
                                      ? "text-slate-900"
                                      : "text-slate-800"
                                  }`}
                                >
                                  {method.label}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                  {method.sub}
                                </p>
                              </div>
                            </motion.button>
                          ))}
                        </div>

                        {/* Total Summary */}
                        <div className="p-4 bg-slate-900 rounded-xl text-white">
                          <div className="flex justify-between items-baseline">
                            <span className="text-sm text-slate-300">You'll pay</span>
                            <span className="text-2xl font-bold">
                              ₦{total.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1.5">
                            + Delivery fee paid to rider on arrival
                          </p>
                        </div>

                        {/* Security Note */}
                        <div className="text-xs text-slate-500 text-center flex items-center justify-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          Secured by{" "}
                          <span className="font-semibold text-slate-700">Paystack</span>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Footer Buttons ── */}
            {!loading && !success && (
              <div className="p-6 border-t border-slate-100 flex gap-3 bg-slate-50">
                {step > 1 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-3 rounded-xl border border-slate-200 bg-white font-semibold text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    Back
                  </button>
                )}

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    if (step === 3) {
                      handlePay();
                    } else {
                      setStep(step + 1);
                    }
                  }}
                  disabled={
                    (step === 1 && !canNext1) ||
                    (step === 2 && !canNext2)
                  }
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-3 rounded-xl font-semibold text-sm shadow-lg shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {step === 3
                    ? `Pay ₦${total.toLocaleString()} Securely`
                    : "Continue"}
                </motion.button>
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
    { title: "Made Fresh Daily", desc: "Every batch is prepared at dawn with freshly soaked beans. Zero compromise on quality." },
    { title: "Lightning Delivery", desc: "Fast and swift delivery immediately once payment is received." },
    { title: "Premium Quality", desc: "We use only the finest local black-eyed beans and pure palm oil." },
    { title: "Unbeatable Prices", desc: "Restaurant-quality akara at street-food prices. Just ₦100 per piece." },
    { title: "Hygienic & Safe", desc: "Top food safety standards. Sealed packaging every time." },
    { title: "Easy Ordering", desc: "Order in seconds. Pay online securely with Paystack." },
  ];

  return (
    <section id="about" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <SectionHeader
          badge="Why Choose Us"
          title="Trusted by Thousands of"
          highlight="Nigerians"
          sub="We deliver joy, culture, and memories — not just food."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              className="group relative p-7 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500 bg-white overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-0 h-[2px] bg-gradient-to-r from-red-500 to-amber-500 group-hover:w-full transition-all duration-500" />

              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center mb-5 group-hover:bg-red-600 transition-colors">
                <span className="text-white font-bold text-sm">{String(i + 1).padStart(2, "0")}</span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2.5 tracking-tight">{f.title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm">{f.desc}</p>
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
    { name: "Chioma Okonkwo", role: "Food Blogger · Abraka", avatar: "CO", rating: 5, text: "Hands-down the best akara I've ever had. The crispiness, the flavor — unmatched. I order every weekend!" },
    { name: "Emeka Nwosu", role: "Engineer · Abraka", avatar: "EN", rating: 5, text: "Having fresh hot akara delivered every morning has been a game changer. Consistently excellent quality." },
    { name: "Fatima Aliyu", role: "Nurse · Delta", avatar: "FA", rating: 5, text: "My kids absolutely devoured the family pack! Will definitely order again. Fast delivery too." },
    { name: "Tunde Adeyemi", role: "Business Owner", avatar: "TA", rating: 5, text: "Catered our office breakfast and everyone was blown away. Professional, on-time, delicious." },
    { name: "Blessing Eze", role: "Teacher · Abraka", avatar: "BE", rating: 5, text: "The akara takes me back to my grandmother's kitchen. Authentic taste, fair price." },
    { name: "David Obi", role: "Student · DELSU", avatar: "DO", rating: 5, text: "Best breakfast deal for students! The akara is fire. Delivers to campus too." },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % reviews.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="reviews" className="py-20 sm:py-28 bg-slate-950 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_30%,rgba(220,38,38,0.1),transparent)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_50%,transparent_100%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative">
        <SectionHeader
          badge="Customer Love"
          title="What Our"
          highlight="Customers Say"
          sub="Over 10,000 happy customers and counting."
          dark
        />

        <div className="max-w-3xl mx-auto mb-12 h-72 sm:h-64 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 flex flex-col justify-center"
            >
              <div className="flex gap-1 mb-5">
                {Array(reviews[index].rating)
                  .fill(0)
                  .map((_, i) => (
                    <span key={i} className="text-amber-400 text-lg">★</span>
                  ))}
              </div>

              <p className="text-white/90 text-base sm:text-lg leading-relaxed mb-6 font-light italic">
                "{reviews[index].text}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold text-sm ring-2 ring-white/10">
                  {reviews[index].avatar}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{reviews[index].name}</div>
                  <div className="text-slate-500 text-xs">{reviews[index].role}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-2 mb-14">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-8 bg-red-500" : "w-1.5 bg-white/20 hover:bg-white/30"
              }`}
            />
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.slice(0, 3).map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/[0.06] hover:border-white/15 transition-all"
            >
              <div className="flex gap-0.5 mb-3">
                {Array(r.rating)
                  .fill(0)
                  .map((_, j) => (
                    <span key={j} className="text-amber-400 text-sm">★</span>
                  ))}
              </div>

              <p className="text-slate-300 text-sm leading-relaxed mb-5 font-light">{r.text}</p>

              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white text-xs font-bold">
                  {r.avatar}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{r.name}</div>
                  <div className="text-slate-500 text-xs">{r.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Delivery Process ─────────────────────────────────────────────────────────
function DeliveryProcess() {
  const steps = [
    { step: "01", title: "Place Order", desc: "Choose your items in less than 60 seconds." },
    { step: "02", title: "Make Payment", desc: "Pay securely online via Paystack." },
    { step: "03", title: "We Prepare", desc: "Mama springs into action, frying fresh immediately." },
    { step: "04", title: "Swift Delivery", desc: "Hot akara arrives at your doorstep fast." },
  ];

  return (
    <section id="delivery" className="py-20 sm:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <SectionHeader
          badge="How It Works"
          title="Order in"
          highlight="4 Simple Steps"
          sub="From your phone to your door — fast and delicious."
        />

        <div className="relative">
          <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative text-center group"
              >
                <div className="relative inline-flex items-center justify-center mb-6">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-16 h-16 rounded-2xl bg-white border border-slate-200 group-hover:border-red-500 group-hover:shadow-lg group-hover:shadow-red-500/20 transition-all flex items-center justify-center relative z-10"
                  >
                    <span className="text-slate-900 font-bold text-lg group-hover:text-red-600 transition-colors">{s.step}</span>
                  </motion.div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 tracking-tight">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm"
        >
          <div className="grid md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {[
              { label: "Delivery Zones", value: "Within Abraka, Delta" },
              { label: "Average Time", value: "Fast & Swift" },
              { label: "Delivery Fee", value: "Paid on Delivery" },
            ].map((stat, i) => (
              <div key={i} className="p-4 md:px-6">
                <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold">{stat.label}</div>
                <div className="text-lg sm:text-xl font-bold text-slate-900 mt-2 tracking-tight">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-amber-50 border border-red-100 rounded-2xl text-center text-sm text-slate-700">
            <strong className="font-semibold">Immediate delivery</strong> once payment is received — your akara is on the way!
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
    <section id="contact" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <SectionHeader
          badge="Get In Touch"
          title="Let's"
          highlight="Connect"
          sub="Questions? Catering inquiries? We're here to help."
        />

        <div className="grid lg:grid-cols-2 gap-10">
          <div className="space-y-3">
            {[
              { title: "Visit Us", text: "Abraka, Delta State, Nigeria" },
              { title: "Call Us", text: BUSINESS_PHONE_DISPLAY },
              { title: "Email", text: BUSINESS_EMAIL },
              { title: "Hours", text: "Mon – Sun, 6:00 AM – 2:00 PM" },
            ].map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ x: 4 }}
                className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-100 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xs">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{c.title}</p>
                  <p className="text-slate-600 text-sm mt-0.5">{c.text}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onSubmit={submit}
            className="bg-slate-50 p-8 rounded-3xl border border-slate-100 space-y-4"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-2 tracking-tight">Send us a message</h3>

            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl"
                >
                  <p className="text-emerald-800 font-semibold text-sm">
                    Message sent successfully
                  </p>
                  <p className="text-emerald-700 text-xs mt-1">
                    We'll get back to you as soon as possible.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your Name"
              className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none transition-all text-sm"
            />

            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email Address"
              className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none transition-all text-sm"
            />

            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Your message..."
              className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none transition-all resize-none text-sm"
            />

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-red-500/25 text-sm tracking-wide transition-all"
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
        whileHover={{ scale: 1.08 }}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-2xl shadow-emerald-500/40 flex items-center justify-center transition-colors"
      >
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
        <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-20" />
      </motion.a>

      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: 20 }}
            whileHover={{ scale: 1.08 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-24 right-6 z-40 w-11 h-11 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
            </svg>
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
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);

  const cartCount = useMemo(
    () => Object.values(cart).reduce((s, i) => s + i.qty, 0),
    [cart]
  );

  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="bg-white font-sans antialiased min-h-screen">
          <ScrollProgress />
          <Navbar
            onCartClick={() => setCartOpen(true)}
            cartCount={cartCount}
            logo={MAMA}
          />

          <Hero
            onOrderClick={() =>
              document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })
            }
            onAdminClick={() => setAdminLoginOpen(true)}
          />

          <ProductSection cart={cart} setCart={setCart} />
          <WhyUs />
          <Testimonials />
          <DeliveryProcess />
          <Contact />
          <Footer
            businessEmail={BUSINESS_EMAIL}
            businessPhoneDisplay={BUSINESS_PHONE_DISPLAY}
            logo={MAMA}
          />

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

          <AdminLoginPopup
            open={adminLoginOpen}
            onClose={() => setAdminLoginOpen(false)}
          />
        </div>

        <style>{`
          html { scroll-behavior: smooth; }
          body { 
            font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          ::-webkit-scrollbar { width: 8px; height: 8px; }
          ::-webkit-scrollbar-track { background: #f8fafc; }
          ::-webkit-scrollbar-thumb { 
            background: linear-gradient(180deg, #dc2626, #b91c1c);
            border-radius: 8px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, #b91c1c, #991b1b);
          }
          ::selection {
            background: #dc2626;
            color: white;
          }
        `}</style>
      </ToastProvider>
    </ThemeProvider>
  );
}