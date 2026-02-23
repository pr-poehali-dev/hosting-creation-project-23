import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import type { User } from "@/types";
import { getOrders, confirmOrder, rejectOrder, subscribeStore } from "@/store";

export default function AdminPanel({ user, onBack, onLogout }: { user: User; onBack: () => void; onLogout: () => void }) {
  const [, forceUpdate] = useState(0);
  const [tab, setTab] = useState<"orders" | "servers">("orders");

  useEffect(() => subscribeStore(() => forceUpdate(n => n + 1)), []);

  const orders = getOrders();
  const pending = orders.filter(o => o.status === "pending");
  const confirmed = orders.filter(o => o.status === "confirmed");
  const rejected = orders.filter(o => o.status === "rejected");

  const statusColor = {
    pending: { bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.3)", text: "#fbbf24", label: "Ожидает" },
    confirmed: { bg: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.3)", text: "#4ade80", label: "Подтверждён" },
    rejected: { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.3)", text: "#f87171", label: "Отклонён" },
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Top bar */}
      <div className="flex items-center gap-4 px-6 py-3 border-b border-white/5 flex-shrink-0"
        style={{ background: "rgba(10,10,10,0.95)", backdropFilter: "blur(16px)" }}>
        <button onClick={onBack} className="text-white/50 hover:text-white transition-colors">
          <Icon name="ArrowLeft" size={20} />
        </button>
        <span className="font-extrabold font-montserrat">Zetix<span className="text-green-400">Hosting</span></span>
        <div className="h-4 w-px bg-white/10"></div>
        <span className="text-red-400 text-sm font-semibold flex items-center gap-1.5">
          <Icon name="Shield" size={14} /> Панель администратора
        </span>
        <div className="flex-1" />
        {pending.length > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full animate-pulse">
            {pending.length} новых
          </span>
        )}
        <span className="text-white/40 text-sm hidden md:block">{user.email}</span>
        <button onClick={onLogout} className="btn-secondary px-3 py-1.5 rounded-lg text-sm text-white">Выйти</button>
      </div>

      <div className="flex-1 p-6 max-w-5xl mx-auto w-full">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Ожидают", value: pending.length, color: "#fbbf24", icon: "Clock" },
            { label: "Подтверждено", value: confirmed.length, color: "#4ade80", icon: "CheckCircle" },
            { label: "Отклонено", value: rejected.length, color: "#f87171", icon: "XCircle" },
          ].map(s => (
            <div key={s.label} className="gradient-card rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: `${s.color}18`, border: `1px solid ${s.color}40` }}>
                <Icon name={s.icon} size={22} style={{ color: s.color }} />
              </div>
              <div>
                <div className="text-3xl font-extrabold font-montserrat" style={{ color: s.color }}>{s.value}</div>
                <div className="text-white/40 text-sm">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[{ key: "orders", label: "Логи заказов" }, { key: "servers", label: "Все серверы" }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as typeof tab)}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: tab === t.key ? "rgba(34,197,94,0.15)" : "transparent",
                border: tab === t.key ? "1px solid rgba(34,197,94,0.4)" : "1px solid rgba(255,255,255,0.08)",
                color: tab === t.key ? "#4ade80" : "rgba(255,255,255,0.5)",
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === "orders" && (
          <div className="space-y-3">
            {orders.length === 0 ? (
              <div className="gradient-card rounded-2xl p-12 text-center text-white/30">
                <Icon name="Inbox" size={40} className="mx-auto mb-3 opacity-30" />
                <p>Заказов пока нет</p>
              </div>
            ) : (
              orders.map(order => {
                const sc = statusColor[order.status];
                return (
                  <div key={order.id} className="gradient-card rounded-2xl p-5">
                    <div className="flex items-start gap-4">
                      <span className="text-3xl">{order.planEmoji}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className="text-white font-bold font-montserrat">{order.planName}</span>
                          <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                            style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text }}>
                            {sc.label}
                          </span>
                          {order.promoUsed && (
                            <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-400 font-semibold">
                              🎟 Промокод
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mb-3">
                          <div>
                            <span className="text-white/40 text-xs block">Пользователь</span>
                            <span className="text-white">{order.userEmail}</span>
                          </div>
                          <div>
                            <span className="text-white/40 text-xs block">Сумма</span>
                            <span className="text-green-400 font-bold">{order.planPrice}₽/мес</span>
                          </div>
                          <div>
                            <span className="text-white/40 text-xs block">Порт</span>
                            <span className="text-white font-mono">{order.port}</span>
                          </div>
                          <div>
                            <span className="text-white/40 text-xs block">Дата</span>
                            <span className="text-white text-xs">{new Date(order.createdAt).toLocaleString("ru-RU")}</span>
                          </div>
                        </div>

                        {order.status === "pending" && (
                          <div className="flex gap-3">
                            <button onClick={() => confirmOrder(order.id)}
                              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                              style={{ background: "linear-gradient(135deg,#22c55e,#16a34a)" }}>
                              <Icon name="Check" size={15} /> Подтвердить заказ
                            </button>
                            <button onClick={() => rejectOrder(order.id)}
                              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-red-400 transition-all"
                              style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)" }}>
                              <Icon name="X" size={15} /> Отклонить
                            </button>
                          </div>
                        )}
                        {order.status === "confirmed" && (
                          <div className="flex items-center gap-2 text-green-400 text-sm">
                            <Icon name="CheckCircle" size={15} />
                            Заказ подтверждён — сервер создан
                          </div>
                        )}
                        {order.status === "rejected" && (
                          <div className="flex items-center gap-2 text-red-400 text-sm">
                            <Icon name="XCircle" size={15} />
                            Заказ отклонён
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {tab === "servers" && (
          <div className="gradient-card rounded-2xl p-6">
            <p className="text-white/40 text-sm text-center py-8">
              {confirmed.length === 0 ? "Нет активных серверов" : `${confirmed.length} серверов подтверждено`}
            </p>
            {confirmed.map(o => (
              <div key={o.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 mb-2">
                <span className="text-2xl">{o.planEmoji}</span>
                <div className="flex-1">
                  <div className="text-white font-semibold">{o.planName}</div>
                  <div className="text-white/40 text-xs">{o.userEmail} · порт {o.port}</div>
                </div>
                <span className="text-green-400 font-bold text-sm">{o.planPrice}₽/мес</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
