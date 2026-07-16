// NotificationService removed as part of codebase optimization
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Initialize a service role client to fetch user preferences securely
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export async function POST(req: Request) {
  try {
    const payload = await req.json()
    
    const secret = req.headers.get('x-webhook-secret')
    if (!process.env.WEBHOOK_SECRET || secret !== process.env.WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized webhook request' }, { status: 401 })
    }

    const { type, record } = payload
    
    // We listen to database changes on `users` table or auth webhook
    if (type === 'UPDATE' && record?.last_sign_in_at) {
      const userId = record.id
      
      const { data: notifPrefs } = await supabaseAdmin
        .from('notification_preferences')
        .select('*, users!inner(email, telegram_chat_id)')
        .eq('user_id', userId)
        .single()
        
      if (notifPrefs) {
        const mergedPrefs = { 
          ...notifPrefs, 
          user_email: (notifPrefs.users as any)?.email,
          telegram_chat_id: (notifPrefs.users as any)?.telegram_chat_id
        }
        
        // Notify daily login if email marketing/alerts is broadly accepted
        // or if we add a specific `email_login_alerts` flag in the future
        if (mergedPrefs.email_marketing || mergedPrefs.email_trade_alerts) {
           console.log(`[MOCK NOTIFY] sendEmail sent to user ${mergedPrefs.user_email}`);
        }
      }
    }
    
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Webhook error:', err)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
