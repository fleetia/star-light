export function isCancelledGame(scores, cancellationReason) {
  const reason = cancellationReason.trim();
  return scores.length === 0 && reason !== "" && reason !== "-";
}
