import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminAuth } from "../lib/context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/Supabase.js";

import {
  HiOutlineHome,
  HiOutlineShoppingCart,
  HiOutlineChartBar,
  HiOutlineBell,
  HiOutlineLogout,
  HiOutlineMenu,
  HiX,
  HiOutlineRefresh,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineDownload,
  HiOutlineArrowLeft,
} from "react-icons/hi";
import {
  MdDeliveryDining,
  MdPendingActions,
  MdCheckCircleOutline,
  MdOutlineAttachMoney,
} from "react-icons/md";
import { RiAdminLine } from "react-icons/ri";
import { BsSun, BsMoon } from "react-icons/bs";
import { FiPackage } from "react-icons/fi";

// ─── Status Config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending_payment: {
    label: "Pending Payment",
    color: "text-purple-400",
    bg: "bg-purple-500/15 border-purple-500/30",
    dot: "bg-purple-400",
    icon: "💳",
  },
  pending: {
    label: "Pending",
    color: "text-yellow-400",
    bg: "bg-yellow-500/15 border-yellow-500/30",
    dot: "bg-yellow-400",
    icon: "⏳",
  },
  processing: {
    label: "Processing",
    color: "text-blue-400",
    bg: "bg-blue-500/15 border-blue-500/30",
    dot: "bg-blue-400",
    icon: "🔄",
  },
  delivered: {
    label: "Delivered",
    color: "text-green-400",
    bg: "bg-green-500/15 border-green-500/30",
    dot: "bg-green-400",
    icon: "✅",
  },
};

// ─── Sidebar Nav Items ────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: HiOutlineHome },
  { id: "orders", label: "Orders", icon: HiOutlineShoppingCart },
  { id: "analytics", label: "Analytics", icon: HiOutlineChartBar },
];

