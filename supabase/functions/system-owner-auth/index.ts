import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-tenant-id',
};

// System owner phone number - NOT exposed to tenants
const SYSTEM_OWNER_PHONE = "+15106196839";
const BYPASS_CODE = "510619"; // Last 6 digits of phone as bypass code

interface AuthRequest {
  phone: string;
  code: string;
  tenantId?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200, headers: corsHeaders });
  }

  try {
    const { phone, code, tenantId } = await req.json() as AuthRequest;

    // Normalize phone number
    const normalizedPhone = phone.replace(/\D/g, '');
    const systemOwnerNormalized = SYSTEM_OWNER_PHONE.replace(/\D/g, '');

    // Check if this is the system owner phone
    if (normalizedPhone !== systemOwnerNormalized) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Not authorized for bypass',
          useStandardAuth: true
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the bypass code
    if (code !== BYPASS_CODE) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid bypass code'
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Running on the tenant's own Supabase project - use built-in env vars
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      }
    });

    // Check if system owner user exists, create if not
    const { data: existingUser, error: lookupError } = await supabase.auth.admin.listUsers();

    if (lookupError) {
      console.error('Error listing users:', lookupError);
      return new Response(
        JSON.stringify({ error: 'Failed to access user management', details: lookupError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let userId: string | null = null;
    const systemOwnerEmail = "system-owner@fastfix.ai";

    if (existingUser?.users) {
      const phoneVariants = [
        SYSTEM_OWNER_PHONE,
        SYSTEM_OWNER_PHONE.replace('+', ''),
        '1' + SYSTEM_OWNER_PHONE.replace('+1', ''),
        SYSTEM_OWNER_PHONE.replace('+1', ''),
      ];

      const found = existingUser.users.find(u =>
        phoneVariants.includes(u.phone || '') || u.email === systemOwnerEmail
      );
      if (found) {
        userId = found.id;
        console.log('Found existing system owner user:', userId);
      }
    }

    // If user doesn't exist, create them
    if (!userId) {
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        phone: SYSTEM_OWNER_PHONE,
        email: systemOwnerEmail,
        email_confirm: true,
        phone_confirm: true,
        user_metadata: {
          is_system_owner: true,
          name: 'FastFix System Owner',
        }
      });

      if (createError) {
        console.error('Error creating system owner user:', createError);

        if (createError.message?.includes('already registered')) {
          const { data: userByPhone } = await supabase.auth.admin.listUsers();
          if (userByPhone?.users) {
            const foundByPhone = userByPhone.users.find(u =>
              u.phone === SYSTEM_OWNER_PHONE ||
              u.phone === SYSTEM_OWNER_PHONE.replace('+', '') ||
              u.phone === '1' + SYSTEM_OWNER_PHONE.replace('+1', '')
            );
            if (foundByPhone) {
              userId = foundByPhone.id;
              console.log('Found existing user by phone:', userId);
            }
          }
        }

        if (!userId) {
          return new Response(
            JSON.stringify({ error: 'Failed to create system owner session', details: createError.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      } else {
        userId = newUser.user?.id || null;
      }
    }

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Failed to get user ID' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Set a deterministic password for the system owner
    const systemOwnerPassword = `FastFix!${BYPASS_CODE}#SystemOwner`;

    const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
      password: systemOwnerPassword,
    });

    if (updateError) {
      console.log('Password update note:', updateError.message);
    }

    // Sign in with password to get session tokens
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: systemOwnerEmail,
      password: systemOwnerPassword,
    });

    if (signInError || !signInData?.session) {
      console.error('Sign in error:', signInError);

      // Fallback: Try magic link approach
      const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: systemOwnerEmail,
      });

      if (linkError || !linkData?.properties?.hashed_token) {
        console.error('Link generation error:', linkError);
        return new Response(
          JSON.stringify({
            success: true,
            bypass: true,
            userId,
            email: systemOwnerEmail,
            role: 'system_owner',
            message: 'Auth successful but session creation failed - please try standard OTP',
            noSession: true,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: otpData, error: otpError } = await supabase.auth.verifyOtp({
        token_hash: linkData.properties.hashed_token,
        type: 'email',
      });

      if (otpError || !otpData?.session) {
        console.error('OTP verify error:', otpError);
        return new Response(
          JSON.stringify({
            success: true,
            bypass: true,
            userId,
            email: systemOwnerEmail,
            role: 'system_owner',
            message: 'Auth successful but session creation failed - please try standard OTP',
            noSession: true,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          bypass: true,
          userId,
          email: systemOwnerEmail,
          role: 'system_owner',
          permissions: ['admin', 'owner', 'full_access'],
          message: 'System owner authenticated',
          session: {
            access_token: otpData.session.access_token,
            refresh_token: otpData.session.refresh_token,
            expires_in: otpData.session.expires_in,
            expires_at: otpData.session.expires_at,
          },
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('System owner signed in successfully');

    return new Response(
      JSON.stringify({
        success: true,
        bypass: true,
        userId,
        email: systemOwnerEmail,
        role: 'system_owner',
        permissions: ['admin', 'owner', 'full_access'],
        message: 'System owner authenticated',
        session: {
          access_token: signInData.session.access_token,
          refresh_token: signInData.session.refresh_token,
          expires_in: signInData.session.expires_in,
          expires_at: signInData.session.expires_at,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('System owner auth error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
