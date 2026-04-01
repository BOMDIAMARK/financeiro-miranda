import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens } from "@/lib/google-auth";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Missing code parameter" }, { status: 400 });
  }

  try {
    const tokens = await exchangeCodeForTokens(code);

    // Show the refresh token to the user so they can add it to .env.local
    return new NextResponse(
      `<!DOCTYPE html>
      <html lang="pt-BR">
      <head><title>Autorizado!</title>
      <style>
        body { font-family: system-ui; max-width: 600px; margin: 40px auto; padding: 20px; }
        code { background: #f1f5f9; padding: 8px 12px; border-radius: 6px; display: block; word-break: break-all; margin: 12px 0; }
        .success { color: #16a34a; }
      </style>
      </head>
      <body>
        <h1 class="success">Autorizado com sucesso!</h1>
        <p>Copie o <strong>refresh_token</strong> abaixo e adicione no arquivo <code>.env.local</code>:</p>
        <code>GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}</code>
        <p>Depois reinicie o servidor (<code>npm run dev</code>).</p>
        <p><strong>Access Token:</strong></p>
        <code style="font-size:11px">${tokens.access_token?.substring(0, 40)}...</code>
        <p><a href="/">Voltar ao Dashboard</a></p>
      </body>
      </html>`,
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Failed to exchange code", details: message }, { status: 500 });
  }
}
