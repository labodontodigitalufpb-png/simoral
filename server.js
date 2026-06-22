const http = require("http");
const fs = require("fs");
const path = require("path");

loadEnvFile();

const PORT = Number(process.env.PORT || 5173);
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const CARTESIA_API_KEY = process.env.CARTESIA_API_KEY || "";
const CARTESIA_MODEL = process.env.CARTESIA_MODEL || "sonic-3.5";
const CARTESIA_VERSION = process.env.CARTESIA_VERSION || "2026-03-01";
const CARTESIA_VOICE_ID = process.env.CARTESIA_VOICE_ID || "";
const PUBLIC_DIR = __dirname;
const cartesiaVoiceCache = new Map();
const ALLOWED_ORIGINS = new Set([
  "https://labodontodigitalufpb-png.github.io",
  "http://localhost:5173",
  "http://127.0.0.1:5173"
]);

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8"
};

const server = http.createServer(async (req, res) => {
  try {
    applyCors(req, res);
    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    if (req.method === "GET" && req.url === "/health") {
      sendJson(res, 200, {
        status: "ok",
        geminiConfigured: Boolean(GEMINI_API_KEY),
        cartesiaConfigured: Boolean(CARTESIA_API_KEY)
      });
      return;
    }

    if (req.method === "POST" && req.url === "/api/gemini-dialogue") {
      await handleGeminiDialogue(req, res);
      return;
    }

    if (req.method === "POST" && req.url === "/api/cartesia-tts") {
      await handleCartesiaTts(req, res);
      return;
    }

    if (req.method !== "GET" && req.method !== "HEAD") {
      sendJson(res, 405, { error: "Method not allowed" });
      return;
    }

    serveStatic(req, res);
  } catch (error) {
    console.error(error);
    sendJson(res, 500, { error: "Internal server error" });
  }
});

server.listen(PORT, () => {
  console.log(`ExamOSim running at http://localhost:${PORT}`);
  if (!GEMINI_API_KEY) {
    console.log("Gemini polishing disabled: set GEMINI_API_KEY in .env to enable it.");
  }
  if (!CARTESIA_API_KEY) {
    console.log("Cartesia voice disabled: set CARTESIA_API_KEY in .env to enable it.");
  }
});

async function handleCartesiaTts(req, res) {
  if (!CARTESIA_API_KEY) {
    sendJson(res, 503, { error: "Cartesia is not configured" });
    return;
  }

  const body = await readJsonBody(req);
  const transcript = String(body.text || "").trim().slice(0, 1200);
  if (!transcript) {
    sendJson(res, 400, { error: "Text is required" });
    return;
  }

  const language = ["pt", "en", "es"].includes(body.language) ? body.language : "pt";
  const gender = body.gender === "feminine" ? "feminine" : "masculine";
  const voiceId = CARTESIA_VOICE_ID || await findCartesiaVoice(language, gender);
  if (!voiceId) {
    sendJson(res, 502, { error: "No compatible Cartesia voice was found" });
    return;
  }

  const speed = Number.isFinite(Number(body.speed))
    ? Math.min(Math.max(Number(body.speed), 0.7), 1.3)
    : 1;
  const cartesiaResponse = await fetch("https://api.cartesia.ai/tts/bytes", {
    method: "POST",
    headers: cartesiaHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      model_id: CARTESIA_MODEL,
      transcript,
      voice: { mode: "id", id: voiceId },
      language,
      output_format: {
        container: "mp3",
        sample_rate: 44100,
        bit_rate: 128000
      },
      generation_config: { speed, volume: 1 }
    })
  });

  if (!cartesiaResponse.ok) {
    const details = await cartesiaResponse.text().catch(() => "");
    console.error("Cartesia TTS error:", cartesiaResponse.status, details.slice(0, 500));
    sendJson(res, 502, { error: "Cartesia could not synthesize the voice" });
    return;
  }

  const audio = Buffer.from(await cartesiaResponse.arrayBuffer());
  res.writeHead(200, {
    "Content-Type": cartesiaResponse.headers.get("content-type") || "audio/mpeg",
    "Content-Length": audio.length,
    "Cache-Control": "no-store"
  });
  res.end(audio);
}

