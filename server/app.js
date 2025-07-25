// server/app.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const Resume = require('./models/Resume');

// Load .env file
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Initialize OpenAI
const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Set in .env file (backend)
});

// ✅ MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Suggest and Save API
app.post('/api/suggest', async (req, res) => {
  try {
    const { resumeText } = req.body;

    // ✅ Dummy suggestions (temporary for submission)
    const suggestions = [
      "Add a professional summary at the beginning.",
      "List achievements with quantifiable results.",
      "Use consistent formatting and bullet points.",
      "Include relevant keywords from job descriptions."
    ];

    const newResume = new Resume({ resumeText, suggestions });
    await newResume.save();

    res.json({ success: true, suggestions });
  } catch (err) {
    console.error("❌ DB Save Error:", err);
    res.status(500).json({ error: "Failed to save to DB" });
  }
});



app.get('/test', (req, res) => {
  res.send('✅ Test route working');
});

// ✅ Start server
app.listen(5000, () => {
  console.log("✅ Resume Suggestion API is running at http://localhost:5000");
});
