import { NextRequest, NextResponse } from "next/server";
import {
  extractTextFromMessage,
  isTriggered,
  hasMedia,
  getMediaType,
  sendMessage,
  downloadMedia,
  TRIGGER_PREFIX,
  type EvolutionMessage,
} from "@/lib/whatsapp";
import { parseReceiptImage, parseReceiptPDF } from "@/lib/receipt-parser";
import { uploadReceiptToDrive } from "@/lib/drive";
import { addEntrada, addSaida } from "@/lib/sheets";

function formatParsedForWhatsApp(parsed: {
  tipo: string;
  data: string;
  valor: string;
  descricao: string;
  categoria: string;
  formaPgto: string;
  confianca: number;
}) {
  return `📋 *Comprovante lido com sucesso!*

📅 Data: ${parsed.data}
💰 Valor: R$ ${parsed.valor}
📝 Descrição: ${parsed.descricao}
📂 Categoria: ${parsed.categoria}
💳 Pagamento: ${parsed.formaPgto}
📊 Tipo: ${parsed.tipo === "entrada" ? "📥 Entrada" : "📤 Saída"}
🎯 Confiança: ${parsed.confianca}%

✅ Dados salvos na planilha!`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Evolution API sends different event types
    const event = body.event;

    // Only process incoming messages
    if (event !== "messages.upsert") {
      return NextResponse.json({ ok: true });
    }

    const msg = body.data as EvolutionMessage;

    // Ignore messages sent by us
    if (msg.key.fromMe) {
      return NextResponse.json({ ok: true });
    }

    const text = extractTextFromMessage(msg);
    const sender = msg.key.remoteJid;

    // Check trigger
    if (!isTriggered(text) && !hasMedia(msg)) {
      return NextResponse.json({ ok: true, reason: "not triggered" });
    }

    // If triggered without media, send help
    if (isTriggered(text) && !hasMedia(msg)) {
      const command = text.replace(TRIGGER_PREFIX, "").trim().toLowerCase();

      if (command === "ajuda" || command === "" || command === "help") {
        await sendMessage(
          sender,
          `🤖 *Bot Financeiro Miranda*

Comandos disponíveis:
• Envie uma *foto ou PDF de comprovante* com a legenda \`${TRIGGER_PREFIX}\` para registrar automaticamente
• \`${TRIGGER_PREFIX} ajuda\` — mostra este menu

O bot vai:
1. Ler o comprovante com IA (imagem ou PDF)
2. Salvar o arquivo no Google Drive
3. Registrar na planilha financeira`
        );
      }

      return NextResponse.json({ ok: true });
    }

    // Process image or PDF with trigger caption
    const mediaType = getMediaType(msg);
    if (mediaType && isTriggered(text)) {
      await sendMessage(sender, `⏳ Processando comprovante (${mediaType === "pdf" ? "PDF" : "imagem"})...`);

      try {
        // Download media from WhatsApp
        const mediaBuffer = await downloadMedia(msg.key.id);
        const base64 = mediaBuffer.toString("base64");

        // Parse with AI (PDF or image)
        const parsed = mediaType === "pdf"
          ? await parseReceiptPDF(base64)
          : await parseReceiptImage(base64);

        // Upload to Drive
        const ext = mediaType === "pdf" ? "pdf" : "jpg";
        const mime = mediaType === "pdf" ? "application/pdf" : "image/jpeg";
        const driveResult = await uploadReceiptToDrive(
          mediaBuffer,
          `whatsapp_${Date.now()}.${ext}`,
          mime
        );

        // Save to sheet
        if (parsed.tipo === "entrada") {
          await addEntrada({
            data: parsed.data,
            categoria: parsed.categoria,
            valor: parsed.valor,
            fonte: parsed.descricao,
            tipoRecebimento: parsed.formaPgto,
            responsavel: "",
            observacoes: `WhatsApp | Comprovante: ${driveResult.webViewLink}`,
          });
        } else {
          await addSaida({
            data: parsed.data,
            categoria: parsed.categoria,
            subcategoria: parsed.subcategoria,
            valor: parsed.valor,
            descricao: parsed.descricao,
            responsavel: "",
            formaPgto: parsed.formaPgto,
            fixoVariavel: "Variável",
            observacoes: `WhatsApp | Comprovante: ${driveResult.webViewLink}`,
          });
        }

        // Send confirmation
        await sendMessage(sender, formatParsedForWhatsApp(parsed));
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : "Erro desconhecido";
        await sendMessage(
          sender,
          `❌ Erro ao processar comprovante: ${errMsg}\n\nTente novamente ou registre pelo dashboard.`
        );
      }

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
