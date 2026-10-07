import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://api-java-o922.onrender.com",
  timeout: 60000 // 60 segundos para suportar o cold start do Render
});

export async function listarCategorias() {
  const { data } = await api.get("/categorias");
  return data;
}

export async function criarCategoria(nome) {
  const { data } = await api.post("/categorias", { nome });
  return data;
}

export async function removerCategoria(nomeOuId) {
  await api.delete(`/categorias/${encodeURIComponent(nomeOuId)}`);
}

export async function listarLancamentos() {
  const { data } = await api.get("/lancamentos");
  return data;
}

export async function criarLancamento(payload) {
  // Se o payload contiver um ficheiro/comprovativo, envia via Multipart FormData
  if (payload.comprovante instanceof File) {
    const formData = new FormData();
    formData.append("valor", payload.valor);
    formData.append("operacao", payload.operacao);
    formData.append("categoria", payload.categoria);
    formData.append("observacao", payload.observacao || "");
    formData.append("comprovante", payload.comprovante);

    const { data } = await api.post("/lancamentos", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return data;
  }

  // Caso contrário, envia como JSON standard
  const { data } = await api.post("/lancamentos", payload);
  return data;
}

export async function deletarLancamento(id) {
  await api.delete(`/lancamentos/${id}`);
}

export async function editarLancamento(id, payload) {
  const { data } = await api.put(`/lancamentos/${id}`, payload);
  return data;
}