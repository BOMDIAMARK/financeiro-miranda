"use client";

import { useState, useEffect, useCallback } from "react";

export interface SheetData {
  dashboard: string[][];
  previsao: string[][];
  entradas: string[][];
  saidas: string[][];
  dividas: string[][];
  updatedAt: string;
}

// Parse "1.000,78" -> 1000.78
function parseBRL(value: string): number {
  if (!value || value.trim() === "") return 0;
  return parseFloat(value.replace(/\./g, "").replace(",", ".")) || 0;
}

export interface DashboardParsed {
  entradas: number;
  saidasReais: number;
  transferencias: number;
  saldoMes: number;
  dividas: number;
  percentComprometida: number;
  previstoMes: number;
  faltaPagar: number;
  saldoProjetado: number;
  marcos: { entradas: number; saidas: number; transferencias: number; saldo: number; transacoes: number };
  kamila: { entradas: number; saidas: number; transferencias: number; saldo: number; transacoes: number };
  categorias: { categoria: string; total: number; percentual: string; quantidade: number; marcos: number; kamila: number }[];
  previsoes: { id: number; dataPrevista: string; categoria: string; subcategoria: string; descricao: string; valor: number; responsavel: string; status: string; dataPgto: string; tipo: string; observacoes: string }[];
  dividasList: { id: number; credor: string; valorTotal: number; parcTotal: number; valorParcela: number; status: string; dataInicio: string; dataFim: string; parcPagas: number; saldoRestante: number; pagoEsteMes: boolean }[];
}

function parseDashboard(raw: SheetData): DashboardParsed {
  const d = raw.dashboard;

  // Row index 3 (0-indexed) has the KPI values
  const kpiRow = d[3] || [];
  const entradas = parseBRL(kpiRow[0]);
  const saidasReais = parseBRL(kpiRow[1]);
  const transferencias = parseBRL(kpiRow[2]);
  const saldoMes = parseBRL(kpiRow[3]);
  const dividas = parseBRL(kpiRow[4]);
  const percentComprometida = parseFloat((kpiRow[5] || "0").replace(",", ".").replace("%", "")) || 0;
  const previstoMes = parseBRL(kpiRow[6]);
  const faltaPagar = parseBRL(kpiRow[7]);

  // Projecao - row 45 (0-indexed)
  const projRow = d.find(r => r[0]?.includes("SALDO PROJETADO"));
  const saldoProjetado = projRow ? parseBRL(projRow[1]) : 0;

  // Responsaveis - rows 7-11
  const marcos = {
    entradas: parseBRL(d[7]?.[1]),
    saidas: parseBRL(d[8]?.[1]),
    transferencias: parseBRL(d[9]?.[1]),
    saldo: parseBRL(d[10]?.[1]),
    transacoes: parseInt(d[11]?.[1] || "0") || 0,
  };
  const kamila = {
    entradas: parseBRL(d[7]?.[3]),
    saidas: parseBRL(d[8]?.[3]),
    transferencias: parseBRL(d[9]?.[3]),
    saldo: parseBRL(d[10]?.[3]),
    transacoes: parseInt(d[11]?.[3] || "0") || 0,
  };

  // Categorias - rows 15-33
  const categorias = [];
  for (let i = 15; i <= 33; i++) {
    const row = d[i];
    if (!row || !row[0]) continue;
    categorias.push({
      categoria: row[0],
      total: parseBRL(row[1]),
      percentual: row[2] || "0,0%",
      quantidade: parseInt(row[3] || "0") || 0,
      marcos: parseBRL(d[i - 8]?.[6]),
      kamila: parseBRL(d[i - 8]?.[7]),
    });
  }

  // Previsoes
  const previsoes = raw.previsao
    .slice(1) // skip header
    .filter(r => r.length > 1 && r[0])
    .map(r => ({
      id: parseInt(r[0]) || 0,
      dataPrevista: r[1] || "",
      categoria: r[2] || "",
      subcategoria: r[3] || "",
      descricao: r[4] || "",
      valor: parseBRL(r[5]),
      responsavel: r[6] || "",
      status: r[7] || "",
      dataPgto: r[8] || "",
      tipo: r[9] || "",
      observacoes: r[10] || "",
    }));

  // Dividas
  const dividasList = raw.dividas
    .slice(1) // skip header
    .filter(r => r.length > 1 && r[1])
    .map(r => ({
      id: parseInt(r[0]) || 0,
      credor: r[1] || "",
      valorTotal: parseBRL(r[2]),
      parcTotal: parseInt(r[3]) || 0,
      valorParcela: parseBRL(r[4]),
      status: r[5] || "",
      dataInicio: r[6] || "",
      dataFim: r[7] || "",
      parcPagas: parseInt(r[8]) || 0,
      saldoRestante: parseBRL(r[9]),
      pagoEsteMes: (r[12] || "").toLowerCase() === "sim",
    }));

  return {
    entradas, saidasReais, transferencias, saldoMes, dividas,
    percentComprometida, previstoMes, faltaPagar, saldoProjetado,
    marcos, kamila, categorias, previsoes, dividasList,
  };
}

export function useSheetData() {
  const [data, setData] = useState<DashboardParsed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string>("");

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/sheets/data");
      if (!res.ok) throw new Error("Falha ao carregar dados");
      const raw: SheetData = await res.json();
      setData(parseDashboard(raw));
      setUpdatedAt(raw.updatedAt);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, updatedAt, refresh };
}

export { parseBRL };
