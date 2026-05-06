import { Save } from "lucide-react";
import { useState } from "react";

export default function LancamentoForm({ tipo, categorias, onSave, loading }) {
  const [form, setForm] = useState({ valor: "", categoria: "", observacao: "" });
  const [errors, setErrors] = useState({});

  const isReceita = tipo === "receita";

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function validate() {
    const nextErrors = {};
    if (!form.valor || Number(form.valor) <= 0) nextErrors.valor = "Informe um valor maior que zero.";
    if (!form.categoria) nextErrors.categoria = "Escolha uma categoria.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;

    await onSave({
      tipo,
      valor: Number(form.valor),
      categoria: form.categoria,
      observacao: form.observacao
    });

    setForm({ valor: "", categoria: "", observacao: "" });
    setErrors({});
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg bg-white p-5 shadow-soft">
      <div className="mb-5">
        <p className={`text-sm font-semibold ${isReceita ? "text-mint" : "text-coral"}`}>
          {isReceita ? "Entrada de dinheiro" : "Saida de dinheiro"}
        </p>
        <h2 className="text-2xl font-semibold text-ink">{isReceita ? "Nova receita" : "Nova despesa"}</h2>
      </div>

      <div className="grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-ink/75">Valor (R$)</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.valor}
            onChange={(event) => updateField("valor", event.target.value)}
            className="rounded-lg border border-ink/10 px-3 py-3 outline-none transition focus:border-mint focus:ring-2 focus:ring-mint/20"
            placeholder="0,00"
          />
          {errors.valor && <span className="text-sm text-coral">{errors.valor}</span>}
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-ink/75">Categoria</span>
          <select
            value={form.categoria}
            onChange={(event) => updateField("categoria", event.target.value)}
            className="rounded-lg border border-ink/10 bg-white px-3 py-3 outline-none transition focus:border-mint focus:ring-2 focus:ring-mint/20"
          >
            <option value="">Selecione</option>
            {categorias.map((categoria) => (
              <option key={categoria.nome} value={categoria.nome}>
                {categoria.nome}
              </option>
            ))}
          </select>
          {errors.categoria && <span className="text-sm text-coral">{errors.categoria}</span>}
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-ink/75">Observacao</span>
          <textarea
            value={form.observacao}
            onChange={(event) => updateField("observacao", event.target.value)}
            className="min-h-28 resize-y rounded-lg border border-ink/10 px-3 py-3 outline-none transition focus:border-mint focus:ring-2 focus:ring-mint/20"
            placeholder="Detalhes opcionais"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold text-white transition disabled:opacity-60 ${
          isReceita ? "bg-mint hover:bg-mint/90" : "bg-coral hover:bg-coral/90"
        }`}
      >
        <Save size={18} />
        Salvar
      </button>
    </form>
  );
}
