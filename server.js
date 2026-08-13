const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

loadEnvFile();

const PORT = Number(process.env.PORT || 5173);
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@examosim.local").trim().toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || (process.env.NODE_ENV === "production" ? "" : "Admin@123");
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");
const DATA_FILE = path.resolve(process.env.DATA_FILE || path.join(__dirname, ".data", "examosim-db.json"));
const PUBLIC_DIR = __dirname;
const ALLOWED_ORIGINS = new Set([
  "https://labodontodigitalufpb-png.github.io",
  "http://localhost:5173",
  "http://127.0.0.1:5173"
]);
const DENTAL_SPECIALTIES = new Set([
  "Cirurgião-dentista (generalista)",
  "Acupuntura",
  "Cirurgia e Traumatologia Bucomaxilofaciais",
  "Cirurgia Estética Orofacial",
  "Dentística",
  "Disfunção Temporomandibular e Dor Orofacial",
  "Endodontia",
  "Estomatologia",
  "Harmonização Orofacial",
  "Homeopatia",
  "Implantodontia",
  "Odontogeriatria",
  "Odontologia do Esporte",
  "Odontologia do Trabalho",
  "Odontologia Hospitalar",
  "Odontologia Legal",
  "Odontologia para Pacientes com Necessidades Especiais",
  "Odontopediatria",
  "Ortodontia",
  "Ortopedia Funcional dos Maxilares",
  "Patologia Oral e Maxilofacial",
  "Periodontia",
  "Prótese Bucomaxilofacial",
  "Prótese Dentária",
  "Radiologia Odontológica e Imaginologia",
  "Saúde Coletiva"
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
    const requestUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    if (req.method === "GET" && requestUrl.pathname === "/health") {
      sendJson(res, 200, {
        status: "ok",
        geminiConfigured: Boolean(GEMINI_API_KEY)
      });
      return;
    }

    if (req.method === "POST" && requestUrl.pathname === "/api/gemini-dialogue") {
      await handleGeminiDialogue(req, res);
      return;
    }

    if (requestUrl.pathname.startsWith("/api/")) {
      await handleApi(req, res, requestUrl);
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
  if (!process.env.SESSION_SECRET) {
    console.warn("SESSION_SECRET is temporary; sessions will expire when the server restarts.");
  }
  if (!ADMIN_PASSWORD) {
    console.warn("Administrative login disabled: set ADMIN_EMAIL and ADMIN_PASSWORD.");
  }
});

async function handleApi(req, res, url) {
  if (req.method === "POST" && url.pathname === "/api/auth/register") {
    await handleRegistration(req, res);
    return;
  }
  if (req.method === "POST" && url.pathname === "/api/auth/login") {
    await handleLogin(req, res);
    return;
  }
  if (req.method === "POST" && url.pathname === "/api/auth/recover") {
    await handlePasswordRecovery(req, res);
    return;
  }

  const session = authenticateRequest(req);
  if (!session) {
    sendJson(res, 401, { error: "Sessão inválida ou expirada." });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/auth/me") {
    const profile = session.role === "admin" ? adminProfile() : findUserById(session.sub)?.profile;
    if (!profile) {
      sendJson(res, 401, { error: "Conta não encontrada." });
      return;
    }
    sendJson(res, 200, { role: session.role, profile });
    return;
  }

  if (req.method === "PUT" && url.pathname === "/api/profile") {
    if (session.role !== "professional") return sendForbidden(res);
    const body = await readJsonBody(req);
    const database = readDatabase();
    const user = database.users.find((item) => item.id === session.sub);
    if (!user) {
      sendJson(res, 404, { error: "Conta não encontrada." });
      return;
    }
    const profile = normalizeProfile({ ...user.profile, ...body, email: user.email });
    if (!hasValidDentalSpecialties(profile.specialties)) {
      sendJson(res, 400, { error: "Selecione uma ou mais especialidades odontológicas válidas." });
      return;
    }
    user.profile = profile;
    writeDatabase(database);
    sendJson(res, 200, { profile: user.profile });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/attempts") {
    if (session.role !== "professional") return sendForbidden(res);
    const body = await readJsonBody(req);
    const database = readDatabase();
    const user = database.users.find((item) => item.id === session.sub);
    if (!user) {
      sendJson(res, 404, { error: "Conta não encontrada." });
      return;
    }
    const attempt = normalizeAttempt(body, user);
    const existingIndex = database.attempts.findIndex(
      (item) => item.id === attempt.id && item.userId === user.id
    );
    if (existingIndex >= 0) database.attempts[existingIndex] = attempt;
    else database.attempts.push(attempt);
    writeDatabase(database);
    sendJson(res, existingIndex >= 0 ? 200 : 201, { attempt });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/attempts/mine") {
    if (session.role !== "professional") return sendForbidden(res);
    const attempts = readDatabase().attempts.filter((item) => item.userId === session.sub);
    sendJson(res, 200, { attempts: sortAttempts(attempts) });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/admin/attempts") {
    if (session.role !== "admin") return sendForbidden(res);
    const attempts = filterAttempts(readDatabase().attempts, url.searchParams);
    sendJson(res, 200, { attempts: sortAttempts(attempts) });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/admin/attempts.csv") {
    if (session.role !== "admin") return sendForbidden(res);
    const attempts = filterAttempts(readDatabase().attempts, url.searchParams);
    sendCsv(res, attemptsToCsv(sortAttempts(attempts)), "examosim-todas-avaliacoes.csv");
    return;
  }

  sendJson(res, 404, { error: "Rota não encontrada." });
}

async function handleRegistration(req, res) {
  const body = await readJsonBody(req);
  const profile = normalizeProfile(body.profile || body);
  const password = String(body.password || "");
  if (!profile.name || !profile.profession || !profile.city || !profile.stateRegion || !isEmail(profile.email)) {
    sendJson(res, 400, { error: "Preencha nome, especialidade odontológica, cidade, UF e um e-mail válido." });
    return;
  }
  if (!hasValidDentalSpecialties(profile.specialties)) {
    sendJson(res, 400, { error: "Selecione uma ou mais especialidades odontológicas válidas." });
    return;
  }
  if (password.length < 8) {
    sendJson(res, 400, { error: "A senha deve ter pelo menos 8 caracteres." });
    return;
  }
  const database = readDatabase();
  if (database.users.some((user) => user.email === profile.email) || profile.email === ADMIN_EMAIL) {
    sendJson(res, 409, { error: "Já existe uma conta com este e-mail." });
    return;
  }
  const salt = crypto.randomBytes(16).toString("hex");
  const user = {
    id: crypto.randomUUID(),
    email: profile.email,
    passwordSalt: salt,
    passwordHash: hashPassword(password, salt),
    recoveryCredentialHash: "",
    profile,
    createdAt: new Date().toISOString()
  };
  const recoveryCredential = createRecoveryCredential();
  user.recoveryCredentialHash = hashRecoveryCredential(recoveryCredential);
  database.users.push(user);
  writeDatabase(database);
  sendJson(res, 201, { ...authResponse("professional", user.id, profile), recoveryCredential });
}

async function handleLogin(req, res) {
  const body = await readJsonBody(req);
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const role = body.role === "admin" ? "admin" : "professional";
  if (role === "admin") {
    if (!ADMIN_PASSWORD || !safeEqual(email, ADMIN_EMAIL) || !safeEqual(password, ADMIN_PASSWORD)) {
      sendJson(res, 401, { error: "Credenciais administrativas inválidas." });
      return;
    }
    sendJson(res, 200, authResponse("admin", "admin", adminProfile()));
    return;
  }
  const database = readDatabase();
  const user = database.users.find((item) => item.email === email);
  if (!user || !safeEqual(hashPassword(password, user.passwordSalt), user.passwordHash)) {
    sendJson(res, 401, { error: "E-mail ou senha inválidos." });
    return;
  }
  let recoveryCredential = "";
  if (!user.recoveryCredentialHash) {
    recoveryCredential = createRecoveryCredential();
    user.recoveryCredentialHash = hashRecoveryCredential(recoveryCredential);
    writeDatabase(database);
  }
  sendJson(res, 200, { ...authResponse("professional", user.id, user.profile), recoveryCredential });
}

async function handlePasswordRecovery(req, res) {
  const body = await readJsonBody(req);
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const recoveryCredential = String(body.recoveryCredential || "");
  if (!isEmail(email) || password.length < 8 || !recoveryCredential) {
    sendJson(res, 400, { error: "Informe o e-mail, a credencial de recuperação e uma nova senha com pelo menos 8 caracteres." });
    return;
  }
  const database = readDatabase();
  const user = database.users.find((item) => item.email === email);
  if (!user || !user.recoveryCredentialHash || !safeEqual(hashRecoveryCredential(recoveryCredential), user.recoveryCredentialHash)) {
    sendJson(res, 401, { error: "Não foi possível validar a recuperação neste dispositivo." });
    return;
  }
  const salt = crypto.randomBytes(16).toString("hex");
  const nextRecoveryCredential = createRecoveryCredential();
  user.passwordSalt = salt;
  user.passwordHash = hashPassword(password, salt);
  user.recoveryCredentialHash = hashRecoveryCredential(nextRecoveryCredential);
  writeDatabase(database);
  sendJson(res, 200, { message: "Senha atualizada.", recoveryCredential: nextRecoveryCredential });
}

function authResponse(role, subject, profile) {
  return { role, profile, token: createSessionToken({ sub: subject, role }) };
}

function createSessionToken(payload) {
  const encoded = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 12 * 60 * 60 * 1000 })).toString("base64url");
  const signature = crypto.createHmac("sha256", SESSION_SECRET).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

