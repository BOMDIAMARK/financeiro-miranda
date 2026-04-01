import { NextRequest, NextResponse } from "next/server";
import { parseReceiptImage } from "@/lib/receipt-parser";
import { uploadReceiptToDrive } from "@/lib/drive";
import { addEntrada, addSaida } from "@/lib/sheets";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const responsavel = (formData.get("responsavel") as string) || "";
    const autoSave = formData.get("autoSave") === "true";

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    // Convert file to buffer and base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");

    // Parse receipt with AI
    const parsed = await parseReceiptImage(base64);

    // Upload to Google Drive
    const driveResult = await uploadReceiptToDrive(buffer, file.name, file.type);

    // If autoSave, write directly to the sheet
    let sheetResult = null;
    if (autoSave) {
      if (parsed.tipo === "entrada") {
        sheetResult = await addEntrada({
          data: parsed.data,
          categoria: parsed.categoria,
          valor: parsed.valor,
          fonte: parsed.descricao,
          tipoRecebimento: parsed.formaPgto,
          responsavel,
          observacoes: `Comprovante: ${driveResult.webViewLink}`,
        });
      } else {
        sheetResult = await addSaida({
          data: parsed.data,
          categoria: parsed.categoria,
          subcategoria: parsed.subcategoria,
          valor: parsed.valor,
          descricao: parsed.descricao,
          responsavel,
          formaPgto: parsed.formaPgto,
          fixoVariavel: "Variável",
          observacoes: `Comprovante: ${driveResult.webViewLink}`,
        });
      }
    }

    return NextResponse.json({
      success: true,
      parsed,
      drive: driveResult,
      saved: autoSave,
      sheetResult,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
