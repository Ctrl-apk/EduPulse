import axios from 'axios';

export const generateQuiz = async (req, res) => {
  const { summary } = req.body;

  if (!summary) {
    console.error('❌ No summary provided in request body');
    return res.status(400).json({ error: 'Summary is required' });
  }

  console.log('✅ Received summary for quiz generation');
  console.log('🔎 Summary preview:', summary.slice(0, 100) + '...');

  const prompt = `
You are an expert quiz generator.

Create a high-quality, insightful quiz consisting of around 10-15 multiple-choice questions based on the following educational content:

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
  }
]

IMPORTANT: Output ONLY the JSON array. Do NOT include any markdown, explanations, or extra text.
`;

  try {
    const response = await axios.post(
      'https://api.perplexity.ai/chat/completions',
      {
        model: 'sonar-pro',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    let content = response?.data?.choices?.[0]?.message?.content;
    console.log('🎯 Perplexity API responded with content:', content);

    // Remove markdown code block wrappers if present
    if (content && content.trim().startsWith('```')) {
      content = content.replace(/``````/g, '').trim();
    }

    let quiz;
    try {
      quiz = JSON.parse(content);
    } catch (parseError) {
      console.error('❌ JSON parsing failed. Content:', content);
      return res.status(500).json({ error: 'Quiz content format is invalid', details: parseError.message });
    }

    if (!Array.isArray(quiz)) {
      console.error('❌ Quiz is not an array:', quiz);
      return res.status(500).json({ error: 'Generated quiz is not in correct format' });
    }

    console.log('✅ Quiz generated successfully with', quiz.length, 'questions');
    res.status(200).json({ quiz });

  } catch (error) {
    console.error('❌ Failed to generate quiz from Perplexity API');

    if (error.response) {
      console.error('API Status:', error.response.status);
      console.error('API Error Response:', error.response.data);
    } else {
      console.error('Error Message:', error.message);
    }

    res.status(500).json({ error: 'Failed to generate quiz from Perplexity API' });
  }
};
