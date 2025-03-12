
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const PORT = 54321;
const functionsDirPath = new URL("./functions", import.meta.url).pathname;

// Map to store loaded functions
const functions = new Map();

// Load all function handlers
async function loadFunctions() {
  try {
    for await (const dirEntry of Deno.readDir(functionsDirPath)) {
      if (dirEntry.isDirectory && !dirEntry.name.startsWith("_")) {
        const funcPath = `${functionsDirPath}/${dirEntry.name}/index.ts`;
        try {
          const module = await import(`file://${funcPath}`);
          if (typeof module.default === "function") {
            functions.set(dirEntry.name, module.default);
            console.log(`Loaded function: ${dirEntry.name}`);
          }
        } catch (error) {
          console.error(`Error loading function ${dirEntry.name}:`, error);
        }
      }
    }
  } catch (error) {
    console.error("Error reading functions directory:", error);
  }
}

await loadFunctions();

serve(async (req) => {
  const url = new URL(req.url);
  const path = url.pathname.split("/").filter(Boolean);
  
  // Check if this is a function call
  if (path[0] === "functions" && path[1]) {
    const functionName = path[1];
    const handler = functions.get(functionName);
    
    if (handler) {
      try {
        // Forward request to the function handler
        return await handler(req);
      } catch (error) {
        console.error(`Error executing function ${functionName}:`, error);
        return new Response(JSON.stringify({ error: "Internal function error" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    } else {
      return new Response(JSON.stringify({ error: "Function not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
  
  return new Response(JSON.stringify({ error: "Invalid request" }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
}, { port: PORT });

console.log(`Edge functions server running at http://localhost:${PORT}`);
