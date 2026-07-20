// src/services/aiService.js

const API_KEYS = [
  import.meta.env.VITE_OPENROUTER_API_KEY_ONE,
  import.meta.env.VITE_OPENROUTER_API_KEY_TWO,
  import.meta.env.VITE_OPENROUTER_API_KEY_THREE,
].filter(Boolean);

const MODELS = [
  "google/gemma-4-31b-it:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
];

let keyRotationIndex = 0;

function getNextApiKey() {
  if (API_KEYS.length === 0) return null;
  const key = API_KEYS[keyRotationIndex % API_KEYS.length];
  keyRotationIndex++;
  return key;
}

// ==========================================
// CONTADOR DE REQUISIÇÕES (por chave, nesta sessão do navegador)
// ==========================================
const requestStats = {};

function maskKey(key) {
  if (!key) return "chave-desconhecida";
  return `...${key.slice(-6)}`;
}

function logRequestStats(apiKey, model, response, errorData) {
  const masked = maskKey(apiKey);
  if (!requestStats[masked]) {
    requestStats[masked] = { count: 0, lastLimitInfo: null };
  }
  requestStats[masked].count += 1;

  const metadata = errorData?.error?.metadata || null;
  const isUpstreamSaturation = !!metadata?.raw?.includes?.('temporarily rate-limited upstream');

  console.groupCollapsed(
    `%c[aiService] Requisição #${requestStats[masked].count} | chave ${masked} | modelo: ${model}`,
    'color:#3b82f6;font-weight:bold;'
  );
  console.log('Status HTTP:', response?.status ?? 'sem resposta (erro de rede)');
  console.log('Total de requisições feitas com esta chave (sessão atual):', requestStats[masked].count);

  if (metadata) {
    console.log('Metadata do provider:', metadata);
    if (isUpstreamSaturation) {
      console.log(
        '%c→ Isso é saturação do PROVEDOR (compartilhada entre todos os usuários do modelo), não da sua chave/conta. Retry_after_seconds:',
        'color:#f59e0b;font-weight:bold;',
        metadata.retry_after_seconds
      );
    }
  }
  if (errorData?.error) {
    console.log('Erro retornado:', errorData.error);
  }
  console.groupEnd();

  return { isUpstreamSaturation, retryAfterSeconds: metadata?.retry_after_seconds };
}

export function getRequestStatsSummary() {
  console.table(
    Object.entries(requestStats).map(([key, val]) => ({
      chave: key,
      requisicoes_nesta_sessao: val.count,
    }))
  );
  return requestStats;
}

async function callOpenRouter(apiKey, model, systemPrompt, history, userMessage) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": window.location.origin,
      "X-Title": "Meu App de Inglês",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        ...history.map(m => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content
        })),
        { role: "user", content: userMessage }
      ],
    }),
  });

  if (!response.ok) {
    let errorData = {};
    try { errorData = await response.json(); } catch (_) {}
    const { isUpstreamSaturation, retryAfterSeconds } = logRequestStats(apiKey, model, response, errorData);

    const err = new Error(errorData.error?.message || `Erro HTTP ${response.status}`);
    err.status = response.status;
    err.isUpstreamSaturation = isUpstreamSaturation;
    err.retryAfterSeconds = retryAfterSeconds;
    throw err;
  }

  logRequestStats(apiKey, model, response, null);

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content || !content.trim()) {
    throw new Error("Resposta vazia da IA.");
  }
  return content;
}

let inFlight = null;

