import { Link } from "react-router-dom";
import { ArrowLeftRight, Banknote, ReceiptText } from "lucide-react";

const cards = [
  { to: "/receitas", label: "Receitas", icon: Banknote, className: "bg-mint text-white" },
  { to: "/despesas", label: "Despesas", icon: ReceiptText, className: "bg-coral text-white" },
  { to: "/extrato", label: "Extrato", icon: ArrowLeftRight, className: "bg-ink text-white" }
];

export default function HomePage() {
  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-center">
      <div>
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-mint">Painel financeiro</p>
        <h2 className="max-w-xl text-4xl font-bold leading-tight text-ink sm:text-5xl">
          Registre entradas, controle saidas e acompanhe seu caixa.
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
        {cards.map(({ to, label, icon: Icon, className }) => (
          <Link
            key={to}
            to={to}
            className={`flex min-h-32 items-center justify-between rounded-lg p-6 shadow-soft transition hover:-translate-y-1 ${className}`}
          >
            <span className="text-2xl font-semibold">{label}</span>
            <Icon size={30} />
          </Link>
        ))}
      </div>
    </section>
  );
}
