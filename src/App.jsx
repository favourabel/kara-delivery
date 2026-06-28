import { useState, useEffect, useRef } from "react";

import Akp from "./assets/Akp.jpg";

// ─── Animation Hook ───────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

// ─── Floating Particle ────────────────────────────────────────────────────────
function Particle({ emoji, style, animClass }) {
  return (
    <span
      className={`absolute select-none pointer-events-none text-2xl ${animClass}`}
      style={style}
    >
      {emoji}
    </span>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["Menu", "About", "Delivery", "Reviews"];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/10 backdrop-blur-2xl shadow-2xl border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/40">
            <span className="text-white text-lg font-black">MA</span>
          </div>
          <div>
            <span className="text-white font-black text-xl tracking-tight">Mama</span>
            <span className="text-orange-400 font-black text-xl"> Akara</span>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-white/80 hover:text-orange-400 text-sm font-medium transition-colors duration-300 relative group"
            >
              {link}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-400 group-hover:w-full transition-all duration-300 rounded-full" />
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button className="text-white/80 hover:text-white text-sm font-medium transition-colors">
            Sign In
          </button>
          <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-2.5 rounded-2xl text-sm font-bold hover:shadow-lg hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-300 active:scale-95">
            Order Now 🔥
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`block h-0.5 bg-white rounded-full transition-all duration-300 ${
                i === 1 ? "w-5" : "w-7"
              } ${menuOpen && i === 0 ? "rotate-45 translate-y-2" : ""} ${
                menuOpen && i === 1 ? "opacity-0" : ""
              } ${menuOpen && i === 2 ? "-rotate-45 -translate-y-2" : ""}`}
            />
          ))}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ${
          menuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-black/80 backdrop-blur-2xl px-6 py-4 flex flex-col gap-4 border-t border-white/10">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-white/80 hover:text-orange-400 font-medium transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link}
            </a>
          ))}
          <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-3 rounded-2xl font-bold w-full mt-2">
            Order Now 🔥
          </button>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function Hero() {
  const particles = [
    { emoji: "🌶️", style: { top: "12%", left: "8%"  }, animClass: "animate-float-slow"   },
    { emoji: "🫘", style: { top: "20%", left: "78%" }, animClass: "animate-float-medium" },
    { emoji: "✨", style: { top: "60%", left: "5%"  }, animClass: "animate-float-fast"   },
    { emoji: "🌿", style: { top: "75%", left: "82%" }, animClass: "animate-float-slow"   },
    { emoji: "🫙", style: { top: "35%", left: "88%" }, animClass: "animate-float-medium" },
    { emoji: "🌶️", style: { top: "80%", left: "15%" }, animClass: "animate-float-fast"   },
    { emoji: "⭐", style: { top: "10%", left: "55%" }, animClass: "animate-float-slow"   },
    { emoji: "🫘", style: { top: "50%", left: "92%" }, animClass: "animate-float-medium" },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* ── Layered Background ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-orange-950/60 to-gray-900" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(249,115,22,0.3),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_75%_60%,rgba(239,68,68,0.15),transparent)]" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url(${Akp})`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating particles */}
      {particles.map((p, i) => (
        <Particle key={i} emoji={p.emoji} style={p.style} animClass={p.animClass} />
      ))}

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-[128px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-500/15 rounded-full blur-[100px] animate-pulse [animation-delay:1s]" />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-32 grid lg:grid-cols-2 gap-16 items-center w-full">

        {/* Left — Text */}
        <div className="flex flex-col gap-6 animate-slide-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-1.5 w-fit backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping-slow" />
            <span className="text-orange-400 text-sm font-semibold tracking-wide">
              🔥 Fresh & Hot · Delivered Daily
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight">
            Nigeria's{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-orange-400 via-red-400 to-orange-500 bg-clip-text text-transparent">
                Finest
              </span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                <path d="M0 6 Q50 0 100 5 Q150 10 200 4" stroke="url(#underlineGrad)" strokeWidth="3" strokeLinecap="round" fill="none"/>
                <defs>
                  <linearGradient id="underlineGrad" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#f97316"/>
                    <stop offset="1" stopColor="#ef4444"/>
                  </linearGradient>
                </defs>
              </svg>
            </span>{" "}
            <br />
            Akara,{" "}
            <span className="text-white/60">Delivered Hot</span>
          </h1>

          <p className="text-white/60 text-lg lg:text-xl leading-relaxed max-w-lg">
            Crispy on the outside, fluffy on the inside. Made fresh every morning
            from premium black-eyed beans by Mama herself — straight to your door.
          </p>

          {/* Stats */}
          <div className="flex gap-8 py-2">
            {[["10k+","Happy Customers"],["4.9★","Average Rating"],["30min","Avg. Delivery"]].map(([val, label]) => (
              <div key={label}>
                <div className="text-2xl font-black text-orange-400">{val}</div>
                <div className="text-white/50 text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mt-2">
            <button className="group relative bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl font-bold text-lg overflow-hidden hover:shadow-2xl hover:shadow-orange-500/40 hover:-translate-y-1 transition-all duration-300 active:scale-95">
              <span className="relative z-10 flex items-center gap-2">
                Order Now
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            <button className="group border border-white/20 text-white px-8 py-4 rounded-2xl font-bold text-lg backdrop-blur-sm hover:border-orange-500/50 hover:bg-orange-500/10 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              View Menu
            </button>
          </div>
        </div>

        {/* Right — 3D Akara Visual */}
        <div className="relative flex items-center justify-center animate-slide-up [animation-delay:200ms]">
          {/* Glow rings */}
          <div className="absolute w-80 h-80 lg:w-[480px] lg:h-[480px] rounded-full border border-orange-500/10 animate-spin-slow" />
          <div className="absolute w-64 h-64 lg:w-96 lg:h-96 rounded-full border border-orange-500/15 animate-spin-reverse" />

          {/* Main glow blob */}
          <div className="absolute w-72 h-72 lg:w-[420px] lg:h-[420px] bg-gradient-to-br from-orange-600/40 via-red-600/25 to-amber-500/30 rounded-full blur-3xl animate-pulse" />

          {/* Plate / dish backdrop */}
          <div className="absolute w-64 h-64 lg:w-80 lg:h-80 bg-gradient-to-br from-amber-900/80 to-orange-900/60 rounded-full blur-2xl" />

          {/* Image container — 3D perspective card */}
          <div className="relative z-10 group" style={{ perspective: "1000px" }}>
            <div
              className="relative w-72 h-72 lg:w-[420px] lg:h-[420px] rounded-[2.5rem] overflow-hidden
                          shadow-[0_40px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.05),inset_0_1px_0_rgba(255,255,255,0.1)]
                          group-hover:shadow-[0_60px_120px_rgba(249,115,22,0.4),0_0_0_1px_rgba(249,115,22,0.2)]
                          transition-all duration-700 animate-float-image"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Actual image */}
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Akara_2.jpg/1200px-Akara_2.jpg"
                alt="Premium Nigerian Akara"
                className="w-full h-full object-cover scale-110 group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&q=90";
                }}
              />

              {/* Overlay gradient for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-orange-950/60 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 via-transparent to-red-900/20" />

              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Bottom badge inside image */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="bg-black/50 backdrop-blur-md rounded-xl px-3 py-1.5 border border-white/10">
                  <span className="text-orange-400 text-xs font-bold">⭐ 4.9 Rating</span>
                </div>
                <div className="bg-orange-500/80 backdrop-blur-md rounded-xl px-3 py-1.5">
                  <span className="text-white text-xs font-bold">🔥 Hot & Fresh</span>
                </div>
              </div>
            </div>

            {/* Floating mini cards */}
            <div className="absolute -top-6 -right-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3 shadow-xl animate-float-card-1">
              <div className="text-2xl mb-1">🫘</div>
              <div className="text-white text-xs font-bold">Premium Beans</div>
              <div className="text-white/50 text-xs">100% Natural</div>
            </div>

            <div className="absolute -bottom-6 -left-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3 shadow-xl animate-float-card-2">
              <div className="text-2xl mb-1">🚚</div>
              <div className="text-white text-xs font-bold">Fast Delivery</div>
              <div className="text-orange-400 text-xs font-bold">≤ 30 mins</div>
            </div>

            <div className="absolute top-1/2 -right-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-3 shadow-xl shadow-orange-500/40 animate-float-card-1 [animation-delay:0.5s]">
              <div className="text-white text-2xl font-black">10k</div>
              <div className="text-white/80 text-xs">Orders</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80L48 74.7C96 69.3 192 58.7 288 53.3C384 48 480 48 576 53.3C672 58.7 768 69.3 864 69.3C960 69.3 1056 58.7 1152 53.3C1248 48 1344 48 1392 48L1440 48V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0Z" fill="rgb(249 250 251)"/>
        </svg>
      </div>
    </section>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ badge, title, highlight, sub }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`text-center mb-16 transition-all duration-700 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 mb-4">
        <span className="text-orange-600 text-sm font-semibold">{badge}</span>
      </div>
      <h2 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
        {title}{" "}
        <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
          {highlight}
        </span>
      </h2>
      {sub && <p className="text-gray-500 mt-4 text-lg max-w-xl mx-auto">{sub}</p>}
    </div>
  );
}

