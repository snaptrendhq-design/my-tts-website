import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static("public"));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/generate", async (req, res) => {
  try {
    const { text } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: text,
    });

    res.json({
      output: response.text,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
