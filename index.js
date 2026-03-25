export default function Home() {
  return (
    <div style={{ fontFamily: "monospace", padding: 40, background: "#080808", color: "#e0e0e0", minHeight: "100vh" }}>
      <h1>🧠 AI Conference — Backend</h1>
      <p style={{ marginTop: 16, color: "#666" }}>Proxy API rodando. Endpoint: <code style={{ color: "#D97757" }}>/api/proxy</code></p>
      <p style={{ marginTop: 8, color: "#444", fontSize: 12 }}>Providers suportados: openai, gemini, xai, perplexity, claude</p>
    </div>
  );
}
