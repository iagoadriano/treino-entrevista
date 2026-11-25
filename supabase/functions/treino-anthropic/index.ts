// treino-anthropic: proxy/cofre para a API Anthropic.
// A chave da Anthropic fica como secret no servidor (ANTHROPIC_API_KEY) e nunca
// chega ao navegador. Só usuários logados cujo e-mail está em ALLOWED_EMAILS podem
// chamar — assim ninguém mais gasta a chave.
//
// Secrets necessários (Supabase → Edge Functions → Secrets):
//   ANTHROPIC_API_KEY = sua chave sk-ant-...
//   ALLOWED_EMAILS    = email1@x.com,email2@y.com  (quem pode usar o cofre)
import { createClient } from "jsr:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  // 1) Quem está chamando? (o JWT já foi verificado pela plataforma)
  const authHeader = req.headers.get("Authorization") ?? "";
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) return json({ error: "nao_autenticado" }, 401);

  // 2) Esse e-mail pode usar a chave?
  const allowed = (Deno.env.get("ALLOWED_EMAILS") ?? "")
    .split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
  const email = (user.email ?? "").toLowerCase();
  if (!allowed.length || !allowed.includes(email)) {
    return json({ error: "email_nao_autorizado" }, 403);
  }

  // 3) A chave está configurada?
  const key = Deno.env.get("ANTHROPIC_API_KEY");
  if (!key) return json({ error: "chave_nao_configurada" }, 500);

  // 4) Monta a chamada à Anthropic
  let body: { prompt?: string; max_tokens?: number; model?: string };
  try { body = await req.json(); } catch { return json({ error: "corpo_invalido" }, 400); }
  const prompt = (body.prompt ?? "").toString();
  if (!prompt) return json({ error: "prompt_vazio" }, 400);
  const max_tokens = Math.min(4000, Math.max(200, Number(body.max_tokens) || 2000));
  const model = typeof body.model === "string" && body.model ? body.model : "claude-haiku-5-5";

  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model, max_tokens, messages: [{ role: "user", content: prompt }] }),
  });
  const data = await r.json().catch(() => ({ error: "resposta_invalida_da_anthropic" }));
  // Repassa o mesmo formato que o cliente já sabe ler (data.content[].text)
  return json(data, r.status);
});
