import { useState, useEffect, useRef, createContext, useContext, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { useNavigate } from "react-router-dom";

import Navbar from "../component/Navbar.jsx";
import Footer from "../component/Footer.jsx";
import { useAdminAuth } from "../lib/context/AuthContext.jsx";
import { supabase } from "../lib/Supabase.js";

import Yummy from "../assets/Yummy.jpg";
import Akp from "../assets/Akp.jpg";
import Enjoy from "../assets/Enjoy.jpg";
import pap from "../assets/Pap.jpg";
import sugar from "../assets/Sugar.jpg";
import Sweet from "../assets/Sweet.jpg";

import monday from "../assets/monday.jpg"

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


export const BUSINESS_EMAIL = "Egileweprecious1@gmail.com";
export const BUSINESS_PHONE_DISPLAY = "+234 913 283 0290";
const BUSINESS_WHATSAPP_NUMBER = "2349132830290";

// ─── Takeaway Price ───────────────────────────────────────────────────────────
const TAKEAWAY_PRICE = 200;

// ─── Toast Context ────────────────────────────────────────────────────────────
const ToastContext = createContext();
const useToast = () => useContext(ToastContext);

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
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
              className={`pointer-events-auto px-5 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-3 min-w-[280px] max-w-[360px] ${
                t.type === "success"
                  ? "bg-white/95 text-slate-900 border-emerald-200 shadow-emerald-500/10"
                  : t.type === "error"
                  ? "bg-white/95 text-slate-900 border-red-200 shadow-red-500/10"
                  : "bg-white/95 text-slate-900 border-amber-200 shadow-amber-500/10"
              }`}
            >
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                t.type === "success" ? "bg-emerald-500" : t.type === "error" ? "bg-red-500" : "bg-amber-500"
              }`} />
              <span className="font-medium text-sm leading-snug">{t.message}</span>
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
      setEmail(""); setPassword(""); setError(""); setShowPass(false);
    }
  }, [open]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); triggerShake(); return; }
    setLoginLoading(true); setError("");
    const result = await login(email, password);
    if (result.success) { setLoginLoading(false); onClose(); navigate("/admin/dashboard"); }
    else { setLoginLoading(false); setError(result.error); triggerShake(); }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[200]" />
          <div className="fixed inset-0 z-[210] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={shake ? { opacity: 1, scale: 1, y: 0, x: [-8,8,-8,8,-4,4,0], transition: { x: { duration: 0.4 } } } : { opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 24, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md"
            >
              <div className="relative bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/60">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />
                <button onClick={onClose} className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all">
                  <HiX className="w-4 h-4" />
                </button>
                <div className="relative p-8 sm:p-10">
                  <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.1, type: "spring", damping: 15 }}
                    className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-xl shadow-red-500/30 ring-1 ring-white/10">
                    <RiAdminLine className="w-8 h-8 text-white" />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white tracking-tight">Admin Portal</h2>
                    <p className="text-slate-400 text-sm mt-1.5">Secure access · Management Dashboard</p>
                  </motion.div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative">
                      <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input ref={emailRef} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Admin Email"
                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-red-500/50 focus:bg-white/10 focus:ring-2 focus:ring-red-500/20 outline-none transition-all text-sm" />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="relative">
                      <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
                        className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-red-500/50 focus:bg-white/10 focus:ring-2 focus:ring-red-500/20 outline-none transition-all text-sm" />
                      <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                        {showPass ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                      </button>
                    </motion.div>
                    <AnimatePresence>
                      {error && (
                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                          className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                          <span className="text-red-300 text-sm font-medium">{error}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                      whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={loginLoading}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold text-sm shadow-lg shadow-red-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 tracking-wide">
                      {loginLoading ? (<><motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}><BiLoader className="w-5 h-5" /></motion.div>Authenticating...</>) : (<><HiOutlineShieldCheck className="w-5 h-5" />Sign In Securely</>)}
                    </motion.button>
                  </form>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-center text-slate-500 text-xs mt-6">
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

// ─── Hero Section (RESTORED to original + combo card BELOW image on the right)
function Hero({ onOrderClick, onAdminClick }) {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const stats = [
    { val: "10k+", label: "Happy Customers" },
    { val: "4.9", label: "Average Rating" },
    { val: "5 Days", label: "Weekly Service" },
  ];
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(220,38,38,0.15),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_80%_60%,rgba(245,158,11,0.08),transparent)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_50%,transparent_100%)]" />
      <motion.div style={{ y: y1 }} className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[128px]" />
      <motion.div style={{ y: y2 }} className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/8 rounded-full blur-[100px]" />
      <motion.div style={{ opacity }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-20 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
        {/* LEFT — Original hero text */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="flex flex-col gap-7">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 w-fit">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="text-slate-200 text-xs sm:text-sm font-medium tracking-wide">Fresh Batches · Mon, Wed – Sat · 6:30AM – 10:00AM</span>
          </motion.div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.05] tracking-tight">
            Nigeria's{" "}<span className="relative inline-block"><span className="bg-gradient-to-r from-amber-300 via-red-400 to-red-500 bg-clip-text text-transparent">Finest</span></span>{" "}<br />
            Akara,{" "}<span className="text-slate-400 font-light">Delivered Hot</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-lg font-light">
            Crispy on the outside, fluffy on the inside. Handcrafted every morning from premium black-eyed beans — fried with pure <span className="text-amber-300 font-medium">groundnut oil</span> (not palm oil) — straight to your doorstep.
          </p>
          <div className="flex gap-8 sm:gap-12 py-2">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
                className="border-l border-white/10 pl-4 first:border-l-0 first:pl-0">
                <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{s.val}</div>
                <div className="text-slate-500 text-xs mt-1 uppercase tracking-wider">{s.label}</div>
              </motion.div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 sm:gap-4 mt-2">
            <motion.button whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} onClick={onOrderClick}
              className="group relative bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-7 py-3.5 rounded-xl font-semibold text-sm sm:text-base shadow-xl shadow-red-500/25 transition-all">
              <span className="relative z-10 flex items-center gap-2">Order Now
                <motion.svg className="w-4 h-4" animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </motion.svg>
              </span>
            </motion.button>
            <motion.button whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} onClick={onAdminClick}
              className="border border-white/15 bg-white/5 backdrop-blur-sm text-white px-7 py-3.5 rounded-xl font-semibold text-sm sm:text-base hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2">
              <HiOutlineShieldCheck className="w-4 h-4" />Admin Login
            </motion.button>
          </div>
        </motion.div>

        {/* RIGHT — Image + Combo Description BELOW the image */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3 }} className="relative flex flex-col items-center justify-center gap-6">
          {/* Image container */}
          <div className="relative flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="absolute w-80 h-80 lg:w-[480px] lg:h-[480px] rounded-full border border-white/5" />
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute w-64 h-64 lg:w-96 lg:h-96 rounded-full border border-white/10" />
            <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute w-72 h-72 lg:w-[420px] lg:h-[420px] bg-gradient-to-br from-red-600/30 via-amber-500/20 to-red-500/20 rounded-full blur-3xl" />
            <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 w-72 h-72 sm:w-80 sm:h-80 lg:w-[420px] lg:h-[420px] rounded-[2rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.08)]">
              <img src={monday} alt="Premium Akara" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="bg-white/10 backdrop-blur-xl rounded-xl px-3 py-2 border border-white/20">
                  <span className="text-white text-xs font-semibold flex items-center gap-1.5"><span className="text-amber-400">★</span> 4.9 Rating</span>
                </div>
                <div className="bg-red-500/90 backdrop-blur-xl rounded-xl px-3 py-2 border border-red-400/30">
                  <span className="text-white text-xs font-semibold">Hot & Fresh</span>
                </div>
              </div>
            </motion.div>
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-2 -right-2 sm:-top-6 sm:-right-6 bg-white/10 backdrop-blur-2xl border border-white/15 rounded-2xl p-4 shadow-2xl">
              <div className="text-white text-xs font-semibold">Groundnut Oil</div>
              <div className="text-slate-400 text-[10px] mt-0.5">100% Pure</div>
            </motion.div>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 5, repeat: Infinity }}
              className="absolute -bottom-2 -left-2 sm:-bottom-6 sm:-left-6 bg-white/10 backdrop-blur-2xl border border-white/15 rounded-2xl p-4 shadow-2xl">
              <div className="text-white text-xs font-semibold">Fast Delivery</div>
              <div className="text-red-400 text-[10px] font-semibold mt-0.5">Swift & Quick</div>
            </motion.div>
          </div>

          {/* ─── Hot Student Combo Description — placed BELOW the image ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="w-full max-w-md bg-gradient-to-br from-red-600/15 via-amber-500/10 to-red-500/15 backdrop-blur-xl border border-white/15 rounded-2xl p-5 text-center shadow-xl"
          >
            <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-400/30 rounded-full px-3 py-1 mb-3">
              <span className="text-base">🍲</span>
              <span className="text-red-200 text-[10px] font-bold uppercase tracking-wider">Hot Student Breakfast Combo</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-2 leading-snug">
              Akara + Pap + Bread + Hollandia Evap Milk & Sugar
            </h3>
            <div className="inline-flex items-baseline gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-1.5 my-2">
              <span className="text-2xl font-bold text-amber-300">₦2,300</span>
            </div>
            <p className="text-slate-300 text-xs italic mt-2">
              📩 SEND A DM TO ORDER NOW!
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ badge, title, highlight, sub, dark = false }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-14 sm:mb-20">
      <div className={`inline-flex items-center gap-2 ${dark ? "bg-white/5 border-white/10 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-700"} border rounded-full px-4 py-1.5 mb-5`}>
        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
        <span className="text-xs font-semibold tracking-wider uppercase">{badge}</span>
      </div>
      <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${dark ? "text-white" : "text-slate-900"}`}>
        {title}{" "}<span className="bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent">{highlight}</span>
      </h2>
      {sub && <p className={`${dark ? "text-slate-400" : "text-slate-500"} mt-5 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed`}>{sub}</p>}
    </motion.div>
  );
}


