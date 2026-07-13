// src/hooks/useAppVersion.js
import { useState, useEffect } from 'react';
import { APP_VERSION_FALLBACK, GITHUB_REPO } from '../config/appVersion';

const CACHE_KEY = 'lifeaccess_app_version_cache';
const RATE_LIMIT_KEY = 'lifeaccess_github_rate_limit';

// Intervalo mínimo entre duas tentativas de busca (não é um "cache forte",
// é só uma trava curta para evitar disparar 2 requisições seguidas por
// causa de re-render/StrictMode). Isso permite que a versão seja
// atualizada a cada entrada no app, sempre que o limite de requisições
// do GitHub permitir.
const MIN_REFETCH_INTERVAL_MS = 60 * 1000; // 1 minuto

// Hook que devolve a "versão" do app para ser exibida na UI (ex: no rodapé).
//
// Estratégia:
// 1. Mostra imediatamente o último valor salvo em cache (ou o fallback
//    manual, se nunca buscou antes), para nunca deixar o rodapé vazio.
// 2. Em toda entrada no app, tenta buscar o título do último commit do
//    repositório público configurado em GITHUB_REPO via API do GitHub.
// 3. A API do GitHub devolve nos headers quantas requisições ainda restam
//    (x-ratelimit-remaining) e quando o limite reseta (x-ratelimit-reset).
//    Guardamos isso localmente: se o limite já tiver acabado, a busca é
//    pulada e continuamos mostrando o último valor em cache, sem erro.
// 4. Qualquer falha (offline, repo privado, rate limit, etc.) é silenciosa.
export function useAppVersion() {
  const [version, setVersion] = useState(APP_VERSION_FALLBACK);

  useEffect(() => {
    let cancelled = false;

    const readJson = (key) => {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    };

    const writeJson = (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // localStorage indisponível (modo privado, etc.) — sem problema
      }
    };

    const cached = readJson(CACHE_KEY);
    if (cached?.version) setVersion(cached.version);

    if (!GITHUB_REPO) return; // busca automática desativada

    const now = Date.now();

    // Se buscamos há pouquíssimo tempo (ex: remontagem rápida do componente),
    // não dispara outra requisição à toa.
    if (cached?.cachedAt && now - cached.cachedAt < MIN_REFETCH_INTERVAL_MS) {
      return;
    }

    // Se o limite de requisições do GitHub já esgotou e ainda não chegou
    // a hora do reset, não tenta buscar — só mantém o cache atual.
    const rateLimit = readJson(RATE_LIMIT_KEY);
    if (rateLimit && rateLimit.remaining <= 0 && now < rateLimit.resetAt) {
      return;
    }

    const fetchLatestCommitTitle = async () => {
      try {
        const res = await fetch(
          `https://api.github.com/repos/${GITHUB_REPO}/commits?per_page=1`
        );

        // Guarda o estado do limite de requisições, informado pelo próprio
        // GitHub nos headers, para decidir se vale tentar de novo depois.
        const remainingHeader = res.headers.get('x-ratelimit-remaining');
        const resetHeader = res.headers.get('x-ratelimit-reset');
        const remaining = parseInt(remainingHeader, 10);
        const resetAtSeconds = parseInt(resetHeader, 10);

        if (!Number.isNaN(remaining) && !Number.isNaN(resetAtSeconds)) {
          writeJson(RATE_LIMIT_KEY, {
            remaining,
            resetAt: resetAtSeconds * 1000, // GitHub manda em segundos (epoch)
          });
        }

        if (!res.ok || cancelled) return; // ex: repo não encontrado, limite estourado, etc.

        const data = await res.json();
        const rawMessage = data?.[0]?.commit?.message;
        if (!rawMessage || cancelled) return;

        // Usa só a primeira linha da mensagem de commit (o "título")
        const title = String(rawMessage).split('\n')[0].trim();
        if (!title) return;

        setVersion(title);
        writeJson(CACHE_KEY, { version: title, cachedAt: Date.now() });
      } catch {
        // Sem internet ou erro de rede — mantém o que já estava em cache/fallback
      }
    };

    fetchLatestCommitTitle();

    return () => {
      cancelled = true;
    };
  }, []);

  return version;
}