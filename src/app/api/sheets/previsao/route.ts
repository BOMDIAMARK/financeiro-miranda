import { NextRequest, NextResponse } from "next/server";
import { updatePrevisaoStatus } from "@/lib/sheets";

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { row, status, dataPgto } = body as {
      row: number;
      status: string;
      dataPgto?: string;
    };

    if (!row || !status) {
      return NextResponse.json(
        { error: "Campos obrigatórios: row, status" },
        { status: 400 }
      );
    }

    const result = await updatePrevisaoStatus(row, status, dataPgto);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
