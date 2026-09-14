import { useEffect, useState } from "react";
import CategoryManager from "../components/CategoryManager.jsx";
import TransactionManager from "../components/TransactionManager.jsx";
import LancamentoForm from "../components/LancamentoForm.jsx";
import Toast from "../components/Toast.jsx";
import { criarCategoria, criarLancamento, listarCategorias, removerCategoria } from "../services/api.js";

// export default function LancamentoPage({ tipo }) {
export default function LancamentoPage() {
  const [categorias, setCategorias] = useState([]);
  const [operacoes, setOperacoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    carregarCategorias();
    carregarOperacoes();
  }, []);

  function showToast(message, type = "success") {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 2800);
  }

  async function carregarCategorias() {
    try {
      setLoading(true);
      // setCategorias(await listarCategorias());
      const dados = await listarCategorias();
      setCategorias(Array.isArray(dados) ? dados : []);
    } catch {
      showToast("Nao foi possivel carregar as categorias.", "error");
    } finally {
      setLoading(false);
    }
  }

  // Carrega as operações do dropdown 
    function carregarOperacoes() { 
      setOperacoes([{ nome: "receita" }, { nome: "despesa" }]);

  }

  async function handleSave(payload) {
    try {
      setLoading(true);
      await criarLancamento(payload);
      await carregarCategorias();
      showToast("Lancamento salvo com sucesso.");
    } catch (error) {
      showToast(error.response?.data?.message || "Erro ao salvar lancamento.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddCategoria(nome) {
    try {
      setLoading(true);
      await criarCategoria(nome);
      await carregarCategorias();
      showToast("Categoria adicionada.");
    } catch (error) {
      showToast(error.response?.data?.message || "Erro ao adicionar categoria.", "error");
    } finally {
      setLoading(false);
    }
  }

  

  async function handleRemoveCategoria(nome) {
    try {
      setLoading(true);
      await removerCategoria(nome);
      await carregarCategorias();
      showToast("Categoria removida.");
    } catch (error) {
      showToast(error.response?.data?.message || "Erro ao remover categoria.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Toast message={toast?.message} type={toast?.type} />
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">      
        <LancamentoForm categorias={categorias} operacoes={operacoes} onSave={handleSave} loading={loading} />
        <CategoryManager categorias={categorias} onAdd={handleAddCategoria} onRemove={handleRemoveCategoria} loading={loading} />
     
      </div>
    </>
  );
}
