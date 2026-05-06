import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3333"
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
