// controllers/chatbotController.js
import fetch from 'node-fetch';

export async function askPerplexity(req, res) {
  const { message } = req.body;

  const prompt = `You are an expert educational chatbot. Reply concisely: ${message}`;

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        model: "sonar-pro",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();

    const reply = data?.choices?.[0]?.message?.content || "Sorry, no response.";
    res.json({ reply });
  } catch (err) {
    console.error("Perplexity chatbot error:", err);
    res.status(500).json({ message: "Chatbot error" });
  }
}
