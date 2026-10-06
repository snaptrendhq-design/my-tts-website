import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.post("/tts", async (req, res) => {
  try {
    const { text, voiceId } = req.body;

    const response = await fetch(
      "https://api.cartesia.ai/tts/bytes",
      {
        method: "POST",
        headers: {
          "Cartesia-Version": "2026-08-14",
          "X-API-Key": process.env.CARTESIA_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model_id: "sonic-3.6",
          transcript: text,
          voice: voiceId,
          output_format: {
            container: "wav",
            encoding: "pcm_s16le",
            sample_rate: 44100
          }
        })
      }
    );

    const audioBuffer =
      Buffer.from(await response.arrayBuffer());

    res.setHeader("Content-Type", "audio/wav");
    res.send(audioBuffer);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

app.listen(3000, () => {
  console.log("Server running");
});
