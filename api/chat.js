export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  if (!process.env.GROQ_KEY) {
    return res.status(500).json({ error: { message: "GROQ_KEY não configurada no servidor" } });
  }

  try {
    const { messages, system, max_tokens } = req.body;

    const groqMessages = [
      ...(system ? [{ role: "system", content: system }] : []),
      ...messages.map(m => ({ role: m.role, content: m.content }))
    ];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_KEY?.trim()}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: groqMessages,
        max_tokens: max_tokens || 1000
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error });
    }

    const text = data.choices?.[0]?.message?.content || "";
    res.status(200).json({ content: [{ text }] });
  } catch (e) {
    res.status(500).json({ error: { message: e.message } });
  }
}
