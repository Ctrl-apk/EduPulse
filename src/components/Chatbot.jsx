import { useState } from "react";
import { MessageCircle } from "lucide-react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi! How can I help you with your study material today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const botText = data.reply || "Sorry, I didn't get that.";

      setMessages((prev) => [...prev, { from: "bot", text: botText }]);
    } catch (error) {
      console.error("Error fetching bot reply:", error);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Oops! Something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={toggleChat}
        className="bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700"
        aria-label="Open chatbot"
      >
        <MessageCircle />
      </button>

      {isOpen && (
        <div className="w-80 h-96 bg-white rounded-lg shadow-2xl mt-2 flex flex-col">
          <div className="p-2 border-b font-semibold text-center bg-blue-600 text-white rounded-t">
            EduBot
          </div>
          <div className="flex-1 p-2 overflow-y-auto text-sm">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`my-1 p-2 rounded-md max-w-[80%] ${
                  msg.from === "user"
                    ? "ml-auto bg-blue-100"
                    : "mr-auto bg-gray-100"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="my-1 p-2 rounded-md max-w-[80%] mr-auto bg-gray-200 italic text-gray-600">
                EduBot is typing...
              </div>
            )}
          </div>
          <div className="p-2 border-t flex">
            <input
              className="flex-1 text-sm px-2 py-1 border rounded-l"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-3 rounded-r hover:bg-blue-700 disabled:bg-blue-400"
              disabled={loading}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
