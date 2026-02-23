import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";
import type { User, Plan, Order } from "@/types";
import { addOrder, subscribeStore, getOrders, confirmOrder, rejectOrder, getUserOrderCount, ADMIN_PROMO } from "@/store";
import ServerPanel from "@/components/ServerPanel";
import AdminPanel from "@/components/AdminPanel";

// ===================== DATA =====================
const plans: Plan[] = [
  {
    id: "popugai", name: "ПОПУГАЙ", emoji: "🦜",
    image: "https://cdn.poehali.dev/projects/27fd1437-0ba7-4459-a662-c6cb5abfb665/bucket/d77d7605-5799-42aa-a58f-b3effb939c5c.png",
    desc: "Удобный вариант для знакомства с хостингом",
    cpu: "0.5 ядра AMD Ryzen 9 3900x", ram: "1 ГБ DDR4", disk: "6 ГБ NVMe SSD",
    ddos: "Расширенная", location: "Россия", price: 45, badge: "new", badgeColor: "green",
  },
  {
    id: "pchela", name: "ПЧЕЛА", emoji: "🐝",
    image: "https://cdn.poehali.dev/projects/27fd1437-0ba7-4459-a662-c6cb5abfb665/bucket/d77d7605-5799-42aa-a58f-b3effb939c5c.png",
    desc: "Подходит для хобби и прокси",
    cpu: "1 ядро AMD Ryzen 9 3900x", ram: "2 ГБ DDR4", disk: "10 ГБ NVMe SSD",
    ddos: "Расширенная", location: "Россия", price: 99,
  },
  {
    id: "zombi", name: "ЗОМБИ", emoji: "🧟",
    image: "https://cdn.poehali.dev/projects/27fd1437-0ba7-4459-a662-c6cb5abfb665/bucket/d77d7605-5799-42aa-a58f-b3effb939c5c.png",
    desc: "Увеличенные ресурсы для стабильной игры",
    cpu: "1 ядро AMD Ryzen 9 3900x", ram: "3 ГБ DDR4", disk: "16 ГБ NVMe SSD",
    ddos: "Расширенная", location: "Россия", price: 189,
  },
  {
    id: "skelet", name: "СКЕЛЕТ", emoji: "💀",
    image: "https://cdn.poehali.dev/projects/27fd1437-0ba7-4459-a662-c6cb5abfb665/bucket/d77d7605-5799-42aa-a58f-b3effb939c5c.png",
    desc: "Надёжный вариант для постоянного сервера",
    cpu: "1.5 ядра AMD Ryzen 9 3900x", ram: "4 ГБ DDR4", disk: "20 ГБ NVMe SSD",
    ddos: "Расширенная", location: "Россия", price: 269,
  },
  {
    id: "pauk", name: "ПАУК", emoji: "🕷",
    image: "https://cdn.poehali.dev/projects/27fd1437-0ba7-4459-a662-c6cb5abfb665/bucket/d77d7605-5799-42aa-a58f-b3effb939c5c.png",
    desc: "Комфортная работа с плагинами и модами",
    cpu: "2 ядра AMD Ryzen 9 3900x", ram: "6 ГБ DDR4", disk: "45 ГБ NVMe SSD",
    ddos: "Расширенная", location: "Россия", price: 369,
  },
  {
    id: "kriper", name: "КРИПЕР", emoji: "💚",
    image: "https://cdn.poehali.dev/projects/27fd1437-0ba7-4459-a662-c6cb5abfb665/bucket/d77d7605-5799-42aa-a58f-b3effb939c5c.png",
    desc: "Оптимальный выбор для большинства серверов",
    cpu: "2.5 ядра AMD Ryzen 9 3900x", ram: "8 ГБ DDR4", disk: "60 ГБ NVMe SSD",
    ddos: "Расширенная", location: "Россия", price: 459, badge: "popular", badgeColor: "orange",
  },
  {
    id: "piglin", name: "ПИГЛИН", emoji: "🐷",
    image: "https://cdn.poehali.dev/projects/27fd1437-0ba7-4459-a662-c6cb5abfb665/bucket/d77d7605-5799-42aa-a58f-b3effb939c5c.png",
    desc: "Для активных серверов с средней онлайн",
    cpu: "2.5 ядра AMD Ryzen 9 3900x", ram: "10 ГБ DDR4", disk: "85 ГБ NVMe SSD",
    ddos: "Расширенная", location: "Россия", price: 549,
  },
  {
    id: "golem", name: "ГОЛЕМ", emoji: "🗿",
    image: "https://cdn.poehali.dev/projects/27fd1437-0ba7-4459-a662-c6cb5abfb665/bucket/d77d7605-5799-42aa-a58f-b3effb939c5c.png",
    desc: "Уверенно держит высокую нагрузку",
    cpu: "3 ядра AMD Ryzen 9 3900x", ram: "12 ГБ DDR4", disk: "70 ГБ NVMe SSD",
    ddos: "Расширенная", location: "Россия", price: 629,
  },
];