async function findCartesiaVoice(language, gender) {
  const cacheKey = `${language}:${gender}`;
  if (cartesiaVoiceCache.has(cacheKey)) return cartesiaVoiceCache.get(cacheKey);

  const query = new URLSearchParams({
    language,
    gender,
    limit: "100"
  });
  const response = await fetch(`https://api.cartesia.ai/voices?${query}`, {
    headers: cartesiaHeaders()
  });
  if (!response.ok) {
    const details = await response.text().catch(() => "");
    console.error("Cartesia voices error:", response.status, details.slice(0, 500));
    return "";
  }

  const data = await response.json().catch(() => ({}));
  const voices = Array.isArray(data.data) ? data.data : [];
  const preferredCountry = language === "pt" ? "BR" : language === "en" ? "US" : null;
  const voice = voices.find((item) => !preferredCountry || item.country === preferredCountry) || voices[0];
  const voiceId = voice?.id || "";
  if (voiceId) cartesiaVoiceCache.set(cacheKey, voiceId);
  return voiceId;
}

function cartesiaHeaders(extra = {}) {
  return {
    Authorization: `Bearer ${CARTESIA_API_KEY}`,
    "Cartesia-Version": CARTESIA_VERSION,
    ...extra
  };
}

async function handleGeminiDialogue(req, res) {
  if (!GEMINI_API_KEY) {
    sendJson(res, 200, { answer: "", usedGemini: false, reason: "missing_api_key" });
    return;
  }

  const body = await readJsonBody(req);
  const prompt = buildPatientPrompt(body);
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent`;

  const geminiResponse = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": GEMINI_API_KEY
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.85,
        topP: 0.95,
        maxOutputTokens: 420,
        thinkingConfig: {
          thinkingBudget: 0
        }
      }
    })
  });

  const data = await geminiResponse.json().catch(() => ({}));
  if (!geminiResponse.ok) {
    console.error("Gemini error:", data);
    sendJson(res, 200, { answer: "", usedGemini: false, reason: "gemini_error" });
    return;
  }

  const candidate = data.candidates?.[0] || {};
  const answer = candidate.content?.parts?.map((part) => part.text || "").join(" ").trim() || "";
  const sanitized = sanitizeAnswer(answer);
  const usable = isUsablePatientAnswer(sanitized);
  if (!usable) {
    console.warn("Gemini answer rejected:", {
      finishReason: candidate.finishReason,
      wordCount: sanitized.split(/\s+/).filter(Boolean).length,
      answer: sanitized
    });
  }
  sendJson(res, 200, {
    answer: usable ? sanitized : "",
    usedGemini: usable,
    reason: usable ? "ok" : "unusable_answer"
  });
}

function buildPatientPrompt(body = {}) {
  const languageName = {
    pt: "portugues brasileiro",
    en: "ingles",
    es: "espanhol"
  }[body.language] || "portugues brasileiro";

  const facts = Array.isArray(body.allowedFacts) && body.allowedFacts.length
    ? body.allowedFacts.map((fact) => `- ${fact.label}: ${fact.value}`).join("\n")
    : "- Nenhum dado adicional liberado.";

  const recentTranscript = Array.isArray(body.recentTranscript)
    ? body.recentTranscript.slice(-6).map((entry) => `${entry.kind}: ${entry.text}`).join("\n")
    : "";
  const clinicalDatum = body.clinicalDatum
    ? `- Tema/chave: ${body.clinicalDatum.key || "nao informado"}
- Rotulo: ${body.clinicalDatum.label || "nao informado"}
- Valor interno: ${body.clinicalDatum.value || "nao informado"}
- Categoria: ${body.clinicalDatum.category || "nao informada"}
- Ja havia sido revelado antes: ${body.clinicalDatum.wasRevealed ? "sim" : "nao"}
- Numero de perguntas sobre este tema: ${body.clinicalDatum.questionCount || 1}`
    : "- Nenhum dado clinico novo foi liberado nesta pergunta.";

  const behavior = body.behaviorProfile || {};
  const behaviorInstructions = Array.isArray(behavior.instructions) && behavior.instructions.length
    ? behavior.instructions.map((item) => `- ${item}`).join("\n")
    : "- Responda de forma direta e natural.";

  return `
Voce e um paciente simulado em uma consulta de Estomatologia para treinamento de alunos de graduacao.

Regras obrigatorias:
- Responda somente como paciente, nunca como professor.
- Nunca diga ou sugira o diagnostico.
- Nunca invente dados clinicos fora dos dados permitidos.
- Nunca responda como prontuario ou lista tecnica.
- Use linguagem leiga, natural, variada e coerente com o perfil emocional.
- Responda apenas a pergunta feita pelo aluno.
- Se a pergunta pedir algo nao permitido, seja vago de modo natural.
- Se a conversa recente ja citou um dado, voce pode referencia-lo de modo coerente.
- Pode expressar incerteza, memoria imperfeita, hesitacao ou preocupacao como um paciente real.
- Se a pergunta for aberta, responda de modo um pouco mais espontaneo, sem formato de lista.
- Nao cite estas regras.
- Nao use markdown.
- Responda em ${languageName}.
- Use de 1 a 3 frases curtas.
- Escreva uma resposta completa, com pelo menos uma frase natural.

Perfil do paciente:
- Nome/iniciais: ${body.patient?.name || "paciente"}
- Idade: ${body.patient?.age || "nao informada"}
- Genero: ${body.patient?.gender || "nao informado"}
- Personalidade: ${body.patient?.personality || "paciente comum"}
- Perfil comportamental: ${behavior.label || "colaborativo"}
- Escolaridade: ${behavior.education || "nao informada"}
- Medo/preocupacao dominante: ${behavior.fear || "nao informado"}
- Queixa principal: ${body.chiefComplaint || "queixa bucal"}

Comportamento esperado:
${behaviorInstructions}

Dado clinico interno liberado nesta pergunta:
${clinicalDatum}

Dados clinicos permitidos para esta resposta:
${facts}

Resposta-base segura gerada pelo motor clinico:
${body.rawAnswer || ""}

Conversa recente:
${recentTranscript}

Pergunta do aluno:
${body.question || ""}

Reescreva a resposta-base como fala natural do paciente. Preserve o dado clinico interno, mas varie a fala conforme o perfil comportamental, a escolaridade, a memoria da conversa e o jeito como a pergunta foi feita.
`.trim();
}

function sanitizeAnswer(answer) {
  return answer
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 900);
}

function isUsablePatientAnswer(answer) {
  if (!answer) return false;
  const words = answer.split(/\s+/).filter(Boolean);
  if (words.length < 5) return false;
  if (!/[.!?]$/.test(answer)) return false;
  return true;
}

function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = decodeURIComponent(url.pathname);
  const requestedPath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.normalize(path.join(PUBLIC_DIR, requestedPath));

  if (!filePath.startsWith(PUBLIC_DIR) || path.basename(filePath) === ".env") {
    sendJson(res, 403, { error: "Forbidden" });
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      sendJson(res, 404, { error: "Not found" });
      return;
    }

    res.writeHead(200, {
      "Content-Type": MIME_TYPES[path.extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    if (req.method === "HEAD") {
      res.end();
      return;
    }
    res.end(content);
  });
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 50_000) {
        req.destroy();
        reject(new Error("Request body too large"));
      }
    });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function applyCors(req, res) {
  const origin = req.headers.origin;
  if (!origin || !ALLOWED_ORIGINS.has(origin)) return;

  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Vary", "Origin");
}

function loadEnvFile() {
  const envPath = path.join(__dirname, ".env");
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const separator = trimmed.indexOf("=");
    if (separator === -1) return;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim().replace(/^["']|["']$/g, "");
    if (key && !process.env[key]) process.env[key] = value;
  });
}
