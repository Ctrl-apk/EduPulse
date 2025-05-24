const PERPLEXITY_API_KEY = "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"

export async function generateQuiz(summaryText) {
  try {
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mistral-7b-instruct",
        messages: [
          { role: "system", content: "You are a quiz generator. Generate 5 MCQs based on the given summary." },
          { role: "user", content: `Generate 5 multiple choice questions with 4 options each from the following content:\n\n${summaryText}\n\nMark the correct answer.` },
        ],
        temperature: 0.7,
        max_tokens: 700,
      }),
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error("Unexpected API response structure.");
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz.");
  }
}
