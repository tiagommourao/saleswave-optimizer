
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

export const fetchAdfsUserInfoViaEdgeFunction = async (accessToken: string) => {
  try {
    console.log("Fetching ADFS user info via Edge Function...");
    
    // Add better error handling and debugging
    if (!accessToken) {
      console.error("No access token provided");
      toast({
        variant: "destructive",
        title: "Erro ao buscar informações ADFS",
        description: "Token de acesso não fornecido"
      });
      return null;
    }

    console.log("Calling Edge Function with access token:", accessToken.substring(0, 10) + "...");
    
    // Garante que o corpo da requisição é formatado corretamente
    const requestBody = JSON.stringify({ accessToken });
    console.log("Request body:", requestBody.substring(0, 30) + "...");
    
    const { data, error } = await supabase.functions.invoke("fetch-adfs-user", {
      method: "POST",
      body: requestBody,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (error) {
      console.error("Edge Function error:", error);
      toast({
        variant: "destructive",
        title: "Erro ao buscar informações ADFS",
        description: `Erro ao chamar função: ${error.message || "Erro desconhecido"}`
      });
      return null;
    }
    
    if (!data) {
      console.error("Edge Function returned no data");
      toast({
        variant: "destructive",
        title: "Erro ao buscar informações ADFS",
        description: "Nenhum dado retornado do servidor"
      });
      return null;
    }
    
    console.log("ADFS API response via Edge Function:", data);
    return data;
    
  } catch (err) {
    console.error("Error calling Edge Function:", err);
    toast({
      variant: "destructive",
      title: "Erro ao buscar informações ADFS",
      description: "Não foi possível buscar informações do ADFS"
    });
    return null;
  }
};
