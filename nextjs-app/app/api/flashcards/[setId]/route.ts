import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: Request,
  context: { params: Promise<{ setId: string }> }
) {
  try {
    const { setId } = await context.params
    const supabase = await createClient()

    const { data: flashcards, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('set_id', setId)
      .order('order_index')

    if (error) {
      console.error('Error fetching flashcards:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ flashcards })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
