// src/services/aiService.js
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
// console.log("A chave carregada é:", API_KEY ? API_KEY.substring(0, 10) + "..." : "NULA!");

export const generateCloudResponse = async (userMessage, history = [], systemPrompt) => {
  if (!API_KEY) throw new Error("Chave de API não configurada no arquivo .env");

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
      const errorData = await response.json();
      console.error("Erro detalhado do OpenRouter:", errorData); // Isso vai nos dizer o modelo exato que ele quer
      throw new Error(errorData.error?.message || "Erro na comunicação com a IA");
  }

  const data = await response.json();
  return data.choices[0].message.content;
};