import express from "express";
import OpenAI from "openai";
import fetch from "node-fetch";
import 'dotenv/config';
const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/voice/openai", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    const mp3 = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "coral",
      input: prompt,    
      instructions: "Speak in a cheerful and positive tone",
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    const audioBase64 = buffer.toString("base64");
    res.json({ audio: audioBase64 });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Voice API call failed", details: err.message });
  }
});

const deepseek = new OpenAI({
    baseURL: process.env.DEEPSEEK_API_URL, // https://api.deepseek.com/v3.1_terminus_expires_on_20251015
    apiKey: process.env.DEEPSEEK_API_KEY,
  });
  
    router.post("/text/deepseek", async (req, res) => {
    const { messages } = req.body;
    if (!messages) return res.status(400).json({ error: "Messages are required" });
  
    try {
      const completion = await deepseek.chat.completions.create({
        model: "deepseek-chat",
        messages: messages,
      });
  
      res.json({
        text: completion.choices?.[0]?.message?.content || "",
        raw: completion,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "DeepSeek text API failed", details: err.message });
    }
  });
  
  // image/sora2 route
router.post("/image/sora2", async (req, res) => {
    const { prompt, size = "512x512" } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });
  
    try {
      const response = await fetch("https://api.deepseek.com/v3.1/images/generate", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "sora2",
          prompt: prompt,
          size: size, // optional: "256x256", "512x512", "1024x1024"
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error("DeepSeek Image API error:", data);
        throw new Error(data.error?.message || "DeepSeek Image API error");
      }
  
      res.json({
        imageUrl: data.data?.[0]?.url || "",
        raw: data,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "DeepSeek image API failed", details: err.message });
    }
  });
  

  
export default router;
