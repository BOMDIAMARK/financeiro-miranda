import { NextRequest, NextResponse } from "next/server";
import { addSaida, type SaidaInput } from "@/lib/sheets";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SaidaInput;

    if (!body.data || !body.valor || !body.categoria || !body.descricao) {
      return NextResponse.json(
        { error: "Campos obrigatórios: data, valor, categoria, descricao" },
        { status: 400 }
      );
    }

    const result = await addSaida(body);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
