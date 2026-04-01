import { NextResponse } from "next/server";
import { readDashboard, readPrevisao, readEntradas, readSaidas, readDividas } from "@/lib/sheets";

export async function GET() {
  try {
    const [dashboard, previsao, entradas, saidas, dividas] = await Promise.all([
      readDashboard(),
      readPrevisao(),
      readEntradas(),
      readSaidas(),
      readDividas(),
    ]);

    return NextResponse.json({
      dashboard,
      previsao,
      entradas,
      saidas,
      dividas,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