function authenticateRequest(req) {
  const match = String(req.headers.authorization || "").match(/^Bearer\s+(.+)$/i);
  if (!match) return null;
  const [encoded, signature] = match[1].split(".");
  if (!encoded || !signature) return null;
  const expected = crypto.createHmac("sha256", SESSION_SECRET).update(encoded).digest("base64url");
  if (!safeEqual(signature, expected)) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    return payload.exp > Date.now() ? payload : null;
  } catch (error) {
    return null;
  }
}

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 210_000, 32, "sha256").toString("hex");
}

function createRecoveryCredential() {
  return crypto.randomBytes(32).toString("base64url");
}

function hashRecoveryCredential(credential) {
  return crypto.createHash("sha256").update(String(credential)).digest("hex");
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function adminProfile() {
  return { name: "Administrador principal", profession: "Administração", specialties: [], city: "", stateRegion: "", email: ADMIN_EMAIL, id: "", college: "ExamOSim" };
}

function normalizeProfile(profile = {}) {
  const specialties = normalizeSpecialties(profile);
  return {
    name: cleanText(profile.name, 160),
    profession: specialties.join(" · "),
    specialties,
    city: cleanText(profile.city, 100),
    stateRegion: cleanText(profile.stateRegion, 2).toUpperCase(),
    email: cleanText(profile.email, 254).toLowerCase(),
    id: cleanText(profile.id, 100),
    college: cleanText(profile.college, 180)
  };
}

function normalizeSpecialties(profile = {}) {
  const raw = Array.isArray(profile.specialties)
    ? profile.specialties
    : String(profile.profession || "").split(" · ");
  return [...new Set(raw.slice(0, DENTAL_SPECIALTIES.size).map((item) => cleanText(item, 100))
    .map((item) => item === "Odontologia" ? "Cirurgião-dentista (generalista)" : item)
    .filter(Boolean))];
}

function hasValidDentalSpecialties(specialties) {
  return Array.isArray(specialties) && specialties.length > 0 && specialties.every((item) => DENTAL_SPECIALTIES.has(item));
}

function normalizeAttempt(body, user) {
  const source = body.record && typeof body.record === "object" ? body.record : body;
  const allowed = {};
  OSCE_HEADERS.forEach((key) => {
    allowed[key] = cleanText(source[key], 20_000);
  });
  const transcript = Array.isArray(source.transcript)
    ? source.transcript.slice(-500).map((entry) => ({
        kind: ["student", "patient", "system"].includes(entry.kind) ? entry.kind : "system",
        text: cleanText(entry.text, 4_000)
      }))
    : [];
  return {
    ...allowed,
    id: cleanText(source.attemptId || source.id, 100) || crypto.randomUUID(),
    userId: user.id,
    profissional: user.profile.name,
    profissao: user.profile.profession,
    cidade: user.profile.city,
    estado: user.profile.stateRegion,
    email: user.email,
    registroProfissional: user.profile.id,
    instituicao: user.profile.college,
    dataHora: cleanText(source.dataHora, 40) || new Date().toISOString(),
    transcript
  };
}

function readDatabase() {
  try {
    const parsed = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      attempts: Array.isArray(parsed.attempts) ? parsed.attempts : []
    };
  } catch (error) {
    if (error.code !== "ENOENT") console.error("Database read error:", error);
    return { users: [], attempts: [] };
  }
}

