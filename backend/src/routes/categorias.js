import { Router } from "express";
import { addCategoria, deleteCategoria, getCategorias } from "../services/sheetsService.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const categorias = await getCategorias();
    res.json(categorias);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const nome = req.body.nome?.trim();

    if (!nome) {
      return res.status(400).json({ message: "Informe o nome da categoria." });
    }

    const categoria = await addCategoria(nome);
    res.status(201).json(categoria);
  } catch (error) {
    next(error);
  }
});

router.delete("/:nome", async (req, res, next) => {
  try {
    await deleteCategoria(req.params.nome);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
