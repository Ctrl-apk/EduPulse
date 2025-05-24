import axios from 'axios';

export const generateQuiz = async (req, res) => {
  const { summary } = req.body;

  if (!summary) {
    return res.status(400).json({ error: 'Summary is required' });
  }

  // Clear and detailed prompt for generating insightful quiz questions
  const prompt = `
You are an expert quiz generator.

Create a high-quality, insightful quiz consisting of exactly 3 multiple-choice questions based on the following educational content:

"""
${summary}
"""

Please follow these instructions:
1. Each question must focus on key concepts or facts from the text.
2. Mix conceptual understanding with factual recall.
3. Provide 4 options (A, B, C, D) for each question: one correct answer and three plausible but incorrect distractors.
4. Clearly indicate which option is correct.
5. Format your response as a valid JSON array in this format:

[
  {
    "question": "Your question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "The correct option text"
  },
  ...
]
`;

  try {
    const response = await axios.post(
      'https://api.perplexity.ai/chat/completions',
      {
        model: 'sonar-pro', // or your preferred Perplexity model
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response.data?.choices?.[0]?.message?.content;

    let quiz;
    try {
      quiz = JSON.parse(content);
    } catch (parseError) {
      console.warn('JSON parsing failed, attempting eval fallback:', parseError);
      quiz = eval(content); // fallback for non-strict JSON formats
    }

    if (!Array.isArray(quiz)) {
      throw new Error('Generated quiz is not an array');
    }

    res.status(200).json({ quiz });
  } catch (error) {
    console.error('Perplexity Quiz Generation Error:', error.message || error);
    res.status(500).json({ error: 'Failed to generate quiz from Perplexity API' });
  }
};
