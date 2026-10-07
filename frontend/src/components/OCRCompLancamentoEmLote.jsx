import React, { useState } from "react";
import { Upload, Trash2, CheckCircle, Loader2, FileText } from "lucide-react";

export default function OCRCompLancamentoEmLote({ categorias = [], onSalvarLote, loading }) {
  const [itensProcessados, setItensProcessados] = useState([]);
  const [carregandoOcr, setCarregandoOcr] = useState(false);

  const handleFileUpload = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length === 0) return;

    setCarregandoOcr(true);

    const requisicoes = selectedFiles.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("https://api-java-o922.onrender.com/api/ocr/processar", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();

          // Retorna apenas os dados extraídos automaticamente
          return {
            tempId: Math.random().toString(),
            data: data.data || new Date().toISOString().split("T")[0],
            valor: data.valor !== undefined ? data.valor : 0,
            operacao: data.operacao || "despesa",
            categoria: data.categoria || (categorias.length > 0 ? (categorias[0].nome || categorias[0]) : "Outros"),
            observacao: data.observacao || "Comprovante OCR",
            ativo: true,
          };
        } else {
          console.error("Erro no servidor ao processar arquivo:", file.name);
        }
      } catch (error) {
        console.error("Erro ao processar comprovante:", file.name, error);
      }
      return null;
    });

    const resultados = await Promise.all(requisicoes);
    const novosItens = resultados.filter((item) => item !== null);

    setItensProcessados((prev) => [...prev, ...novosItens]);
    setCarregandoOcr(false);
    event.target.value = "";
  };

  const handleRemover = (id) => {
    setItensProcessados((prev) => prev.filter((item) => item.tempId !== id));
  };

  const handleSubmit = () => {
    if (itensProcessados.length === 0) return;

    // Envia apenas os dados limpos para a API persistir no PostgreSQL
    const dadosParaSalvar = itensProcessados.map(({ tempId, ...resto }) => resto);

    onSalvarLote(dadosParaSalvar, () => {
      setItensProcessados([]); // Limpa a lista após salvar
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Importação de Comprovantes por OCR
      </h2>

      {/* Área de Upload */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 mb-6 hover:bg-gray-100 transition">
        <input
          type="file"
          multiple
          accept="image/*,application/pdf"
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload-input"
          disabled={carregandoOcr || loading}
        />
        <label htmlFor="file-upload-input" className="cursor-pointer flex flex-col items-center">
          <Upload className="w-10 h-10 text-gray-400 mb-2" />
          <span className="text-sm font-medium text-gray-600">
            Clique para selecionar os comprovantes para leitura
          </span>
          <span className="text-xs text-gray-400 mt-1">Imagens (PNG, JPG) ou PDF — As imagens não serão armazenadas</span>
        </label>
      </div>

      {/* Spinner de Carregamento */}
      {carregandoOcr && (
        <div className="flex items-center justify-center gap-2 my-4 text-blue-600 font-medium">
          <Loader2 className="animate-spin" /> Extraindo dados dos comprovantes...
        </div>
      )}

      {/* Tabela de Conferência (Apenas Leitura) */}
      {itensProcessados.length > 0 && (
        <div>
          <h3 className="text-md font-medium text-gray-700 mb-3">
            Confira os dados extraídos automaticamente ({itensProcessados.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-100 text-sm text-gray-600">
                  <th className="p-3">Data</th>
                  <th className="p-3">Operação</th>
                  <th className="p-3">Valor (R$)</th>
                  <th className="p-3">Categoria</th>
                  <th className="p-3">Observação</th>
                  <th className="p-3 text-center">Remover</th>
                </tr>
              </thead>
              <tbody>
                {itensProcessados.map((item) => (
                  <tr key={item.tempId} className="border-b hover:bg-gray-50 text-sm">
                    <td className="p-3 font-medium text-gray-700">
                      {item.data ? new Date(item.data + 'T00:00:00').toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        item.operacao === 'receita' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {item.operacao.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-gray-800">
                      R$ {Number(item.valor).toFixed(2)}
                    </td>
                    <td className="p-3 text-gray-600">
                      {item.categoria}
                    </td>
                    <td className="p-3 text-gray-600">
                      {item.observacao}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleRemover(item.tempId)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Descartar item da lista"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
            >
              <CheckCircle className="w-5 h-5" /> Confirmar e Salvar no Banco
            </button>
          </div>
        </div>
      )}
    </div>
  );
}