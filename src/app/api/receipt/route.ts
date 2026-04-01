import { NextRequest, NextResponse } from "next/server";
import { parseReceiptImage, parseReceiptPDF } from "@/lib/receipt-parser";
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

    // Parse receipt with AI (PDF or image)
    const isPDF = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const parsed = isPDF
      ? await parseReceiptPDF(base64)
      : await parseReceiptImage(base64);

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
    console.error("[receipt] Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    const stack = error instanceof Error ? error.stack : undefined;
    return NextResponse.json({ error: message, stack }, { status: 500 });
  }
}