// ─── Toast Notification ───────────────────────────────────────────────────────
function DashToast({ toasts }) {
  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 100, scale: 0.85 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.85 }}
            transition={{ type: "spring", damping: 20 }}
            className={`pointer-events-auto min-w-[320px] max-w-sm px-5 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-start gap-3 ${
              t.type === "order"
                ? "bg-orange-600/95 border-orange-400/30 text-white"
                : t.type === "success"
                ? "bg-green-600/95 border-green-400/30 text-white"
                : t.type === "error"
                ? "bg-red-600/95 border-red-400/30 text-white"
                : t.type === "pending_payment"
                ? "bg-purple-600/95 border-purple-400/30 text-white"
                : "bg-blue-600/95 border-blue-400/30 text-white"
            }`}
          >
            <span className="text-2xl mt-0.5 flex-shrink-0">
              {t.type === "order"
                ? "🛍️"
                : t.type === "success"
                ? "✅"
                : t.type === "error"
                ? "❌"
                : t.type === "pending_payment"
                ? "📋"
                : "🔔"}
            </span>
            <div>
              {t.title && (
                <p className="font-black text-sm">{t.title}</p>
              )}
              <p className="text-sm opacity-90 mt-0.5">{t.message}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  gradient,
  delay = 0,
  pulse = false,
  dark,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className={`relative overflow-hidden rounded-2xl border backdrop-blur-xl p-6 cursor-default ${
        dark
          ? "border-white/10 bg-white/5"
          : "border-amber-300/40 bg-amber-50/80 shadow-md shadow-amber-200/40"
      }`}
    >
      <div
        className={`absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl opacity-30 ${gradient}`}
      />

      <div className="relative flex items-start justify-between">
        <div>
          <p
            className={`text-sm font-semibold ${
              dark ? "text-white/50" : "text-amber-700/70"
            }`}
          >
            {label}
          </p>
          <motion.p
            key={value}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-3xl font-black mt-1 ${
              dark ? "text-white" : "text-amber-900"
            }`}
          >
            {value}
          </motion.p>
          {sub && (
            <p
              className={`text-xs mt-1 ${
                dark ? "text-white/40" : "text-amber-600/60"
              }`}
            >
              {sub}
            </p>
          )}
        </div>

        <div
          className={`w-14 h-14 rounded-2xl ${gradient} flex items-center justify-center shadow-lg relative`}
        >
          <Icon className="w-7 h-7 text-white" />
          {pulse && (
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-orange-400">
              <span className="absolute inset-0 rounded-full bg-orange-400 animate-ping" />
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Order Row ────────────────────────────────────────────────────────────────
function OrderRow({ order, onStatusChange, isNew, dark }) {
  const [updating, setUpdating] = useState(false);
  const [localStatus, setLocalStatus] = useState(
    order.delivery_status || "pending"
  );

  const statusCfg =
    STATUS_CONFIG[localStatus] || STATUS_CONFIG.pending;

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from("orders")
        .update({
          delivery_status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", order.id);

      if (error) throw error;
      setLocalStatus(newStatus);
      onStatusChange?.(order.id, newStatus);
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString("en-NG", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ── Payment status badge helper ───────────────────────────────────────────
  const getPaymentBadge = () => {
    const status = order.payment_status;
    if (status === "paid") {
      return {
        dot: "bg-green-500",
        text: "text-green-600",
        label: "✅ Paid",
      };
    }
    if (status === "pending_payment") {
      return {
        dot: "bg-purple-500",
        text: "text-purple-500",
        label: "💳 Awaiting Payment",
      };
    }
    return {
      dot: "bg-yellow-500",
      text: "text-yellow-600",
      label: "⏳ Pending Payment",
    };
  };

  const paymentBadge = getPaymentBadge();

  return (
    <motion.div
      layout
      initial={
        isNew
          ? { opacity: 0, scale: 0.95, y: -20 }
          : { opacity: 0, y: 10 }
      }
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", damping: 22 }}
      className={`relative rounded-2xl border p-5 transition-all ${
        isNew
          ? "border-orange-500/50 bg-orange-500/10"
          : order.payment_status === "pending_payment"
          ? dark
            ? "border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/8"
            : "border-purple-300/50 bg-purple-50/60 hover:bg-purple-100/50"
          : dark
          ? "border-white/8 bg-white/4 hover:bg-white/7 hover:border-white/15"
          : "border-amber-300/50 bg-amber-50/60 hover:bg-amber-100/70 hover:border-amber-400/60"
      } backdrop-blur-sm`}
    >
      {/* NEW badge */}
      {isNew && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg shadow-orange-500/40"
        >
          NEW
        </motion.span>
      )}

      {/* ── Pending Payment top banner ── */}
      {order.payment_status === "pending_payment" && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center gap-2 px-3 py-2 bg-purple-500/15 border border-purple-500/30 rounded-xl"
        >
          <span className="text-purple-400 text-sm">💳</span>
          <span className="text-purple-400 text-xs font-bold">
            Customer submitted delivery details — awaiting payment
          </span>
          <span className="ml-auto text-purple-300/60 text-[10px] font-semibold">
            Not yet paid
          </span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* ── Customer Info ── */}
        <div className="space-y-1">
          <p
            className={`text-[10px] uppercase tracking-wider font-bold ${
              dark ? "text-white/40" : "text-amber-700/60"
            }`}
          >
            Customer
          </p>
          <p
            className={`font-bold text-sm ${
              dark ? "text-white" : "text-amber-900"
            }`}
          >
            {order.customer_name || "—"}
          </p>
          <p
            className={`text-xs ${
              dark ? "text-white/50" : "text-amber-700/60"
            }`}
          >
            {order.customer_email || "—"}
          </p>
          <p className="text-orange-500 text-xs font-semibold">
            {order.customer_phone || "—"}
          </p>
        </div>

        {/* ── Delivery Address ── */}
        <div className="space-y-1">
          <p
            className={`text-[10px] uppercase tracking-wider font-bold ${
              dark ? "text-white/40" : "text-amber-700/60"
            }`}
          >
            Delivery Address
          </p>
          <p
            className={`text-xs leading-relaxed ${
              dark ? "text-white/80" : "text-amber-800/80"
            }`}
          >
            {order.delivery_address || "—"}
          </p>
        </div>

        {/* ── Order Details ── */}
        <div className="space-y-1">
          <p
            className={`text-[10px] uppercase tracking-wider font-bold ${
              dark ? "text-white/40" : "text-amber-700/60"
            }`}
          >
            Order Details
          </p>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs ${
                dark ? "text-white/60" : "text-amber-700/60"
              }`}
            >
              Qty:
            </span>
            <span
              className={`font-bold text-sm ${
                dark ? "text-white" : "text-amber-900"
              }`}
            >
              {order.items
                ? order.items.reduce((s, i) => s + (i.qty || 0), 0)
                : "—"}
            </span>
          </div>

          <p className="text-green-600 font-black text-base">
            ₦{Number(order.total_amount || 0).toLocaleString()}
          </p>

          {/* ── Payment badge ── */}
          <div className="flex items-center gap-1 mt-1">
            <span
              className={`w-1.5 h-1.5 rounded-full ${paymentBadge.dot}`}
            />
            <span
              className={`text-xs font-bold ${paymentBadge.text}`}
            >
              {paymentBadge.label}
            </span>
          </div>
        </div>

        {/* ── Status & Date ── */}
        <div className="space-y-3">
          <div>
            <p
              className={`text-[10px] uppercase tracking-wider font-bold mb-1 ${
                dark ? "text-white/40" : "text-amber-700/60"
              }`}
            >
              Date & Time
            </p>
            <p
              className={`text-xs ${
                dark ? "text-white/60" : "text-amber-700/70"
              }`}
            >
              {formatDate(order.created_at)}
            </p>
          </div>

          <div>
            <p
              className={`text-[10px] uppercase tracking-wider font-bold mb-2 ${
                dark ? "text-white/40" : "text-amber-700/60"
              }`}
            >
              Delivery Status
            </p>

            {/* Current status badge */}
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold ${statusCfg.bg} ${statusCfg.color} mb-2`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`}
              />
              {statusCfg.icon} {statusCfg.label}
            </div>

            {/* Status selector buttons */}
            <div className="flex gap-1.5 flex-wrap">
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <motion.button
                  key={key}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleStatusChange(key)}
                  disabled={updating || localStatus === key}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                    localStatus === key
                      ? `${cfg.bg} ${cfg.color} cursor-default`
                      : dark
                      ? "border-white/10 text-white/40 hover:border-white/30 hover:text-white/70 bg-white/5"
                      : "border-amber-300/50 text-amber-700/50 hover:border-amber-500/60 hover:text-amber-800 bg-amber-100/50"
                  } disabled:opacity-60`}
                >
                  {updating && localStatus !== key ? (
                    <motion.span
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    >
                      ...
                    </motion.span>
                  ) : (
                    `${cfg.icon} ${cfg.label}`
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Order Notes ── */}
      {order.order_notes && (
        <div
          className={`mt-3 pt-3 border-t ${
            dark ? "border-white/8" : "border-amber-300/40"
          }`}
        >
          <p
            className={`text-[10px] uppercase tracking-wider font-bold mb-1 ${
              dark ? "text-white/40" : "text-amber-700/60"
            }`}
          >
            Notes
          </p>
          <p
            className={`text-xs ${
              dark ? "text-white/60" : "text-amber-700/70"
            }`}
          >
            {order.order_notes}
          </p>
        </div>
      )}
    </motion.div>
  );
}

// ─── Analytics Mini Chart ─────────────────────────────────────────────────────
function MiniBarChart({ data, label, dark }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div>
      <p
        className={`text-xs font-bold uppercase tracking-wider mb-3 ${
          dark ? "text-white/40" : "text-amber-700/60"
        }`}
      >
        {label}
      </p>
      <div className="flex items-end gap-2 h-24">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(d.value / max) * 100}%` }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="w-full rounded-t-md bg-gradient-to-t from-orange-600 to-orange-400 min-h-[4px]"
            />
            <span
              className={`text-[9px] ${
                dark ? "text-white/30" : "text-amber-600/50"
              }`}
            >
              {d.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { adminData, logout } = useAdminAuth();
  const navigate = useNavigate();

  // UI State
  const [dark, setDark] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Data state
  const [orders, setOrders] = useState([]);
  const [newOrderIds, setNewOrderIds] = useState(new Set());
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [notifCount, setNotifCount] = useState(0);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const realtimeRef = useRef(null);

  // ── Toast helper ──────────────────────────────────────────────────────────
  const addToast = useCallback((title, message, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, title, message, type }]);
    setTimeout(
      () => setToasts((t) => t.filter((x) => x.id !== id)),
      5000
    );
  }, []);

  // ── Fetch orders ──────────────────────────────────────────────────────────
  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error("Failed to fetch orders:", {
        message: err.message || String(err),
        details: err.stack || String(err),
        hint: "",
        code: "",
      });
      addToast(
        "Error",
        "Failed to load orders. Check Supabase connection.",
        "error"
      );
    } finally {
      setLoadingOrders(false);
    }
  }, [addToast]);

  // ── Realtime subscription ─────────────────────────────────────────────────
  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          const newOrder = payload.new;
          setOrders((prev) => [newOrder, ...prev]);
          setNewOrderIds((prev) => new Set([...prev, newOrder.id]));

          setTimeout(() => {
            setNewOrderIds((prev) => {
              const next = new Set(prev);
              next.delete(newOrder.id);
              return next;
            });
          }, 8000);

          // ── Different toast for pending_payment vs paid ─────────────────
          const isPendingPayment =
            newOrder.payment_status === "pending_payment";

          addToast(
            isPendingPayment
              ? "📋 Customer Details Received!"
              : "🛍️ New Order Received!",
            isPendingPayment
              ? `${newOrder.customer_name} submitted delivery info — awaiting payment`
              : `${newOrder.customer_name} ordered ₦${Number(
                  newOrder.total_amount || 0
                ).toLocaleString()}`,
            isPendingPayment ? "pending_payment" : "order"
          );

          setNotifications((prev) => [
            {
              id: newOrder.id,
              text: isPendingPayment
                ? `${newOrder.customer_name} submitted delivery details`
                : `New order from ${newOrder.customer_name}`,
              amount: `₦${Number(
                newOrder.total_amount || 0
              ).toLocaleString()}`,
              time: new Date().toLocaleTimeString("en-NG", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              read: false,
              isPendingPayment,
            },
            ...prev,
          ]);

          setNotifCount((n) => n + 1);
          setActiveNav("orders");
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders" },
        (payload) => {
          // Update order in state
          setOrders((prev) =>
            prev.map((o) =>
              o.id === payload.new.id ? { ...o, ...payload.new } : o
            )
          );

          // ── Fire toast when payment confirmed ───────────────────────────
          if (
            payload.new.payment_status === "paid" &&
            payload.old?.payment_status === "pending_payment"
          ) {
            addToast(
              "💰 Payment Confirmed!",
              `${payload.new.customer_name} completed payment — ₦${Number(
                payload.new.total_amount || 0
              ).toLocaleString()}`,
              "success"
            );

            setNotifications((prev) => [
              {
                id: `pay_${payload.new.id}_${Date.now()}`,
                text: `${payload.new.customer_name} completed payment`,
                amount: `₦${Number(
                  payload.new.total_amount || 0
                ).toLocaleString()}`,
                time: new Date().toLocaleTimeString("en-NG", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                read: false,
                isPendingPayment: false,
              },
              ...prev,
            ]);

            setNotifCount((n) => n + 1);
          }
        }
      )
      .subscribe();

    realtimeRef.current = channel;

    return () => {
      if (realtimeRef.current) {
        supabase.removeChannel(realtimeRef.current);
      }
    };
  }, [fetchOrders, addToast]);

  // ── Computed stats ────────────────────────────────────────────────────────
  const stats = {
    total: orders.length,
    pendingPayment: orders.filter(
      (o) => o.payment_status === "pending_payment"
    ).length,
    pending: orders.filter(
      (o) => (o.delivery_status || "pending") === "pending"
    ).length,
    processing: orders.filter(
      (o) => o.delivery_status === "processing"
    ).length,
    delivered: orders.filter(
      (o) => o.delivery_status === "delivered"
    ).length,
    revenue: orders
      .filter((o) => o.payment_status === "paid")
      .reduce((s, o) => s + Number(o.total_amount || 0), 0),
  };

  // ── Filter orders ─────────────────────────────────────────────────────────
  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      !searchQuery ||
      [
        o.customer_name,
        o.customer_email,
        o.customer_phone,
        o.delivery_address,
      ]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    let matchFilter = true;
    if (filterStatus === "pending_payment") {
      matchFilter = o.payment_status === "pending_payment";
    } else if (filterStatus !== "all") {
      matchFilter = (o.delivery_status || "pending") === filterStatus;
    }

    return matchSearch && matchFilter;
  });

  // ── Analytics chart data ──────────────────────────────────────────────────
  const chartData = (() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d
        .toLocaleDateString("en-NG", { weekday: "short" })
        .slice(0, 3);
      const dateStr = d.toISOString().split("T")[0];
      const value = orders.filter(
        (o) => o.created_at && o.created_at.startsWith(dateStr)
      ).length;
      days.push({ label, value });
    }
    return days;
  })();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div
      className={`min-h-screen font-sans antialiased transition-colors duration-300 ${
        dark
          ? "bg-gray-950 text-white"
          : "bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 text-amber-900"
      }`}
    >
      <DashToast toasts={toasts} />

      {/* ── Sidebar Overlay (mobile) ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className={`fixed left-0 top-0 bottom-0 w-72 z-50 lg:translate-x-0 lg:z-30 flex flex-col backdrop-blur-2xl shadow-2xl force-sidebar-desktop ${
          dark
            ? "bg-gray-900/95 border-r border-white/8"
            : "bg-gradient-to-b from-amber-100 via-yellow-50 to-amber-100 border-r border-amber-300/60"
        }`}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500" />

        {/* Logo */}
        <div className="p-6 flex items-center justify-between">
          <button
            onClick={() => {
              setActiveNav("overview");
              setSidebarOpen(false);
            }}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
              <span className="text-xl">🫘</span>
            </div>
            <div>
              <p
                className={`font-black text-sm ${
                  dark ? "text-white" : "text-amber-900"
                }`}
              >
                Mama Akara
              </p>
              <p
                className={`text-[10px] ${
                  dark ? "text-white/40" : "text-amber-600/70"
                }`}
              >
                Admin Panel
              </p>
            </div>
          </button>
          <button
            onClick={() => setSidebarOpen(false)}
            className={`lg:hidden w-8 h-8 rounded-xl flex items-center justify-center ${
              dark
                ? "bg-white/8 text-white/60 hover:text-white"
                : "bg-amber-200/60 text-amber-700 hover:text-amber-900"
            }`}
          >
            <HiX className="w-4 h-4" />
          </button>
        </div>

        {/* Admin profile */}
        <div
          className={`mx-4 p-4 rounded-2xl mb-4 ${
            dark
              ? "bg-white/5 border border-white/8"
              : "bg-amber-200/40 border border-amber-300/60"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-orange-500/30">
              {adminData?.avatar || "A"}
            </div>
            <div>
              <p
                className={`font-black text-sm ${
                  dark ? "text-white" : "text-amber-900"
                }`}
              >
                {adminData?.name || "Admin"}
              </p>
              <p
                className={`text-xs ${
                  dark ? "text-white/40" : "text-amber-700/60"
                }`}
              >
                {adminData?.email || "admin@akara.com"}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-green-600 text-[10px] font-bold">
                  Online
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <motion.button
                key={item.id}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setActiveNav(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/30"
                    : dark
                    ? "text-white/50 hover:text-white hover:bg-white/8"
                    : "text-amber-700/70 hover:text-amber-900 hover:bg-amber-200/50"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {item.label}
                {item.id === "orders" &&
                  (stats.pending > 0 || stats.pendingPayment > 0) && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto bg-orange-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center"
                    >
                      {stats.pending + stats.pendingPayment}
                    </motion.span>
                  )}
              </motion.button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4">
          <motion.button
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
              dark
                ? "text-red-400 hover:bg-red-500/10"
                : "text-red-600 hover:bg-red-100/60"
            }`}
          >
            <HiOutlineLogout className="w-5 h-5" />
            Sign Out
          </motion.button>
        </div>
      </motion.aside>

      {/* ── Main Content ── */}
      <div className="lg:pl-72 min-h-screen flex flex-col">
        {/* ── Top Bar ── */}
        <header
          className={`sticky top-0 z-20 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4 border-b ${
            dark
              ? "bg-gray-950/90 border-white/8 backdrop-blur-xl"
              : "bg-amber-50/90 border-amber-300/50 backdrop-blur-xl"
          }`}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className={`lg:hidden w-10 h-10 rounded-xl flex items-center justify-center ${
                dark
                  ? "bg-white/8 text-white"
                  : "bg-amber-200/60 text-amber-800"
              }`}
            >
              <HiOutlineMenu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-1.5 text-xs mb-0.5">
                <button
                  onClick={() => setActiveNav("overview")}
                  className={`font-bold transition-colors ${
                    activeNav === "overview"
                      ? "text-orange-500"
                      : dark
                      ? "text-white/40 hover:text-white/70"
                      : "text-amber-600/60 hover:text-amber-800"
                  }`}
                >
                  Dashboard
                </button>
                {activeNav !== "overview" && (
                  <>
                    <span
                      className={
                        dark ? "text-white/20" : "text-amber-400/60"
                      }
                    >
                      /
                    </span>
                    <span
                      className={`font-bold ${
                        dark ? "text-white/80" : "text-amber-900"
                      }`}
                    >
                      {activeNav === "orders" ? "Orders" : "Analytics"}
                    </span>
                  </>
                )}
              </div>

              <h1
                className={`font-black text-lg ${
                  dark ? "text-white" : "text-amber-900"
                }`}
              >
                {activeNav === "overview"
                  ? "Dashboard Overview"
                  : activeNav === "orders"
                  ? "Customer Orders"
                  : "Analytics"}
              </h1>
              <p
                className={`text-xs ${
                  dark ? "text-white/40" : "text-amber-700/60"
                }`}
              >
                {new Date().toLocaleDateString("en-NG", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Refresh */}
            <motion.button
              whileTap={{ rotate: 360 }}
              transition={{ duration: 0.4 }}
              onClick={fetchOrders}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                dark
                  ? "bg-white/8 text-white/60 hover:text-white"
                  : "bg-amber-200/60 text-amber-700 hover:text-amber-900 hover:bg-amber-300/60"
              }`}
            >
              <HiOutlineRefresh className="w-5 h-5" />
            </motion.button>

            {/* Theme toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setDark((d) => !d)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                dark
                  ? "bg-white/8 text-yellow-400 hover:bg-white/12"
                  : "bg-amber-300/60 text-amber-800 hover:bg-amber-400/60"
              }`}
            >
              {dark ? (
                <BsSun className="w-5 h-5" />
              ) : (
                <BsMoon className="w-5 h-5" />
              )}
            </motion.button>

            {/* Notifications */}
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setShowNotifPanel((v) => !v);
                  setNotifCount(0);
                }}
                className={`w-10 h-10 rounded-xl flex items-center justify-center relative transition-colors ${
                  dark
                    ? "bg-white/8 text-white/60 hover:text-white"
                    : "bg-amber-200/60 text-amber-700 hover:text-amber-900 hover:bg-amber-300/60"
                }`}
              >
                <HiOutlineBell className="w-5 h-5" />
                <AnimatePresence>
                  {notifCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-black flex items-center justify-center"
                    >
                      {notifCount > 9 ? "9+" : notifCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Notification Panel */}
              <AnimatePresence>
                {showNotifPanel && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className={`absolute right-0 top-12 w-80 rounded-2xl border shadow-2xl z-50 overflow-hidden ${
                      dark
                        ? "bg-gray-900 border-white/10"
                        : "bg-amber-50 border-amber-300/50"
                    }`}
                  >
                    <div
                      className={`p-4 border-b ${
                        dark ? "border-white/8" : "border-amber-200/60"
                      }`}
                    >
                      <p
                        className={`font-black text-sm ${
                          dark ? "text-white" : "text-amber-900"
                        }`}
                      >
                        Notifications
                      </p>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center">
                          <p
                            className={`text-sm ${
                              dark ? "text-white/40" : "text-amber-700/50"
                            }`}
                          >
                            No notifications yet
                          </p>
                        </div>
                      ) : (
                        notifications.map((n, i) => (
                          <div
                            key={`${n.id}-${i}`}
                            className={`p-4 border-b last:border-0 ${
                              dark
                                ? "border-white/5 hover:bg-white/4"
                                : "border-amber-200/40 hover:bg-amber-100/60"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-xl flex-shrink-0">
                                {n.isPendingPayment ? "📋" : "🛍️"}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`text-sm font-bold ${
                                    dark ? "text-white" : "text-amber-900"
                                  }`}
                                >
                                  {n.text}
                                </p>
                                <p className="text-orange-500 text-xs font-bold">
                                  {n.amount}
                                </p>
                                {n.isPendingPayment && (
                                  <p className="text-purple-400 text-xs font-semibold mt-0.5">
                                    💳 Awaiting payment
                                  </p>
                                )}
                                <p
                                  className={`text-xs mt-1 ${
                                    dark
                                      ? "text-white/30"
                                      : "text-amber-600/50"
                                  }`}
                                >
                                  {n.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                dark
                  ? "bg-red-500/15 text-red-400 border border-red-500/25 hover:bg-red-500/25 hover:border-red-500/40"
                  : "bg-red-100/80 text-red-600 border border-red-300/60 hover:bg-red-200/80 hover:border-red-400/60"
              }`}
            >
              <HiOutlineLogout className="w-4 h-4" />
              <span>Logout</span>
            </motion.button>
          </div>
        </header>

        {/* ── Page Content ── */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8">
          <AnimatePresence mode="wait">

            {/* ════════════════════════════════
                OVERVIEW
            ════════════════════════════════ */}
            {activeNav === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="space-y-8"
              >
                {/* Stat Cards */}
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
                  <StatCard
                    icon={FiPackage}
                    label="Total Orders"
                    value={stats.total}
                    sub="All time"
                    gradient="bg-gradient-to-br from-orange-500 to-red-600"
                    delay={0}
                    pulse={newOrderIds.size > 0}
                    dark={dark}
                  />
                  <StatCard
                    icon={MdPendingActions}
                    label="Pending Deliveries"
                    value={stats.pending}
                    sub="Awaiting dispatch"
                    gradient="bg-gradient-to-br from-yellow-500 to-amber-600"
                    delay={0.08}
                    dark={dark}
                  />
                  <StatCard
                    icon={MdCheckCircleOutline}
                    label="Completed"
                    value={stats.delivered}
                    sub="Delivered orders"
                    gradient="bg-gradient-to-br from-green-500 to-emerald-600"
                    delay={0.16}
                    dark={dark}
                  />
                  <StatCard
                    icon={MdOutlineAttachMoney}
                    label="Total Revenue"
                    value={`₦${stats.revenue.toLocaleString()}`}
                    sub="From paid orders"
                    gradient="bg-gradient-to-br from-purple-500 to-violet-600"
                    delay={0.24}
                    dark={dark}
                  />
                </div>

                {/* ── Pending Payment Alert Banner ── */}
                {stats.pendingPayment > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-4 p-4 rounded-2xl border ${
                      dark
                        ? "bg-purple-500/10 border-purple-500/30"
                        : "bg-purple-50 border-purple-300/50"
                    }`}
                  >
                    <span className="text-2xl">💳</span>
                    <div className="flex-1">
                      <p className="text-purple-400 font-black text-sm">
                        {stats.pendingPayment} order
                        {stats.pendingPayment > 1 ? "s" : ""} awaiting
                        payment
                      </p>
                      <p className="text-purple-400/70 text-xs mt-0.5">
                        Customer details received — payment not yet confirmed
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setFilterStatus("pending_payment");
                        setActiveNav("orders");
                      }}
                      className="text-xs font-bold text-purple-400 hover:text-purple-300 whitespace-nowrap transition-colors"
                    >
                      View Orders →
                    </button>
                  </motion.div>
                )}

                {/* Recent Orders */}
                <div
                  className={`rounded-3xl border p-6 ${
                    dark
                      ? "border-white/8 bg-white/3"
                      : "border-amber-300/50 bg-amber-50/70 shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2
                        className={`font-black text-lg ${
                          dark ? "text-white" : "text-amber-900"
                        }`}
                      >
                        Recent Orders
                      </h2>
                      <p
                        className={`text-xs mt-1 ${
                          dark ? "text-white/40" : "text-amber-700/60"
                        }`}
                      >
                        Latest {Math.min(3, orders.length)} orders
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveNav("orders")}
                      className="text-orange-500 text-sm font-bold hover:text-orange-400 transition-colors"
                    >
                      View All →
                    </button>
                  </div>

                  {loadingOrders ? (
                    <div className="flex items-center justify-center py-12">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-10 h-10 border-4 border-orange-500/30 border-t-orange-500 rounded-full"
                      />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-5xl mb-3">📭</div>
                      <p
                        className={`font-bold ${
                          dark ? "text-white/60" : "text-amber-700/70"
                        }`}
                      >
                        No orders yet
                      </p>
                      <p
                        className={`text-sm mt-1 ${
                          dark ? "text-white/30" : "text-amber-600/50"
                        }`}
                      >
                        Orders will appear here in real time
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.slice(0, 3).map((order) => (
                        <OrderRow
                          key={order.id}
                          order={order}
                          isNew={newOrderIds.has(order.id)}
                          onStatusChange={() => {}}
                          dark={dark}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Status Breakdown */}
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    {
                      label: "Pending",
                      count: stats.pending,
                      cfg: STATUS_CONFIG.pending,
                    },
                    {
                      label: "Processing",
                      count: stats.processing,
                      cfg: STATUS_CONFIG.processing,
                    },
                    {
                      label: "Delivered",
                      count: stats.delivered,
                      cfg: STATUS_CONFIG.delivered,
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.08 }}
                      className={`rounded-2xl border p-5 ${
                        dark
                          ? `${item.cfg.bg} border-white/10`
                          : "border-amber-300/50 bg-amber-50/80 shadow-sm"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${item.cfg.dot}`}
                        />
                        <span
                          className={`text-sm font-bold ${item.cfg.color}`}
                        >
                          {item.label}
                        </span>
                      </div>
                      <p
                        className={`text-3xl font-black ${
                          dark ? "text-white" : "text-amber-900"
                        }`}
                      >
                        {item.count}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          dark ? "text-white/40" : "text-amber-600/60"
                        }`}
                      >
                        orders
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ════════════════════════════════
                ORDERS
            ════════════════════════════════ */}
            {activeNav === "orders" && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="space-y-6"
              >
                {/* Back button */}
                <motion.button
                  whileHover={{ x: -4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveNav("overview")}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                    dark
                      ? "bg-white/8 text-white/60 hover:text-white hover:bg-white/12 border border-white/10"
                      : "bg-amber-200/50 text-amber-700 hover:text-amber-900 hover:bg-amber-300/50 border border-amber-300/40"
                  }`}
                >
                  <HiOutlineArrowLeft className="w-4 h-4" />
                  Back to Overview
                </motion.button>

                {/* Filters */}
                <div
                  className={`rounded-2xl border p-4 flex flex-col sm:flex-row gap-3 ${
                    dark
                      ? "border-white/8 bg-white/3"
                      : "border-amber-300/50 bg-amber-50/70 shadow-sm"
                  }`}
                >
                  {/* Search */}
                  <div className="relative flex-1">
                    <HiOutlineSearch
                      className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                        dark ? "text-white/40" : "text-amber-600/50"
                      }`}
                    />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name, email, phone..."
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all ${
                        dark
                          ? "bg-white/8 border border-white/10 text-white placeholder-white/30 focus:border-orange-500/50"
                          : "bg-amber-100/60 border border-amber-300/50 text-amber-900 placeholder-amber-600/50 focus:border-amber-500"
                      }`}
                    />
                  </div>

                  {/* Status filter buttons */}
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { key: "all", label: "All Orders" },
                      {
                        key: "pending_payment",
                        label: "💳 Awaiting Payment",
                      },
                      { key: "pending", label: "Pending" },
                      { key: "processing", label: "Processing" },
                      { key: "delivered", label: "Delivered" },
                    ].map((s) => (
                      <button
                        key={s.key}
                        onClick={() => setFilterStatus(s.key)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                          filterStatus === s.key
                            ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg"
                            : dark
                            ? "bg-white/8 text-white/50 hover:text-white border border-white/10"
                            : "bg-amber-200/50 text-amber-700/70 hover:text-amber-900 border border-amber-300/50 hover:bg-amber-300/50"
                        }`}
                      >
                        {s.label}
                        {s.key !== "all" && (
                          <span className="ml-1.5 opacity-70">
                            (
                            {s.key === "pending_payment"
                              ? stats.pendingPayment
                              : s.key === "pending"
                              ? stats.pending
                              : s.key === "processing"
                              ? stats.processing
                              : stats.delivered}
                            )
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Orders count + new badge */}
                <div className="flex items-center justify-between">
                  <p
                    className={`text-sm font-bold ${
                      dark ? "text-white/50" : "text-amber-700/60"
                    }`}
                  >
                    {filteredOrders.length} order
                    {filteredOrders.length !== 1 ? "s" : ""} found
                  </p>
                  {newOrderIds.size > 0 && (
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="flex items-center gap-2 bg-orange-500/20 border border-orange-500/40 rounded-full px-3 py-1"
                    >
                      <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
                      <span className="text-orange-500 text-xs font-bold">
                        {newOrderIds.size} new order
                        {newOrderIds.size > 1 ? "s" : ""}
                      </span>
                    </motion.div>
                  )}
                </div>

                {/* Orders list */}
                {loadingOrders ? (
                  <div className="flex items-center justify-center py-24">
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-14 h-14 mx-auto border-4 border-orange-500/30 border-t-orange-500 rounded-full"
                      />
                      <p
                        className={`mt-4 text-sm font-bold ${
                          dark ? "text-white/50" : "text-amber-700/60"
                        }`}
                      >
                        Loading orders...
                      </p>
                    </div>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="text-center py-24">
                    <div className="text-6xl mb-4">📭</div>
                    <p
                      className={`text-xl font-black ${
                        dark ? "text-white/60" : "text-amber-700/70"
                      }`}
                    >
                      {searchQuery || filterStatus !== "all"
                        ? "No orders match your filter"
                        : "No orders yet"}
                    </p>
                    <p
                      className={`text-sm mt-2 ${
                        dark ? "text-white/30" : "text-amber-600/50"
                      }`}
                    >
                      {searchQuery || filterStatus !== "all"
                        ? "Try adjusting your search or filter"
                        : "New orders will appear here in real time"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {filteredOrders.map((order) => (
                        <OrderRow
                          key={order.id}
                          order={order}
                          isNew={newOrderIds.has(order.id)}
                          onStatusChange={(id, newStatus) => {
                            setOrders((prev) =>
                              prev.map((o) =>
                                o.id === id
                                  ? { ...o, delivery_status: newStatus }
                                  : o
                              )
                            );
                          }}
                          dark={dark}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            )}

            {/* ════════════════════════════════
                ANALYTICS
            ════════════════════════════════ */}
            {activeNav === "analytics" && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="space-y-6"
              >
                {/* Back button */}
                <motion.button
                  whileHover={{ x: -4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveNav("overview")}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                    dark
                      ? "bg-white/8 text-white/60 hover:text-white hover:bg-white/12 border border-white/10"
                      : "bg-amber-200/50 text-amber-700 hover:text-amber-900 hover:bg-amber-300/50 border border-amber-300/40"
                  }`}
                >
                  <HiOutlineArrowLeft className="w-4 h-4" />
                  Back to Overview
                </motion.button>

                <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  <StatCard
                    icon={FiPackage}
                    label="Total Orders"
                    value={stats.total}
                    gradient="bg-gradient-to-br from-orange-500 to-red-600"
                    delay={0}
                    dark={dark}
                  />
                  <StatCard
                    icon={MdPendingActions}
                    label="Pending"
                    value={stats.pending}
                    gradient="bg-gradient-to-br from-yellow-500 to-amber-600"
                    delay={0.08}
                    dark={dark}
                  />
                  <StatCard
                    icon={MdDeliveryDining}
                    label="Processing"
                    value={stats.processing}
                    gradient="bg-gradient-to-br from-blue-500 to-cyan-600"
                    delay={0.16}
                    dark={dark}
                  />
                  <StatCard
                    icon={MdCheckCircleOutline}
                    label="Delivered"
                    value={stats.delivered}
                    gradient="bg-gradient-to-br from-green-500 to-emerald-600"
                    delay={0.24}
                    dark={dark}
                  />
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Orders chart */}
                  <div
                    className={`rounded-2xl border p-6 ${
                      dark
                        ? "border-white/8 bg-white/3"
                        : "border-amber-300/50 bg-amber-50/70 shadow-sm"
                    }`}
                  >
                    <h3
                      className={`font-black text-base mb-4 ${
                        dark ? "text-white" : "text-amber-900"
                      }`}
                    >
                      Orders — Last 7 Days
                    </h3>
                    <MiniBarChart
                      data={chartData}
                      label="Daily Order Volume"
                      dark={dark}
                    />
                  </div>

                  {/* Revenue */}
                  <div
                    className={`rounded-2xl border p-6 ${
                      dark
                        ? "border-white/8 bg-white/3"
                        : "border-amber-300/50 bg-amber-50/70 shadow-sm"
                    }`}
                  >
                    <h3
                      className={`font-black text-base mb-4 ${
                        dark ? "text-white" : "text-amber-900"
                      }`}
                    >
                      Revenue Summary
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          label: "Total Revenue",
                          value: `₦${stats.revenue.toLocaleString()}`,
                          bar: stats.total > 0 ? 100 : 0,
                          color: "from-orange-500 to-red-500",
                        },
                        {
                          label: "Avg Order Value",
                          value:
                            stats.total > 0
                              ? `₦${Math.round(
                                  stats.revenue / stats.total
                                ).toLocaleString()}`
                              : "₦0",
                          bar: 60,
                          color: "from-purple-500 to-violet-500",
                        },
                        {
                          label: "Delivery Rate",
                          value:
                            stats.total > 0
                              ? `${Math.round(
                                  (stats.delivered / stats.total) * 100
                                )}%`
                              : "0%",
                          bar:
                            stats.total > 0
                              ? Math.round(
                                  (stats.delivered / stats.total) * 100
                                )
                              : 0,
                          color: "from-green-500 to-emerald-500",
                        },
                      ].map((item, i) => (
                        <div key={i}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span
                              className={`text-xs font-bold ${
                                dark ? "text-white/60" : "text-amber-700/70"
                              }`}
                            >
                              {item.label}
                            </span>
                            <span
                              className={`text-sm font-black ${
                                dark ? "text-white" : "text-amber-900"
                              }`}
                            >
                              {item.value}
                            </span>
                          </div>
                          <div
                            className={`h-2 rounded-full overflow-hidden ${
                              dark ? "bg-white/10" : "bg-amber-200/60"
                            }`}
                          >
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${item.bar}%` }}
                              transition={{
                                delay: 0.2 + i * 0.1,
                                duration: 0.7,
                              }}
                              className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Status Distribution */}
                <div
                  className={`rounded-2xl border p-6 ${
                    dark
                      ? "border-white/8 bg-white/3"
                      : "border-amber-300/50 bg-amber-50/70 shadow-sm"
                  }`}
                >
                  <h3
                    className={`font-black text-base mb-6 ${
                      dark ? "text-white" : "text-amber-900"
                    }`}
                  >
                    Order Status Distribution
                  </h3>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {[
                      {
                        label: "Pending",
                        count: stats.pending,
                        cfg: STATUS_CONFIG.pending,
                        pct:
                          stats.total > 0
                            ? Math.round(
                                (stats.pending / stats.total) * 100
                              )
                            : 0,
                      },
                      {
                        label: "Processing",
                        count: stats.processing,
                        cfg: STATUS_CONFIG.processing,
                        pct:
                          stats.total > 0
                            ? Math.round(
                                (stats.processing / stats.total) * 100
                              )
                            : 0,
                      },
                      {
                        label: "Delivered",
                        count: stats.delivered,
                        cfg: STATUS_CONFIG.delivered,
                        pct:
                          stats.total > 0
                            ? Math.round(
                                (stats.delivered / stats.total) * 100
                              )
                            : 0,
                      },
                    ].map((item, i) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className={`p-5 rounded-2xl border ${
                          dark
                            ? item.cfg.bg
                            : "border-amber-300/50 bg-amber-100/50"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <span
                            className={`w-3 h-3 rounded-full ${item.cfg.dot}`}
                          />
                          <span
                            className={`font-bold text-sm ${item.cfg.color}`}
                          >
                            {item.label}
                          </span>
                        </div>
                        <p
                          className={`text-4xl font-black ${
                            dark ? "text-white" : "text-amber-900"
                          }`}
                        >
                          {item.count}
                        </p>
                        <div
                          className={`mt-3 h-1.5 rounded-full overflow-hidden ${
                            dark ? "bg-white/10" : "bg-amber-200/60"
                          }`}
                        >
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.pct}%` }}
                            transition={{
                              delay: 0.3 + i * 0.1,
                              duration: 0.6,
                            }}
                            className={`h-full rounded-full ${item.cfg.dot}`}
                          />
                        </div>
                        <p
                          className={`text-xs mt-1 ${
                            dark ? "text-white/40" : "text-amber-600/60"
                          }`}
                        >
                          {item.pct}% of total orders
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* ── Mobile Bottom Navigation ── */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden flex items-center justify-around px-2 py-3 border-t backdrop-blur-xl ${
          dark
            ? "bg-gray-900/95 border-white/8"
            : "bg-amber-50/95 border-amber-300/50"
        }`}
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all relative ${
                isActive
                  ? "text-orange-500"
                  : dark
                  ? "text-white/40"
                  : "text-amber-600/60"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-bold">{item.label}</span>
              {item.id === "orders" &&
                (stats.pending > 0 || stats.pendingPayment > 0) && (
                  <span className="absolute -top-1 right-0 w-4 h-4 rounded-full bg-orange-500 text-white text-[8px] font-black flex items-center justify-center">
                    {stats.pending + stats.pendingPayment > 9
                      ? "9+"
                      : stats.pending + stats.pendingPayment}
                  </span>
                )}
              {isActive && (
                <motion.div
                  layoutId="mobileNavIndicator"
                  className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange-500"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom padding for mobile nav */}
      <div className="lg:hidden h-16" />

      <style>{`
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(249,115,22,0.4); border-radius: 8px; }

        @media (min-width: 1024px) {
          .force-sidebar-desktop {
            transform: translateX(0) !important;
          }
        }
      `}</style>
    </div>
  );
}