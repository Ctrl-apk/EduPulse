import React, { useState } from "react";
import FileUploader from "../components/FileUploader";
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

const Home = () => {
  const [lectureNotes, setLectureNotes] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [quiz, setQuiz] = useState([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState("");

  // For user quiz interaction
  const [userAnswers, setUserAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState({});

  // Handles file upload or text content
  const handleFileContent = async (content, file) => {
    if (typeof content === "string") {
      setLectureNotes(content);
      setSummary("");
      setError("");
      setQuiz([]);
      setUserAnswers({});
      setShowFeedback({});
    } else if (file && file.type === "application/pdf") {
      setLoading(true);
      setError("");
      setSummary("");
      setQuiz([]);
      setUserAnswers({});
      setShowFeedback({});
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
    setUserAnswers({});
    setShowFeedback({});
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
    setUserAnswers({});
    setShowFeedback({});
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

  // Reset quiz state (optional: add a "Reset Quiz" button if you want)
  const handleResetQuiz = () => {
    setUserAnswers({});
    setShowFeedback({});
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Welcome to EduPulse</h1>

      <FileUploader onFileContent={handleFileContent} />

      {lectureNotes && (
        <div className="mt-6 p-4 border rounded bg-gray-50 whitespace-pre-wrap">
          <h2 className="font-semibold mb-2">Lecture Notes Preview:</h2>
          <p>{lectureNotes}</p>
        </div>
      )}

      <div className="mt-4 flex gap-4">
        <button
          className={`py-2 px-4 rounded transition bg-blue-600 text-white hover:bg-blue-700 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleGenerateSummary}
          disabled={loading}
        >
          {loading ? "Generating Summary..." : "Generate Summary"}
        </button>

        <button
          className={`py-2 px-4 rounded transition bg-green-600 text-white hover:bg-green-700 ${
            quizLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleGenerateQuiz}
          disabled={quizLoading}
        >
          {quizLoading ? "Generating Quiz..." : "Generate Quiz"}
        </button>

        {quiz.length > 0 && (
          <button
            className="py-2 px-4 rounded transition bg-yellow-600 text-white hover:bg-yellow-700"
            onClick={handleResetQuiz}
          >
            Reset Quiz
          </button>
        )}
      </div>

      {summary && (
        <div className="mt-6 p-4 border rounded bg-green-50">
          <h2 className="font-semibold mb-2 text-green-700">Summary:</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>{summary}</pre>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {quizError && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">{quizError}</div>
      )}

      {quiz.length > 0 && (
        <div className="mt-6 p-4 border rounded bg-yellow-50">
          <h3 className="font-semibold mb-2">Generated Quiz</h3>
          <ol className="list-decimal ml-6">
            {quiz.map((q, i) => (
              <li key={i} className="mb-6">
                <div className="font-semibold mb-2">{q.question}</div>
                <ul className="list-disc ml-5">
                  {q.options.map((opt, idx) => (
                    <li key={idx} className="mb-1">
                      <button
                        className={`py-1 px-3 rounded border transition ${
                          userAnswers[i] === opt
                            ? userAnswers[i] === q.answer
                              ? "bg-green-200 border-green-600"
                              : "bg-red-200 border-red-600"
                            : "bg-white border-gray-400 hover:bg-gray-200"
                        }`}
                        disabled={!!userAnswers[i]}
                        onClick={() => {
                          setUserAnswers({ ...userAnswers, [i]: opt });
                          setShowFeedback({ ...showFeedback, [i]: true });
                        }}
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
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {userAnswers[i] === q.answer
                      ? "Correct!"
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
        </div>
      )}
    </div>
  );
};

export default Home;
