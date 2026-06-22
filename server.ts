import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily/safely
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (aiClient) return aiClient;
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === "MY_GEMINI_API_KEY") {
    throw new Error("GEMINI_API_KEY is not configured or contains placeholder. Please set it in the Secrets panel.");
  }
  aiClient = new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
  return aiClient;
}

// ----------------------------------------------------
// AI TRAINER ENDPOINT (RAG system)
// ----------------------------------------------------
app.post("/api/trainer", async (req, res) => {
  try {
    const { message, lang = "en", context = [] } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const contextText = context.map((c: any) => `Source [SOP ID: ${c.id}] ${c.title}:\n${c.content}`).join("\n\n");
    const systemPrompt = `You are Sarathi AI, an advanced enterprise cognitive assistant and workforce trainer for a heavy industrial plant (like Tata Steel, JSW, Jindal, power plants, mining).
Your objective is to provide precise mechanical, electrical, process, and safety guidance based on the plant SOPs and manuals provided.

Guidelines:
1. Speak in the user's requested language. The user's query may be in English, Hindi, or Hinglish. Answer comprehensively using the exact same tone and mixed terms (Hinglish) if they ask in Hinglish.
2. Rely mostly on the provided plant context:
---
${contextText || "No matching SOP/Manual asset found in local database."}
---
3. ALWAYS cite the specfic source (e.g., SOP ID and SOP Title) you are referencing.
4. Provide technical step-by-step resolution steps.
5. Choose a confidence score (from 0% to 100%) based on how perfectly the search context matches their industrial task.
6. Design your message with a professional industrial trainer persona. Include clear bullet points.
7. Return your response in JSON format matching this schema:
{
  "answer": "Highly structured response with steps...",
  "confidence": 95,
  "source": "SOP ID & SOP Title reference",
  "relatedLearning": "Recommended skill and course ID to master this process",
  "relatedExpertSkill": "Name of plant discipline expert who knows this"
}`;

    let ai;
    try {
      ai = getGeminiClient();
    } catch (err: any) {
      // Fallback response with graceful warning if API key is not configured
      return res.json({
        answer: `[DEMO MODE - GEMINI KEY NOT SET] (Responding using native fallback model):
Для सीखने-सिखाने की प्रक्रिया (Training Process) complete instructions:
To handle this industrial process safely:
1. Always wear appropriate personal protective equipment (PPE) including safety helmet, steel-toed boots, safety goggles, and high-visibility vest.
2. Ensure proper LOTO (Lockout-Tagout) compliance at the electrical breaker pane before starting maintenance.
3. Inspect system pressure gauges and bleed residual hydraulic energy safely.
4. Notify the Shift Supervisor and log the physical intervention in the plant logbook.

Please configure your GEMINI_API_KEY in the Secrets panel to activate full cognitive AI power!`,
        confidence: 85,
        source: "General Plant Standard Safety SOP-001 & LOTO-003",
        relatedLearning: "LOTO Safety Certification Course (SAFE-101)",
        relatedExpertSkill: "Safety Compliance Senior Inspector",
        warning: err.message
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: message,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const bodyText = response.text || "{}";
    try {
      const parsed = JSON.parse(bodyText.trim());
      res.json(parsed);
    } catch (parseError) {
      res.json({
        answer: bodyText,
        confidence: 90,
        source: "Raw LLM response",
        relatedLearning: "Enterprise Skill Path",
        relatedExpertSkill: "Maintenance Expert"
      });
    }
  } catch (error: any) {
    console.error("AI Trainer error:", error);
    res.status(500).json({ error: error.message || "Internal AI generation error" });
  }
});

// ----------------------------------------------------
// AI KNOWLEDGE CAPTURE INTERVIEW ENDPOINT
// ----------------------------------------------------
app.post("/api/capture-interview", async (req, res) => {
  try {
    const { dialogue, expertName, domain } = req.body;
    if (!dialogue) {
      return res.status(400).json({ error: "Dialogue script/transcript is required." });
    }

    const systemPrompt = `You are Sarathi AI, specialized in the "Knowledge Retention & Preservation" workflow for workforce transition.
Your task is to take a dialogue script or interview transcript between an AI Interviewer and a retiring senior expert, and transform it into a structured, production-grade SOP article/Knowledge Asset.

Format your output in JSON matching this schema:
{
  "title": "Clear Technical SOP Title, e.g., Troubleshooting Blast Furnace Charging Valve Seals",
  "category": "SOPs" | "Lessons Learned" | "Troubleshooting Guides" | "Expert Articles",
  "summary": "High value technical summary summarizing why this knowledge is being preserved",
  "steps": [
    "Step 1 details...",
    "Step 2 details..."
  ],
  "bestPractices": [
    "Pro-tip or safety practice 1 from expert...",
    "Pro-tip or safety practice 2 from expert..."
  ],
  "failureLearnings": [
    "Critical failures described by expert, what caused it, and how to avoid it..."
  ]
}

Ensure the instructions are highly specific, industrial-grade, and retain the exact wisdom described in the transcript. Don't speak generic items. Fill in with realistic details of engineering and tools.`;

    let ai;
    try {
      ai = getGeminiClient();
    } catch (err: any) {
      // Fallback response with graceful warning if API key is not configured
      return res.json({
        title: `Expert SOP: Operating ${domain || "Plant"} Systems Safely`,
        category: "Lessons Learned",
        summary: `Preserved knowledge assets for senior expert ${expertName || "V. K. Mishra"}. (Fallback generated without active Gemini API Key)`,
        steps: [
          "Check temperature gradient before ignition sequence.",
          "Check secondary water seal and purge logic for gas lockouts.",
          "Always perform thermal imaging on joint bearings once per shift."
        ],
        bestPractices: [
          "Listen for sub-harmonic humming from mechanical drives: it warns of alignment issues 2 weeks before standard vibration probes catch it.",
          "Keep spare silicon carbide O-rings in oil-bath storage, never dry cabins."
        ],
        failureLearnings: [
          "We once had a secondary cooling nozzle clog because recycled canal water was poorly filtered. Use dual inline high-pressure mesh screens."
        ],
        warning: err.message
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Expert Name: ${expertName || "Retiring Senior Expert"}\nDomain: ${domain || "Industrial Engineering"}\nDialogue Script:\n${dialogue}`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    });

    const bodyText = response.text || "{}";
    try {
      const parsed = JSON.parse(bodyText.trim());
      res.json(parsed);
    } catch (parseError) {
      res.json({
        title: `Expert SOP: Operating ${domain || "Plant"} Systems`,
        category: "Lessons Learned",
        summary: bodyText,
        steps: ["Review raw interview text below."],
        bestPractices: ["Check interview history."],
        failureLearnings: []
      });
    }
  } catch (error: any) {
    console.error("AI Capture Interview error:", error);
    res.status(500).json({ error: error.message || "Internal AI generation error" });
  }
});

// ----------------------------------------------------
// VITE DEV SERVER / PRODUCTION SERVING
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SARATHI AI] Server running on http://0.0.0.0:${PORT} under NODE_ENV=${process.env.NODE_ENV}`);
  });
}

startServer();
