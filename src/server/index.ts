import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config({ path: ".env.local" });

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// API 키 로드 (환경변수에서)
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("❌ GEMINI_API_KEY environment variable is not set");
  console.error("Please set GEMINI_API_KEY in your .env.local file");
  process.exit(1);
}
console.log("✅ API key loaded successfully from environment");

// Gemini AI 클라이언트 초기화
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// 시스템 프롬프트 로드
let SYSTEM_PROMPT = "";
try {
  // src/prompts/system.md를 읽기 위해 현재 파일 기준으로 경로 설정
  const promptPath = path.resolve(
    path.dirname(import.meta.url).replace("file://", ""),
    "../prompts/system.md"
  );
  SYSTEM_PROMPT = fs.readFileSync(promptPath, "utf-8");
  console.log("✅ System prompt loaded successfully");
} catch (error) {
  console.error("❌ Failed to load system prompt:", error);
}

app.post("/api/chat", async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "Messages array is required" });
      return;
    }

    // 메시지 형식 변환 (system prompt는 별도로 처리)
    const chatHistory = messages.map(
      (msg: { role: string; content: string }) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })
    );

    // SSE 헤더 설정
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    try {
      // 스트리밍 채팅 시작
      const chat = model.startChat({
        history: chatHistory.slice(0, -1), // 마지막 메시지(사용자 입력)를 제외한 이전 대화
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
        },
        systemInstruction: {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT }],
        },
      });

      // 사용자의 마지막 메시지로 스트리밍 응답 받기
      const userMessage =
        chatHistory[chatHistory.length - 1]?.parts[0]?.text || "";
      const result = await chat.sendMessageStream(userMessage);

      // 스트리밍 처리
      for await (const chunk of result.stream) {
        const text = chunk.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          res.write(`data: ${JSON.stringify({ text })}\n\n`);
        }
      }

      res.write("data: [DONE]\n\n");
      res.end();
    } catch (error) {
      console.error("Gemini streaming error:", error);
      res.write(`data: ${JSON.stringify({ error: "Streaming failed" })}\n\n`);
      res.write("data: [DONE]\n\n");
      res.end();
    }
  } catch (error) {
    console.error("Chat API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
