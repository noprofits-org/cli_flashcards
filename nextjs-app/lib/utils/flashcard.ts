/**
 * Normalizes a clasp command answer for comparison
 * Removes brackets, optional markers, and normalizes whitespace
 */
export function normalizeAnswer(answer: string): string {
  return answer
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/\[options\]/g, '')
    .replace(/\[([^\]]+)\]/g, '') // Remove all bracketed content
    .replace(/<([^>]+)>/g, '') // Remove angle brackets
    .trim()
}

/**
 * Checks if user's answer matches the correct answer
 */
export function isAnswerCorrect(userAnswer: string, correctAnswer: string): boolean {
  return normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer)
}

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Calculates percentage score
 */
export function calculatePercentage(score: number, total: number): number {
  if (total === 0) return 0
  return Math.round((score / total) * 100)
}

/**
 * Gets a motivational message based on score percentage
 */
export function getScoreMessage(percentage: number): string {
  if (percentage === 100) {
    return 'Perfect! You mastered all commands! 🏆'
  } else if (percentage >= 80) {
    return 'Excellent work! You know most commands! 🌟'
  } else if (percentage >= 60) {
    return 'Good effort! Keep practicing! 💪'
  } else if (percentage >= 40) {
    return 'Nice try! Review and try again! 📖'
  } else {
    return 'Keep learning! You\'ll get there! 🚀'
  }
}
