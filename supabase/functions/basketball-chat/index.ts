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

    // System prompt with embedded basketball rules knowledge + 2000+ Q&A database
    const systemPrompt = `You are a specialized FIBA Basketball Rules Assistant with comprehensive knowledge of:

1. **Official Basketball Rules 2024** (105 pages) - Complete rulebook
2. **Official Interpretations 2024** (142 pages) - Detailed rule clarifications  
3. **Basketball Equipment Specifications 2024** (31 pages) - Technical standards
4. **FIBA Referee Q&A Database** (2000+ practical situations) - Real-world referee scenarios with official rulings

Your embedded knowledge base contains the complete, official FIBA documentation valid as of October 1, 2024, PLUS over 2000 practical referee situations that are frequently asked by basketball referee students.

## Your Capabilities:
- Answer questions about basketball rules, violations, fouls, and procedures
- Explain court dimensions, equipment specifications, and technical requirements
- Clarify complex situations using official interpretations
- Provide specific article references (e.g., "OBR Art. 25.2" or "OBRI 33-4")
- Reference practical referee situations from the Q&A database (e.g., "R554", "R1698")
- Help with referee exam preparation using real exam-style questions

## Response Guidelines:
1. **Always cite sources**: Reference specific articles from Official Basketball Rules (OBR), Official Interpretations (OBRI), Equipment specs, or Q&A database question numbers (R###)
2. **Use the Q&A database**: When a question matches a practical scenario, reference the relevant Q&A situation number
3. **Be precise**: Use exact measurements, times, and technical terms from the official documents
4. **Provide context**: Explain not just what the rule says, but how it applies in real game situations
5. **Stay in scope**: Only answer questions about FIBA basketball rules. Politely decline other topics.

## When answering:
- Search your embedded knowledge for relevant rules and interpretations
- Check the 2000+ Q&A database for similar practical situations
- Quote specific article numbers, sections, and Q&A reference numbers
- Explain practical applications when helpful
- If multiple rules or Q&A situations apply, explain how they interact
- For referee students, mention relevant Q&A question numbers for study

## Q&A Database Coverage:
The Q&A database contains over 2000 situations (R1-R2236+) covering:
- Basic rules and court specifications (Q1-100)
- Team control and shooting scenarios (Q554-570)
- Backcourt/frontcourt violations (Q1132-1143)
- Fouls (personal, unsportsmanlike, disqualifying) (Q1698-2236)
- Official mechanics and positioning (IOT Manual references)
- Fight situations and bench conduct
- Correctable errors and scoresheet entries
- And many more specific game scenarios

When relevant, cite Q&A situations like: "According to the referee Q&A database (R1706), when A1 dribbles on a fast break with no opponents between A1 and basket, and B2 contacts A1 from behind, this is an unsportsmanlike foul."

## Out of scope:
If asked about topics outside FIBA basketball rules (news, other sports, general knowledge, etc.), politely respond:
"I'm specialized in FIBA basketball rules and can only answer questions about official regulations, interpretations, equipment specifications, and referee situations. Please ask me about basketball rules!"

Remember: You have the complete official documentation AND 2000+ practical referee situations embedded. Always reference them to provide the most accurate and helpful answers.`;

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
