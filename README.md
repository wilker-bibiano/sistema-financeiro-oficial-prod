# Controle Financeiro Pessoal

Aplicacao web para registrar receitas, despesas, categorias e visualizar extrato usando React, Vite, Tailwind CSS, Node.js, Express e Google Sheets API.

## Estrutura

```txt
frontend/  Aplicacao React
backend/   API Express integrada ao Google Sheets
```

## O que voce precisa instalar

1. Node.js LTS: https://nodejs.org
2. Uma conta Google
3. Uma planilha no Google Sheets
4. Um projeto no Google Cloud com a Google Sheets API ativada

## Como configurar o Google Sheets

1. Crie uma planilha no Google Sheets.
2. Crie duas abas com estes nomes exatos:
   - `lancamentos`
   - `categorias`
3. Copie o ID da planilha. Ele fica na URL:

```txt
https://docs.google.com/spreadsheets/d/ID_DA_PLANILHA/edit
```

4. No Google Cloud Console, crie um projeto.
5. Ative a API "Google Sheets API".
6. Crie uma Service Account.
7. Gere uma chave JSON para essa Service Account.
8. Compartilhe a planilha com o e-mail da Service Account, com permissao de editor.

## Variaveis de ambiente

Crie o arquivo `backend/.env` copiando `backend/.env.example`:

```env
PORT=3333
GOOGLE_SHEET_ID=cole_o_id_da_planilha_aqui
GOOGLE_CLIENT_EMAIL=service-account@projeto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSUA_CHAVE_PRIVADA\n-----END PRIVATE KEY-----\n"
```

Crie o arquivo `frontend/.env` copiando `frontend/.env.example`:

```env
VITE_API_URL=http://localhost:3333
```

## Como rodar

Instale as dependencias:

```bash
npm install
npm run install:all
```

Rode frontend e backend juntos:

```bash
npm run dev
```

Acesse:

```txt
http://localhost:5173
```

API:

```txt
http://localhost:3333
```

## Endpoints

```txt
GET  /lancamentos
POST /lancamentos
GET  /categorias
POST /categorias
DELETE /categorias/:nome
```

## Exemplo de lancamento

```json
{
  "tipo": "receita",
  "valor": 1200,
  "categoria": "Salario",
  "observacao": "Pagamento mensal"
}
```
