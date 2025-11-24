import "dotenv/config";
import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

app.post("/api/gemini", async (req, res) => {
  try {
    const { messages, mode } = req.body;

    const conversation = messages
      .map(m => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n");

    const task =
      mode === "feedback"
        ? "Give structured feedback across Communication, Technical Skills, Problem Solving, and Improvements."
        : "Ask the next interview question or 1–3 follow-up questions. Only one message per turn.";

    const prompt = `
Conversation so far:
${conversation}

Task:
${task}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",   
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    });

    const reply =
      response?.candidates?.[0]?.content?.parts?.map(p => p.text).join(" ") ||
      response?.text() ||
      "No response from AI.";

    res.json({ reply });

  } catch (error) {
    console.error("Gemini Error:", error);
    res.json({ reply: "Server error occurred." });
  }
});

app.listen(3000, () =>
  console.log("✔ Server running at http://localhost:3000")
);
