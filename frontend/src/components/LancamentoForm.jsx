import { Save } from "lucide-react";
import { useState } from "react";
import Toast from "./Toast.jsx";

  
export default function LancamentoForm({ categorias = [], operacoes = [], onSave, loading }) {
  
const [form, setForm] = useState({ valor: "", operacao: "", categoria: "", observacao: "" });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const isReceita = form.operacao?.toLowerCase().trim() === "receita";

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }
   

  function validate() {
    const nextErrors = {};
    const op = form.operacao?.toLowerCase().trim();
    if (!form.valor || Number(form.valor) <= 0) nextErrors.valor = "Informe um valor maior que zero.";
    if (!op || (op !== "receita" && op !== "despesa")) nextErrors.operacao = "Escolha uma operação.";
    if (!form.categoria) nextErrors.categoria = "Escolha uma categoria.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
   if (!validate()) {
      setToast({ message: "Preencha todos os campos obrigatórios.", type: "error" });
      return;
    }
try {
      await onSave({
        valor: Number(form.valor),
        operacao: form.operacao.toLowerCase().trim(),
        categoria: form.categoria,
        observacao: form.observacao
      });

      setForm({ valor: "", operacao: "", categoria: "", observacao: "" });
      setErrors({});

      setToast({ message: "Lançamento salvo com sucesso!", type: "success" });

    } catch {
      setToast({ message: "Erro ao conectar ao servidor. Tente novamente.", type: "error" });
    }
  }

  return (
    <>
    <Toast message={toast?.message} type={toast?.type} />
    <form onSubmit={handleSubmit} className="rounded-lg bg-white p-5 shadow-soft">
      <div className="mb-5">
        <p className={`text-sm font-semibold ${isReceita ? "text-receita" : "text-despesa"}`}>
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
            className="rounded-lg border border-ink/10 px-3 py-3 outline-none transition focus:border-receita focus:ring-2 focus:ring-receita/20"
            placeholder="0,00"
          />
          {errors.valor && <span className="text-sm text-despesa">{errors.valor}</span>}
        </label>


        {/* Categoria */}
       <label className="grid gap-2">
          <span className="text-sm font-semibold text-ink/75">Categoria</span>
          <select
            value={form.categoria}
            onChange={(event) => updateField("categoria", event.target.value)}
            className="rounded-lg border border-ink/10 bg-white px-3 py-3 outline-none transition focus:border-receita focus:ring-2 focus:ring-receita/20"
          >
            <option value="">Selecione</option>
            {categorias.map((categoria) => {
              const catNome = typeof categoria === "string" ? categoria : categoria.nome;
              return (
                <option key={catNome} value={catNome}>
                  {catNome}
                </option>
              );
            })}
          </select>
          {errors.categoria && <span className="text-sm text-despesa">{errors.categoria}</span>}
        </label>

        {/* OPERAÇÃO */}
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-ink/75">Operação</span>
          <select
            value={form.operacao}
            onChange={(event) => updateField("operacao", event.target.value)}
            className="rounded-lg border border-ink/10 bg-white px-3 py-3 outline-none transition focus:border-receita focus:ring-2 focus:ring-receita/20"
          >
        <option value="">Selecione</option>
            {operacoes.map((operacao) => {
              const val = typeof operacao === "string" ? operacao : operacao.nome;
              const valNormalized = val.toLowerCase().trim();
              return (
                <option key={valNormalized} value={valNormalized}>
                  {val}
                </option>
              );
            })}
          </select>
          {errors.operacao && <span className="text-sm text-despesa">{errors.operacao}</span>}
        </label>


        {/* Observação */}
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-ink/75">Observacao</span>
          <textarea
            value={form.observacao}
            onChange={(event) => updateField("observacao", event.target.value)}
            className="min-h-28 resize-y rounded-lg border border-ink/10 px-3 py-3 outline-none transition focus:border-receita focus:ring-2 focus:ring-receita/20"
            placeholder="Detalhes opcionais"
          />
        </label>
      </div>

        {/* Botão Salvar  */}
      <button
        type="submit"
        disabled={loading}
        className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold text-white transition disabled:opacity-60 ${
          isReceita ? "bg-receita hover:bg-receita/90" : "bg-despesa hover:bg-despesa/90"
        }`}
      >
        <Save size={18} />
        {loading ? "Acionando o Servidor, por favor aguarde..." : "Salvar"}
      </button>
    </form>
    </>
  );
}
