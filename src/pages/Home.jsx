import React, { useState, useEffect } from "react";
import FileUploader from "../components/FileUploader";

// Helper to send text summary request (for plain text notes)
import { summarizeText } from "../API/summarizeText";

export async function summarizePdfFile(file) {
  const formData = new FormData();
  formData.append("pdf", file);

  const res = await fetch("http://localhost:5000/api/summary", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Failed to summarize PDF: ${res.statusText}`);
  }

  const data = await res.json();
  return data.summary;
}

const Home = () => {
  const [lectureNotes, setLectureNotes] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  // Quiz state
  const [quiz, setQuiz] = useState([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState("");

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("edupulse_history")) || [];
    setHistory(savedHistory);
  }, []);

  const saveToHistory = (noteText, summaryText) => {
    const entry = {
      timestamp: new Date().toISOString(),
      note: noteText,
      summary: summaryText,
    };
    const updatedHistory = [entry, ...history];
    setHistory(updatedHistory);
    localStorage.setItem("edupulse_history", JSON.stringify(updatedHistory));
  };

  // Handle file content coming from FileUploader component
  const handleFileContent = async (content, file) => {
    // content is string for text files, else file for PDF
    if (typeof content === "string") {
      // Plain text file or text pasted
      setLectureNotes(content);
      setSummary("");
      setError("");
      setQuiz([]);
    } else if (file && file.type === "application/pdf") {
      // PDF file uploaded - generate summary directly
      setLoading(true);
      setError("");
      setSummary("");
      setQuiz([]);
      try {
        const pdfSummary = await summarizePdfFile(file);
        setLectureNotes(`(PDF content summarized)`);
        setSummary(pdfSummary);
        saveToHistory("(PDF content)", pdfSummary);
      } catch (err) {
        console.error("PDF summary error:", err);
        setError("Failed to summarize PDF.");
      } finally {
        setLoading(false);
      }
    } else {
      setLectureNotes("Unsupported file format or no content");
    }
  };

  // Generate summary from typed/uploaded text (not PDF)
  const handleGenerateSummary = async () => {
    if (!lectureNotes) return;
    setLoading(true);
    setError("");
    setSummary("");
    setQuiz([]);
    try {
      const result = await summarizeText(lectureNotes);
      setSummary(result);
      saveToHistory(lectureNotes, result);
    } catch (err) {
      console.error("Summary error:", err);
      setError("Failed to generate summary.");
    } finally {
      setLoading(false);
    }
  };

  // Generate quiz based on current summary or lecture notes
  const handleGenerateQuiz = async () => {
    setQuizLoading(true);
    setQuizError("");
    try {
      const res = await fetch("http://localhost:5000/api/quiz/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: summary || lectureNotes }),
      });
      if (!res.ok) throw new Error("Failed to generate quiz");
      const data = await res.json();
      setQuiz(data.questions || []);
    } catch (err) {
      setQuizError(err.message);
    } finally {
      setQuizLoading(false);
    }
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
          className={`py-2 px-4 rounded transition-colors duration-200 ${
            lectureNotes
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
          onClick={handleGenerateSummary}
          disabled={!lectureNotes || loading}
        >
          {loading ? "Generating Summary..." : "Generate Summary"}
        </button>

        <button
          className={`py-2 px-4 rounded transition-colors duration-200 ${
            (summary || lectureNotes.length > 0)
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
          onClick={handleGenerateQuiz}
          disabled={quizLoading || (!summary && !lectureNotes)}
        >
          {quizLoading ? "Generating Quiz..." : "Generate Quiz"}
        </button>
      </div>

      {summary && (
        <div className="mt-6 p-4 border rounded bg-green-50">
          <h2 className="font-semibold mb-2 text-green-700">Summary:</h2>
          <p>{summary}</p>
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
              <li key={i} className="mb-2">{q.question}</li>
            ))}
          </ol>
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Previous Summaries</h2>
          {history.map((entry, index) => (
            <div
              key={index}
              className="mb-4 p-4 border rounded bg-white shadow-sm"
            >
              <p className="text-gray-500 text-sm mb-2">
                {new Date(entry.timestamp).toLocaleString()}
              </p>
              <div className="mb-2">
                <strong className="block">Note:</strong>
                <p className="whitespace-pre-wrap">{entry.note}</p>
              </div>
              <div>
                <strong className="block text-green-700">Summary:</strong>
                <p className="whitespace-pre-wrap">{entry.summary}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
