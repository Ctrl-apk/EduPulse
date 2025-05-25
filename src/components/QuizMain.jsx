import React, { useState } from "react";
import FileUploader from "./FileUploader";
import QuizList from "./QuizList";
import { summarizeText } from "../API/summarizeText";

// Helper for PDF summary API call
export async function summarizePdfFile(file) {
  const formData = new FormData();
  formData.append("pdf", file);

  const res = await fetch("http://localhost:5000/api/summary/generate", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error(`Failed to summarize PDF: ${res.statusText}`);

  const data = await res.json();
  return data.summary;
}

// Gamification helpers
const getLevel = (score) => {
  if (score >= 80) return "Quiz Master 🏆";
  if (score >= 60) return "Quiz Pro ⭐";
  if (score >= 40) return "Quiz Novice 🎓";
  return "Beginner 🌱";
};

const getBadge = (score) => {
  if (score >= 80) return "🏅";
  if (score >= 60) return "🥈";
  if (score >= 40) return "🥉";
  return "";
};

const POINTS_PER_CORRECT = 10;
const BONUS_STREAK = 5;

const QuizMain = ({ quizHistory, setQuizHistory }) => {
  const [lectureNotes, setLectureNotes] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [quiz, setQuiz] = useState([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState("");

  // Gamification states
  const [userAnswers, setUserAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState({});
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Handles file upload or text content
  const handleFileContent = async (content, file) => {
    if (typeof content === "string") {
      setLectureNotes(content);
      setSummary("");
      setError("");
      setQuiz([]);
      resetQuizGamify();
    } else if (file && file.type === "application/pdf") {
      setLoading(true);
      setError("");
      setSummary("");
      setQuiz([]);
      resetQuizGamify();
      try {
        const pdfSummary = await summarizePdfFile(file);
        setSummary(pdfSummary);
        setLectureNotes("(PDF content summarized)");
      } catch (err) {
        setError("Failed to summarize PDF: " + err.message);
      } finally {
        setLoading(false);
      }
    } else {
      setLectureNotes("Unsupported file format or no content");
    }
  };

  // Handles summary generation from text notes
  const handleGenerateSummary = async () => {
    if (!lectureNotes) {
      setError("Please upload or enter lecture notes first.");
      return;
    }
    setLoading(true);
    setError("");
    setSummary("");
    setQuiz([]);
    resetQuizGamify();
    try {
      const result = await summarizeText(lectureNotes);
      setSummary(result);
    } catch (err) {
      setError("Failed to generate summary: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handles quiz generation from summary or notes
  const handleGenerateQuiz = async () => {
    if (!summary && !lectureNotes) {
      setQuizError("Please provide summary or lecture notes first.");
      return;
    }
    setQuizLoading(true);
    setQuizError("");
    resetQuizGamify();
    try {
      const res = await fetch("http://localhost:5000/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary: summary || lectureNotes }),
      });
      if (!res.ok) throw new Error("Failed to generate quiz");
      const data = await res.json();
      setQuiz(data.quiz || []);
    } catch (err) {
      setQuizError("Quiz error: " + err.message);
    } finally {
      setQuizLoading(false);
    }
  };

  // Gamification: handle answer selection
  const handleAnswer = (qIdx, selected, correct) => {
    if (userAnswers[qIdx]) return; // Prevent double answer
    const newUserAnswers = { ...userAnswers, [qIdx]: selected };
    setUserAnswers(newUserAnswers);
    setShowFeedback({ ...showFeedback, [qIdx]: true });

    // Score and streak logic
    let newScore = score;
    let newStreak = streak;
    let newMaxStreak = maxStreak;
    if (selected === correct) {
      newScore += POINTS_PER_CORRECT;
      newStreak += 1;
      if (newStreak > 2) newScore += BONUS_STREAK; // Bonus for 3+ streak
      if (newStreak > newMaxStreak) newMaxStreak = newStreak;
    } else {
      newStreak = 0;
    }
    setScore(newScore);
    setStreak(newStreak);
    setMaxStreak(newMaxStreak);

    // Completion check
    if (Object.keys(newUserAnswers).length === quiz.length) {
      setCompleted(true);
      // Add to quiz history
      setQuizHistory(prev => [
        ...prev,
        {
          score: newScore,
          maxStreak: newMaxStreak,
          date: new Date().toLocaleString(),
          level: getLevel(newScore),
        }
      ]);
    }
  };

  // Reset all gamified quiz state and fetch new quiz
  const handleNewQuiz = () => {
    setUserAnswers({});
    setShowFeedback({});
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCompleted(false);
    handleGenerateQuiz();
  };

  // Just reset state, don't fetch new quiz (for file/summary changes)
  const resetQuizGamify = () => {
    setUserAnswers({});
    setShowFeedback({});
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCompleted(false);
  };

  return (
    <main className="ep-main">
      <h1 className="ep-title gaming-title text-4xl mb-6 text-center">
        EduPulse <span className="level">{getBadge(score)}</span>
      </h1>

      <FileUploader onFileContent={handleFileContent} />

      {lectureNotes && (
        <section className="ep-section">
          <h2 className="ep-section-title">Lecture Notes Preview:</h2>
          <p>{lectureNotes}</p>
        </section>
      )}

      <div className="ep-btn-row">
        <button
          className={`glow-btn${loading ? " ep-btn-disabled" : ""}`}
          onClick={handleGenerateSummary}
          disabled={loading}
        >
          {loading ? "Generating Summary..." : "Generate Summary"}
        </button>
        <button
          className={`glow-btn${quizLoading ? " ep-btn-disabled" : ""}`}
          onClick={handleGenerateQuiz}
          disabled={quizLoading}
        >
          {quizLoading ? "Generating Quiz..." : "Generate Quiz"}
        </button>
        {quiz.length > 0 && (
          <button className="glow-btn" onClick={handleNewQuiz}>
            New Quiz
          </button>
        )}
      </div>

      {summary && (
        <section className="ep-section">
          <h2 className="ep-section-title" style={{ color: "#ff00cc" }}>Summary:</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>{summary}</pre>
        </section>
      )}

      {error && (
        <div className="ep-alert ep-alert-error">{error}</div>
      )}
      {quizError && (
        <div className="ep-alert ep-alert-error">{quizError}</div>
      )}

      {quiz.length > 0 && (
        <section className="ep-section">
          <h3 className="ep-section-title" style={{ color: "#00ffe7" }}>Generated Quiz</h3>
          <div className="progress-bar mb-3">
            <div
              className="progress-bar-inner"
              style={{
                width: `${(Object.keys(userAnswers).length / quiz.length) * 100}%`,
              }}
            ></div>
          </div>
          <div className="ep-quiz-stats">
            <span>Score: <strong>{score}</strong></span>
            <span className="streak">Streak: <strong>{streak}</strong> | Max: {maxStreak}</span>
            <span className="level">Level: <strong>{getLevel(score)}</strong></span>
          </div>
          <QuizList
            quiz={quiz}
            userAnswers={userAnswers}
            showFeedback={showFeedback}
            handleAnswer={handleAnswer}
            streak={streak}
            BONUS_STREAK={BONUS_STREAK}
          />
          {completed && (
            <div className="ep-quiz-complete">
              <h4 className="text-xl font-bold mb-2 level">Quiz Complete!</h4>
              <div className="mb-2">Final Score: <strong>{score}</strong> {getBadge(score)}</div>
              <div className="mb-2">Max Streak: <strong>{maxStreak}</strong></div>
              <div className="mb-2">Level: <strong>{getLevel(score)}</strong></div>
              <div className="mb-2">
                {score === quiz.length * 10
                  ? "Perfect! You're a genius! 🎉"
                  : score >= quiz.length * 7
                  ? "Great job! Keep it up! 🚀"
                  : score > 0
                  ? "Nice try! Practice makes perfect! 💡"
                  : "Don't give up! Try again! 💪"}
              </div>
              <button
                className="mt-2 py-2 px-4 rounded glow-btn"
                onClick={handleNewQuiz}
              >
                Play Again (New Quiz)
              </button>
            </div>
          )}
        </section>
      )}
    </main>
  );
};

export default QuizMain;
