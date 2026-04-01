import { NextRequest, NextResponse } from "next/server";
import { addEntrada, type EntradaInput } from "@/lib/sheets";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as EntradaInput;

    if (!body.data || !body.valor || !body.categoria) {
      return NextResponse.json(
        { error: "Campos obrigatórios: data, valor, categoria" },
        { status: 400 }
      );
    }

    const result = await addEntrada(body);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
