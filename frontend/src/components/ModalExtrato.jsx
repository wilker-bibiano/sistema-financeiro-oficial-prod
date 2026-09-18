import { useState, useEffect } from "react";


export default function ModalEditarExtrato({ isOpen, onClose, onSave, item }) {
  const [form, setForm] = useState({
    observacao: "",
    valor: "",
    operacao: "receita",
    categoria: ""
  });

// Preenche o formulário com os dados do item selecionado ao abrir
useEffect(() => {
  if (item) {
    setForm({
      observacao: item.observacao || item.descricao || "",
      valor: item.valor || "",
      operacao: item.operacao || "receita",
      categoria: item.categoria || ""
    });
  }
}, [item]);
 if (!isOpen) return null;

  function handleSubmit(event) {
    event.preventDefault();
    onSave (item.id, {...form, valor: Number(form.valor)}); // Converte o valor para número antes de salvar
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold text-ink">Editar Lançamento</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-ink/70">Operação</label>
            <select
              value={form.operacao}
              onChange={(e) => setForm({ ...form, operacao: e.target.value })}
              className="mt-1 w-full rounded-lg border border-ink/20 p-2 text-sm outline-none focus:border-receita"
            >
              <option value="receita">Receita</option>
              <option value="despesa">Despesa</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-ink/70">Valor</label>
            <input
              type="number"
              step="0.01"
              value={form.valor}
              onChange={(e) => setForm({ ...form, valor: e.target.value })}
              className="mt-1 w-full rounded-lg border border-ink/20 p-2 text-sm outline-none focus:border-receita"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink/70">Categoria</label>
            <input
              type="text"
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
              className="mt-1 w-full rounded-lg border border-ink/20 p-2 text-sm outline-none focus:border-receita"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink/70">Observação</label>
            <input
              type="text"
              value={form.observacao}
              onChange={(e) => setForm({ ...form, observacao: e.target.value })}
              className="mt-1 w-full rounded-lg border border-ink/20 p-2 text-sm outline-none focus:border-receita"
            />
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-ink/10 px-4 py-2 text-sm font-semibold text-ink hover:bg-ink/20"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-receita px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );

}