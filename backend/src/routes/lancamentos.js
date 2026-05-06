import { Router } from "express";
import { addLancamento, getLancamentos } from "../services/sheetsService.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const lancamentos = await getLancamentos();
    res.json(lancamentos);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { tipo, valor, categoria, observacao } = req.body;

    if (!["receita", "despesa"].includes(tipo)) {
      return res.status(400).json({ message: "Tipo deve ser receita ou despesa." });
    }

    const valorNumerico = Number(valor);
    if (!valorNumerico || valorNumerico <= 0) {
      return res.status(400).json({ message: "Informe um valor maior que zero." });
    }

    if (!categoria?.trim()) {
      return res.status(400).json({ message: "Informe uma categoria." });
    }

    const lancamento = await addLancamento({
      tipo,
      valor: valorNumerico,
      categoria: categoria.trim(),
      observacao: observacao?.trim() || ""
    });

    res.status(201).json(lancamento);
  } catch (error) {
    next(error);
  }
});

export default router;
