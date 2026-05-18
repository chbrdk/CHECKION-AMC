/** Short label for competitive model tabs on narrow viewports. */
export function shortenCompetitiveModelLabel(model: string): string {
  const id = model.toLowerCase();
  if (id.includes('gpt') || id.includes('openai')) return 'GPT';
  if (id.includes('claude') || id.includes('anthropic')) return 'Claude';
  if (id.includes('gemini')) return 'Gemini';
  if (model.length <= 14) return model;
  return `${model.slice(0, 12)}…`;
}