function writeDatabase(database) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  const temporary = `${DATA_FILE}.${process.pid}.tmp`;
  fs.writeFileSync(temporary, JSON.stringify(database, null, 2), { mode: 0o600 });
  fs.renameSync(temporary, DATA_FILE);
}

function findUserById(id) {
  return readDatabase().users.find((user) => user.id === id);
}

function sortAttempts(attempts) {
  return [...attempts].sort((a, b) => String(b.dataHora).localeCompare(String(a.dataHora)));
}

function filterAttempts(attempts, searchParams) {
  const query = cleanText(searchParams.get("q"), 200).toLowerCase();
  if (!query) return attempts;
  return attempts.filter((attempt) => [attempt.profissional, attempt.email, attempt.caso, attempt.instituicao]
    .some((value) => String(value || "").toLowerCase().includes(query)));
}

function attemptsToCsv(attempts) {
  const headers = ["id", ...OSCE_HEADERS, "conversaCompleta"];
  return [
    headers.join(";"),
    ...attempts.map((record) => headers.map((header) => csvCell(
      header === "conversaCompleta" ? serializeTranscript(record.transcript) : record[header]
    )).join(";"))
  ].join("\n");
}

function serializeTranscript(transcript) {
  if (!Array.isArray(transcript)) return "";
  return transcript.map((entry) => `${entry.kind}: ${entry.text}`).join(" | ");
}

