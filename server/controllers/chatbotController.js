// controllers/chatbotController.js
import fetch from 'node-fetch';

export async function askPerplexity(req, res) {
  const { message } = req.body;

  const prompt = `
You are a legendary study quest guide, turning every question into an exciting challenge! Reply to the following as if you’re helping a player level up in the ultimate knowledge game. Make your answer concise, energetic, and motivating—like a game master giving hints, rewards, or encouragement.

${message}

Your mission: Make learning feel like unlocking achievements, collecting XP, and progressing to the next level. Keep it fun, focused, and inspiring!
`;

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
