
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

serve(async (req) => {
  console.log("Edge function received request");
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS preflight request");
    return new Response(null, { 
      headers: corsHeaders,
      status: 204 
    });
  }

  try {
    // Check if request is valid
    if (!req.body) {
      console.error("Request has no body");
      return new Response(
        JSON.stringify({ error: 'Request body is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Check Content-Type
    const contentType = req.headers.get('content-type');
    console.log(`Content-Type header: ${contentType}`);
    
    if (!contentType || !contentType.includes('application/json')) {
      console.error("Invalid Content-Type:", contentType);
      return new Response(
        JSON.stringify({ error: 'Content-Type must be application/json' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }
    
    let body;
    try {
      // Get request body as text first to validate it's not empty
      const bodyText = await req.text();
      console.log("Request body length:", bodyText.length);
      
      if (!bodyText || bodyText.trim() === '') {
        console.error("Empty request body");
        return new Response(
          JSON.stringify({ error: 'Request body cannot be empty' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400 
          }
        );
      }
      
      // Then try to parse as JSON
      try {
        body = JSON.parse(bodyText);
        console.log("Parsed request body:", JSON.stringify(body).substring(0, 100));
      } catch (parseError) {
        console.error("JSON parse error:", parseError.message);
        return new Response(
          JSON.stringify({ 
            error: 'Invalid JSON in request body', 
            details: parseError.message,
            receivedText: bodyText.substring(0, 50) + (bodyText.length > 50 ? '...' : '')
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400 
          }
        );
      }
    } catch (bodyError) {
      console.error("Error reading request body:", bodyError);
      return new Response(
        JSON.stringify({ error: 'Error reading request body', details: bodyError.message }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Extract access token
    const { accessToken } = body || {};
    
    if (!accessToken) {
      console.error("Missing access token in request");
      return new Response(
        JSON.stringify({ error: 'Access token is required', receivedBody: JSON.stringify(body) }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }
    
    console.log("Fetching ADFS user info from Edge Function...");
    
    try {
      const response = await fetch("https://api.ciser.com.br/copiloto-vendas-api-qas/v1/users/me", {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("ADFS API error:", response.status, errorText);
        
        return new Response(
          JSON.stringify({ error: `API Error: ${response.status}`, details: errorText }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: response.status 
          }
        );
      }
      
      const adfsData = await response.json();
      console.log("ADFS API response received successfully");
      
      return new Response(
        JSON.stringify(adfsData),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    } catch (fetchError) {
      console.error("Error fetching from ADFS API:", fetchError);
      return new Response(
        JSON.stringify({ error: 'Error connecting to ADFS API', details: fetchError.message }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }
  } catch (error) {
    console.error("Unexpected error in Edge Function:", error);
    
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', details: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
