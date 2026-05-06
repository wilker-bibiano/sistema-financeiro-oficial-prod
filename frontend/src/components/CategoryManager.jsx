import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export default function CategoryManager({ categorias, onAdd, onRemove, loading }) {
  const [nome, setNome] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    if (!nome.trim()) return;
    await onAdd(nome.trim());
    setNome("");
  }

  return (
    <section className="rounded-lg bg-white p-5 shadow-soft">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-ink">Categorias</h2>
        <p className="text-sm text-ink/60">Adicione ou remova opcoes do dropdown.</p>
      </div>

      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          value={nome}
          onChange={(event) => setNome(event.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-ink/10 px-3 py-2 outline-none transition focus:border-mint focus:ring-2 focus:ring-mint/20"
          placeholder="Ex.: Mercado"
          disabled={loading}
        />
        <button
          type="submit"
          className="grid h-10 w-10 place-items-center rounded-lg bg-ink text-white transition hover:bg-ink/90 disabled:opacity-50"
          disabled={loading || !nome.trim()}
          title="Adicionar categoria"
        >
          <Plus size={18} />
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {categorias.length === 0 ? (
          <p className="text-sm text-ink/55">Nenhuma categoria cadastrada.</p>
        ) : (
          categorias.map((categoria) => (
            <span
              key={categoria.nome}
              className="inline-flex items-center gap-2 rounded-lg bg-paper px-3 py-2 text-sm font-medium text-ink"
            >
              {categoria.nome}
              <button
                type="button"
                onClick={() => onRemove(categoria.nome)}
                className="text-coral transition hover:text-coral/75"
                title={`Remover ${categoria.nome}`}
                disabled={loading}
              >
                <Trash2 size={15} />
              </button>
            </span>
          ))
        )}
      </div>
    </section>
  );
}
