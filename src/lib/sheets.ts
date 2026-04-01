import { google } from "googleapis";
import { getAuthedClient } from "./google-auth";

const SPREADSHEET_ID = process.env.SPREADSHEET_ID!;

// Sheet GIDs mapped to names (from the published spreadsheet)
export const SHEET_NAMES = {
  DASHBOARD: "📊 Dashboard",
  PREVISAO: "📅 Previsão",
  ENTRADAS: "📥 Entradas",
  SAIDAS: "📤 Saídas",
  DIVIDAS: "💳 Dívidas",
  ANALISE: "📈 Análise",
} as const;

async function getSheetsClient() {
  const auth = await getAuthedClient();
  return google.sheets({ version: "v4", auth });
}

// ─── READ ───────────────────────────────────────────────

export async function readSheet(sheetName: string, range: string) {
  const sheets = await getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${sheetName}'!${range}`,
  });
  return res.data.values || [];
}

export async function readDashboard() {
  const rows = await readSheet(SHEET_NAMES.DASHBOARD, "A1:I50");
  return rows;
}

export async function readPrevisao() {
  const rows = await readSheet(SHEET_NAMES.PREVISAO, "A4:K40");
  return rows;
}

export async function readEntradas() {
  const rows = await readSheet(SHEET_NAMES.ENTRADAS, "A3:H40");
  return rows;
}

export async function readSaidas() {
  const rows = await readSheet(SHEET_NAMES.SAIDAS, "A3:J130");
  return rows;
}

export async function readDividas() {
  const rows = await readSheet(SHEET_NAMES.DIVIDAS, "A3:N12");
  return rows;
}

// ─── WRITE ──────────────────────────────────────────────

export async function appendToSheet(sheetName: string, range: string, values: string[][]) {
  const sheets = await getSheetsClient();
  const res = await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${sheetName}'!${range}`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values },
  });
  return res.data;
}

export async function updateCell(sheetName: string, range: string, values: string[][]) {
  const sheets = await getSheetsClient();
  const res = await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${sheetName}'!${range}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values },
  });
  return res.data;
}

// ─── ENTRADAS (Receitas) ────────────────────────────────

export interface EntradaInput {
  data: string; // DD/MM/YYYY
  categoria: string;
  valor: string; // "1.500,00"
  fonte: string;
  tipoRecebimento: string;
  responsavel: string;
  observacoes?: string;
}

export async function addEntrada(input: EntradaInput) {
  // Find next empty row
  const existing = await readEntradas();
  const nextRow = existing.length + 4; // header is row 3, data starts row 4

  const values = [[
    (existing.length + 1).toString(), // #
    input.data,
    input.categoria,
    input.valor,
    input.fonte,
    input.tipoRecebimento,
    input.responsavel,
    input.observacoes || "",
  ]];

  return appendToSheet(SHEET_NAMES.ENTRADAS, `A${nextRow}:H${nextRow}`, values);
}

// ─── SAIDAS (Despesas) ──────────────────────────────────

export interface SaidaInput {
  data: string;
  categoria: string;
  subcategoria: string;
  valor: string;
  descricao: string;
  responsavel: string;
  formaPgto: string;
  fixoVariavel: string;
  observacoes?: string;
}

export async function addSaida(input: SaidaInput) {
  const existing = await readSaidas();
  // Filter empty rows to get actual count
  const filledRows = existing.filter(r => r.some(cell => cell && cell.trim()));
  const nextRow = filledRows.length + 4;

  const values = [[
    (filledRows.length + 1).toString(),
    input.data,
    input.categoria,
    input.subcategoria,
    input.valor,
    input.descricao,
    input.responsavel,
    input.formaPgto,
    input.fixoVariavel,
    input.observacoes || "",
  ]];

  return appendToSheet(SHEET_NAMES.SAIDAS, `A${nextRow}:J${nextRow}`, values);
}

// ─── PREVISAO STATUS UPDATE ─────────────────────────────

export async function updatePrevisaoStatus(rowNumber: number, status: string, dataPgto?: string) {
  // Column H = Status, Column I = Data Pgto Real (row offset: header at row 3)
  const sheetRow = rowNumber + 3;
  const values = [[status, dataPgto || ""]];
  return updateCell(SHEET_NAMES.PREVISAO, `H${sheetRow}:I${sheetRow}`, values);
}
