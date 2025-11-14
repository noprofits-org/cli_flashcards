export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      flashcard_sets: {
        Row: {
          id: string
          name: string
          description: string | null
          card_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          card_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          card_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      flashcards: {
        Row: {
          id: string
          set_id: string
          task: string
          answer: string
          description: string
          when_to_use: string
          scenarios: Json
          order_index: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          set_id: string
          task: string
          answer: string
          description: string
          when_to_use: string
          scenarios?: Json
          order_index?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          set_id?: string
          task?: string
          answer?: string
          description?: string
          when_to_use?: string
          scenarios?: Json
          order_index?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string | null
          flashcard_id: string
          session_id: string | null
          user_answer: string | null
          is_correct: boolean
          attempted_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          flashcard_id: string
          session_id?: string | null
          user_answer?: string | null
          is_correct: boolean
          attempted_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          flashcard_id?: string
          session_id?: string | null
          user_answer?: string | null
          is_correct?: boolean
          attempted_at?: string
        }
      }
      user_sessions: {
        Row: {
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
        Insert: {
          id?: string
          user_id?: string | null
          set_id: string
          score?: number
          total_attempts?: number
          started_at?: string
          completed_at?: string | null
          is_guest?: boolean
          guest_session_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          set_id?: string
          score?: number
          total_attempts?: number
          started_at?: string
          completed_at?: string | null
          is_guest?: boolean
          guest_session_id?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
