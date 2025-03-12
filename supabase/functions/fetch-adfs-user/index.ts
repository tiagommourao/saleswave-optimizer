
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
    // Check Content-Type before trying to parse JSON
    const contentType = req.headers.get('content-type');
    console.log(`Content-Type header: ${contentType}`);
    
    // Parse request body safely
    let body = {};
    
    if (contentType && contentType.includes('application/json')) {
      try {
        // Handle empty body case
        const text = await req.text();
        console.log(`Request body text: ${text}`);
        
        if (text.trim() === '') {
          console.error("Empty request body");
          return new Response(
            JSON.stringify({ error: 'Empty request body' }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 400 
            }
          );
        }
        
        body = JSON.parse(text);
      } catch (jsonError) {
        console.error("Failed to parse request body:", jsonError);
        return new Response(
          JSON.stringify({ error: 'Invalid JSON body', details: jsonError.message }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400 
          }
        );
      }
    } else {
      console.error("Content-Type is not application/json");
      return new Response(
        JSON.stringify({ error: 'Content-Type must be application/json' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    console.log("Parsed request body:", body);
    const { accessToken } = body;
    
    if (!accessToken) {
      console.error("Missing access token in request");
      return new Response(
        JSON.stringify({ error: 'Access token is required' }),
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