function csvCell(value) {
  return `"${String(value ?? "").replace(/\r?\n/g, " ").replace(/"/g, '""')}"`;
}

function sendCsv(res, csv, filename) {
  res.writeHead(200, {
    "Content-Type": "text/csv; charset=utf-8",
    "Content-Disposition": `attachment; filename="${filename}"`,
    "Cache-Control": "no-store"
  });
  res.end(`\ufeff${csv}`);
}

function sendForbidden(res) {
  sendJson(res, 403, { error: "Acesso não autorizado para este perfil." });
}

function cleanText(value, maxLength) {
  return String(value ?? "").trim().slice(0, maxLength);
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

const OSCE_HEADERS = [
  "dataHora", "profissional", "profissao", "cidade", "estado", "email",
  "registroProfissional", "instituicao", "caso", "paciente", "queixa", "nota",
  "tempoSegundos", "pontuacaoAnamnese", "pontuacaoExameFisico", "pontuacaoHipoteses",
  "pontuacaoExames", "pontuacaoConduta", "hda", "historiaFamiliar", "historiaMedica",
  "historiaOdontologica", "habitos", "comunicacao", "fatoresDeRisco", "diagnosticoCorreto",
  "hipoteseEsperada", "hipotesesMarcadas", "justificativaDiagnostica", "examesFisicosRealizados",
  "achadosExameFisico", "condutasMarcadas", "urgencia", "perguntasAluno", "ordemObservada",
  "perguntasOmitidas", "condutasPendentes", "alertasSeguranca", "feedbackTutor",
  "observacoesAvaliador", "soapS", "soapO", "soapA", "soapP"
];

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

  const publicExtensions = new Set(Object.keys(MIME_TYPES));
  if (
    !filePath.startsWith(`${PUBLIC_DIR}${path.sep}`) ||
    pathname.split("/").some((segment) => segment.startsWith(".")) ||
    !publicExtensions.has(path.extname(filePath)) ||
    ["server.js"].includes(path.basename(filePath))
  ) {
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
      if (raw.length > 2_000_000) {
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
  res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, POST, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
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
