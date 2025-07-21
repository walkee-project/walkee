export const getDifficulty = (timeInSeconds: number): string => {
  const minutes = timeInSeconds / 60;
  if (minutes < 30) return "초급";
  if (minutes <= 60) return "중급";
  return "상급";
}; 