export const generateCloudResponse = async (userMessage, history = [], systemPrompt) => {
  if (API_KEYS.length === 0) {
    throw new Error("Nenhuma chave de API configurada no arquivo .env (VITE_OPENROUTER_API_KEY_ONE/TWO/THREE).");
  }

  if (inFlight) {
    try { await inFlight; } catch (_) {}
  }

  const run = (async () => {
    let lastError;

    // Para cada modelo, tenta com UMA ÚNICA chave (a próxima da rotação).
    // Rotacionar chaves em caso de 429 NÃO ajuda quando é saturação do
    // provedor (upstream) — todas as chaves batem no mesmo provedor
    // saturado e falham igual, só multiplicando requisições à toa.
    // Só trocamos de chave em erro de AUTENTICAÇÃO (401/403), que aí sim
    // é problema específico daquela chave.
    for (const model of MODELS) {
      let apiKey = getNextApiKey();
      let authRetriesLeft = API_KEYS.length - 1; // chances de trocar de chave só por erro de auth

      while (true) {
        try {
          return await callOpenRouter(apiKey, model, systemPrompt, history, userMessage);
        } catch (err) {
          lastError = err;

          if ((err.status === 401 || err.status === 403) && authRetriesLeft > 0) {
            console.warn(`[aiService] Chave inválida/revogada para o modelo "${model}", tentando próxima chave...`);
            apiKey = getNextApiKey();
            authRetriesLeft--;
            continue;
          }

          if (err.status === 429) {
            const reason = err.isUpstreamSaturation
              ? `o modelo está temporariamente saturado no provedor gratuito (todos os usuários do OpenRouter afetados, não só você)`
              : `limite de uso atingido`;
            console.warn(`[aiService] Modelo "${model}" com 429 (${reason}). Pulando para o próximo modelo sem trocar de chave...`);
          } else {
            console.warn(`[aiService] Modelo "${model}" com erro (${err.status}). Pulando para o próximo modelo...`);
          }
          break; // vai para o próximo modelo da lista, sem insistir mais nesta combinação
        }
      }
    }

    getRequestStatsSummary();

    const isSaturation = lastError?.isUpstreamSaturation;
    const friendlyMsg = isSaturation
      ? `Os modelos gratuitos de IA estão temporariamente saturados no provedor (isso afeta todos os usuários do OpenRouter, não é limite da sua conta). Tente novamente em ${lastError?.retryAfterSeconds || 'alguns'} segundos, ou configure sua própria chave do Google AI Studio em openrouter.ai/settings/integrations para evitar isso no futuro.`
      : `Todas as chaves/modelos falharam. Último erro: ${lastError?.message}`;

    throw new Error(friendlyMsg);
  })();

  inFlight = run;
  try {
    return await run;
  } finally {
    if (inFlight === run) inFlight = null;
  }
};

export const generateFitnessPlan = async (profileAnswers) => {
  const systemPrompt = `You are an encouraging AI personal trainer creating a weekly workout plan.
  The user's data: goal="${profileAnswers.goal}", weightKg=${profileAnswers.weightKg}, heightCm=${profileAnswers.heightCm}, age=${profileAnswers.age}, activityLevel="${profileAnswers.activityLevel}".
  Available muscle groups: legs, core, back, arms, cardio.

  Respond ONLY with valid JSON:
  {
    "summary": "2-3 sentence friendly summary of the plan and why, in Portuguese",
    "days": [
      { "weekday": "Monday", "groupIds": ["legs","core"] },
      { "weekday": "Wednesday", "groupIds": ["back","arms"] },
      { "weekday": "Friday", "groupIds": ["cardio","core"] }
    ]
  }`;

  const raw = await generateCloudResponse(
    "Generate my weekly plan.",
    [],
    systemPrompt
  );

  const cleaned = raw.trim().replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```$/, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    return { summary: raw, days: [] };
  }
};

// ==========================================
// MÓDULO DE DIETA: estimativa de calorias por texto e geração de plano
// ==========================================

// Recebe uma descrição livre (ex: "2 ovos fritos e uma fatia de pão")
// e devolve os itens identificados com calorias médias.
export const estimateCaloriesFromText = async (foodDescription) => {
  const systemPrompt = `You are a nutrition estimation assistant. The user will describe a meal or food item in Portuguese, Spanish or English.
Identify each distinct food item mentioned and estimate its average calories based on a typical/common portion size.
Respond ONLY with valid JSON, no markdown fences:
{
  "items": [ { "name": "string (in the same language the user wrote)", "estimatedGrams": number, "calories": number } ],
  "totalCalories": number,
  "confidenceNote": "short note in the user's language about portion assumptions, e.g. 'Assuming a medium portion'"
}`;

  const raw = await generateCloudResponse(foodDescription, [], systemPrompt);
  return parseDietJson(raw);
};

// Recebe uma imagem em base64 (sem o prefixo data:...) e o mimeType, e pede
// para o modelo IDENTIFICAR o prato e estimar calorias de cada elemento.
export const estimateCaloriesFromImage = async (base64Image, mimeType = 'image/jpeg') => {
  if (API_KEYS.length === 0) {
    throw new Error("Nenhuma chave de API configurada.");
  }

  const systemPrompt = `You are a nutrition estimation assistant analyzing a food photo.
Identify the dish and each visible distinct food element/ingredient, and estimate calories for the portion shown.
Respond ONLY with valid JSON, no markdown fences:
{
  "dishName": "string, short name of the overall dish/plate",
  "items": [ { "name": "string", "estimatedGrams": number, "calories": number } ],
  "totalCalories": number,
  "confidenceNote": "short note about assumptions made"
}`;

  // Modelos gratuitos do OpenRouter com suporte a visão (multimodal)
  const VISION_MODELS = [
    "google/gemma-3-27b-it:free",
    "qwen/qwen2.5-vl-32b-instruct:free",
  ];

  let lastError;
  for (const model of VISION_MODELS) {
    const apiKey = getNextApiKey();
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
          "X-Title": "LifeAccess Diet Scanner",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: [
                { type: "text", text: "Analyze this food photo and estimate the calories." },
                { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64Image}` } }
              ]
            }
          ],
        }),
      });

      if (!response.ok) {
        let errorData = {};
        try { errorData = await response.json(); } catch (_) {}
        lastError = new Error(errorData.error?.message || `Erro HTTP ${response.status}`);
        continue;
      }

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content;
      if (!content) { lastError = new Error("Resposta vazia da IA."); continue; }
      return parseDietJson(content);
    } catch (err) {
      lastError = err;
    }
  }

  throw new Error(lastError?.message || "Não foi possível analisar a foto. Tente novamente.");
};

