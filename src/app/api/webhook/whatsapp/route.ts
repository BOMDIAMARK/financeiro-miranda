import { NextRequest, NextResponse } from "next/server";
import {
  extractTextFromMessage,
  isTriggered,
  hasImage,
  sendMessage,
  downloadMedia,
  TRIGGER_PREFIX,
  type EvolutionMessage,
} from "@/lib/whatsapp";
import { parseReceiptImage } from "@/lib/receipt-parser";
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
    if (!isTriggered(text) && !hasImage(msg)) {
      return NextResponse.json({ ok: true, reason: "not triggered" });
    }

    // If triggered without image, send help
    if (isTriggered(text) && !hasImage(msg)) {
      const command = text.replace(TRIGGER_PREFIX, "").trim().toLowerCase();

      if (command === "ajuda" || command === "" || command === "help") {
        await sendMessage(
          sender,
          `🤖 *Bot Financeiro Miranda*

Comandos disponíveis:
• Envie uma *foto de comprovante* com a legenda \`${TRIGGER_PREFIX}\` para registrar automaticamente
• \`${TRIGGER_PREFIX} ajuda\` — mostra este menu

O bot vai:
1. Ler o comprovante com IA
2. Salvar a imagem no Google Drive
3. Registrar na planilha financeira`
        );
      }

      return NextResponse.json({ ok: true });
    }

    // Process image with trigger caption
    if (hasImage(msg) && isTriggered(text)) {
      await sendMessage(sender, "⏳ Processando comprovante...");

      try {
        // Download image from WhatsApp
        const imageBuffer = await downloadMedia(msg.key.id);
        const base64 = imageBuffer.toString("base64");

        // Parse with AI
        const parsed = await parseReceiptImage(base64);

        // Upload to Drive
        const driveResult = await uploadReceiptToDrive(
          imageBuffer,
          `whatsapp_${Date.now()}.jpg`,
          "image/jpeg"
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
