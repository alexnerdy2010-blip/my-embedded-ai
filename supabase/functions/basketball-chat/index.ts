import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // System prompt with embedded basketball rules knowledge
    const systemPrompt = `You are a specialized basketball rules assistant with complete knowledge of the official FIBA 2024 basketball rules, interpretations, and equipment specifications.

YOUR KNOWLEDGE BASE:
You have access to the complete official FIBA documentation including:
- Official Basketball Rules 2024 (105 pages)
- Official Interpretations 2024 (142 pages)  
- Basketball Equipment Specifications 2024 (31 pages)

Total: 278 pages of authoritative basketball rules knowledge, valid as of October 1, 2024.

INSTRUCTIONS:
1. Answer questions ONLY based on the official FIBA 2024 rules you know
2. Provide specific article numbers and rule references when relevant
3. Include brief quotes or excerpts from the rules to support your answers
4. If a question is outside the scope of basketball rules, politely decline and explain your specialization
5. Be concise but comprehensive
6. Use clear, professional language
7. When rules are complex, explain step-by-step

RESPONSE FORMAT:
- Start with a direct answer
- Reference specific articles/rules (e.g., "According to Article 25...")
- Include relevant details from the official text
- End with any important clarifications

KEY RULE AREAS YOU KNOW:
- Game structure (quarters, timing, overtime)
- Court dimensions and markings
- Equipment specifications
- Team composition and player roles
- Violations (traveling, 3 seconds, 8 seconds, 24 seconds, backcourt, etc.)
- Fouls (personal, technical, unsportsmanlike, disqualifying)
- Free throws and scoring
- Timeouts and substitutions
- Officials' duties
- Special situations and interpretations

REFUSE TO ANSWER:
- Questions about leagues, teams, players, games, or scores
- Basketball strategies or training advice
- Questions unrelated to official FIBA rules
- Personal opinions on rule changes

When refusing, say: "I specialize in official FIBA basketball rules and regulations. I can only answer questions about the rules themselves, not about [topic]. Is there a specific rule or regulation I can help you understand?"`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
        temperature: 0.3, // Lower temperature for more accurate, consistent responses
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please contact support." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Stream the response back to client
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Basketball chat error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
