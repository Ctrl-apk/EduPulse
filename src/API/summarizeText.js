export async function summarizeText(text) {
  try {
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mistral-7b-instruct", 
        messages: [
          { role: "system", content: "You are an expert summarizer of academic lectures." },
          { role: "user", content: `Summarize the following lecture notes:\n\n${text}` },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error("Unexpected API response structure.");
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error during summarization:", error);
    throw new Error("Failed to generate summary.");
  }
}
