import { useState } from "react";
import { MessageCircle } from "lucide-react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "🕵️‍♂️ Welcome to the Mafia Lounge. How can I assist your studies today?",
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
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Oops! Something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans">
      <button
        onClick={toggleChat}
        className="mafia-glow-btn rounded-full p-3 shadow-lg flex items-center justify-center"
        aria-label="Open chatbot"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="mafia-chatbot-glass w-80 h-96 rounded-xl shadow-2xl mt-2 flex flex-col border-2 border-[#00ffe7]">
          <div className="flex items-center justify-center gap-2 p-2 border-b font-bold mafia-chatbot-header text-lg rounded-t">
            <span role="img" aria-label="mafia-hat">🕵️‍♂️</span> 
            <span>EduBot</span>
          </div>
          <div className="flex-1 p-2 overflow-y-auto text-sm">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`my-1 max-w-[80%] px-3 py-2 rounded-xl mafia-bubble ${
                  msg.from === "user"
                    ? "ml-auto mafia-user-bubble"
                    : "mr-auto mafia-bot-bubble"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="my-1 max-w-[80%] px-3 py-2 rounded-xl mafia-bubble mafia-bot-bubble italic">
                EduBot is typing...
              </div>
            )}
          </div>
          <div className="p-2 border-t flex mafia-chatbot-footer">
            <input
              className="flex-1 text-sm px-2 py-1 rounded-l bg-[#22223b] text-white border-none focus:ring-2 focus:ring-[#00ffe7] outline-none font-sans"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              disabled={loading}
              style={{ fontFamily: "inherit" }}
            />
            <button
              onClick={sendMessage}
              className="mafia-glow-btn px-4 rounded-r font-bold transition disabled:opacity-60"
              disabled={loading}
              style={{ fontFamily: "'Press Start 2P', cursive" }}
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
