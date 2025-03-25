
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

export function checkCollision(
  tank: { position: number, width: number }, 
  object: { x: number, y: number, width: number, height: number }
): boolean {
  // Convert percentage positions to pixel values (assuming game area width is 100%)
  const tankLeft = tank.position * 25 - tank.width / 2;
  const tankRight = tank.position * 25 + tank.width / 2;
  const tankTop = window.innerHeight - 120; // Approximate tank top position
  const tankBottom = window.innerHeight - 40; // Approximate tank bottom position

  const objectLeft = object.x * 25 - object.width / 2;
  const objectRight = object.x * 25 + object.width / 2;
  const objectTop = object.y;
  const objectBottom = object.y + object.height;

  // Check for overlap in both X and Y axes
  return !(
    tankRight < objectLeft ||
    tankLeft > objectRight ||
    tankBottom < objectTop ||
    tankTop > objectBottom
  );
}

// Generate initial mines for the game
export function generateInitialMines(correctAnswer: number, options: number[]) {
  return options.map((value, index) => ({
    value,
    x: index,
    y: -100 - Math.random() * 300, // Start off-screen at varying heights
    isCorrect: value === correctAnswer,
    isHit: false
  }));
}

// Generate coins randomly
export function generateCoins(count = 10) {
  const coins = [];
  for (let i = 0; i < count; i++) {
    coins.push({
      id: i,
      x: Math.floor(Math.random() * 5),  // 0-4 horizontal
      y: -100 - Math.random() * 800, // Start off-screen at varying heights
      collected: false
    });
  }
  return coins;
}
