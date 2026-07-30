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

## Aplicativo mobile (.NET MAUI)

A versao mobile fica em:

```txt
mobile/FinanceiroMobile
```

Ela usa a mesma arquitetura da versao web:

```txt
App MAUI -> Backend no Render -> Google Sheets
```

A chave do Google Sheets continua somente no backend. O aplicativo mobile chama apenas a API publica do Render.

### Configurar a URL do Render

Abra o arquivo:

```txt
mobile/FinanceiroMobile/Services/ApiConfig.cs
```

Troque:

```csharp
public const string BaseUrl = "https://COLE-SUA-URL-DO-RENDER.onrender.com";
```

pela URL real do seu backend no Render, sem barra no final. Exemplo:

```csharp
public const string BaseUrl = "https://meu-financeiro-api.onrender.com";
```

### Rodar pelo Visual Studio

1. Abra o arquivo `mobile/FinanceiroMobile/FinanceiroMobile.csproj` no Visual Studio.
2. Escolha o alvo de execucao:
   - Windows Machine para testar no PC.
   - Android Emulator para testar no emulador.
   - Um celular Android conectado por USB para testar no aparelho.
3. Clique em Run.

### Rodar pelo terminal

Para compilar a versao Windows:

```powershell
cd mobile/FinanceiroMobile
dotnet build -f net10.0-windows10.0.19041.0
```

Para Android, use o Visual Studio com emulador ou aparelho conectado. O app vai usar a URL publica do Render, entao funciona fora do PC desde que o backend esteja online.