// ─── Menu Section ─────────────────────────────────────────────────────────────
function MenuSection() {
  const [activeTab, setActiveTab] = useState("All");
  const [cart, setCart] = useState({});

  const menu = [
    {
      id: 1,
      name: "Akara Classic",
      desc: "6 perfectly golden, crispy akara balls — the original.",
      price: 1000,
      tag: "Bestseller",
      category: "Classic",
      emoji: "🟠",
      calories: "320 kcal",
      time: "15 min",
    },
    {
      id: 2,
      name: "Akara + Pap",
      desc: "Our signature akara paired with smooth, warm ogi pap.",
      price: 1500,
      tag: "Popular",
      category: "Combos",
      emoji: "🥣",
      calories: "480 kcal",
      time: "18 min",
    },
    {
      id: 3,
      name: "Akara + Bread",
      desc: "Stuffed inside soft agege bread — a street food legend.",
      price: 1300,
      tag: "Trending",
      category: "Combos",
      emoji: "🍞",
      calories: "550 kcal",
      time: "15 min",
    },
    {
      id: 4,
      name: "Family Pack",
      desc: "20+ akara pieces for the whole family — big savings.",
      price: 5000,
      tag: "Best Value",
      category: "Family",
      emoji: "👨‍👩‍👧‍👦",
      calories: "1200 kcal",
      time: "25 min",
    },
    {
      id: 5,
      name: "Spicy Akara",
      desc: "Extra pepper and onion kick for the heat seekers.",
      price: 1200,
      tag: "🌶️ Hot",
      category: "Classic",
      emoji: "🌶️",
      calories: "340 kcal",
      time: "15 min",
    },
    {
      id: 6,
      name: "Akara Deluxe Combo",
      desc: "Akara + pap + bread + chilled zobo drink. Full meal!",
      price: 2500,
      tag: "New",
      category: "Combos",
      emoji: "🎉",
      calories: "780 kcal",
      time: "20 min",
    },
    {
      id: 7,
      name: "Mini Akara Bites",
      desc: "12 bite-sized akara pieces perfect for snacking.",
      price: 800,
      tag: "Snack",
      category: "Classic",
      emoji: "✨",
      calories: "210 kcal",
      time: "12 min",
    },
    {
      id: 8,
      name: "Office Catering Pack",
      desc: "50+ akara with pap for your office. Feeds 10–15 people.",
      price: 15000,
      tag: "Bulk",
      category: "Family",
      emoji: "🏢",
      calories: "—",
      time: "45 min",
    },
  ];

  const tabs = ["All", "Classic", "Combos", "Family"];
  const filtered = activeTab === "All" ? menu : menu.filter((m) => m.category === activeTab);

  const addToCart = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const removeFromCart = (id) =>
    setCart((c) => {
      const next = { ...c };
      if (next[id] > 1) next[id]--;
      else delete next[id];
      return next;
    });

  const tagColor = {
    Bestseller: "bg-orange-500 text-white",
    Popular: "bg-purple-500 text-white",
    Trending: "bg-blue-500 text-white",
    "Best Value": "bg-green-500 text-white",
    "🌶️ Hot": "bg-red-500 text-white",
    New: "bg-pink-500 text-white",
    Snack: "bg-amber-500 text-white",
    Bulk: "bg-gray-700 text-white",
  };

  return (
    <section id="menu" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <SectionHeader
          badge="🍽️ Our Menu"
          title="Order Your"
          highlight="Favourite"
          sub="Freshly made every morning. No preservatives, all love."
        />

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-12 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
                activeTab === tab
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30 scale-105"
                  : "bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-600 border border-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((item, i) => (
            <MenuCard
              key={item.id}
              item={item}
              tagColor={tagColor}
              qty={cart[item.id] || 0}
              onAdd={() => addToCart(item.id)}
              onRemove={() => removeFromCart(item.id)}
              delay={i * 60}
            />
          ))}
        </div>

        {/* Cart Summary */}
        {Object.keys(cart).length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shadow-orange-500/30 animate-slide-up">
            <div className="text-white">
              <div className="font-black text-xl">
                🛒 {Object.values(cart).reduce((a, b) => a + b, 0)} items in cart
              </div>
              <div className="text-white/80 text-sm mt-1">
                Total: ₦
                {menu
                  .reduce((sum, m) => sum + (cart[m.id] || 0) * m.price, 0)
                  .toLocaleString()}
              </div>
            </div>
            <button className="bg-white text-orange-600 font-black px-8 py-3 rounded-2xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto">
              Checkout →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function MenuCard({ item, tagColor, qty, onAdd, onRemove, delay }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-orange-500/10
                  hover:-translate-y-2 transition-all duration-500 border border-gray-100/80
                  ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Image area */}
      <div className="relative h-44 bg-gradient-to-br from-orange-100 to-amber-50 overflow-hidden flex items-center justify-center">
        <span className="text-7xl group-hover:scale-110 transition-transform duration-500 select-none">
          {item.emoji}
        </span>
        {/* Tag */}
        <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${tagColor[item.tag]}`}>
          {item.tag}
        </span>
        {/* Time */}
        <span className="absolute top-3 right-3 text-xs bg-black/20 text-white backdrop-blur-sm px-2 py-1 rounded-full">
          ⏱ {item.time}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-black text-gray-900 text-lg leading-tight">{item.name}</h3>
        <p className="text-gray-500 text-sm mt-1.5 leading-relaxed line-clamp-2">{item.desc}</p>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-gray-400">{item.calories}</span>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-orange-500 font-black text-xl">₦{item.price.toLocaleString()}</span>
          </div>

          {/* Cart controls */}
          {qty === 0 ? (
            <button
              onClick={onAdd}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl text-sm font-bold
                         hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
            >
              Add +
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-orange-50 rounded-xl p-1">
              <button
                onClick={onRemove}
                className="w-7 h-7 rounded-lg bg-white shadow text-orange-600 font-black hover:bg-orange-500 hover:text-white transition-colors"
              >
                −
              </button>
              <span className="text-orange-600 font-black w-4 text-center text-sm">{qty}</span>
              <button
                onClick={onAdd}
                className="w-7 h-7 rounded-lg bg-orange-500 text-white font-black hover:bg-orange-600 transition-colors"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Why Choose Us ────────────────────────────────────────────────────────────
function WhyUs() {
  const features = [
    {
      icon: "🔥",
      title: "Made Fresh Daily",
      desc: "Every batch is prepared at dawn with freshly soaked and peeled beans. Zero freezing, zero compromise.",
      color: "from-orange-400 to-red-500",
      bg: "bg-orange-50",
    },
    {
      icon: "🚀",
      title: "Lightning Delivery",
      desc: "Our riders are always ready. Average delivery time is under 30 minutes within Port Harcourt.",
      color: "from-blue-400 to-purple-500",
      bg: "bg-blue-50",
    },
    {
      icon: "💎",
      title: "Premium Quality",
      desc: "We use only the finest local black-eyed beans, fresh peppers, onions, and pure palm oil.",
      color: "from-amber-400 to-orange-500",
      bg: "bg-amber-50",
    },
    {
      icon: "💰",
      title: "Unbeatable Prices",
      desc: "Restaurant-quality akara at street-food prices. Because good food shouldn't break the bank.",
      color: "from-green-400 to-emerald-500",
      bg: "bg-green-50",
    },
    {
      icon: "🛡️",
      title: "Hygienic & Safe",
      desc: "Our kitchen meets top food safety standards. Every order is handled with gloves and sealed packaging.",
      color: "from-pink-400 to-rose-500",
      bg: "bg-pink-50",
    },
    {
      icon: "📱",
      title: "Easy Ordering",
      desc: "Order in seconds via our website or WhatsApp. Track in real-time, pay on delivery or online.",
      color: "from-violet-400 to-purple-500",
      bg: "bg-violet-50",
    },
  ];

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <SectionHeader
          badge="💡 Why Us"
          title="Why Thousands Choose"
          highlight="Mama Akara"
          sub="We don't just sell akara — we deliver joy, culture, and memories."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => {
            const [ref, inView] = useInView();
            return (
              <div
                key={i}
                ref={ref}
                className={`group p-8 rounded-3xl border border-gray-100 hover:border-transparent
                             hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-default
                             ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className={`w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center text-3xl mb-5
                                 group-hover:scale-110 transition-transform duration-300`}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed">{f.desc}</p>
                <div className={`mt-5 h-1 w-12 rounded-full bg-gradient-to-r ${f.color} group-hover:w-full transition-all duration-500`} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
  const reviews = [
    {
      name: "Chioma Okonkwo",
      role: "Food Blogger · Lagos",
      avatar: "CO",
      rating: 5,
      text: "I've eaten akara all over Nigeria and Mama Akara is hands-down the best. The crispiness, the flavor — it's unmatched. I order every weekend!",
      color: "from-orange-400 to-red-400",
    },
    {
      name: "Emeka Nwosu",
      role: "Software Engineer · PH",
      avatar: "EN",
      rating: 5,
      text: "As someone who works from home, having fresh hot akara delivered to my door every morning has been a game changer. Quality is consistently excellent.",
      color: "from-purple-400 to-blue-400",
    },
    {
      name: "Fatima Aliyu",
      role: "Nurse · Port Harcourt",
      avatar: "FA",
      rating: 5,
      text: "Ordered the family pack for my kids on a Sunday morning. They absolutely devoured everything! Will definitely order again. Fast delivery too.",
      color: "from-green-400 to-emerald-400",
    },
    {
      name: "Tunde Adeyemi",
      role: "Business Owner · PH",
      avatar: "TA",
      rating: 5,
      text: "Mama Akara catered our office breakfast meeting and everyone was blown away. Professional, on-time, and absolutely delicious. 10/10 recommend.",
      color: "from-pink-400 to-rose-400",
    },
    {
      name: "Blessing Eze",
      role: "Teacher · Enugu",
      avatar: "BE",
      rating: 5,
      text: "The akara + pap combo takes me straight back to my grandmother's kitchen. Authentic taste, fair price. This is real Nigerian comfort food.",
      color: "from-amber-400 to-orange-400",
    },
    {
      name: "David Obi",
      role: "Student · UNIPORT",
      avatar: "DO",
      rating: 5,
      text: "Best breakfast deal for students on a budget! The spicy akara is my go-to — it's fire 🔥. Delivers to campus too. What's not to love?",
      color: "from-blue-400 to-violet-400",
    },
  ];

  return (
    <section id="reviews" className="py-24 bg-gray-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-4">
            <span className="text-orange-400 text-sm font-semibold">⭐ Customer Love</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight">
            What Our{" "}
            <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Customers Say
            </span>
          </h2>
          <p className="text-white/50 mt-4 text-lg">
            Over 10,000 happy customers and counting.
          </p>
          {/* Stars */}
          <div className="flex items-center justify-center gap-1 mt-4">
            {[1,2,3,4,5].map((s) => (
              <svg key={s} className="w-6 h-6 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-white/60 text-sm ml-2">4.9/5 from 2,400+ reviews</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r, i) => {
            const [ref, inView] = useInView();
            return (
              <div
                key={i}
                ref={ref}
                className={`group bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-7
                             hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 transition-all duration-500
                             ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                {/* Quote */}
                <svg className="w-8 h-8 text-orange-500/40 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>

                <p className="text-white/70 leading-relaxed text-sm mb-6">{r.text}</p>

                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array(r.rating).fill(0).map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Avatar */}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${r.color} flex items-center justify-center text-white text-sm font-black`}>
                    {r.avatar}
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">{r.name}</div>
                    <div className="text-white/40 text-xs">{r.role}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Delivery Process ─────────────────────────────────────────────────────────
function DeliveryProcess() {
  const steps = [
    {
      step: "01",
      icon: "📱",
      title: "Place Your Order",
      desc: "Choose your items on our website or send a WhatsApp message. Takes less than 60 seconds.",
    },
    {
      step: "02",
      icon: "👩‍🍳",
      title: "We Prepare Fresh",
      desc: "Mama and the team spring into action, frying your akara hot and fresh to perfection.",
    },
    {
      step: "03",
      icon: "🛵",
      title: "Rider Picks Up",
      desc: "Your sealed, hot order is handed to our dedicated rider for swift, safe delivery.",
    },
    {
      step: "04",
      icon: "🏠",
      title: "Enjoy at Your Door",
      desc: "In 30 minutes or less, piping hot akara arrives at your doorstep. Dig in!",
    },
  ];

  return (
    <section id="delivery" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <SectionHeader
          badge="🚀 How It Works"
          title="Order in"
          highlight="4 Simple Steps"
          sub="From your phone to your door — fast, easy, and delicious."
        />

        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-orange-200 via-orange-400 to-orange-200" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => {
              const [ref, inView] = useInView();
              return (
                <div
                  key={i}
                  ref={ref}
                  className={`relative text-center group transition-all duration-700 ${
                    inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${i * 120}ms` }}
                >
                  {/* Step number circle */}
                  <div className="relative inline-flex items-center justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-white border-2 border-orange-200 group-hover:border-orange-500
                                     group-hover:shadow-lg group-hover:shadow-orange-500/30 transition-all duration-300
                                     flex items-center justify-center text-3xl z-10 relative">
                      {s.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-red-500
                                     text-white text-xs font-black flex items-center justify-center shadow-md">
                      {s.step}
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-gray-900 mb-3">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery zones */}
        <div className="mt-16 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            {[
              { icon: "📍", label: "Delivery Zones", value: "All PH Areas" },
              { icon: "⏱️", label: "Average Time", value: "25–35 mins" },
              { icon: "💵", label: "Delivery Fee", value: "₦500 flat" },
            ].map((stat, i) => (
              <div key={i} className="p-4">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
                <div className="text-2xl font-black text-gray-900 mt-1">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CTA Section ──────────────────────────────────────────────────────────────
function CTASection() {
  const [ref, inView] = useInView();
  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        <div
          ref={ref}
          className={`relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-gray-950 via-orange-950 to-gray-900 p-12 lg:p-20 text-center
                       transition-all duration-700 ${inView ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        >
          {/* BG decorations */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgba(249,115,22,0.4),transparent)]" />
          <div className="absolute top-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="text-6xl mb-6">🔥</div>
            <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Ready for the{" "}
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Best Akara
              </span>{" "}
              of Your Life?
            </h2>
            <p className="text-white/60 mt-6 text-xl max-w-2xl mx-auto leading-relaxed">
              Join over 10,000 Nigerians who start their morning right. Order now and get{" "}
              <span className="text-orange-400 font-bold">free delivery on your first order!</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-10 py-4 rounded-2xl font-black text-lg
                                  hover:shadow-2xl hover:shadow-orange-500/40 hover:-translate-y-1 transition-all duration-300 active:scale-95">
                🛒 Order Now — It's Fast!
              </button>
              <a
                href="https://wa.me/2348000000000"
                target="_blank"
                rel="noreferrer"
                className="bg-green-500 text-white px-10 py-4 rounded-2xl font-black text-lg
                            hover:bg-green-400 hover:shadow-2xl hover:shadow-green-500/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Order
              </a>
            </div>

            <p className="text-white/30 text-sm mt-6">
              📍 Serving Port Harcourt & environs · Mon–Sun 6AM–2PM
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-8">
        <div className="grid md:grid-cols-4 gap-10 pb-10 border-b border-white/10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center font-black text-white">
                MA
              </div>
              <div>
                <span className="text-white font-black text-xl">Mama</span>
                <span className="text-orange-400 font-black text-xl"> Akara</span>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              Nigeria's finest akara, made fresh every morning and delivered hot to your door.
            </p>
            <div className="flex gap-3 mt-6">
              {["📘","📸","🐦","▶️"].map((icon, i) => (
                <button key={i} className="w-9 h-9 rounded-xl bg-white/5 hover:bg-orange-500/20 hover:text-orange-400 transition-colors flex items-center justify-center text-sm">
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            {
              title: "Menu",
              links: ["Classic Akara","Combos","Family Packs","Seasonal Specials"],
            },
            {
              title: "Company",
              links: ["About Us","Our Story","Blog","Careers"],
            },
            {
              title: "Contact",
              links: ["+234 800 000 0000","hello@mamaakara.ng","Port Harcourt, Nigeria","Mon–Sun 6AM–2PM"],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">{col.title}</h4>
              <ul className="flex flex-col gap-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-white/50 hover:text-orange-400 text-sm transition-colors">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">
            © 2026 Mama Akara. All Rights Reserved. Made with ❤️ in Port Harcourt.
          </p>
          <div className="flex gap-4 text-white/30 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      {/* Custom animation keyframes injected via style tag */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-18px) rotate(8deg); }
          66% { transform: translateY(-8px) rotate(-5deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-24px) rotate(-10deg); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-14px) scale(1.1); }
        }
        @keyframes float-image {
          0%, 100% { transform: translateY(0px) rotateX(0deg) rotateY(0deg); }
          25% { transform: translateY(-12px) rotateX(2deg) rotateY(-2deg); }
          75% { transform: translateY(-6px) rotateX(-1deg) rotateY(2deg); }
        }
        @keyframes float-card-1 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-card-2 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(10px); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes ping-slow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
        }
        .animate-float-slow   { animation: float-slow   6s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 4s ease-in-out infinite; }
        .animate-float-fast   { animation: float-fast   3s ease-in-out infinite; }
        .animate-float-image  { animation: float-image  8s ease-in-out infinite; }
        .animate-float-card-1 { animation: float-card-1 4s ease-in-out infinite; }
        .animate-float-card-2 { animation: float-card-2 5s ease-in-out infinite; }
        .animate-slide-up     { animation: slide-up     0.9s ease forwards; }
        .animate-spin-slow    { animation: spin-slow   20s linear  infinite; }
        .animate-spin-reverse { animation: spin-reverse 15s linear  infinite; }
        .animate-ping-slow    { animation: ping-slow    2s ease-in-out infinite; }

        * { scroll-behavior: smooth; }
        body { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
      `}</style>

      <div className="bg-gray-50 font-sans antialiased">
        <Navbar />
        <Hero />
        <MenuSection />
        <WhyUs />
        <Testimonials />
        <DeliveryProcess />
        <CTASection />
        <Footer />
      </div>
    </>
  );
}