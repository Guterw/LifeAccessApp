// src/data/vocabSpeechLevels.js
// Reaproveita o mesmo banco de palavras do vocab-normal, mas como arquivo
// próprio do módulo Speech (permite no futuro divergir o conteúdo sem tocar
// no vocabulariesLevels.js original).
import { vocabulariesLevels } from './vocabulariesLevels';

export const vocabSpeechLevels = vocabulariesLevels;