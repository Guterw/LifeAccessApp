// src/config/appVersion.js

// Fallback MANUAL: edite esta string sempre que quiser garantir uma versão
// exibida mesmo sem internet, ou caso a API do GitHub esteja indisponível
// ou com o limite de requisições estourado. Sugestão: use o mesmo texto
// do título do seu commit mais recente.
export const APP_VERSION_FALLBACK = 'v1.0.0';

// Repositório público no formato "usuario/repositorio", usado para buscar
// automaticamente o título do ÚLTIMO COMMIT via API pública do GitHub
// (sem necessidade de autenticação — limite de 60 requisições/hora por IP,
// o que é mais que suficiente para este uso, já que há cache local de 1h).
//
// Ajuste para o nome exato do seu repositório. Se quiser DESATIVAR a busca
// automática e usar sempre o APP_VERSION_FALLBACK acima, deixe como null
// ou string vazia.
export const GITHUB_REPO = 'Guterw/LifeAccessApp';