import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import lancamentosRoutes from "./routes/lancamentos.js";
import categoriasRoutes from "./routes/categorias.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "API do Controle Financeiro rodando.",
    frontend: "http://localhost:5173",
    endpoints: ["/health", "/lancamentos", "/categorias"]
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/lancamentos", lancamentosRoutes);
app.use("/categorias", categoriasRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Erro interno do servidor"
  });
});

app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});
