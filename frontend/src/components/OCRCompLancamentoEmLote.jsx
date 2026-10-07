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

      const previewUrl = file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null;

      try {
        const response = await fetch("https://api-java-o922.onrender.com/api/ocr/processar", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          return {
            tempId: Math.random().toString(),
            fileRaw: file,
            previewUrl: previewUrl,
            valor: data.valor || 0,
            observacao: data.recebedor
              ? `Pago a: ${data.recebedor}`
              : data.pagador
              ? `Recebido de: ${data.pagador}`
              : "Comprovante OCR",
            categoria: categorias.length > 0 ? (categorias[0].nome || categorias[0]) : "",
            operacao: "despesa",
            ativo: true,
          };
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

  const handleItemChange = (id, campo, valor) => {
    setItensProcessados((prev) =>
      prev.map((item) => (item.tempId === id ? { ...item, [campo]: valor } : item))
    );
  };

  const handleRemover = (id) => {
    setItensProcessados((prev) => {
      const itemParaRemover = prev.find((item) => item.tempId === id);
      if (itemParaRemover?.previewUrl) {
        URL.revokeObjectURL(itemParaRemover.previewUrl);
      }
      return prev.filter((item) => item.tempId !== id);
    });
  };

  const handleSubmit = () => {
    if (itensProcessados.length === 0) return;
    onSalvarLote(itensProcessados, () => {
      itensProcessados.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      });
      setItensProcessados([]);
    });
  };

return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Importação de Comprovantes por OCR
      </h2>

      {/* Área de Upload Múltiplo */}
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
            Clique para selecionar vários comprovantes de uma vez
          </span>
          <span className="text-xs text-gray-400 mt-1">Imagens (PNG, JPG) ou PDF</span>
        </label>
      </div>

      {/* Indicador de Carregamento */}
      {carregandoOcr && (
        <div className="flex items-center justify-center gap-2 my-4 text-blue-600 font-medium">
          <Loader2 className="animate-spin" /> Processando comprovantes com OCR...
        </div>
      )}

      {/* Tabela de Prévia */}
      {itensProcessados.length > 0 && (
        <div>
          <h3 className="text-md font-medium text-gray-700 mb-3">
            Revise os lançamentos antes de salvar ({itensProcessados.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-100 text-sm text-gray-600">
                  <th className="p-3 text-center">Preview</th>
                  <th className="p-3">Valor (R$)</th>
                  <th className="p-3">Operação</th>
                  <th className="p-3">Categoria</th>
                  <th className="p-3">Observação / Recebedor</th>
                  <th className="p-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {itensProcessados.map((item) => (
                  <tr key={item.tempId} className="border-b hover:bg-gray-50 text-sm">
                    <td className="p-2 text-center">
                      {item.previewUrl ? (
                        <a href={item.previewUrl} target="_blank" rel="noopener noreferrer">
                          <img
                            src={item.previewUrl}
                            alt="Prévia"
                            className="w-10 h-10 object-cover rounded border mx-auto hover:scale-105 transition-transform"
                          />
                        </a>
                      ) : (
                        <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded text-gray-400 mx-auto">
                          <FileText className="w-5 h-5" />
                        </div>
                      )}
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        step="0.01"
                        value={item.valor}
                        onChange={(e) => handleItemChange(item.tempId, "valor", e.target.value)}
                        className="border rounded p-1 w-28"
                      />
                    </td>
                    <td className="p-2">
                      <select
                        value={item.operacao}
                        onChange={(e) => handleItemChange(item.tempId, "operacao", e.target.value)}
                        className="border rounded p-1"
                      >
                        <option value="despesa">Despesa</option>
                        <option value="receita">Receita</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <select
                        value={item.categoria}
                        onChange={(e) => handleItemChange(item.tempId, "categoria", e.target.value)}
                        className="border rounded p-1 w-full"
                      >
                        {categorias.map((cat, idx) => {
                          const nomeCat = typeof cat === "string" ? cat : cat.nome;
                          return (
                            <option key={idx} value={nomeCat}>
                              {nomeCat}
                            </option>
                          );
                        })}
                      </select>
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={item.observacao}
                        onChange={(e) => handleItemChange(item.tempId, "observacao", e.target.value)}
                        className="border rounded p-1 w-full"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => handleRemover(item.tempId)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Remover"
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
              className="flex items-center gap-2 bg-red-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600 transition disabled:opacity-50"
            >
              <CheckCircle className="w-5 h-5" /> Salvar Todos os Lançamentos
            </button>
          </div>
        </div>
      )}
    </div>
  );
}