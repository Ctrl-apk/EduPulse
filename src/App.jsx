import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Dashboard";
import Summary from "./pages/Summary";
import Quiz from "./pages/Quiz";
import History from "./pages/History";
import Navbar from "./components/NavBar";
import QuizHistory from "./components/QuizHistory";
import Chatbot from "./components/Chatbot";


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/history" element={<History />} />
        <Route path="/quiz-history" element={<QuizHistory />} />
      </Routes>
      <Chatbot />
    </>
  );
}

export default App;
