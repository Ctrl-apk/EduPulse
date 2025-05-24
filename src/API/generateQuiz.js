import axios from 'axios';

export async function generateQuiz(summaryText) {
  try {
    const response = await axios.post('http://localhost:5000/api/quiz', {
      summary: summaryText,
    });

    const quiz = response.data.quiz;

    if (!Array.isArray(quiz)) {
      throw new Error("Unexpected API response structure.");
    }

    return quiz;
  } catch (error) {
    console.error("Error generating quiz:", error.response?.data || error.message);
    throw new Error("Failed to generate quiz.");
  }
}
