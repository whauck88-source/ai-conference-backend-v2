export default async function handler(req, res) {
  // CORS headers — allow calls from anywhere (artifact, PWA, etc.)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { provider, prompt, apiKey } = req.body;

  if (!provider || !prompt) {
    return res.status(400).json({ error: "Missing provider or prompt" });
  }

  try {
    let text = "";

    if (provider === "openai") {
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "gpt-4o",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const d = await r.json();
      if (d.error) throw new Error(d.error.message);
      text = d.choices?.[0]?.message?.content || "Sem resposta.";

    } else if (provider === "gemini") {
      const r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 1000 },
          }),
        }
      );
      const d = await r.json();
      if (d.error) throw new Error(d.error.message);
      text = d.candidates?.[0]?.content?.parts?.[0]?.text || "Sem resposta.";

    } else if (provider === "xai") {
      const r = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "grok-2-latest",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const d = await r.json();
      if (d.error) throw new Error(d.error.message);
      text = d.choices?.[0]?.message?.content || "Sem resposta.";

    } else if (provider === "perplexity") {
      const r = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "llama-3.1-sonar-large-128k-online",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const d = await r.json();
      if (d.error) throw new Error(d.error.message);
      text = d.choices?.[0]?.message?.content || "Sem resposta.";

    } else if (provider === "claude") {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const d = await r.json();
      if (d.error) throw new Error(d.error.message);
      text = d.content?.[0]?.text || "Sem resposta.";

    } else {
      return res.status(400).json({ error: `Provider desconhecido: ${provider}` });
    }

    return res.status(200).json({ text });

  } catch (err) {
    console.error(`[${provider}] error:`, err.message);
    return res.status(500).json({ error: err.message });
  }
}
