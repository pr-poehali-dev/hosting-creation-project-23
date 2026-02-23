import { useState } from "react";
import Icon from "@/components/ui/icon";

// ===================== TYPES =====================
interface User {
  email: string;
}

interface Plan {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  cpu: string;
  ram: string;
  disk: string;
  ddos: string;
  location: string;
  price: number;
  badge?: "popular" | "new";
  badgeColor?: "green" | "orange";
}

// ===================== DATA =====================
const plans: Plan[] = [
  {
    id: "popugai",
    name: "ПОПУГАЙ",
    emoji: "🦜",
    desc: "Удобный вариант для знакомства с хостингом",
    cpu: "0.5 ядра AMD Ryzen 9 3900x",
    ram: "1 ГБ DDR4",
    disk: "6 ГБ NVMe SSD",
    ddos: "Расширенная",
    location: "Россия",
    price: 45,
    badge: "new",
    badgeColor: "green",
  },
  {
    id: "pchela",
    name: "ПЧЕЛА",
    emoji: "🐝",
    desc: "Подходит для хобби и прокси",
    cpu: "1 ядро AMD Ryzen 9 3900x",
    ram: "2 ГБ DDR4",
    disk: "10 ГБ NVMe SSD",
    ddos: "Расширенная",
    location: "Россия",
    price: 99,
  },
  {
    id: "zombi",
    name: "ЗОМБИ",
    emoji: "🧟",
    desc: "Увеличенные ресурсы для стабильной игры",
    cpu: "1 ядро AMD Ryzen 9 3900x",
    ram: "3 ГБ DDR4",
    disk: "16 ГБ NVMe SSD",
    ddos: "Расширенная",
    location: "Россия",
    price: 189,
  },
  {
    id: "skelet",
    name: "СКЕЛЕТ",
    emoji: "💀",
    desc: "Надёжный вариант для постоянного сервера",
    cpu: "1.5 ядра AMD Ryzen 9 3900x",
    ram: "4 ГБ DDR4",
    disk: "20 ГБ NVMe SSD",
    ddos: "Расширенная",
    location: "Россия",
    price: 269,
  },
  {
    id: "pauk",
    name: "ПАУК",
    emoji: "🕷",
    desc: "Комфортная работа с плагинами и модами",
    cpu: "2 ядра AMD Ryzen 9 3900x",
    ram: "6 ГБ DDR4",
    disk: "45 ГБ NVMe SSD",
    ddos: "Расширенная",
    location: "Россия",
    price: 369,
  },
  {
    id: "kriper",
    name: "КРИПЕР",
    emoji: "💚",
    desc: "Оптимальный выбор для большинства серверов",
    cpu: "2.5 ядра AMD Ryzen 9 3900x",
    ram: "8 ГБ DDR4",
    disk: "60 ГБ NVMe SSD",
    ddos: "Расширенная",
    location: "Россия",
    price: 459,
    badge: "popular",
    badgeColor: "orange",
  },
  {
    id: "piglin",
    name: "ПИГЛИН",
    emoji: "🐷",
    desc: "Для активных серверов с средней онлайн",
    cpu: "2.5 ядра AMD Ryzen 9 3900x",
    ram: "10 ГБ DDR4",
    disk: "85 ГБ NVMe SSD",
    ddos: "Расширенная",
    location: "Россия",
    price: 549,
  },
  {
    id: "golem",
    name: "ГОЛЕМ",
    emoji: "🗿",
    desc: "Уверенно держит высокую нагрузку",
    cpu: "3 ядра AMD Ryzen 9 3900x",
    ram: "12 ГБ DDR4",
    disk: "70 ГБ NVMe SSD",
    ddos: "Расширенная",
    location: "Россия",
    price: 629,
  },
];

