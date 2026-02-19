import type { UseCase } from "./db";

export function matchUseCases(
  useCases: UseCase[],
  attemptedIds: string[],
  userRole: string | null,
  userTimePriorities: string[] | null,
  aiTools: string[]
): UseCase[] {
  const excludeSet = new Set(attemptedIds);
  const available = useCases.filter((uc) => !excludeSet.has(uc.id));

  if (aiTools.length === 0) return available.slice(0, 3);

  const filtered = available.filter((uc) => aiTools.includes(uc.tool));

  const scored = filtered.map((uc) => {
    let score = 0;
    if (userRole && (uc.role === userRole || uc.role === "Other")) {
      score += 10;
    } else if (uc.role === "Other") {
      score += 3;
    }
    if (userTimePriorities?.includes(uc.time_activity)) {
      score += 5;
    }
    if (userRole && uc.role === userRole && userTimePriorities?.includes(uc.time_activity)) {
      score += 10;
    }
    return { useCase: uc, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const result = scored.slice(0, 3).map((s) => s.useCase);

  if (result.length < 3) {
    const remaining = filtered
      .filter((uc) => !result.includes(uc))
      .slice(0, 3 - result.length);
    return [...result, ...remaining];
  }

  return result;
}
