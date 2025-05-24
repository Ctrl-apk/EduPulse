import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white shadow p-4 flex gap-4">
      <Link to="/" className="hover:underline">Home</Link>
      <Link to="/summary" className="hover:underline">Summary</Link>
      <Link to="/quiz" className="hover:underline">Quiz</Link>
      <Link to="/history" className="hover:underline">History</Link>
      <Link to="/quiz-history" className="hover:underline">Quiz History</Link>
    </nav>
  );
}

export default Navbar;
