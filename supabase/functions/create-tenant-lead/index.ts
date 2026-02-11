import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-tenant-id",
};

interface TenantLeadRequest {
  tenantId: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company?: string;
  service?: string;
  referralSource?: string;
  message?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const request: TenantLeadRequest = await req.json();
    console.log("Tenant lead creation request:", request);

    // Validate required fields
    if (!request.tenantId) {
      return new Response(
        JSON.stringify({ success: false, error: "Tenant ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!request.name || !request.email) {
      return new Response(
        JSON.stringify({ success: false, error: "Name and email are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Running on the tenant's own Supabase project
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Verify the tenant exists
    const { data: tenant, error: tenantError } = await supabase
      .from('businesses')
      .select('id, name')
      .eq('id', request.tenantId)
      .maybeSingle();

    if (tenantError || !tenant) {
      console.error("Tenant not found:", tenantError);
      return new Response(
        JSON.stringify({ success: false, error: "Tenant not found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Try inserting into the leads table (the CRM's main leads table)
    const leadData = {
      tenant_id: request.tenantId,
      name: request.name,
      email: request.email,
      phone: request.phone || null,
      address: request.address || null,
      company_name: request.company || null,
      service_type: request.service || null,
      source: request.referralSource || 'website',
      notes: request.message || null,
      status: 'new',
    };

    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert(leadData)
      .select('id')
      .single();

    if (leadError) {
      console.error("Failed to create lead:", leadError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to create lead", details: leadError.message }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Lead created successfully:", lead.id);

    // Send SMS notification to tenant owner if Twilio is configured
    let smsSent = false;
    try {
      const twilioSid = Deno.env.get('TWILIO_ACCOUNT_SID');
      const twilioToken = Deno.env.get('TWILIO_AUTH_TOKEN');
      const twilioFromNumber = Deno.env.get('TWILIO_FROM_NUMBER');

      if (twilioSid && twilioToken && twilioFromNumber) {
        // Get tenant owner's phone from team_directory
        const { data: owner } = await supabase
          .from('team_directory')
          .select('phone, name')
          .eq('tenant_id', request.tenantId)
          .eq('role', 'owner')
          .eq('status', 'active')
          .maybeSingle();

        if (owner?.phone) {
          let ownerPhone = owner.phone.replace(/\D/g, '');
          if (ownerPhone.length === 10) ownerPhone = `+1${ownerPhone}`;
          else if (ownerPhone.length === 11 && ownerPhone.startsWith('1')) ownerPhone = `+${ownerPhone}`;

          const smsMessage = `New lead for ${tenant.name}!\n\nName: ${request.name}\nEmail: ${request.email}${request.phone ? `\nPhone: ${request.phone}` : ''}${request.service ? `\nService: ${request.service}` : ''}\n\nCheck your dashboard for details.`;

          const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;
          const smsResponse = await fetch(twilioUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${btoa(`${twilioSid}:${twilioToken}`)}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              To: ownerPhone,
              From: twilioFromNumber,
              Body: smsMessage,
            }),
          });

          if (smsResponse.ok) {
            smsSent = true;
            console.log("SMS notification sent to tenant owner");
          } else {
            console.error("Failed to send SMS:", await smsResponse.text());
          }
        }
      }
    } catch (smsError) {
      console.error("Error sending SMS notification:", smsError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Lead created successfully",
        leadId: lead.id,
        tenantName: tenant.name,
        smsSent
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error in create-tenant-lead:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
