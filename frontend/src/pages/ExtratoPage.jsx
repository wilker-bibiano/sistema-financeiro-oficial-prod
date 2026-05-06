import { useEffect, useMemo, useState } from "react";
import { listarLancamentos } from "../services/api.js";
import Toast from "../components/Toast.jsx";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

export default function ExtratoPage() {
  const [lancamentos, setLancamentos] = useState([]);
  const [filter, setFilter] = useState("todos");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    async function carregarLancamentos() {
      try {
        setLancamentos(await listarLancamentos());
      } catch {
        setToast({ message: "Nao foi possivel carregar o extrato.", type: "error" });
      }
    }

    carregarLancamentos();
  }, []);

  const totais = useMemo(() => {
    return lancamentos.reduce(
      (acc, item) => {
        if (item.tipo === "receita") acc.receitas += item.valor;
        if (item.tipo === "despesa") acc.despesas += item.valor;
        acc.caixa = acc.receitas - acc.despesas;
        return acc;
      },
      { caixa: 0, receitas: 0, despesas: 0 }
    );
  }, [lancamentos]);

  const filtrados = filter === "todos" ? lancamentos : lancamentos.filter((item) => item.tipo === filter);

  return (
    <>
      <Toast message={toast?.message} type={toast?.type} />
      <section className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-3">
          <SummaryCard label="Caixa" value={totais.caixa} tone="ink" />
          <SummaryCard label="Total receitas" value={totais.receitas} tone="mint" />
          <SummaryCard label="Total despesas" value={totais.despesas} tone="coral" />
        </div>

        <div className="rounded-lg bg-white p-5 shadow-soft">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-mint">Movimentacoes</p>
              <h2 className="text-2xl font-semibold text-ink">Extrato</h2>
            </div>
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="rounded-lg border border-ink/10 bg-white px-3 py-2 outline-none transition focus:border-mint focus:ring-2 focus:ring-mint/20"
            >
              <option value="todos">Todos</option>
              <option value="receita">Receitas</option>
              <option value="despesa">Despesas</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b border-ink/10 text-sm text-ink/60">
                  <th className="py-3 pr-4 font-semibold">Data</th>
                  <th className="py-3 pr-4 font-semibold">Tipo</th>
                  <th className="py-3 pr-4 font-semibold">Categoria</th>
                  <th className="py-3 pr-4 font-semibold">Observacao</th>
                  <th className="py-3 text-right font-semibold">Valor</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.length === 0 ? (
                  <tr>
                    <td className="py-8 text-center text-ink/55" colSpan="5">
                      Nenhum lancamento encontrado.
                    </td>
                  </tr>
                ) : (
                  filtrados.map((item) => (
                    <tr key={item.id} className="border-b border-ink/5 text-sm">
                      <td className="py-3 pr-4">{new Date(item.data).toLocaleDateString("pt-BR")}</td>
                      <td className="py-3 pr-4 capitalize">{item.tipo}</td>
                      <td className="py-3 pr-4">{item.categoria}</td>
                      <td className="py-3 pr-4 text-ink/65">{item.observacao || "-"}</td>
                      <td className={`py-3 text-right font-semibold ${item.tipo === "receita" ? "text-mint" : "text-coral"}`}>
                        {currency.format(item.valor)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}

function SummaryCard({ label, value, tone }) {
  const color = {
    ink: "text-ink",
    mint: "text-mint",
    coral: "text-coral"
  }[tone];

  return (
    <div className="rounded-lg bg-white p-5 shadow-soft">
      <p className="text-sm font-semibold text-ink/55">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${color}`}>{currency.format(value)}</p>
    </div>
  );
}