// ─── FULL BREAKFAST MENU ──────────────────────────
const BREAKFAST_MENU = [
  {
    category: "AKARA",
    icon: "🫘",
    color: "#dc2626",
    items: [
      { id: "akara-6", name: "6 Pieces Akara", description: "Fresh palm oil akara, 6 pieces, crispy outside and soft inside.", price: 500, image: Enjoy },
      { id: "akara-12", name: "12 Pieces Akara", description: "Fresh palm oil akara, 12 pieces, golden-orange and well fried.", price: 1000, image: Akp },
      { id: "akara-18", name: "18 Pieces Akara", description: "Fresh palm oil akara, 18 pieces, hot and ready to serve.", price: 1500, image: Sweet },
      { id: "akara-24", name: "24 Pieces Akara", description: "Fresh palm oil akara, 24 pieces, perfect for sharing.", price: 2000, image: Yummy },
    ],
  },
  {
    category: "PAP (OGI)",
    icon: "🥣",
    color: "#f59e0b",
    items: [
      { id: "pap-plain", name: "Plain Pap", description: "Smooth hot Nigerian pap (ogi) served plain.", price: 500, image: pap },
      { id: "pap-sugar", name: "Pap + Sugar", description: "Smooth hot pap (ogi) served with sugar.", price: 600, image: sugar },
      { id: "pap-powdered", name: "Pap + Sugar + Powdered Milk (sachet)", description: "Creamy pap (ogi) served with sugar and powdered milk sachet.", price: 800, image: monday },
      { id: "pap-hollandia", name: "Pap + Sugar + Hollandia Evaporated Milk", description: "Creamy pap (ogi) served with sugar and Hollandia evaporated milk.", price: 900, image: monday },
      { id: "pap-peak", name: "Pap + Sugar + Peak Evaporated Milk", description: "Creamy pap (ogi) served with sugar and Peak evaporated milk.", price: 950, image: monday },
    ],
  },
  {
    category: "CUSTARD",
    icon: "🍮",
    color: "#eab308",
    items: [
      { id: "custard-plain", name: "Plain Custard", description: "Warm smooth custard served plain.", price: 500, image: sugar },
      { id: "custard-sugar", name: "Custard + Sugar", description: "Warm smooth custard served with sugar.", price: 600, image: sugar },
      { id: "custard-powdered", name: "Custard + Sugar + Powdered Milk", description: "Warm custard served with sugar and powdered milk.", price: 800, image: monday },
      { id: "custard-hollandia", name: "Custard + Sugar + Hollandia Evaporated Milk", description: "Warm custard served with sugar and Hollandia evaporated milk.", price: 900, image: monday },
      { id: "custard-peak", name: "Custard + Sugar + Peak Evaporated Milk", description: "Warm custard served with sugar and Peak evaporated milk.", price: 950, image: monday },
    ],
  },
  {
    category: "BREAD",
    icon: "🍞",
    color: "#ea580c",
    items: [
      { id: "bread-mini", name: "Mini Bread", description: "Fresh mini loaf of soft bread.", price: 200, image: Enjoy },
      { id: "bread-small", name: "Small Bread", description: "Fresh small loaf of soft bread.", price: 400, image: Akp },
      { id: "bread-big", name: "Big Bread", description: "Fresh big loaf of soft bread, perfect for breakfast.", price: 900, image: Yummy },
    ],
  },
];

