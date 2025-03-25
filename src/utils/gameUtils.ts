export function generateDivisionProblem(level = 1) {
  // As levels increase, use larger numbers
  const levelMultiplier = Math.min(level * 0.5, 3); // Cap at 3x for higher levels
  
  // Adjust divisors and results based on level
  const divisors = [2, 3, 4, 5, 6, 7, 8, 9];
  const baseResults = [6, 8, 9, 12, 15, 16, 18, 20, 24, 25];
  
  // For higher levels, add some larger results
  let results = [...baseResults];
  if (level > 3) {
    results = [...results, 30, 36, 40, 42, 45, 48, 50, 54];
  }
  
  const result = results[Math.floor(Math.random() * results.length)];
  const divisor = divisors[Math.floor(Math.random() * divisors.length)];
  const dividend = result * divisor;
  
  // Generate 5 options around the correct answer
  // For lower levels, keep options close to the answer
  // For higher levels, spread them out more
  const spreadFactor = Math.min(1 + Math.floor(level / 3), 4);
  
  const baseOptions = [
    result - (2 * spreadFactor), 
    result - spreadFactor, 
    result, 
    result + spreadFactor, 
    result + (2 * spreadFactor)
  ];
  
  return {
    problem: `${dividend} ÷ ${divisor} is the safe mine`,
    correctAnswer: result,
    options: baseOptions.sort(() => Math.random() - 0.5)
  };
}
