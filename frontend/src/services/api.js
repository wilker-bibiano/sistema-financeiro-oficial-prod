import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://api-java-o922.onrender.com"
});

export async function listarCategorias() {
  const { data } = await api.get("/categorias");
  return data;
}

export async function criarCategoria(nome) {
  const { data } = await api.post("/categorias", { nome });
  return data;
}

export async function removerCategoria(nome) {
  await api.delete(`/categorias/${encodeURIComponent(nome)}`);
}

export async function listarLancamentos() {
  const { data } = await api.get("/lancamentos");
  return data;
}

export async function criarLancamento(payload) {
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