import { useEffect, useState } from "react";
import OCRCompLancamentoEmLote from "../components/OCRCompLancamentoEmLote.jsx";
import Toast from "../components/Toast.jsx";
import { criarLancamento, listarCategorias } from "../services/api.js";

export default function OCRLancamentoEmLote() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    carregarCategorias();
  }, []);

  function showToast(message, type = "success") {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 2800);
  }

  async function carregarCategorias() {
    try {
      setLoading(true);
      const dados = await listarCategorias();
      setCategorias(Array.isArray(dados) ? dados : []);
    } catch {
      showToast("Não foi possível carregar as categorias.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleSalvarLote(itens, onSuccess) {
    try {
      setLoading(true);
      for (const item of itens) {
        const payload = {
          valor: parseFloat(item.valor),
          categoria: item.categoria,
          operacao: item.operacao,
          observacao: item.observacao,
          comprovante: item.fileRaw || null,
          ativo: true,
        };
        await criarLancamento(payload);
      }
      showToast("Lote de lançamentos salvo com sucesso!");
      onSuccess();
    } catch (error) {
      showToast(
        error.response?.data?.message || "Erro ao salvar os lançamentos em lote.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Toast message={toast?.message} type={toast?.type} />
      <div className="max-w-5xl mx-auto mt-6 p-4">
        <OCRCompLancamentoEmLote
          categorias={categorias}
          onSalvarLote={handleSalvarLote}
          loading={loading}
        />
      </div>
    </>
  );
}