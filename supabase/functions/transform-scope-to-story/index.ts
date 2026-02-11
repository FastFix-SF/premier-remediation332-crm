import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-tenant-id',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { scopeOfWork, description, clientName, propertyAddress, projectType, industry } = await req.json();

    const textToTransform = scopeOfWork || description;
    if (!textToTransform) {
      throw new Error('Scope of work or description is required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const industryLabel = industry || 'home improvement';

    const prompt = `Transform this technical scope of work into TWO outputs for a ${industryLabel} project portfolio:

OUTPUT 1 - SHORT DESCRIPTION (1-2 sentences):
A compelling teaser for a project card. Should grab attention and make readers want to learn more.

OUTPUT 2 - FULL STORY (2-3 paragraphs):
An engaging story-style description that:
1. Sounds like an exciting transformation narrative
2. Is written for public viewing (homeowners and potential customers)
3. Highlights the challenges overcome and benefits achieved
4. Uses engaging, professional language
5. Keeps the key technical details but presents them in an accessible way
6. Focuses on the customer experience and outcome

Project Details:
- Client: ${clientName || 'The property owner'}
- Property: ${propertyAddress || 'A local property'}
- Project Type: ${projectType || industryLabel + ' project'}
- Industry: ${industryLabel}

Technical Scope / Description:
${textToTransform}

IMPORTANT: Respond in this exact JSON format:
{"shortDescription": "...", "story": "..."}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert storyteller specializing in ${industryLabel} narratives. Create engaging, professional stories that showcase successful projects while maintaining credibility and highlighting technical expertise. Always respond with valid JSON.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      // Fallback: use the whole response as the story
      parsed = { shortDescription: content.substring(0, 150), story: content };
    }

    console.log('Story transformation completed successfully');

    return new Response(JSON.stringify({
      success: true,
      shortDescription: parsed.shortDescription,
      story: parsed.story,
      // Keep backwards compatibility
      storyDescription: parsed.story,
      originalScope: textToTransform,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in transform-scope-to-story function:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