// ===================== MODAL: AUTH =====================
function AuthModal({
  mode,
  onClose,
  onLogin,
  onSwitchMode,
}: {
  mode: "login" | "register";
  onClose: () => void;
  onLogin: (user: User) => void;
  onSwitchMode: (m: "login" | "register") => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Заполните все поля");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Введите корректный email");
      return;
    }
    if (password.length < 6) {
      setError("Пароль должен быть не менее 6 символов");
      return;
    }
    if (mode === "register" && password !== confirm) {
      setError("Пароли не совпадают");
      return;
    }
    onLogin({ email });
  };

  return (
    <div
      className="modal-bg fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="modal-card w-full max-w-md p-8 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>
            {mode === "login" ? "Войти" : "Регистрация"}
          </h2>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
            <Icon name="X" size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-white/60 text-sm mb-1.5 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-green-500 transition-colors"
            />
          </div>
          <div>
            <label className="text-white/60 text-sm mb-1.5 block">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-green-500 transition-colors"
            />
          </div>
          {mode === "register" && (
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Подтверждение пароля</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>
          )}

          {error && (
            <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 px-4 py-2.5 rounded-xl">
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary w-full py-3.5 rounded-xl text-white font-semibold text-base mt-2">
            {mode === "login" ? "Войти" : "Создать аккаунт"}
          </button>
        </form>

        <p className="text-center text-white/40 text-sm mt-5">
          {mode === "login" ? (
            <>
              Нет аккаунта?{" "}
              <button onClick={() => onSwitchMode("register")} className="text-green-400 hover:text-green-300 transition-colors font-medium">
                Зарегистрироваться
              </button>
            </>
          ) : (
            <>
              Уже есть аккаунт?{" "}
              <button onClick={() => onSwitchMode("login")} className="text-green-400 hover:text-green-300 transition-colors font-medium">
                Войти
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

// ===================== MODAL: ORDER =====================
function OrderModal({
  plan,
  user,
  onClose,
}: {
  plan: Plan;
  user: User;
  onClose: () => void;
}) {
  const [done, setDone] = useState(false);

  return (
    <div
      className="modal-bg fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="modal-card w-full max-w-md p-8 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {done ? (
          <div className="text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Заявка отправлена!
            </h2>
            <p className="text-white/50 text-sm mb-6">
              Тариф <span className="text-green-400 font-semibold">{plan.name}</span> — {plan.price}₽/мес<br />
              Мы свяжемся с вами на {user.email}
            </p>
            <button onClick={onClose} className="btn-primary px-8 py-3 rounded-xl text-white font-semibold">
              Отлично!
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>
                Заказать тариф
              </h2>
              <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
                <Icon name="X" size={22} />
              </button>
            </div>

            <div className="gradient-card rounded-xl p-4 mb-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{plan.emoji}</span>
                <div>
                  <div className="text-white font-bold" style={{ fontFamily: "Montserrat, sans-serif" }}>{plan.name}</div>
                  <div className="text-white/50 text-sm">{plan.desc}</div>
                </div>
              </div>
              <div className="text-2xl font-bold" style={{ color: "var(--green)", fontFamily: "Montserrat, sans-serif" }}>
                {plan.price}₽<span className="text-sm text-white/40 font-normal">/мес</span>
              </div>
            </div>

            <p className="text-white/50 text-sm mb-5">
              Аккаунт: <span className="text-white">{user.email}</span>
            </p>

            <button onClick={() => setDone(true)} className="btn-primary w-full py-3.5 rounded-xl text-white font-semibold text-base">
              Подтвердить заказ
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ===================== PLAN CARD =====================
function PlanCard({
  plan,
  user,
  onOrder,
}: {
  plan: Plan;
  user: User | null;
  onOrder: (plan: Plan) => void;
}) {
  const isCreeper = plan.id === "kriper";

  return (
    <div
      className={`relative rounded-2xl p-5 flex flex-col h-full transition-all duration-300 hover:-translate-y-1 ${
        isCreeper ? "gradient-card-creeper glow-green" : "gradient-card"
      }`}
    >
      {plan.badge && (
        <div className="absolute -top-3 right-4">
          <span
            className="text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
            style={{
              background:
                plan.badgeColor === "orange"
                  ? "linear-gradient(135deg,#f97316,#ea580c)"
                  : "linear-gradient(135deg,#22c55e,#16a34a)",
            }}
          >
            {plan.badge === "popular" ? "Популярный" : "Новинка"}
          </span>
        </div>
      )}

      <div className="flex flex-col items-center mb-4 mt-1">
        <span className="text-4xl mb-2">{plan.emoji}</span>
        <h3
          className="text-lg font-extrabold text-white tracking-wide"
          style={{ fontFamily: "Montserrat, sans-serif", color: isCreeper ? "#4ade80" : "white" }}
        >
          {plan.name}
        </h3>
        <p className="text-white/40 text-xs text-center mt-1 leading-tight">{plan.desc}</p>
      </div>

      <div className="flex flex-col gap-0 mb-4 flex-1">
        <div className="spec-row">
          <span className="flex items-center gap-1.5 text-white/50">
            <Icon name="Cpu" size={13} /> Процессор
          </span>
          <span className="text-white/80 text-right text-xs max-w-[55%] leading-tight">{plan.cpu}</span>
        </div>
        <div className="spec-row">
          <span className="flex items-center gap-1.5 text-white/50">
            <Icon name="MemoryStick" size={13} /> Оперативная память
          </span>
          <span className="text-white/80">{plan.ram}</span>
        </div>
        <div className="spec-row">
          <span className="flex items-center gap-1.5 text-white/50">
            <Icon name="HardDrive" size={13} /> Место на диске
          </span>
          <span className="text-white/80">{plan.disk}</span>
        </div>
        <div className="spec-row">
          <span className="flex items-center gap-1.5 text-white/50">
            <Icon name="Shield" size={13} /> DDoS защита
          </span>
          <span className="text-white/80">{plan.ddos}</span>
        </div>
        <div className="spec-row">
          <span className="flex items-center gap-1.5 text-white/50">
            <Icon name="MapPin" size={13} /> Локация
          </span>
          <span className="text-white/80">{plan.location}</span>
        </div>
      </div>

      <div className="mt-auto">
        <div className="mb-3">
          <span className="text-xs text-white/30 uppercase tracking-wider block mb-0.5">Стоимость</span>
          <span
            className="text-3xl font-extrabold"
            style={{
              fontFamily: "Montserrat, sans-serif",
              color: isCreeper ? "#f97316" : "#22c55e",
            }}
          >
            {plan.price}₽
          </span>
          <span className="text-white/30 text-sm">/мес</span>
        </div>

        <button
          onClick={() => onOrder(plan)}
          className={`w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
            user
              ? "btn-primary text-white"
              : "btn-secondary text-white hover:border-green-500/50"
          }`}
        >
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

  const handleOrder = (plan: Plan) => {
    if (!user) {
      setAuthModal("register");
    } else {
      setOrderPlan(plan);
    }
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-white/5" style={{ background: "rgba(10,10,10,0.85)", backdropFilter: "blur(16px)" }}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <span className="font-extrabold text-lg tracking-tight" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Zetix<span style={{ color: "#22c55e" }}>Hosting</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo("home")} className="nav-link text-sm">Главная</button>
            <button onClick={() => scrollTo("plans")} className="nav-link text-sm">Тарифы</button>
            <button onClick={() => scrollTo("support")} className="nav-link text-sm">Поддержка</button>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-white/50 text-sm hidden md:block">{user.email}</span>
                <button
                  onClick={() => setUser(null)}
                  className="btn-secondary px-4 py-2 rounded-xl text-sm"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setAuthModal("login")}
                  className="btn-secondary px-4 py-2 rounded-xl text-sm"
                >
                  Войти
                </button>
                <button
                  onClick={() => setAuthModal("register")}
                  className="btn-primary px-4 py-2 rounded-xl text-sm text-white"
                >
                  Регистрация
                </button>
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

          <h1 className="section-title text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight">
            Стабильный{" "}
            <span style={{ color: "#22c55e" }}>хостинг</span>
            <br />
            для вашего проекта
          </h1>

          <p className="text-white/50 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Мы предоставляем лучшие решения для создания и управления Minecraft и Hytale
            серверами. С нами вы получите высокую скорость, надёжность и простоту использования.
            Наши сервера работают на AMD Ryzen 9 3900x, обеспечивая отличную производительность и стабильность.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => scrollTo("plans")}
              className="btn-primary px-8 py-4 rounded-xl text-white font-semibold text-base flex items-center gap-2"
            >
              <Icon name="Plus" size={18} />
              Создать сервер
            </button>
            <button
              onClick={() => scrollTo("support")}
              className="btn-secondary px-8 py-4 rounded-xl text-white font-semibold text-base flex items-center gap-2"
            >
              <Icon name="Eye" size={18} />
              Видеообзор
            </button>
          </div>

          <div className="mt-20 grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[
              { value: "99.9%", label: "Uptime" },
              { value: "500+", label: "Серверов" },
              { value: "24/7", label: "Поддержка" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-extrabold" style={{ color: "#22c55e", fontFamily: "Montserrat, sans-serif" }}>
                  {stat.value}
                </div>
                <div className="text-white/40 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANS */}
      <section id="plans" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="section-title text-4xl md:text-5xl mb-4">
              Наши <span style={{ color: "#22c55e" }}>тарифы</span>
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">
              Выберите подходящий план для вашего сервера
            </p>
            {!user && (
              <div className="mt-4 inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-5 py-2.5 text-yellow-400 text-sm">
                <Icon name="Lock" size={15} />
                Для покупки необходимо{" "}
                <button onClick={() => setAuthModal("register")} className="underline font-semibold hover:text-yellow-300 transition-colors">
                  зарегистрироваться
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} user={user} onOrder={handleOrder} />
            ))}
          </div>
        </div>
      </section>

      {/* SUPPORT */}
      <section id="support" className="py-24 px-6" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="section-title text-4xl md:text-5xl mb-4">
              <span style={{ color: "#22c55e" }}>Поддержка</span> 24/7
            </h2>
            <p className="text-white/40 text-lg">Мы всегда рядом, чтобы помочь вам</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-14">
            {[
              {
                icon: "MessageCircle",
                title: "Онлайн-чат",
                desc: "Ответим в течение 5 минут в любое время суток",
                color: "#22c55e",
              },
              {
                icon: "Mail",
                title: "Email поддержка",
                desc: "Отправьте заявку на support@zetixhosting.ru",
                color: "#3b82f6",
              },
              {
                icon: "Send",
                title: "Telegram",
                desc: "Напишите нам в Telegram @zetixhosting",
                color: "#8b5cf6",
              },
            ].map((item) => (
              <div key={item.title} className="gradient-card rounded-2xl p-6 text-center hover:-translate-y-1 transition-all duration-300">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: `${item.color}20`, border: `1px solid ${item.color}40` }}
                >
                  <Icon name={item.icon} size={24} style={{ color: item.color }} />
                </div>
                <h3 className="text-white font-bold text-lg mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  {item.title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="gradient-card rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-6" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Часто задаваемые вопросы
            </h3>
            <div className="flex flex-col gap-4">
              {[
                {
                  q: "Как быстро активируется сервер?",
                  a: "Сервер активируется автоматически сразу после оплаты — в течение 1-2 минут.",
                },
                {
                  q: "Есть ли бесплатный период?",
                  a: "Мы предоставляем тестовый период по запросу в поддержку.",
                },
                {
                  q: "Можно ли сменить тариф?",
                  a: "Да, вы можете перейти на любой другой тариф в любое время. Перерасчёт производится автоматически.",
                },
                {
                  q: "Какой тип DDoS-защиты используется?",
                  a: "Расширенная DDoS-защита на всех тарифах — защита уровней L3/L4/L7.",
                },
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
            <span className="font-extrabold tracking-tight" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Zetix<span style={{ color: "#22c55e" }}>Hosting</span>
            </span>
          </div>
          <p className="text-white/30 text-sm">© 2024 ZetixHosting. Все права защищены.</p>
          <div className="flex gap-6">
            <button onClick={() => scrollTo("home")} className="text-white/30 hover:text-white/60 text-sm transition-colors">Главная</button>
            <button onClick={() => scrollTo("plans")} className="text-white/30 hover:text-white/60 text-sm transition-colors">Тарифы</button>
            <button onClick={() => scrollTo("support")} className="text-white/30 hover:text-white/60 text-sm transition-colors">Поддержка</button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {authModal && (
        <AuthModal
          mode={authModal}
          onClose={() => setAuthModal(null)}
          onLogin={(u) => {
            setUser(u);
            setAuthModal(null);
          }}
          onSwitchMode={setAuthModal}
        />
      )}

      {orderPlan && user && (
        <OrderModal
          plan={orderPlan}
          user={user}
          onClose={() => setOrderPlan(null)}
        />
      )}
    </div>
  );
}