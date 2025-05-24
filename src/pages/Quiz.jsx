import React, { use, useState } from "react";
import { generateQuiz } from "../API/generateQuiz";
const Quiz = () => {
  const[inputText, setInputText] = useState("");
  const[quizText, setQuizText] = useState("");
  const[loading, setLoading] = useState(false);
  const[error, setError] = useState("");

  const handleGenerate = async () =>{
    if(!inputText.trim()) return;
    setLoading(true);
    setQuizText("")
    setError("");

    try{
      const quiz = await generateQuiz(inputText);
      setQuizText(quiz);
    } catch(err){
      setError("Quiz generation failed.");
    } finally{
      setLoading(false);
    }
  }

  const saveQuizToHistory = (quizData) =>{
    const existing = JSON.parse(localStorage.getItem("edulpulse_quiz_history")) || [];
    const updated = [quizData, ...existing];

    localStorage.setItem("edupulse_quiz_history", JSON.stringify(updated));
  }
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Generate Quiz</h1>

      <textarea
        rows={8}
        className="w-full border rounded p-2 mb-4"
        placeholder="Paste summary text here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />

      <button
        onClick={handleGenerate}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Quiz"}
      </button>

      {quizText && (
        <div className="mt-6 whitespace-pre-wrap bg-gray-50 p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">Quiz:</h2>
          {quizText}
        </div>
      )}

      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}

export default Quiz;
