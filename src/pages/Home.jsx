import React, { useState, useEffect } from "react";
import QuizMain from "../components/QuizMain";

const Home = () => {
  const [quizHistory, setQuizHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("quizHistory");
    if (saved) setQuizHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("quizHistory", JSON.stringify(quizHistory));
  }, [quizHistory]);

  return (
    <div className="gaming-bg min-h-screen">
      <div className="ep-container">
        <QuizMain quizHistory={quizHistory} setQuizHistory={setQuizHistory} />
      </div>
    </div>
  );
};

export default Home;