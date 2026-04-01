import OpenAI from "openai";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_KEY || "" });
}

export interface ParsedReceipt {
  data: string; // DD/MM/YYYY
  valor: string; // "1.500,00"
  descricao: string;
  categoria: string;
  subcategoria: string;
  formaPgto: string;
  tipo: "entrada" | "saida";
  confianca: number; // 0-100
}

const CATEGORIAS_SAIDA = [
  "Alimentação", "Moradia", "Carro", "Transporte", "Saúde", "Educação",
  "Lazer/Entretenimento", "Internet/Telefone", "Assinaturas", "Roupas/Calçados",
  "Impostos/Taxas", "Igreja/Religião", "Filhos", "Compras Pessoais",
  "Dívidas/Empréstimos", "Serviços Profissionais", "Serviços Digitais",
  "Pagamentos Terceiros", "Outros",
];

const CATEGORIAS_ENTRADA = [
  "Salário", "Freelance", "Comissão", "Transferência Recebida",
  "Reembolso", "Investimento", "Outros",
];

const FORMAS_PGTO = ["PIX", "Cartão Crédito", "Cartão Débito", "Dinheiro", "Boleto", "Transferência"];

export async function parseReceiptImage(base64Image: string): Promise<ParsedReceipt> {
  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `Você é um assistente especialista em leitura de comprovantes financeiros brasileiros.
Analise a imagem do comprovante e extraia as informações financeiras.

Retorne APENAS um JSON válido (sem markdown, sem código) com estes campos:
{
  "data": "DD/MM/YYYY",
  "valor": "1.500,00" (formato brasileiro, sem R$),
  "descricao": "descrição curta da transação",
  "categoria": "uma das categorias listadas",
  "subcategoria": "subcategoria mais específica",
  "formaPgto": "forma de pagamento detectada",
  "tipo": "entrada" ou "saida",
  "confianca": 0 a 100 (quão confiante está na leitura)
}

Categorias de SAÍDA: ${CATEGORIAS_SAIDA.join(", ")}
Categorias de ENTRADA: ${CATEGORIAS_ENTRADA.join(", ")}
Formas de Pagamento: ${FORMAS_PGTO.join(", ")}

Regras:
- Se for PIX enviado, é "saida". PIX recebido é "entrada".
- Se for pagamento de boleto, é "saida".
- Valor sempre no formato brasileiro (1.500,00).
- Data sempre DD/MM/YYYY.
- Se não conseguir ler algum campo, use "Outros" ou deixe vazio.`,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Analise este comprovante e extraia os dados financeiros:",
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`,
              detail: "high",
            },
          },
        ],
      },
    ],
    max_tokens: 500,
    temperature: 0.1,
  });

  const content = response.choices[0]?.message?.content || "";

  // Clean potential markdown wrapping
  const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

  try {
    return JSON.parse(cleaned) as ParsedReceipt;
  } catch {
    throw new Error(`Failed to parse AI response: ${cleaned}`);
  }
}