function parseDietJson(raw) {
  if (!raw) return { items: [], totalCalories: 0 };
  const cleaned = raw.trim().replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```$/, '').trim();
  try {
    const parsed = JSON.parse(cleaned);
    const items = Array.isArray(parsed.items) ? parsed.items : [];
    const totalCalories = parsed.totalCalories || items.reduce((sum, i) => sum + (Number(i.calories) || 0), 0);
    return { ...parsed, items, totalCalories };
  } catch {
    return { items: [], totalCalories: 0, dishName: '', confidenceNote: raw };
  }
}

// Gera um plano de dieta completo a partir das respostas do onboarding
// (objetivo, restrições, alimentos que gosta/não gosta, dificuldade de abandonar certos alimentos, refeições por dia).
export const generateDietPlan = async (answers, uiLang = 'pt') => {
  const langNames = { pt: 'Portuguese', en: 'English', es: 'Spanish' };
  const nativeLang = langNames[uiLang] || 'Portuguese';

  let calorieInstruction;
  if (answers.goalCalorieTarget) {
    calorieInstruction = `The user's daily calorie target has ALREADY been calculated by their Fitness profile (based on BMI, goal, and timeframe) and MUST be exactly ${answers.goalCalorieTarget} kcal/day. Do NOT suggest a different dailyCalorieTarget — always return exactly ${answers.goalCalorieTarget} for that field, and distribute the meals so their estimatedCalories sum up close to this exact number.`;
  } else if (answers.referenceTdee) {
    calorieInstruction = `The user's real estimated daily energy expenditure (TDEE) is ${answers.referenceTdee} kcal/day. Use this as the anchor/reference point for the calorie target, adjusting up or down based on their goal.`;
  } else {
    calorieInstruction = `No fitness profile TDEE is available — calculate a reasonable calorie target based on the goal alone.`;
  }

  const fastingInstruction = answers.wantsFasting
    ? `The user practices intermittent fasting with the "${answers.fastingProtocol}" protocol (fasting ${FASTING_HOURS_HINT[answers.fastingProtocol] || ''} hours). Organize the meals ONLY within the user's likely eating window — do not suggest breakfast/early meals if the protocol implies skipping them (e.g. for 16:8, skip breakfast and start with lunch).`
    : `The user does not practice intermittent fasting — spread meals evenly across the day.`;

  const systemPrompt = `You are an encouraging AI nutritionist creating a realistic, sustainable daily diet plan.

User profile:
- Goal: ${answers.goal}
- ${calorieInstruction}
- Meals per day: ${answers.mealsPerDay || 4}
- ${fastingInstruction}
- Restrictions/allergies: ${answers.restrictions || 'none'}
- Foods they like: ${answers.likedFoods || 'not specified'}
- Foods they dislike: ${answers.dislikedFoods || 'not specified'}
- Foods they find hard to give up: ${answers.difficultyFoods || 'not specified'}

Rules:
- Never suggest foods listed as disliked or restricted.
- Be realistic about the "hard to give up" foods: include them in strict moderation instead of banning them completely, to make the plan sustainable.
- Write all text fields in ${nativeLang}.
- The number of items in "meals" array should match "Meals per day" above (1 or 2 meals is valid, e.g. for OMAD/strict fasting).

Respond ONLY with valid JSON, no markdown fences:
{
  "summary": "2-3 sentence friendly summary explaining the logic of this plan, in ${nativeLang}",
  "dailyCalorieTarget": number,
  "waterGoalMl": number,
  "meals": [
    { "name": "string, e.g. Breakfast/Café da Manhã", "suggestion": "string describing what to eat", "estimatedCalories": number }
  ],
  "tips": ["short actionable tip in ${nativeLang}", "..."]
}`;

  const raw = await generateCloudResponse("Generate my diet plan.", [], systemPrompt);
  const parsed = parseDietJson(raw);

  // Trava final de segurança: mesmo que a IA ignore a instrução acima,
  // nunca deixamos a meta divergir do que já foi calculado no Fitness.
  if (answers.goalCalorieTarget) {
    parsed.dailyCalorieTarget = answers.goalCalorieTarget;
  }

  return parsed;
};

// Mapa auxiliar só para dar contexto textual de horas de jejum ao prompt acima
const FASTING_HOURS_HINT = {
  '16:8': 16,
  '18:6': 18,
  '20:4': 20,
  'OMAD': 23,
};