import { NextResponse } from 'next/server'

// Generate a simple random ID for session tracking (client-side only, no persistence)
function generateSessionId() {
  return `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export async function POST(request: Request) {
  try {
    const { setId, isGuest = true } = await request.json()

    // Return a mock session object without persisting to database
    // All session tracking is handled client-side
    const session = {
      id: generateSessionId(),
      set_id: setId,
      user_id: null,
      is_guest: isGuest,
      guest_session_id: generateSessionId(),
      score: 0,
      total_attempts: 0,
      started_at: new Date().toISOString(),
      completed_at: null,
    }

    return NextResponse.json({ session })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { sessionId, score, totalAttempts, completed } = await request.json()

    // Return updated session data without persisting
    // Session data is tracked client-side only
    const session = {
      id: sessionId,
      score,
      total_attempts: totalAttempts,
      completed_at: completed ? new Date().toISOString() : null,
    }

    return NextResponse.json({ session })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
