import "dotenv/config";
import { google } from "googleapis";
import { randomUUID } from "node:crypto";

const sheetId = process.env.GOOGLE_SHEET_ID;
const lancamentosSheet = "lancamentos";
const categoriasSheet = "categorias";

function getSheetsClient() {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!sheetId || !process.env.GOOGLE_CLIENT_EMAIL || !privateKey) {
    const error = new Error("Configure GOOGLE_SHEET_ID, GOOGLE_CLIENT_EMAIL e GOOGLE_PRIVATE_KEY no .env.");
    error.status = 500;
    throw error;
  }

  const normalizedPrivateKey = normalizePrivateKey(privateKey);

  if (normalizedPrivateKey.length < 1000 || !normalizedPrivateKey.includes("-----BEGIN PRIVATE KEY-----")) {
    const error = new Error("GOOGLE_PRIVATE_KEY parece incompleta. Copie a private_key inteira do JSON da Service Account.");
    error.status = 500;
    throw error;
  }

  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: normalizedPrivateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });

  return google.sheets({ version: "v4", auth });
}

function normalizePrivateKey(privateKey) {
  const withRealNewlines = privateKey.replace(/\\n/g, "\n").trim();
  const begin = withRealNewlines.indexOf("-----BEGIN PRIVATE KEY-----");
  const endMarker = "-----END PRIVATE KEY-----";
  const end = withRealNewlines.indexOf(endMarker);

  if (begin === -1 || end === -1) {
    return withRealNewlines;
  }

  return `${withRealNewlines.slice(begin, end + endMarker.length)}\n`;
}

// Garante que a primeira linha de cada aba tenha os nomes das colunas esperadas.
async function ensureHeaders(sheets, tabName, headers) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${tabName}!A1:Z1`
  });

  if (!response.data.values?.length) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${tabName}!A1`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [headers] }
    });
  }
}

export async function getLancamentos() {
  const sheets = getSheetsClient();
  await ensureHeaders(sheets, lancamentosSheet, ["id", "data", "tipo", "valor", "categoria", "observacao"]);

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${lancamentosSheet}!A2:F`
  });

  return (response.data.values || []).map(([id, data, tipo, valor, categoria, observacao]) => ({
    id,
    data,
    tipo,
    valor: Number(valor),
    categoria,
    observacao: observacao || ""
  }));
}

export async function addLancamento({ tipo, valor, categoria, observacao }) {
  const sheets = getSheetsClient();
  await ensureHeaders(sheets, lancamentosSheet, ["id", "data", "tipo", "valor", "categoria", "observacao"]);

  const lancamento = {
    id: randomUUID(),
    data: new Date().toISOString(),
    tipo,
    valor,
    categoria,
    observacao
  };

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${lancamentosSheet}!A:F`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[lancamento.id, lancamento.data, lancamento.tipo, lancamento.valor, lancamento.categoria, lancamento.observacao]]
    }
  });

  return lancamento;
}

export async function getCategorias() {
  const sheets = getSheetsClient();
  await ensureHeaders(sheets, categoriasSheet, ["nome"]);

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${categoriasSheet}!A2:A`
  });

  return (response.data.values || [])
    .flat()
    .filter(Boolean)
    .map((nome) => ({ nome }));
}

export async function addCategoria(nome) {
  const sheets = getSheetsClient();
  await ensureHeaders(sheets, categoriasSheet, ["nome"]);
  const categorias = await getCategorias();

  const exists = categorias.some((categoria) => categoria.nome.toLowerCase() === nome.toLowerCase());
  if (exists) {
    const error = new Error("Categoria ja cadastrada.");
    error.status = 409;
    throw error;
  }

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${categoriasSheet}!A:A`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [[nome]] }
  });

  return { nome };
}

export async function deleteCategoria(nome) {
  const sheets = getSheetsClient();
  await ensureHeaders(sheets, categoriasSheet, ["nome"]);

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${categoriasSheet}!A2:A`
  });

  const values = response.data.values || [];
  const rowIndex = values.findIndex(([categoria]) => categoria?.toLowerCase() === nome.toLowerCase());

  if (rowIndex === -1) {
    const error = new Error("Categoria nao encontrada.");
    error.status = 404;
    throw error;
  }

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: sheetId,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: await getSheetNumericId(sheets, categoriasSheet),
              dimension: "ROWS",
              startIndex: rowIndex + 1,
              endIndex: rowIndex + 2
            }
          }
        }
      ]
    }
  });
}

async function getSheetNumericId(sheets, title) {
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
  const sheet = spreadsheet.data.sheets.find((item) => item.properties.title === title);

  if (!sheet) {
    const error = new Error(`A aba "${title}" nao existe na planilha.`);
    error.status = 500;
    throw error;
  }

  return sheet.properties.sheetId;
}