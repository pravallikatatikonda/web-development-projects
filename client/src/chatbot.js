import React, { useState } from "react";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");

  const handleAsk = async () => {
    if (!question.trim()) return;

    const userMsg = { from: "user", text: question };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch("http://localhost:5000/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      const botMsg = {
        from: "bot",
        text: data.answer,
        showFeedback: true,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "❌ Server error." },
      ]);
    }

    setQuestion("");
  };

  const handleFeedback = async (index, helpful) => {
    const botMsg = messages[index];
    try {
      await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answer: botMsg.text,
          helpful,
        }),
      });

      const updated = [...messages];
      updated[index].showFeedback = false;
      setMessages(updated);
    } catch {
      alert("❌ Feedback failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-xl bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4 text-center text-blue-700">
          🤖 AI FAQ Chatbot
        </h2>

        <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
          {messages.map((msg, i) => (
            <div key={i}>
              <div
                className={`text-sm text-${
                  msg.from === "user" ? "right" : "left"
                }`}
              >
                <span
                  className={`inline-block px-3 py-2 rounded-lg ${
                    msg.from === "user"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  {msg.text}
                </span>
              </div>

              {msg.from === "bot" && msg.showFeedback && (
                <div className="text-xs mt-1 text-gray-600">
                  Was this helpful?
                  <button
                    onClick={() => handleFeedback(i, true)}
                    className="ml-2 text-green-600 hover:underline"
                  >
                    👍 Yes
                  </button>
                  <button
                    onClick={() => handleFeedback(i, false)}
                    className="ml-2 text-red-600 hover:underline"
                  >
                    👎 No
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask something..."
            className="flex-1 border px-3 py-2 rounded"
          />
          <button
            onClick={handleAsk}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
