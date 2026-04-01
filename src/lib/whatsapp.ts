const EVOLUTION_URL = process.env.EVOLUTION_API_URL || "http://localhost:8080";
const EVOLUTION_KEY = process.env.EVOLUTION_API_KEY || "";
const INSTANCE = process.env.EVOLUTION_INSTANCE || "evolution";

// Gatilho: mensagem deve comecar com "#financeiro" para ativar o bot
export const TRIGGER_PREFIX = "#financeiro";

interface EvolutionMessage {
  key: {
    remoteJid: string;
    fromMe: boolean;
    id: string;
  };
  message?: {
    conversation?: string;
    extendedTextMessage?: { text: string };
    imageMessage?: {
      mimetype: string;
      caption?: string;
      jpegThumbnail?: string;
    };
    documentMessage?: {
      mimetype: string;
      title?: string;
      caption?: string;
      fileName?: string;
    };
    documentWithCaptionMessage?: {
      message?: {
        documentMessage?: {
          mimetype: string;
          title?: string;
          caption?: string;
          fileName?: string;
        };
      };
    };
  };
  messageType?: string;
}

export function extractTextFromMessage(msg: EvolutionMessage): string {
  return (
    msg.message?.conversation ||
    msg.message?.extendedTextMessage?.text ||
    msg.message?.imageMessage?.caption ||
    msg.message?.documentMessage?.caption ||
    msg.message?.documentWithCaptionMessage?.message?.documentMessage?.caption ||
    ""
  );
}

export function isTriggered(text: string): boolean {
  return text.toLowerCase().startsWith(TRIGGER_PREFIX);
}

export function hasImage(msg: EvolutionMessage): boolean {
  return msg.messageType === "imageMessage" || !!msg.message?.imageMessage;
}

export function hasDocument(msg: EvolutionMessage): boolean {
  return (
    msg.messageType === "documentMessage" ||
    msg.messageType === "documentWithCaptionMessage" ||
    !!msg.message?.documentMessage ||
    !!msg.message?.documentWithCaptionMessage
  );
}

export function isPDFDocument(msg: EvolutionMessage): boolean {
  const doc = msg.message?.documentMessage || msg.message?.documentWithCaptionMessage?.message?.documentMessage;
  if (!doc) return false;
  return doc.mimetype === "application/pdf" || (doc.fileName || doc.title || "").toLowerCase().endsWith(".pdf");
}

export function hasMedia(msg: EvolutionMessage): boolean {
  return hasImage(msg) || isPDFDocument(msg);
}

export function getMediaType(msg: EvolutionMessage): "image" | "pdf" | null {
  if (hasImage(msg)) return "image";
  if (isPDFDocument(msg)) return "pdf";
  return null;
}

export async function sendMessage(to: string, text: string) {
  const res = await fetch(`${EVOLUTION_URL}/message/sendText/${INSTANCE}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: EVOLUTION_KEY,
    },
    body: JSON.stringify({
      number: to,
      text,
    }),
  });

  if (!res.ok) {
    throw new Error(`Evolution API error: ${res.status} ${await res.text()}`);
  }

  return res.json();
}

export async function downloadMedia(messageId: string): Promise<Buffer> {
  const res = await fetch(
    `${EVOLUTION_URL}/chat/getBase64FromMediaMessage/${INSTANCE}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: EVOLUTION_KEY,
      },
      body: JSON.stringify({ message: { key: { id: messageId } } }),
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to download media: ${res.status}`);
  }

  const data = await res.json();
  return Buffer.from(data.base64, "base64");
}

export type { EvolutionMessage };
