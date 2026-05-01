// supabase/functions/create-tech/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { email, password, name, role } = await req.json()

    // Check if user already exists
    const { data: existingUser } = await supabaseClient
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'A user with this email already exists' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Create the user with password (auto-confirmed)
    const { data: authData, error: authError } = await supabaseClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm the email
      user_metadata: { name, role },
    })

    if (authError) throw authError

    // Create profile entry
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .insert({
        id: authData.user.id,
        name: name,
        email: email,
        role: role || 'Nail Technician',
        is_technician: true,
      })

    if (profileError) throw profileError

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Account created successfully',
        user: {
          id: authData.user.id,
          email: email,
          name: name,
          role: role
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})