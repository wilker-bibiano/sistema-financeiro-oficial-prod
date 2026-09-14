import { NavLink, Route, Routes } from "react-router-dom";
import { ArrowLeftRight, Banknote, Home, ReceiptText, WalletCards } from "lucide-react";
import HomePage from "./pages/HomePage.jsx";
import LancamentoPage from "./pages/LancamentoPage.jsx";
import ExtratoPage from "./pages/ExtratoPage.jsx";

// Navegação superior da tela
const navItems = [
  // { to: "/", label: "Inicio", icon: Home },
  // { to: "/receitas", label: "Receitas", icon: Banknote },
  // { to: "/despesas", label: "Despesas", icon: ReceiptText },
  {to: "/", label: "Lancamentos", icon: Banknote },
  { to: "/extrato", label: "Extrato", icon: ArrowLeftRight }
];

export default function App() {
  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl flex-col">
        <header className="mb-8 flex flex-col gap-4 rounded-lg bg-white/85 p-4 shadow-soft backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-ink text-white">
              <WalletCards size={22} />
            </div>
            <div>
              <p className="text-sm font-medium text-receita">Controle pessoal</p>
              <h1 className="text-xl font-semibold text-ink">Financas em dia</h1>
            </div>
          </div>

          <nav className="flex flex-wrap gap-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    isActive ? "bg-ink text-white" : "bg-white text-ink hover:bg-ink/5"
                  }`
                }
              >
                <Icon size={17} />
                {label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="flex-1">
          <Routes>
            {/* <Route path="/" element={<HomePage />} /> */}
               <Route path="/" element={<LancamentoPage />} />
            {/* <Route path="/receitas" element={<LancamentoPage  />} /> */}
            {/* <Route path="/despesas" element={<LancamentoPage tipo="despesa" />} /> */}
            <Route path="/extrato" element={<ExtratoPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
