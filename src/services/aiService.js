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