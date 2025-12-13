export interface Flashcard {
  id: string
  set_id: string
  task: string
  answer: string
  description: string
  when_to_use: string
  scenarios: string[]
  order_index: number | null
}

export interface FlashcardSet {
  id: string
  name: string
  description: string | null
  card_count: number
  category?: string
  categoryLabel?: string
  difficulty?: string
  estimatedTime?: string
  icon?: string
  color?: string
}

export interface UserProgress {
  id: string
  user_id: string | null
  flashcard_id: string
  session_id: string | null
  user_answer: string | null
  is_correct: boolean
  attempted_at: string
}

export interface UserSession {
  id: string
  user_id: string | null
  set_id: string
  score: number
  total_attempts: number
  started_at: string
  completed_at: string | null
  is_guest: boolean
  guest_session_id: string | null
}

export interface CardState {
  userAnswer: string
  isCorrect: boolean
  retryCount?: number // For hard mode: tracks how many times user has retried this card
}

export interface AppState {
  currentIndex: number
  currentScore: number
  totalAttempts: number
  cardStates: (CardState | null)[]
  isAnswered: boolean
  hardMode: boolean
  currentRetryAttempt?: number // Current retry attempt (1-3) for hard mode
}
