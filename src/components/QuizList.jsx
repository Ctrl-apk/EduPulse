import React from "react";

const QuizList = ({
  quiz,
  userAnswers,
  showFeedback,
  handleAnswer,
  streak,
  BONUS_STREAK,
}) => (
  <ol className="ep-quiz-list">
    {quiz.map((q, i) => (
      <li key={i} className="ep-quiz-item">
        <div className="font-semibold mb-2">{q.question}</div>
        <ul className="ep-quiz-options">
          {q.options.map((opt, idx) => (
            <li key={idx}>
              <button
                className={`ep-quiz-btn glow-btn${
                  userAnswers[i] === opt
                    ? userAnswers[i] === q.answer
                      ? " ep-correct"
                      : " ep-wrong"
                    : ""
                }`}
                disabled={!!userAnswers[i]}
                onClick={() => handleAnswer(i, opt, q.answer)}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
        {showFeedback[i] && (
          <div
            className={`mt-2 font-semibold ${
              userAnswers[i] === q.answer
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {userAnswers[i] === q.answer
              ? (
                <>
                  Correct! 🎉
                  {streak > 2 && (
                    <span className="ml-2 badge">Streak Bonus! +{BONUS_STREAK}</span>
                  )}
                </>
              )
              : (
                <>
                  Incorrect. The correct answer is: <span className="underline">{q.answer}</span>
                </>
              )
            }
          </div>
        )}
      </li>
    ))}
  </ol>
);

export default React.memo(QuizList);