function BreakfastMenu() {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const addToCart = (item, category) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { ...item, category, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === id);
      if (existing && existing.qty > 1) {
        return prev.map((c) => c.id === id ? { ...c, qty: c.qty - 1 } : c);
      }
      return prev.filter((c) => c.id !== id);
    });
  };

  const deleteFromCart = (id) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  };

  const totalItems = cart.reduce((sum, c) => sum + c.qty, 0);
  const totalPrice = cart.reduce((sum, c) => sum + c.price * c.qty, 0);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">🍳 Breakfast Menu</h1>
            <p className="text-sm text-gray-500">Fresh, hot and ready — order your favourite breakfast</p>
          </div>
          <button
            onClick={() => setShowCart(!showCart)}
            className="relative rounded-2xl bg-gray-900 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-gray-800 active:scale-95"
          >
            🛒 Cart
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ── Cart Slide-out ── */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCart(false)} />
          <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-xl font-extrabold text-gray-900">🛒 Your Cart ({totalItems})</h2>
              <button onClick={() => setShowCart(false)} className="rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <span className="text-6xl">🛒</span>
                  <p className="mt-4 text-lg font-semibold text-gray-400">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: "64px", height: "64px", objectFit: "cover", borderRadius: "12px", flexShrink: 0 }}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.category}</p>
                        <p className="mt-1 text-sm font-bold text-gray-900">₦{(item.price * item.qty).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => removeFromCart(item.id)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-300">−</button>
                        <span className="w-6 text-center text-sm font-bold">{item.qty}</span>
                        <button onClick={() => addToCart(item, item.category)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-300">+</button>
                      </div>
                      <button onClick={() => deleteFromCart(item.id)} className="text-red-400 hover:text-red-600">🗑️</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <div className="border-t bg-white px-6 py-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">Total:</span>
                  <span className="text-2xl font-extrabold text-gray-900">₦{totalPrice.toLocaleString()}</span>
                </div>
                <button className="w-full rounded-2xl bg-gradient-to-r from-green-500 to-green-700 py-4 text-lg font-bold text-white shadow-lg transition hover:opacity-90 active:scale-95">
                  Checkout — ₦{totalPrice.toLocaleString()}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Menu Content ── */}
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="space-y-14">
          {BREAKFAST_MENU.map((section) => (
            <div key={section.category}>
              <div className={`mb-6 flex items-center gap-3 rounded-2xl bg-gradient-to-r ${section.color} px-6 py-4 shadow-lg`}>
                <span className="text-3xl">{section.icon}</span>
                <h2 className="text-2xl font-extrabold tracking-wide text-white">{section.category}</h2>
                <span className="ml-auto rounded-full bg-white/20 px-3 py-1 text-sm font-semibold text-white">
                  {section.items.length} items
                </span>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {section.items.map((item) => {
                  const inCart = cart.find((c) => c.id === item.id);
                  return (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "#ffffff",
                        borderRadius: "16px",
                        overflow: "hidden",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        border: "1px solid #f3f4f6",
                      }}
                    >
                      {/* ── PRODUCT IMAGE (INLINE STYLES) ── */}
                      <div
                        style={{
                          width: "100%",
                          height: "220px",
                          overflow: "hidden",
                          position: "relative",
                          backgroundColor: "#f3f4f6",
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />

                        <div
                          style={{
                            position: "absolute",
                            left: "12px",
                            top: "12px",
                            padding: "4px 12px",
                            borderRadius: "999px",
                            backgroundColor: "rgba(0,0,0,0.6)",
                            color: "white",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          {section.icon} {section.category}
                        </div>

                        {inCart && (
                          <div
                            style={{
                              position: "absolute",
                              right: "12px",
                              top: "12px",
                              width: "32px",
                              height: "32px",
                              borderRadius: "999px",
                              backgroundColor: "#10b981",
                              color: "white",
                              fontSize: "12px",
                              fontWeight: "bold",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {inCart.qty}
                          </div>
                        )}
                      </div>

                      {/* ── Card Body ── */}
                      <div style={{ padding: "16px", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
                        <div>
                          <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#111827" }}>{item.name}</h3>
                          <p style={{ marginTop: "4px", fontSize: "14px", color: "#6b7280", lineHeight: "1.5" }}>{item.description}</p>
                        </div>

                        <div style={{ marginTop: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div>
                            <p style={{ fontSize: "12px", color: "#9ca3af" }}>Price</p>
                            <p style={{ fontSize: "20px", fontWeight: "800", color: "#111827" }}>₦{item.price.toLocaleString()}</p>
                          </div>

                          {inCart ? (
                            <div className="flex items-center gap-2">
                              <button onClick={() => removeFromCart(item.id)} className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-200 text-lg font-bold text-gray-700 hover:bg-gray-300 active:scale-90">−</button>
                              <span className="w-6 text-center text-sm font-bold text-gray-900">{inCart.qty}</span>
                              <button onClick={() => addToCart(item, section.category)} className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r ${section.color} text-lg font-bold text-white shadow hover:opacity-90 active:scale-90`}>+</button>
                            </div>
                          ) : (
                            <button onClick={() => addToCart(item, section.category)} className={`rounded-xl bg-gradient-to-r ${section.color} px-4 py-2 text-sm font-semibold text-white shadow-md hover:opacity-90 active:scale-95`}>
                              Add to Cart
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Floating Cart (Mobile) */}
      {totalItems > 0 && !showCart && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-green-500 to-green-700 px-6 py-4 text-base font-bold text-white shadow-2xl hover:opacity-90 active:scale-95 sm:hidden"
        >
          🛒 ₦{totalPrice.toLocaleString()}
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-bold text-green-700">
            {totalItems}
          </span>
        </button>
      )}
    </div>
  );
}

// ─── Product Section (WITH IMAGES) ───────────────────────────────────
function ProductSection({ cart, setCart }) {
  const addToCart = (item) => setCart((c) => ({
    ...c,
    [item.id]: { ...item, qty: (c[item.id]?.qty || 0) + 1 },
  }));
  const removeFromCart = (item) => setCart((c) => {
    const current = c[item.id]?.qty || 0;
    if (current <= 1) { const next = { ...c }; delete next[item.id]; return next; }
    return { ...c, [item.id]: { ...c[item.id], qty: current - 1 } };
  });

  return (
    <section id="menu" className="py-20 sm:py-28 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-red-100/40 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative">
        <SectionHeader
          badge="Full Breakfast Menu"
          title="Mama Akara"
          highlight="Breakfast Menu"
          sub="Fresh, hot, and made with pure groundnut oil. Choose from our full menu below and add takeaway pack at checkout if needed."
        />

        {/* Opening Hours Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mb-12 bg-gradient-to-r from-red-50 via-amber-50 to-red-50 border border-amber-200 rounded-2xl p-5 sm:p-6 text-center shadow-sm"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">🕕</span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">Opening Days & Hours</h3>
          </div>
          <p className="text-slate-700 text-sm sm:text-base font-medium">
            Mondays, Wednesdays, Thursdays, Fridays & Saturdays
          </p>
          <p className="text-red-600 font-bold text-base sm:text-lg mt-1">
            6:30 AM – 10:00 AM
          </p>
          <p className="text-slate-500 text-xs mt-2 italic">
            Fried fresh with 100% pure groundnut oil — never palm oil
          </p>
        </motion.div>

        {/* Menu by Category — WITH IMAGES */}
        <div className="space-y-14">
          {BREAKFAST_MENU.map((cat, catIdx) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: catIdx * 0.1 }}
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg text-2xl`}>
                  {cat.icon}
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{cat.category}</h3>
                  <p className="text-slate-500 text-sm">{cat.items.length} option{cat.items.length !== 1 ? "s" : ""} available</p>
                </div>
              </div>

              {/* Product Cards WITH IMAGES */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {cat.items.map((item, i) => {
                  const inCart = cart[item.id]?.qty || 0;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      whileHover={{ y: -6 }}
                      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl hover:shadow-slate-200/60 border border-slate-100 hover:border-slate-200 transition-all duration-300 overflow-hidden flex flex-col"
                    >
                      {/* ── PRODUCT IMAGE ── */}
                      <div
                        style={{
                          width: "100%",
                          height: "220px",
                          position: "relative",
                          backgroundColor: "#f3f4f6",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                            transition: "transform 0.5s ease",
                          }}
                          className="group-hover:scale-110"
                        />

                        {/* Category tag on image */}
                        <div className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider text-white px-3 py-1.5 rounded-md bg-gradient-to-r ${cat.color} shadow-md`}>
                          {cat.icon} {cat.category}
                        </div>

                        {/* In-cart badge */}
                        {inCart > 0 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                          >
                            {inCart}
                          </motion.div>
                        )}

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                      </div>

                      {/* ── CARD BODY ── */}
                      <div className="p-5 flex flex-col flex-1">
                        {/* Item Name */}
                        <h4 className="font-bold text-slate-900 text-base leading-snug mb-2 min-h-[3rem]">
                          {item.name}
                        </h4>

                        {/* Description */}
                        <p className="text-slate-500 text-xs leading-relaxed mb-4 min-h-[2.5rem]">
                          {item.description}
                        </p>

                        {/* Price */}
                        <div className="flex items-baseline gap-1 mb-4">
                          <span className="text-slate-400 text-xs">₦</span>
                          <span className="text-2xl font-bold text-slate-900">{item.price.toLocaleString()}</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-auto">
                          {inCart > 0 ? (
                            <div className="flex items-center justify-between bg-slate-50 rounded-xl p-1.5 border border-slate-200">
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => removeFromCart(item)}
                                className="w-9 h-9 rounded-lg bg-white text-slate-700 font-bold text-lg shadow-sm border border-slate-200 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
                              >−</motion.button>
                              <span className="font-bold text-slate-900 text-sm">
                                {inCart} in cart
                              </span>
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => addToCart(item)}
                                className="w-9 h-9 rounded-lg bg-red-600 text-white font-bold text-lg shadow-md hover:bg-red-700 transition-all"
                              >+</motion.button>
                            </div>
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => addToCart(item)}
                              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-red-600 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              Add to Cart
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-slate-500 text-sm mt-14 italic max-w-2xl mx-auto"
        >
          All items are freshly prepared with 100% pure groundnut oil.
          Add takeaway pack (+₦{TAKEAWAY_PRICE}) at checkout if you need one.
        </motion.p>
      </div>
    </section>
  );
}

// ─── Cart Drawer (text-only, no images) ───────────────────────────────────────
function CartDrawer({ open, onClose, cart, setCart, onCheckout }) {
  const items = Object.values(cart);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const update = (id, delta) => setCart((c) => {
    const next = { ...c };
    if (!next[id]) return next;
    next[id] = { ...next[id], qty: next[id].qty + delta };
    if (next[id].qty <= 0) delete next[id];
    return next;
  });

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[60]" />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[440px] bg-white z-[70] shadow-2xl flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-br from-slate-900 to-slate-800 text-white">
              <div>
                <h3 className="text-xl font-bold tracking-tight">Your Cart</h3>
                <p className="text-slate-300 text-xs mt-0.5">{items.length} item{items.length !== 1 ? "s" : ""} · Ready to checkout</p>
              </div>
              <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-colors"><HiX className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-slate-100 flex items-center justify-center">
                    <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">Your cart is empty</h4>
                  <p className="text-slate-500 mt-2 text-sm">Add some delicious items to get started</p>
                  <button onClick={onClose} className="mt-6 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors">Browse Menu</button>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div key={item.id} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-slate-900 text-sm leading-snug">{item.name}</h4>
                            <p className="text-slate-500 text-xs mt-1">₦{item.price.toLocaleString()} each</p>
                          </div>
                          <button onClick={() => update(item.id, -item.qty)} className="text-slate-400 hover:text-red-500 transition-colors flex-shrink-0">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button onClick={() => update(item.id, -1)} className="w-7 h-7 rounded-lg bg-white border border-slate-200 font-bold text-slate-700 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors text-sm">−</button>
                            <span className="font-semibold text-sm w-6 text-center">{item.qty}</span>
                            <button onClick={() => update(item.id, 1)} className="w-7 h-7 rounded-lg bg-white border border-slate-200 font-bold text-slate-700 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors text-sm">+</button>
                          </div>
                          <p className="text-slate-900 font-bold text-base">₦{(item.price * item.qty).toLocaleString()}</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
            {items.length > 0 && (
              <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-3">
                <div className="flex justify-between text-sm text-slate-600"><span>Subtotal</span><span className="font-semibold text-slate-900">₦{subtotal.toLocaleString()}</span></div>
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700 flex items-start gap-2">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span><strong className="font-semibold">Delivery fee</strong> is paid directly to the rider upon arrival. Takeaway pack (+₦{TAKEAWAY_PRICE}) can be added at checkout.</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-slate-900 pt-3 border-t border-slate-200"><span>Total</span><span>₦{subtotal.toLocaleString()}</span></div>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={onCheckout}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-red-500/25 text-sm tracking-wide transition-all">
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
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// ─── Email Helper ─────────────────────────────────────────────────────────────
async function sendDeliveryDetailsEmail(form, cart = {}, takeaway = false) {
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    console.warn("EmailJS not configured — skipping email.");
    return { ok: false };
  }
  const items = Object.values(cart);
  const orderSummary = items.length ? items.map((i) => `• ${i.name} x${i.qty} — ₦${(i.price * i.qty).toLocaleString()}`).join("\n") : "No items";
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const takeawayFee = takeaway ? TAKEAWAY_PRICE : 0;
  const totalAmount = subtotal + takeawayFee;
  const fullMessage = `ORDER DETAILS:\n${orderSummary}\n\nSubtotal: ₦${subtotal.toLocaleString()}\nTakeaway Pack: ${takeaway ? `₦${takeawayFee}` : "No"}\nTotal: ₦${totalAmount.toLocaleString()}\n\nNotes:\n${form.note || "None"}`;
  try {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID, template_id: EMAILJS_TEMPLATE_ID, user_id: EMAILJS_PUBLIC_KEY,
        template_params: { name: form.name, fullName: form.name, fullname: form.name, email: form.email || "Not provided", phone: form.phone, address: form.address, message: fullMessage, time: new Date().toLocaleString("en-NG", { dateStyle: "full", timeStyle: "short" }), title: "New Delivery Request" },
      }),
    });
    const text = await response.text();
    if (!response.ok) { console.error("EmailJS error:", response.status, text); return { ok: false }; }
    return { ok: true };
  } catch (err) { console.error("EmailJS failed:", err); return { ok: false }; }
}

// ─── Build WhatsApp URL ───────────────────────────────────────────────────────
function buildWhatsAppUrl({ form, cart, transaction, total, takeaway }) {
  const items = Object.values(cart);
  const orderSummary = items.map((i) => `• ${i.name} x${i.qty} — ₦${(i.price * i.qty).toLocaleString()}`).join("\n");
  const takeawayLine = takeaway ? `\n📦 *Takeaway Pack:* ₦${TAKEAWAY_PRICE}` : `\n📦 *Takeaway Pack:* No`;
  const message =
    `🎉 *NEW ORDER — PAYMENT CONFIRMED* 🎉\n\n` +
    `Hello Mama Akara! A customer has just paid for an order via Paystack.\n\n` +
    `👤 *Customer Details*\n` +
    `Name: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email || "Not provided"}\nAddress: ${form.address}\n\n` +
    `🛒 *Order Summary*\n${orderSummary}` +
    takeawayLine + `\n\n` +
    `💰 *Total Paid:* ₦${total.toLocaleString()}\n` +
    `💳 *Payment Method:* ${transaction?.channel || "card"}\n` +
    `🔖 *Reference:* ${transaction?.reference || "N/A"}\n\n` +
    `📝 *Notes:* ${form.note || "None"}\n\n` +
    `Please prepare this order for immediate delivery. Thank you! 🙏`;
  return `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function generateOrderNumber() {
  return `AKARA-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

function generatePaystackRef() {
  return `AKARA_${Date.now()}_${Math.floor(Math.random() * 1_000_000)}`;
}

function getPaystackChannels(method) {
  const map = { card: ["card"], bank_transfer: ["bank_transfer"], ussd: ["ussd"], qr: ["qr"], bank: ["bank"] };
  return map[method] ?? ["card", "bank_transfer", "ussd", "qr"];
}

async function saveOrderToSupabase({ form, items, total, status = "pending", paymentChannel = "pending", paystackReference, takeaway = false }) {
  const cleanItems = items.map(({ id, name, price, qty }) => ({ id, name, price, qty }));
  if (takeaway) {
    cleanItems.push({ id: "takeaway-pack", name: "Takeaway Pack", price: TAKEAWAY_PRICE, qty: 1 });
  }

  const orderData = {
    order_number: generateOrderNumber(),
    customer_name: form.name.trim(),
    customer_email: form.email?.trim() || "",
    customer_phone: form.phone.trim(),
    delivery_address: form.address.trim(),
    order_notes: (form.note?.trim() || "") + (takeaway ? " | Takeaway pack requested." : ""),
    items: cleanItems,
    subtotal: total,
    total_amount: total,
    payment_status: status,
    delivery_status: "pending",
    payment_channel: paymentChannel,
    paystack_reference: paystackReference || `PENDING_${Date.now()}`,
  };

  const { data, error } = await supabase
    .from("orders")
    .insert([orderData])
    .select()
    .single();

  if (error) {
    console.error("Supabase insert error:", error);
    throw new Error(error.message || "Database insert failed");
  }

  return data;
}

async function updateOrderPayment({ orderId, reference, channel }) {
  const { data, error } = await supabase
    .from("orders")
    .update({
      payment_status: "paid",
      payment_channel: channel || "card",
      paystack_reference: reference,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .select()
    .single();

  if (error) {
    console.error("Supabase update error:", error);
    throw new Error(error.message || "Failed to update order");
  }

  return data;
}

// ─── Paystack Loader Hook ─────────────────────────────────────────────────────
function usePaystackLoader() {
  const [paystackReady, setPaystackReady] = useState(false);
  const [paystackError, setPaystackError] = useState(false);

  useEffect(() => {
    if (typeof window.PaystackPop !== "undefined") {
      setPaystackReady(true);
      return;
    }

    const existing = document.querySelector(
      'script[src="https://js.paystack.co/v2/inline.js"]'
    );

    if (!existing) {
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v2/inline.js";
      script.async = true;
      script.onerror = () => {
        console.error("Failed to load Paystack script from CDN.");
        setPaystackError(true);
      };
      document.head.appendChild(script);
    }

    let attempts = 0;
    const maxAttempts = 50;

    const pollInterval = setInterval(() => {
      attempts++;
      if (typeof window.PaystackPop !== "undefined") {
        setPaystackReady(true);
        clearInterval(pollInterval);
        return;
      }
      if (attempts >= maxAttempts) {
        console.error("Paystack script failed to initialize after 10 seconds.");
        setPaystackError(true);
        clearInterval(pollInterval);
      }
    }, 200);

    return () => clearInterval(pollInterval);
  }, []);

  return { paystackReady, paystackError };
}

// ─── Checkout Modal (with Takeaway Option, text-only order review) ───────────
function CheckoutModal({ open, onClose, cart, setCart }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", note: "" });
  const [payMethod, setPayMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [deliverySaved, setDeliverySaved] = useState(false);
  const [deliverySaving, setDeliverySaving] = useState(false);
  const [savedOrderId, setSavedOrderId] = useState(null);
  const [whatsappUrl, setWhatsappUrl] = useState(null);
  const [takeaway, setTakeaway] = useState(false);

  const { showToast } = useToast();
  const { paystackReady, paystackError } = usePaystackLoader();

  const items = Object.values(cart);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const takeawayFee = takeaway ? TAKEAWAY_PRICE : 0;
  const total = subtotal + takeawayFee;

  const reset = () => {
    setStep(1); setForm({ name: "", phone: "", email: "", address: "", note: "" });
    setPayMethod("card"); setSuccess(false); setLoading(false);
    setDeliverySaved(false); setDeliverySaving(false); setSavedOrderId(null); setWhatsappUrl(null);
    setTakeaway(false);
  };

  const close = () => { onClose(); setTimeout(reset, 400); };

  useEffect(() => {
    if (deliverySaved) setDeliverySaved(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [takeaway]);

  const handleSaveDelivery = async () => {
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      showToast("Please fill in Name, Phone and Address first.", "error");
      return;
    }

    setDeliverySaving(true);

    try {
      const savedOrder = await saveOrderToSupabase({
        form,
        items,
        total,
        status: "pending",
        paymentChannel: "pending",
        paystackReference: `PENDING_${Date.now()}`,
        takeaway,
      });

      if (savedOrder?.id) setSavedOrderId(savedOrder.id);

      setDeliverySaved(true);

      sendDeliveryDetailsEmail(form, cart, takeaway).catch(console.error);

      showToast("✅ Delivery information saved successfully!", "success");
    } catch (err) {
      console.error("Save delivery failed:", err);
      const msg = err?.message || "";
      if (msg.includes("relation") || msg.includes("does not exist")) {
        showToast("Database table not found. Please contact support.", "error");
      } else if (msg.includes("violates") || msg.includes("policy") || msg.includes("permission")) {
        showToast("Permission error saving order. Please contact support.", "error");
      } else if (msg.includes("JWT") || msg.includes("auth") || msg.includes("anon")) {
        showToast("Authentication error. Please refresh and try again.", "error");
      } else if (msg.includes("network") || msg.includes("fetch") || msg.includes("Failed to fetch")) {
        showToast("Network error. Please check your connection and try again.", "error");
      } else {
        showToast(`Could not save delivery info: ${msg || "Unknown error. Try again."}`, "error");
      }
    } finally {
      setDeliverySaving(false);
    }
  };

  const handlePay = () => {
    if (!deliverySaved) {
      showToast("Please save your delivery information first.", "error");
      setStep(1);
      return;
    }
    if (!paystackReady) {
      showToast(paystackError ? "Payment gateway failed to load. Please refresh." : "Payment gateway loading, please wait...", paystackError ? "error" : "info");
      return;
    }
    if (typeof window.PaystackPop === "undefined") {
      showToast("Payment gateway not loaded. Please refresh the page.", "error");
      return;
    }
    if (!form.email) { showToast("Please go back and enter your email address.", "error"); return; }
    if (!PAYSTACK_PUBLIC_KEY) { showToast("Payment configuration error. Please contact support.", "error"); return; }
    if (total < 100) { showToast("Minimum order amount is ₦100.", "error"); return; }

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
          { display_name: "Takeaway Pack", variable_name: "takeaway", value: takeaway ? `Yes (+₦${TAKEAWAY_PRICE})` : "No" },
          { display_name: "Items Ordered", variable_name: "items_ordered", value: items.map((i) => `${i.name} x${i.qty}`).join(", ") },
        ],
      },
      onSuccess: async (transaction) => {
        console.log("Paystack success:", transaction);
        if (savedOrderId) {
          try { await updateOrderPayment({ orderId: savedOrderId, reference: transaction.reference, channel: transaction.channel }); }
          catch (err) { console.error("Failed to update order payment:", err); showToast("Payment received but update failed. We will review manually.", "info"); }
        }
        sendDeliveryDetailsEmail(form, cart, takeaway).catch(console.error);

        setLoading(false);
        setSuccess(true);
        showToast("🎉 Payment successful! Your order is confirmed.");

        const url = buildWhatsAppUrl({ form, cart, transaction, total, takeaway });
        setWhatsappUrl(url);

        setTimeout(() => { window.location.href = url; }, 2500);
      },
      onCancel: () => { setLoading(false); showToast("Payment cancelled. Try again when ready.", "info"); },
      onError: (error) => { setLoading(false); console.error("Paystack error:", error); showToast(`Payment failed: ${error?.message || "Unknown error"}`, "error"); },
    });
  };

  const canNext1 = form.name.trim() && form.phone.trim() && form.address.trim();
  const canNext2 = items.length > 0;

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4" onClick={close}>
          <motion.div initial={{ scale: 0.95, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 26 }} onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">

            <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative flex-shrink-0">
              <button onClick={close} className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-colors"><HiX className="w-4 h-4" /></button>
              <h2 className="text-xl font-bold tracking-tight">Checkout</h2>
              <p className="text-slate-300 text-xs mt-1">Complete your order in 3 simple steps</p>
              <div className="flex items-center gap-2 mt-5">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex-1 flex items-center gap-2">
                    <motion.div animate={{ backgroundColor: step >= s ? "#dc2626" : "rgba(255,255,255,0.15)", scale: step === s ? 1.1 : 1 }}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                      {success && s === 3 ? "✓" : s}
                    </motion.div>
                    {s < 3 && (<div className="flex-1 h-0.5 rounded-full bg-white/15 overflow-hidden"><motion.div animate={{ width: step > s ? "100%" : "0%" }} className="h-full bg-red-500" /></div>)}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[10px] mt-2 text-slate-400 font-semibold uppercase tracking-wider"><span>Details</span><span>Review</span><span>Payment</span></div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">

                {/* STEP 1 — Details + Takeaway Option */}
                {step === 1 && (
                  <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                    <h3 className="text-base font-bold text-slate-900">Delivery Details</h3>
                    {[
                      { key: "name", label: "Full Name *", type: "text" },
                      { key: "phone", label: "Phone Number *", type: "tel" },
                      { key: "email", label: "Email Address (for receipt)", type: "email" },
                      { key: "address", label: "Delivery Address (Abraka) *", type: "text" },
                    ].map((f) => (
                      <input key={f.key} type={f.type} value={form[f.key]}
                        onChange={(e) => { setForm({ ...form, [f.key]: e.target.value }); if (deliverySaved) setDeliverySaved(false); }}
                        placeholder={f.label}
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-100 outline-none transition-all text-sm" />
                    ))}
                    <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })}
                      placeholder="Special instructions (optional)" rows={3}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-100 outline-none transition-all resize-none text-sm" />

                    {/* Takeaway Pack Option */}
                    <div className="pt-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                        Do you want a Takeaway Pack? 📦
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setTakeaway(true)}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            takeaway
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">📦</span>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              takeaway ? "border-emerald-500 bg-emerald-500" : "border-slate-300"
                            }`}>
                              {takeaway && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          </div>
                          <p className={`font-bold text-sm ${takeaway ? "text-emerald-800" : "text-slate-900"}`}>With Takeaway</p>
                          <p className={`text-xs mt-1 ${takeaway ? "text-emerald-700" : "text-slate-500"}`}>+₦{TAKEAWAY_PRICE} per pack</p>
                        </motion.button>

                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setTakeaway(false)}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            !takeaway
                              ? "border-slate-900 bg-slate-50"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">🚫</span>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              !takeaway ? "border-slate-900 bg-slate-900" : "border-slate-300"
                            }`}>
                              {!takeaway && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          </div>
                          <p className={`font-bold text-sm ${!takeaway ? "text-slate-900" : "text-slate-900"}`}>No Takeaway</p>
                          <p className={`text-xs mt-1 ${!takeaway ? "text-slate-700" : "text-slate-500"}`}>No extra charge</p>
                        </motion.button>
                      </div>

                      <AnimatePresence>
                        {takeaway && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800"
                          >
                            <strong>Takeaway pack added</strong> — ₦{TAKEAWAY_PRICE} will be added to your total.
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2.5">
                      <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span><strong className="font-semibold">Note:</strong> We deliver within Abraka, Delta State. Delivery fee is paid directly to the rider upon arrival.</span>
                    </div>

                    <AnimatePresence>
                      {canNext1 && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
                          {deliverySaved ? (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                              className="w-full flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-emerald-800 text-sm">Your delivery information has been saved successfully!</p>
                                <p className="text-emerald-700 text-xs mt-1 leading-relaxed">Your details have been recorded. Click <strong>Continue</strong> below to review and pay.</p>
                              </div>
                            </motion.div>
                          ) : (
                            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={handleSaveDelivery} disabled={deliverySaving}
                              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                              {deliverySaving ? (
                                <>
                                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full" />
                                  Saving your information...
                                </>
                              ) : (
                                <>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
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

                {/* STEP 2 — Review (TEXT-ONLY, no item images) */}
                {step === 2 && (
                  <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                    <h3 className="text-base font-bold text-slate-900">Order Summary</h3>
                    {deliverySaved && (
                      <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <div>
                          <p className="font-semibold text-emerald-800 text-xs">Delivery information saved ✓</p>
                          <p className="text-emerald-700 text-xs">Complete payment to finalize your order</p>
                        </div>
                      </div>
                    )}
                    <div className="space-y-2">
                      {items.map((i) => (
                        <div key={i.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900 text-sm leading-snug">{i.name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">Qty: {i.qty} × ₦{i.price.toLocaleString()}</p>
                          </div>
                          <p className="font-bold text-slate-900 text-base ml-3 flex-shrink-0">₦{(i.price * i.qty).toLocaleString()}</p>
                        </div>
                      ))}
                      {takeaway && (
                        <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                          <div className="flex-1">
                            <p className="font-semibold text-emerald-900 text-sm">📦 Takeaway Pack</p>
                            <p className="text-xs text-emerald-700 mt-0.5">Qty: 1</p>
                          </div>
                          <p className="font-bold text-emerald-900 ml-3">₦{TAKEAWAY_PRICE.toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
                      <div className="flex justify-between text-sm text-slate-700"><span>Subtotal</span><span className="font-semibold">₦{subtotal.toLocaleString()}</span></div>
                      {takeaway && (
                        <div className="flex justify-between text-sm text-emerald-700"><span>Takeaway Pack</span><span className="font-semibold">+₦{TAKEAWAY_PRICE.toLocaleString()}</span></div>
                      )}
                      <div className="flex justify-between text-sm text-slate-700"><span>Delivery</span><span className="font-semibold text-blue-600">Paid on Delivery</span></div>
                      <div className="flex justify-between font-bold text-lg text-slate-900 pt-2 border-t border-slate-200"><span>Total to Pay Now</span><span>₦{total.toLocaleString()}</span></div>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700"><strong className="font-semibold">Delivering to:</strong> {form.address}</div>
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800"><strong className="font-semibold">Fast & Swift Delivery:</strong> Your order will be delivered immediately once payment is received.</div>
                  </motion.div>
                )}

                {/* STEP 3 — Payment */}
                {step === 3 && (
                  <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                    {loading && (
                      <div className="py-12 text-center">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-14 h-14 mx-auto border-4 border-slate-100 border-t-red-600 rounded-full" />
                        <p className="mt-4 font-semibold text-slate-900 text-sm">Opening payment window...</p>
                        <p className="text-xs text-slate-500 mt-1">Please don't close this window</p>
                      </div>
                    )}
                    {success && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 18 }} className="py-8 text-center">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15, type: "spring" }}
                          className="w-20 h-20 mx-auto bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </motion.div>
                        <h3 className="text-2xl font-bold text-slate-900 mt-6 tracking-tight">Payment Successful!</h3>
                        <p className="text-slate-500 mt-2 text-sm">Your order has been confirmed and recorded.</p>
                        <p className="text-xs text-emerald-600 font-semibold mt-3">Redirecting you to WhatsApp to notify the seller...</p>
                        <p className="text-xs text-slate-400 mt-1">Fast & swift delivery on the way! 🎉</p>
                        {whatsappUrl && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="mt-6">
                            <p className="text-xs text-slate-500 mb-3">If not redirected automatically, tap below:</p>
                            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-emerald-500/30 transition-colors">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                              Send Order to Seller via WhatsApp
                            </a>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                    {!loading && !success && (
                      <>
                        <h3 className="text-base font-bold text-slate-900">Choose Payment Method</h3>
                        {!paystackReady && !paystackError && (
                          <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-4 h-4 border-2 border-amber-400 border-t-amber-600 rounded-full flex-shrink-0" />
                            <p className="text-amber-800 text-xs font-medium">Loading payment gateway, please wait...</p>
                          </div>
                        )}
                        {paystackError && (
                          <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                            <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-1" />
                            <div><p className="text-red-800 text-xs font-semibold">Payment gateway failed to load</p><p className="text-red-700 text-xs mt-0.5">Please check your connection and refresh.</p></div>
                          </div>
                        )}
                        {!deliverySaved && (
                          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                            <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-1.5" />
                            <div>
                              <p className="font-semibold text-red-800 text-sm">Delivery information not saved</p>
                              <p className="text-red-700 text-xs mt-0.5 leading-relaxed">Please go back to Step 1 and click <strong>"Save Delivery Information"</strong> first.</p>
                            </div>
                          </div>
                        )}
                        {deliverySaved && (
                          <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <div><p className="font-semibold text-emerald-800 text-sm">Delivery information saved ✓</p><p className="text-emerald-700 text-xs mt-0.5">Complete payment below to finalize your order.</p></div>
                          </div>
                        )}
                        <div className="grid grid-cols-1 gap-2.5">
                          {[
                            { id: "card", label: "Debit / Credit Card", sub: "Visa, Mastercard, Verve" },
                            { id: "bank_transfer", label: "Bank Transfer", sub: "Transfer from any Nigerian bank" },
                            { id: "ussd", label: "USSD Code", sub: "Dial a shortcode from your phone" },
                            { id: "qr", label: "QR Code", sub: "Scan and pay instantly" },
                            { id: "bank", label: "Pay with Bank", sub: "Direct debit from your account" },
                          ].map((method) => (
                            <motion.button key={method.id} whileTap={{ scale: 0.99 }} onClick={() => setPayMethod(method.id)}
                              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${payMethod === method.id ? "border-red-500 bg-red-50" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"}`}>
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${payMethod === method.id ? "border-red-500 bg-red-500" : "border-slate-300 bg-white"}`}>
                                {payMethod === method.id && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2 h-2 rounded-full bg-white" />}
                              </div>
                              <div className="flex-1">
                                <p className={`font-semibold text-sm ${payMethod === method.id ? "text-slate-900" : "text-slate-800"}`}>{method.label}</p>
                                <p className="text-xs text-slate-500 mt-0.5">{method.sub}</p>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                        <div className="p-4 bg-slate-900 rounded-xl text-white">
                          <div className="flex justify-between items-baseline"><span className="text-sm text-slate-300">You'll pay</span><span className="text-2xl font-bold">₦{total.toLocaleString()}</span></div>
                          {takeaway && (
                            <p className="text-[11px] text-emerald-400 mt-1.5">Includes ₦{TAKEAWAY_PRICE} takeaway pack</p>
                          )}
                          <p className="text-[11px] text-slate-400 mt-1.5">+ Delivery fee paid to rider on arrival</p>
                        </div>
                        <div className="text-xs text-slate-500 text-center flex items-center justify-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                          Secured by <span className="font-semibold text-slate-700">Paystack</span>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {!loading && !success && (
              <div className="p-6 border-t border-slate-100 flex gap-3 bg-slate-50 flex-shrink-0">
                {step > 1 && (
                  <button onClick={() => setStep(step - 1)} className="px-6 py-3 rounded-xl border border-slate-200 bg-white font-semibold text-sm text-slate-700 hover:bg-slate-100 transition-colors">Back</button>
                )}
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    if (step === 3) { handlePay(); return; }
                    if (step === 1 && !deliverySaved) { showToast("Please save your delivery information before continuing.", "error"); return; }
                    setStep(step + 1);
                  }}
                  disabled={(step === 1 && !canNext1) || (step === 2 && !canNext2)}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-3 rounded-xl font-semibold text-sm shadow-lg shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                  {step === 3 ? `Pay ₦${total.toLocaleString()} Securely` : "Continue"}
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
    { title: "Pure Groundnut Oil", desc: "We fry only with 100% pure groundnut oil — never palm oil. Healthier and tastier." },
    { title: "Premium Quality", desc: "We use only the finest local black-eyed beans, carefully sorted every morning." },
    { title: "Unbeatable Prices", desc: "Restaurant-quality akara at street-food prices. 6 pieces for just ₦500." },
    { title: "Hygienic & Safe", desc: "Top food safety standards. Sealed packaging every time." },
    { title: "Easy Ordering", desc: "Order in seconds. Pay online securely with Paystack." },
  ];
  return (
    <section id="about" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <SectionHeader badge="Why Choose Us" title="Trusted by Thousands of" highlight="Nigerians" sub="We deliver joy, culture, and memories — not just food." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.06 }} whileHover={{ y: -4 }}
              className="group relative p-7 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500 bg-white overflow-hidden">
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
  useEffect(() => { const t = setInterval(() => setIndex((i) => (i + 1) % reviews.length), 5000); return () => clearInterval(t); }, []);

  return (
    <section id="reviews" className="py-20 sm:py-28 bg-slate-950 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_30%,rgba(220,38,38,0.1),transparent)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_50%,transparent_100%)]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative">
        <SectionHeader badge="Customer Love" title="What Our" highlight="Customers Say" sub="Over 10,000 happy customers and counting." dark />
        <div className="max-w-3xl mx-auto mb-12 h-72 sm:h-64 relative">
          <AnimatePresence mode="wait">
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 flex flex-col justify-center">
              <div className="flex gap-1 mb-5">{Array(reviews[index].rating).fill(0).map((_, i) => <span key={i} className="text-amber-400 text-lg">★</span>)}</div>
              <p className="text-white/90 text-base sm:text-lg leading-relaxed mb-6 font-light italic">"{reviews[index].text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold text-sm ring-2 ring-white/10">{reviews[index].avatar}</div>
                <div><div className="text-white font-semibold text-sm">{reviews[index].name}</div><div className="text-slate-500 text-xs">{reviews[index].role}</div></div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex justify-center gap-2 mb-14">
          {reviews.map((_, i) => <button key={i} onClick={() => setIndex(i)} className={`h-1.5 rounded-full transition-all ${i === index ? "w-8 bg-red-500" : "w-1.5 bg-white/20 hover:bg-white/30"}`} />)}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.slice(0, 3).map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -4 }}
              className="bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/[0.06] hover:border-white/15 transition-all">
              <div className="flex gap-0.5 mb-3">{Array(r.rating).fill(0).map((_, j) => <span key={j} className="text-amber-400 text-sm">★</span>)}</div>
              <p className="text-slate-300 text-sm leading-relaxed mb-5 font-light">{r.text}</p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white text-xs font-bold">{r.avatar}</div>
                <div><div className="text-white font-semibold text-sm">{r.name}</div><div className="text-slate-500 text-xs">{r.role}</div></div>
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
        <SectionHeader badge="How It Works" title="Order in" highlight="4 Simple Steps" sub="From your phone to your door — fast and delicious." />
        <div className="relative">
          <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative text-center group">
                <div className="relative inline-flex items-center justify-center mb-6">
                  <motion.div whileHover={{ scale: 1.05 }} className="w-16 h-16 rounded-2xl bg-white border border-slate-200 group-hover:border-red-500 group-hover:shadow-lg group-hover:shadow-red-500/20 transition-all flex items-center justify-center relative z-10">
                    <span className="text-slate-900 font-bold text-lg group-hover:text-red-600 transition-colors">{s.step}</span>
                  </motion.div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 tracking-tight">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <div className="grid md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {[{ label: "Delivery Zones", value: "Within Abraka, Delta" }, { label: "Opening Hours", value: "6:30 AM – 10:00 AM" }, { label: "Delivery Fee", value: "Paid on Delivery" }].map((stat, i) => (
              <div key={i} className="p-4 md:px-6">
                <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold">{stat.label}</div>
                <div className="text-lg sm:text-xl font-bold text-slate-900 mt-2 tracking-tight">{stat.value}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-amber-50 border border-red-100 rounded-2xl text-center text-sm text-slate-700">
            <strong className="font-semibold">Open Mondays, Wednesdays, Thursdays, Fridays & Saturdays</strong> — immediate delivery once payment is received!
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
    e.preventDefault(); setSubmitted(true); setForm({ name: "", email: "", message: "" });
    showToast("Message sent! We'll get back to you soon.");
    setTimeout(() => setSubmitted(false), 5000);
  };
  return (
    <section id="contact" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <SectionHeader badge="Get In Touch" title="Let's" highlight="Connect" sub="Questions? Catering inquiries? We're here to help." />
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="space-y-3">
            {[
              { title: "Visit Us", text: "Abraka, Delta State, Nigeria" },
              { title: "Call Us", text: BUSINESS_PHONE_DISPLAY },
              { title: "Email", text: BUSINESS_EMAIL },
              { title: "Opening Days & Hours", text: "Mon, Wed – Sat · 6:30 AM – 10:00 AM" }
            ].map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ x: 4 }}
                className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-100 transition-all">
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xs">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div><p className="font-semibold text-slate-900 text-sm">{c.title}</p><p className="text-slate-600 text-sm mt-0.5">{c.text}</p></div>
              </motion.div>
            ))}
          </div>
          <motion.form initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} onSubmit={submit} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 mb-2 tracking-tight">Send us a message</h3>
            <AnimatePresence>
              {submitted && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <p className="text-emerald-800 font-semibold text-sm">Message sent successfully</p>
                  <p className="text-emerald-700 text-xs mt-1">We'll get back to you as soon as possible.</p>
                </motion.div>
              )}
            </AnimatePresence>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your Name" className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none transition-all text-sm" />
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email Address" className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none transition-all text-sm" />
            <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Your message..." className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none transition-all resize-none text-sm" />
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-red-500/25 text-sm tracking-wide transition-all">Send Message</motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

// ─── Floating Buttons ─────────────────────────────────────────────────────────
function FloatingButtons() {
  const [showTop, setShowTop] = useState(false);
  useEffect(() => { const onScroll = () => setShowTop(window.scrollY > 600); window.addEventListener("scroll", onScroll); return () => window.removeEventListener("scroll", onScroll); }, []);
  return (
    <>
      <motion.a href={`https://wa.me/${BUSINESS_WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1, type: "spring" }} whileHover={{ scale: 1.08 }}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-2xl shadow-emerald-500/40 flex items-center justify-center transition-colors">
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
        <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-20" />
      </motion.a>
      <AnimatePresence>
        {showTop && (
          <motion.button initial={{ scale: 0, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0, y: 20 }} whileHover={{ scale: 1.08 }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-24 right-6 z-40 w-11 h-11 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl flex items-center justify-center transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" /></svg>
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
  const cartCount = useMemo(() => Object.values(cart).reduce((s, i) => s + i.qty, 0), [cart]);

  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="bg-white font-sans antialiased min-h-screen">
          <ScrollProgress />
          <Navbar onCartClick={() => setCartOpen(true)} cartCount={cartCount} logo={MAMA} />
          <Hero onOrderClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })} onAdminClick={() => setAdminLoginOpen(true)} />
          <ProductSection cart={cart} setCart={setCart} />
          <WhyUs />
          <Testimonials />
          <DeliveryProcess />
          <Contact />
          <Footer businessEmail={BUSINESS_EMAIL} businessPhoneDisplay={BUSINESS_PHONE_DISPLAY} logo={MAMA} />
          <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} setCart={setCart} onCheckout={() => { setCartOpen(false); setTimeout(() => setCheckoutOpen(true), 300); }} />
          <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} cart={cart} setCart={setCart} />
          <FloatingButtons />
          <AdminLoginPopup open={adminLoginOpen} onClose={() => setAdminLoginOpen(false)} />
        </div>
        <style>{`
          html { scroll-behavior: smooth; }
          body { font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
          ::-webkit-scrollbar { width: 8px; height: 8px; }
          ::-webkit-scrollbar-track { background: #f8fafc; }
          ::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #dc2626, #b91c1c); border-radius: 8px; }
          ::-webkit-scrollbar-thumb:hover { background: linear-gradient(180deg, #b91c1c, #991b1b); }
          ::selection { background: #dc2626; color: white; }
        `}</style>
      </ToastProvider>
    </ThemeProvider>
  );
}