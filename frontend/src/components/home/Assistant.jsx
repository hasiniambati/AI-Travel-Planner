import { useState } from "react";
import { assistantChat } from "../../services/api.js";
import { chatWithGeminiAPI, getGeminiApiKey } from "../../services/geminiService";
import "./Assistant.css";

export default function Assistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hi! I am your AI Travel Assistant 🤖. Ask me about a destination, hotel, place, budget or trip plan." }
  ]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput("");
    setMessages((m) => [...m, { sender: "user", text }]);
    setLoading(true);

    // Retrieve active trip context
    let tripContext = null;
    const storedTrip = localStorage.getItem("userTrip") || localStorage.getItem("current_trip");
    if (storedTrip) {
      try {
        tripContext = JSON.parse(storedTrip)?.result || null;
      } catch (err) {
        console.error("Error parsing trip details in Assistant:", err);
      }
    }

    try {
      const activeKey = getGeminiApiKey();
      // 1. Try client-side Gemini call first if API Key is configured
      if (activeKey) {
        const reply = await chatWithGeminiAPI(text, messages, tripContext);
        setMessages((m) => [...m, { sender: "ai", text: reply }]);
      } else {
        // 2. If no client key, try calling the backend API (which might have GEMINI_API_KEY)
        const d = await assistantChat(text, tripContext || { page: window.location.pathname });
        setMessages((m) => [...m, { sender: "ai", text: d.answer }]);
      }
    } catch (e) {
      setMessages((m) => [...m, { sender: "ai", text: `I could not fetch a response: ${e.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="assistant-container">
      {open && (
        <div className="chat-box">
          <div className="chat-header">
            <h3>✨ AI Travel Assistant</h3>
            <button onClick={() => setOpen(false)}>×</button>
          </div>
          <div className="chat-body">
            {messages.map((m, i) => (
              <div className={m.sender === "ai" ? "ai-message" : "user-message"} key={i}>
                {m.text}
              </div>
            ))}

            {loading && <div className="ai-message">Thinking...</div>}
          </div>
          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask anything about your trip..."
            />
            <button onClick={send}>Send</button>
          </div>
        </div>
      )}
      <button className="assistant-button" onClick={() => setOpen(!open)} title="AI Travel Assistant" style={{ fontSize: "28px" }}>
        🤖
      </button>
    </div>
  );
}
