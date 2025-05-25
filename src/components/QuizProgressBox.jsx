import React from "react";

const QuizProgressBox = React.memo(({ quizHistory }) => (
  <aside className="ep-progress-box progress-box-gaming">
    <h3 className="font-bold mb-2" style={{ color: "#ffd700" }}>Your Progress</h3>
    {quizHistory.length === 0 ? (
      <div className="text-gray-400">No quizzes yet. Play to track your progress!</div>
    ) : (
      <ul className="text-sm">
        {quizHistory.slice(-5).reverse().map((entry, idx) => (
          <li key={idx} className="mb-2 p-2 rounded bg-[#232526cc]">
            <div>
              <span className="font-semibold" style={{ color: "#00ffe7" }}>
                {entry.level}
              </span>
              <span className="ml-2 text-gray-300">{entry.date}</span>
            </div>
            <div>
              <span>Score: <strong>{entry.score}</strong></span>
              <span className="ml-4">Max Streak: <strong>{entry.maxStreak}</strong></span>
            </div>
          </li>
        ))}
      </ul>
    )}
  </aside>
));

export default QuizProgressBox;
