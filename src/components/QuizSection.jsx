import React from "react";

const QuizSection = ({ quiz, onGenerateQuiz }) => {
  return (
    <div className="bg-white rounded-2xl shadow p-6 mt-6">
      <h3 className="text-2xl font-semibold text-neutral-800 mb-4">Quiz Generator</h3>
      <button
        onClick={onGenerateQuiz}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Generate Quiz
      </button>
      {quiz && (
        <div className="mt-4">
          {quiz.map((q, i) => (
            <div key={i} className="mb-3">
              <p className="font-medium">{q.question}</p>
              <ul className="list-disc ml-5">
                {q.options.map((opt, j) => (
                  <li key={j}>{opt}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizSection;
