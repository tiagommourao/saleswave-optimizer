
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

export const fetchAdfsUserInfoViaEdgeFunction = async (accessToken: string) => {
  try {
    console.log("Fetching ADFS user info via Edge Function...");
    
    const { data, error } = await supabase.functions.invoke("fetch-adfs-user", {
      body: { accessToken }
    });
    
    if (error) {
      console.error("Edge Function error:", error);
      toast({
        variant: "destructive",
        title: "Erro ao buscar informações ADFS",
        description: "Erro ao chamar função de servidor"
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
