import React, { useState, useEffect } from "react";
import FileUploader from "../components/FileUploader";
import { summarizeText } from "../API/summarizeText";

const Home = () => {
  const [lectureNotes, setLectureNotes] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

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

  const handleFileContent = (content) => {
    if (typeof content === "string") {
      setLectureNotes(content);
      setSummary("");
      setError("");
    } else {
      setLectureNotes("PDF uploaded. Parsing will be implemented soon.");
    }
  };

  const handleGenerateSummary = async () => {
    if (!lectureNotes) return;
    setLoading(true);
    setError("");
    setSummary("");

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

      {lectureNotes && (
        <div className="mt-4">
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            onClick={handleGenerateSummary}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Summary"}
          </button>
        </div>
      )}

      {summary && (
        <div className="mt-6 p-4 border rounded bg-green-50">
          <h2 className="font-semibold mb-2 text-green-700">Summary:</h2>
          <p>{summary}</p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Previous Summaries</h2>
          {history.map((entry, index) => (
            <div key={index} className="mb-4 p-4 border rounded bg-white shadow-sm">
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
