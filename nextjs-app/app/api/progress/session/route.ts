import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
  try {
    const { setId, isGuest = true } = await request.json()
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const sessionData = {
      set_id: setId,
      user_id: user?.id || null,
      is_guest: isGuest || !user,
      guest_session_id: !user ? uuidv4() : null,
      score: 0,
      total_attempts: 0,
    }

    const { data: session, error } = await supabase
      .from('user_sessions')
      .insert(sessionData)
      .select()
      .single()

    if (error) {
      console.error('Error creating session:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
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
    const supabase = await createClient()

    const updateData: any = {
      score,
      total_attempts: totalAttempts,
    }

    if (completed) {
      updateData.completed_at = new Date().toISOString()
    }

    const { data: session, error } = await supabase
      .from('user_sessions')
      .update(updateData)
      .eq('id', sessionId)
      .select()
      .single()

    if (error) {
      console.error('Error updating session:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ session })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