const PLAN_IMAGES: Record<string, string> = {
  popugai: "https://minecraft.wiki/images/Parrot.png",
  pchela: "https://minecraft.wiki/images/Bee.png",
  zombi: "https://minecraft.wiki/images/Zombie.png",
  skelet: "https://minecraft.wiki/images/Skeleton.png",
  pauk: "https://minecraft.wiki/images/Spider.png",
  kriper: "https://minecraft.wiki/images/Creeper.png",
  piglin: "https://minecraft.wiki/images/Piglin.png",
  golem: "https://minecraft.wiki/images/Iron_Golem.png",
};

function randPort() {
  return Math.floor(10000 + Math.random() * 89999);
}

// ===================== AUTH MODAL =====================
function AuthModal({ mode, onClose, onLogin, onSwitchMode }: {
  mode: "login" | "register";
  onClose: () => void;
  onLogin: (u: User) => void;
  onSwitchMode: (m: "login" | "register") => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Заполните все поля"); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError("Введите корректный email"); return; }
    if (password.length < 6) { setError("Пароль минимум 6 символов"); return; }
    if (mode === "register" && password !== confirm) { setError("Пароли не совпадают"); return; }
    const isAdmin = email === "admin@zetixhosting.ru";
    onLogin({ email, isAdmin });
  };

  return (
    <div className="modal-bg fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="modal-card w-full max-w-md p-8 animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white font-montserrat">{mode === "login" ? "Войти" : "Регистрация"}</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white"><Icon name="X" size={22} /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-white/60 text-sm mb-1.5 block">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-green-500 transition-colors" />
          </div>
          <div>
            <label className="text-white/60 text-sm mb-1.5 block">Пароль</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-green-500 transition-colors" />
          </div>
          {mode === "register" && (
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Подтверждение пароля</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-green-500 transition-colors" />
            </div>
          )}
          {error && <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 px-4 py-2.5 rounded-xl">{error}</div>}
          <button type="submit" className="btn-primary w-full py-3.5 rounded-xl text-white font-semibold text-base mt-2">
            {mode === "login" ? "Войти" : "Создать аккаунт"}
          </button>
        </form>
        <p className="text-center text-white/40 text-sm mt-5">
          {mode === "login" ? (
            <>Нет аккаунта? <button onClick={() => onSwitchMode("register")} className="text-green-400 hover:text-green-300 font-medium">Зарегистрироваться</button></>
          ) : (
            <>Есть аккаунт? <button onClick={() => onSwitchMode("login")} className="text-green-400 hover:text-green-300 font-medium">Войти</button></>
          )}
        </p>
      </div>
    </div>
  );
}

// ===================== ORDER MODAL =====================
function OrderModal({ plan, user, onClose }: { plan: Plan; user: User; onClose: () => void }) {
  const [promo, setPromo] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const port = useRef(randPort());
  const orderCount = getUserOrderCount(user.email);

  const handlePromo = () => {
    if (promo === ADMIN_PROMO) {
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoError("Неверный промокод");
    }
  };

  const handleOrder = () => {
    if (orderCount >= 5) return;
    const order: Order = {
      id: "ord_" + Math.random().toString(36).slice(2),
      userEmail: user.email,
      planId: plan.id,
      planName: plan.name,
      planEmoji: plan.emoji,
      planPrice: plan.price,
      port: port.current,
      status: "pending",
      createdAt: new Date().toISOString(),
      promoUsed: promoApplied ? ADMIN_PROMO : undefined,
    };
    addOrder(order);
    setSubmitted(true);
  };

  if (orderCount >= 5 && !submitted) {
    return (
      <div className="modal-bg fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="modal-card w-full max-w-md p-8 animate-fade-in text-center" onClick={e => e.stopPropagation()}>
          <div className="text-5xl mb-4">🚫</div>
          <h2 className="text-xl font-bold text-white mb-2 font-montserrat">Лимит серверов</h2>
          <p className="text-white/50 text-sm mb-6">Максимум 5 серверов на аккаунт. Удалите один из существующих.</p>
          <button onClick={onClose} className="btn-secondary px-8 py-3 rounded-xl text-white font-semibold">Закрыть</button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-bg fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="modal-card w-full max-w-md p-8 animate-fade-in" onClick={e => e.stopPropagation()}>
        {submitted ? (
          <div className="text-center">
            <div className="text-5xl mb-4">⏳</div>
            <h2 className="text-2xl font-bold text-white mb-3 font-montserrat">Заявка отправлена!</h2>
            <p className="text-white/50 text-sm mb-4 leading-relaxed">
              Подождите, пока <span className="text-yellow-400 font-semibold">Администратор подтвердит покупку</span>.<br/>
              После подтверждения сервер появится в вашей панели.
            </p>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-5 text-left">
              <p className="text-white/40 text-xs mb-2 uppercase tracking-wider">Реквизиты оплаты</p>
              <div className="flex items-center gap-2 mb-2">
                <Icon name="CreditCard" size={15} className="text-green-400" />
                <span className="text-white font-mono text-sm">2202 2082 8801 8451</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Phone" size={15} className="text-green-400" />
                <span className="text-white font-mono text-sm">+7 921 700-61-74</span>
              </div>
              <div className="mt-3 pt-3 border-t border-white/10">
                <p className="text-white/40 text-xs">Сумма к оплате:</p>
                <p className="text-green-400 font-bold text-xl font-montserrat">{plan.price}₽/мес</p>
              </div>
            </div>
            <button onClick={onClose} className="btn-primary w-full py-3 rounded-xl text-white font-semibold">Понятно</button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white font-montserrat">Заказать тариф</h2>
              <button onClick={onClose} className="text-white/50 hover:text-white"><Icon name="X" size={22} /></button>
            </div>

            <div className="gradient-card rounded-xl p-4 mb-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{plan.emoji}</span>
                <div>
                  <div className="text-white font-bold font-montserrat">{plan.name}</div>
                  <div className="text-white/50 text-xs">{plan.desc}</div>
                </div>
              </div>
              <div className="text-xl font-bold text-green-400 font-montserrat">{plan.price}₽<span className="text-sm text-white/40 font-normal">/мес</span></div>
              <div className="text-white/30 text-xs mt-1">Порт: {port.current}</div>
            </div>

            {/* PROMO */}
            <div className="mb-4">
              <label className="text-white/50 text-xs mb-1.5 block uppercase tracking-wider">Промокод</label>
              <div className="flex gap-2">
                <input value={promo} onChange={e => setPromo(e.target.value)} placeholder="Введите промокод"
                  className="flex-1 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-green-500 text-sm transition-colors" />
                <button onClick={handlePromo} className="btn-secondary px-4 py-2 rounded-xl text-sm text-white">Применить</button>
              </div>
              {promoError && <p className="text-red-400 text-xs mt-1">{promoError}</p>}
              {promoApplied && <p className="text-green-400 text-xs mt-1">✓ Промокод применён</p>}
            </div>

            <p className="text-white/40 text-xs mb-4">Аккаунт: <span className="text-white">{user.email}</span></p>
            <p className="text-white/30 text-xs mb-5">Серверов: {orderCount}/5</p>

            <button onClick={handleOrder} className="btn-primary w-full py-3.5 rounded-xl text-white font-semibold text-base flex items-center justify-center gap-2">
              <Icon name="ShoppingCart" size={17} /> Отправить заявку
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ===================== PLAN CARD =====================
function PlanCard({ plan, user, onOrder }: { plan: Plan; user: User | null; onOrder: (p: Plan) => void }) {
  const isCreeper = plan.id === "kriper";
  const img = PLAN_IMAGES[plan.id];

  return (
    <div className={`relative rounded-2xl p-5 flex flex-col h-full transition-all duration-300 hover:-translate-y-1 ${isCreeper ? "gradient-card-creeper glow-green" : "gradient-card"}`}>
      {plan.badge && (
        <div className="absolute -top-3 right-4 z-10">
          <span className="text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
            style={{ background: plan.badgeColor === "orange" ? "linear-gradient(135deg,#f97316,#ea580c)" : "linear-gradient(135deg,#22c55e,#16a34a)" }}>
            {plan.badge === "popular" ? "Популярный" : "Новинка"}
          </span>
        </div>
      )}

      <div className="flex flex-col items-center mb-4 mt-1">
        <div className="w-16 h-16 mb-2 flex items-center justify-center">
          <img src={img} alt={plan.name}
            className="w-full h-full object-contain"
            style={{ imageRendering: "pixelated" }}
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        </div>
        <span className="text-2xl">{plan.emoji}</span>
        <h3 className="text-lg font-extrabold tracking-wide mt-1 font-montserrat"
          style={{ color: isCreeper ? "#4ade80" : "white" }}>
          {plan.name}
        </h3>
        <p className="text-white/40 text-xs text-center mt-1 leading-tight">{plan.desc}</p>
      </div>

      <div className="flex flex-col gap-0 mb-4 flex-1">
        {[
          { icon: "Cpu", label: "Процессор", val: plan.cpu },
          { icon: "MemoryStick", label: "Оперативная память", val: plan.ram },
          { icon: "HardDrive", label: "Место на диске", val: plan.disk },
          { icon: "Shield", label: "DDoS защита", val: plan.ddos },
          { icon: "MapPin", label: "Локация", val: plan.location },
        ].map(r => (
          <div key={r.label} className="spec-row">
            <span className="flex items-center gap-1.5 text-white/50 text-xs">
              <Icon name={r.icon} size={12} /> {r.label}
            </span>
            <span className="text-white/80 text-xs text-right max-w-[55%]">{r.val}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto">
        <div className="mb-3">
          <span className="text-xs text-white/30 uppercase tracking-wider block mb-0.5">Стоимость</span>
          <span className="text-3xl font-extrabold font-montserrat" style={{ color: isCreeper ? "#f97316" : "#22c55e" }}>{plan.price}₽</span>
          <span className="text-white/30 text-sm">/мес</span>
        </div>
        <button onClick={() => onOrder(plan)}
          className={`w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${user ? "btn-primary text-white" : "btn-secondary text-white"}`}>
          <Icon name="ShoppingCart" size={15} />
          {user ? "Заказать" : "Войти и заказать"}
        </button>
      </div>
    </div>
  );
}

// ===================== MAIN =====================
export default function Index() {
  const [user, setUser] = useState<User | null>(null);
  const [authModal, setAuthModal] = useState<"login" | "register" | null>(null);
  const [orderPlan, setOrderPlan] = useState<Plan | null>(null);
  const [view, setView] = useState<"home" | "panel" | "admin">("home");
  const [, forceUpdate] = useState(0);

  useEffect(() => subscribeStore(() => forceUpdate(n => n + 1)), []);

  const handleOrder = (plan: Plan) => {
    if (!user) { setAuthModal("register"); return; }
    setOrderPlan(plan);
  };

  const handleLogin = (u: User) => {
    setUser(u);
    setAuthModal(null);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  if (view === "panel" && user) return <ServerPanel user={user} onBack={() => setView("home")} onLogout={() => { setUser(null); setView("home"); }} />;
  if (view === "admin" && user?.isAdmin) return <AdminPanel user={user} onBack={() => setView("home")} onLogout={() => { setUser(null); setView("home"); }} />;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-white/5" style={{ background: "rgba(10,10,10,0.9)", backdropFilter: "blur(16px)" }}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView("home")}>
            <span className="text-xl">⚡</span>
            <span className="font-extrabold text-lg tracking-tight font-montserrat">Zetix<span className="text-green-400">Hosting</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo("home")} className="nav-link text-sm">Главная</button>
            <button onClick={() => scrollTo("plans")} className="nav-link text-sm">Тарифы</button>
            <button onClick={() => scrollTo("support")} className="nav-link text-sm">Поддержка</button>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {user.isAdmin && (
                  <button onClick={() => setView("admin")} className="text-xs bg-red-500/20 border border-red-500/40 text-red-400 px-3 py-1.5 rounded-lg font-medium">
                    Админ
                  </button>
                )}
                <button onClick={() => setView("panel")} className="btn-primary px-4 py-2 rounded-xl text-sm text-white flex items-center gap-1.5">
                  <Icon name="Server" size={15} /> Мои серверы
                </button>
                <button onClick={() => setUser(null)} className="btn-secondary px-4 py-2 rounded-xl text-sm text-white">Выйти</button>
              </>
            ) : (
              <>
                <button onClick={() => setAuthModal("login")} className="btn-secondary px-4 py-2 rounded-xl text-sm text-white">Войти</button>
                <button onClick={() => setAuthModal("register")} className="btn-primary px-4 py-2 rounded-xl text-sm text-white">Регистрация</button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="gradient-hero min-h-screen flex items-center justify-center text-center px-6 pt-16">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-white/60 mb-8">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block"></span>
            AMD Ryzen 9 3900x · NVMe SSD · DDoS защита
          </div>
          <h1 className="font-montserrat font-extrabold text-5xl md:text-7xl mb-6 leading-tight tracking-tight" style={{ letterSpacing: "-0.02em" }}>
            Стабильный <span className="text-green-400">хостинг</span><br />для вашего проекта
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Мы предоставляем лучшие решения для создания и управления Minecraft и Hytale серверами.
            С нами вы получите высокую скорость, надёжность и простоту использования.
            Наши сервера работают на AMD Ryzen 9 3900x.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button onClick={() => scrollTo("plans")} className="btn-primary px-8 py-4 rounded-xl text-white font-semibold text-base flex items-center gap-2">
              <Icon name="Plus" size={18} /> Создать сервер
            </button>
            <button onClick={() => scrollTo("support")} className="btn-secondary px-8 py-4 rounded-xl text-white font-semibold text-base flex items-center gap-2">
              <Icon name="Eye" size={18} /> Видеообзор
            </button>
          </div>
          <div className="mt-20 grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[{ value: "99.9%", label: "Uptime" }, { value: "500+", label: "Серверов" }, { value: "24/7", label: "Поддержка" }].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-extrabold text-green-400 font-montserrat">{s.value}</div>
                <div className="text-white/40 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANS */}
      <section id="plans" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-montserrat font-extrabold text-4xl md:text-5xl mb-4">Наши <span className="text-green-400">тарифы</span></h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">Выберите подходящий план для вашего сервера</p>
            {!user && (
              <div className="mt-4 inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-5 py-2.5 text-yellow-400 text-sm">
                <Icon name="Lock" size={15} />
                Для покупки необходимо{" "}
                <button onClick={() => setAuthModal("register")} className="underline font-semibold hover:text-yellow-300">зарегистрироваться</button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {plans.map(plan => (
              <PlanCard key={plan.id} plan={plan} user={user} onOrder={handleOrder} />
            ))}
          </div>
        </div>
      </section>

      {/* SUPPORT */}
      <section id="support" className="py-24 px-6" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-montserrat font-extrabold text-4xl md:text-5xl mb-4"><span className="text-green-400">Поддержка</span> 24/7</h2>
            <p className="text-white/40 text-lg">Мы всегда рядом, чтобы помочь вам</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-14">
            {[
              { icon: "MessageCircle", title: "Онлайн-чат", desc: "Ответим в течение 5 минут в любое время суток", color: "#22c55e" },
              { icon: "Mail", title: "Email поддержка", desc: "support@zetixhosting.ru", color: "#3b82f6" },
              { icon: "Send", title: "Telegram", desc: "@zetixhosting", color: "#8b5cf6" },
            ].map(item => (
              <div key={item.title} className="gradient-card rounded-2xl p-6 text-center hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: `${item.color}20`, border: `1px solid ${item.color}40` }}>
                  <Icon name={item.icon} size={24} style={{ color: item.color }} />
                </div>
                <h3 className="text-white font-bold text-lg mb-2 font-montserrat">{item.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="gradient-card rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-6 font-montserrat">Часто задаваемые вопросы</h3>
            <div className="flex flex-col gap-4">
              {[
                { q: "Как быстро активируется сервер?", a: "Сервер активируется после подтверждения оплаты администратором — обычно в течение 15 минут." },
                { q: "Есть ли бесплатный период?", a: "Мы предоставляем тестовый период по запросу в поддержку." },
                { q: "Можно ли сменить тариф?", a: "Да, вы можете перейти на любой другой тариф в любое время." },
                { q: "Какой тип DDoS-защиты используется?", a: "Расширенная DDoS-защита на всех тарифах — L3/L4/L7." },
              ].map((faq, i) => (
                <div key={i} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                  <div className="text-white font-semibold mb-1.5 text-sm">{faq.q}</div>
                  <div className="text-white/40 text-sm leading-relaxed">{faq.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <span className="font-extrabold font-montserrat">Zetix<span className="text-green-400">Hosting</span></span>
          </div>
          <p className="text-white/30 text-sm">© 2024 ZetixHosting. Все права защищены.</p>
          <div className="flex gap-6">
            <button onClick={() => scrollTo("home")} className="text-white/30 hover:text-white/60 text-sm transition-colors">Главная</button>
            <button onClick={() => scrollTo("plans")} className="text-white/30 hover:text-white/60 text-sm transition-colors">Тарифы</button>
            <button onClick={() => scrollTo("support")} className="text-white/30 hover:text-white/60 text-sm transition-colors">Поддержка</button>
          </div>
        </div>
      </footer>

      {authModal && (
        <AuthModal mode={authModal} onClose={() => setAuthModal(null)} onLogin={handleLogin} onSwitchMode={setAuthModal} />
      )}
      {orderPlan && user && (
        <OrderModal plan={orderPlan} user={user} onClose={() => setOrderPlan(null)} />
      )}
    </div>
  );
}
