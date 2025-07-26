const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = 5000;
const path = require('path');


app.use(cors());
app.use(express.json());

const faqData = JSON.parse(fs.readFileSync("faqs.json", "utf-8"));

// Serve FAQ list
app.get("/api/faq", (req, res) => {
  res.json(faqData);
});

// Handle chatbot question
app.post("/api/ask", (req, res) => {
  const { question } = req.body;
  const lower = question.toLowerCase();

  const matched = faqData.find((faq) =>
    lower.includes(faq.question.toLowerCase())
  );

  if (matched) {
    res.json({ answer: matched.answer });
  } else {
    const logFile = "unansweredLog.json";
    const existing = fs.existsSync(logFile)
      ? JSON.parse(fs.readFileSync(logFile, "utf-8"))
      : [];

    existing.push({ question, timestamp: new Date().toISOString() });
    fs.writeFileSync(logFile, JSON.stringify(existing, null, 2));
    res.json({ answer: "Sorry, I don't have an answer to that yet." });
  }
});

// ✅ Save feedback
app.post("/api/feedback", (req, res) => {
  const { answer, helpful } = req.body;
  const entry = {
    answer,
    helpful,
    timestamp: new Date().toISOString(),
  };

  const file = "feedbackLog.json";
  let existing = [];

  if (fs.existsSync(file)) {
    existing = JSON.parse(fs.readFileSync(file, "utf-8"));
  }

  existing.push(entry);
  fs.writeFileSync(file, JSON.stringify(existing, null, 2));
  res.json({ message: "✅ Feedback saved" });
});

// Admin: Get feedback log
app.get("/api/feedback-log", (req, res) => {
  try {
    const data = fs.readFileSync("feedbackLog.json", "utf-8");
    res.json(JSON.parse(data));
  } catch {
    res.status(500).json({ error: "No feedback log found" });
  }
});

// Admin: Get unanswered questions

// Get unanswered questions
app.get("/api/unanswered", (req, res) => {
  const logFile = path.join(__dirname, "unansweredlog.json");
  fs.readFile(logFile, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading log file:", err);
      return res.status(500).json({ error: "Failed to load log" });
    }
    const parsed = JSON.parse(data || "[]");
    res.json(parsed);
  });
});

// app.get("/api/unanswered-log", (req, res) => {
//   try {
//     const data = fs.readFileSync("unansweredLog.json", "utf-8");
//     res.json(JSON.parse(data));
//   } catch {
//     res.status(500).json({ error: "No unanswered log found" });
//   }
// });

// Root route
app.get("/", (req, res) => {
  res.send("✅ API running. Visit /api/faq");
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
