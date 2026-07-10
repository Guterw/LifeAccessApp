// src/services/aiService.js
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
// console.log("A chave carregada é:", API_KEY ? API_KEY.substring(0, 10) + "..." : "NULA!");

  export const generateCloudResponse = async (userMessage, history = [], systemPrompt, retries = 2) => {
    if (!API_KEY) throw new Error("Chave de API não configurada no arquivo .env");

    const attempt = async () => {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": window.location.origin,
            "X-Title": "Meu App de Inglês",
          },
          body: JSON.stringify({
            model: "google/gemma-4-31b-it:free",
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
          console.error("Erro detalhado do OpenRouter:", errorData);
          const err = new Error(errorData.error?.message || `Erro HTTP ${response.status}`);
          err.status = response.status;
          throw err;
        }

        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content;
        if (!content || !content.trim()) {
          throw new Error("Resposta vazia da IA");
        }
        return content;
      };

      let lastError;
      for (let i = 0; i <= retries; i++) {
        try {
          return await attempt();
        } catch (err) {
          lastError = err;
          // Não insiste em erros de configuração/autenticação (400/401/403) — só em falhas transitórias.
          const isAuthOrBadRequest = err.status === 401 || err.status === 403 || err.status === 400;
          if (isAuthOrBadRequest || i === retries) break;
          // Pequeno backoff progressivo antes de tentar de novo (300ms, 700ms...)
          await new Promise(res => setTimeout(res, 300 + i * 400));
        }
      }
      throw lastError;
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