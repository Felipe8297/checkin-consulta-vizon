import { QUESTIONS, SCORE_BANDS, type ScoreBand } from "./form-config";

/** Soma os pontos de todas as respostas selecionadas (labels). */
export function calcScore(answers: Record<string, string[]>): number {
  return QUESTIONS.reduce((sum, q) => {
    const sel = answers[q.id] ?? [];
    return (
      sum +
      sel.reduce((s, label) => {
        const opt = q.options.find((o) => o.label === label);
        return s + (opt?.points ?? 0);
      }, 0)
    );
  }, 0);
}

/**
 * Faixa correspondente ao score: min <= score <= max (máximo INCLUSIVO —
 * as faixas são declaradas como 0–15, 16–29, 30–50, 51+).
 */
export function getBand(score: number): ScoreBand {
  const faixa = SCORE_BANDS.find((b) => score >= b.min && score <= b.max);
  if (faixa) return faixa;
  // Fora de qualquer faixa: abaixo do mínimo cai na primeira; acima do
  // máximo cai na última (nunca subestima o sintoma).
  return score < SCORE_BANDS[0].min ? SCORE_BANDS[0] : SCORE_BANDS[SCORE_BANDS.length - 1];
}

/** Pontos de uma única pergunta (para o detalhamento no PDF). */
export function questionPoints(questionId: string, selected: string[]): number {
  const q = QUESTIONS.find((qq) => qq.id === questionId);
  if (!q) return 0;
  return selected.reduce((s, label) => {
    const opt = q.options.find((o) => o.label === label);
    return s + (opt?.points ?? 0);
  }, 0);
}
