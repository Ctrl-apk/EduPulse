import { useEffect, useState } from "react";

const QuizHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("edupulse_quiz_history")) || [];
    setHistory(savedHistory);
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Quiz History</h1>
      {history.length === 0 && <p>No quizzes taken yet.</p>}

      {history.map((quiz, index) => (
        <div key={index} className="mb-6 p-4 border rounded bg-white shadow-sm">
          <p className="text-gray-500 text-sm mb-2">
            {new Date(quiz.timestamp).toLocaleString()}
          </p>
          <div>
            <strong>Score: </strong>{quiz.score || "N/A"}
          </div>
          <div className="mt-2">
            <strong>Questions & Answers:</strong>
            <ul className="list-disc list-inside">
              {quiz.questions?.map((q, i) => (
                <li key={i}>
                  <p><strong>Q:</strong> {q.question}</p>
                  <p><strong>Your answer:</strong> {q.userAnswer}</p>
                  <p><strong>Correct answer:</strong> {q.correctAnswer}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuizHistory;
