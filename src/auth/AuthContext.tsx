import React, { createContext, useContext, useEffect, useState } from "react";
import { User, UserManager, WebStorageStateStore, Log } from "oidc-client-ts";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

type AuthConfig = {
  authority: string;
  client_id: string;
  redirect_uri: string;
  post_logout_redirect_uri: string;
  response_type: string;
  scope: string;
};

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  userManager: UserManager | null;
  login: () => void;
  logout: () => void;
  error: Error | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  userManager: null,
  login: () => {},
  logout: () => {},
  error: null,
  isLoading: true
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
  clientId: string;
  tenant: string;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, clientId, tenant }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userManager, setUserManager] = useState<UserManager | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const saveUserInfo = async (userData: User) => {
    if (!userData || !userData.profile) {
      console.error("User data or profile missing");
      return;
    }
    
    try {
      console.log("Attempting to save user info to Supabase...");
      console.log("User profile data:", userData.profile);
      
      const userId = userData.profile.sub;
      if (!userId) {
        console.error("User ID is missing from profile", userData.profile);
        return;
      }

      let ipAddress = '';
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        ipAddress = data.ip;
        console.log("Retrieved IP address:", ipAddress);
      } catch (ipError) {
        console.error("Error getting IP address:", ipError);
      }

      const userAgent = window.navigator.userAgent;
      
      const userInfo = {
        user_id: userId,
        email: userData.profile.email || userData.profile.preferred_username || null,
        display_name: userData.profile.name || null,
        first_name: userData.profile.givenName || null,
        last_name: userData.profile.surname || null,
        profile_image_url: userData.profile.thumbnailPhoto || userData.profile.picture || null,
        job_title: userData.profile.jobTitle || null,
        department: userData.profile.department || null,
        office_location: userData.profile.officeLocation || null,
        user_agent: userAgent,
        ip_address: ipAddress,
        id_token: userData.id_token,
        raw_profile: userData.profile,
        login_timestamp: new Date().toISOString(),
        last_active: new Date().toISOString()
      };

      console.log("Prepared user info to save:", userInfo);

      const { data: existingUser, error: fetchError } = await supabase
        .from('user_info')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (fetchError) {
        console.error("Error checking if user exists:", fetchError);
        toast({
          variant: "destructive",
          title: "Erro ao verificar usuário",
          description: "Não foi possível verificar se o usuário já existe: " + fetchError.message
        });
        return;
      }

      let result;

      if (existingUser) {
        result = await supabase
          .from('user_info')
          .update(userInfo)
          .eq('user_id', userId);
      } else {
        result = await supabase
          .from('user_info')
          .insert([userInfo]);
      }
      
      if (result.error) {
        console.error("Error saving user info:", result.error);
        toast({
          variant: "destructive",
          title: "Erro ao salvar informações",
          description: "Não foi possível salvar as informações do usuário: " + result.error.message
        });
      } else {
        console.log("User info saved successfully");
        toast({
          title: "Informações salvas",
          description: "Informações do usuário salvas com sucesso."
        });
      }
    } catch (err) {
      console.error("Error in saveUserInfo:", err);
      toast({
        variant: "destructive",
        title: "Erro ao salvar informações",
        description: "Ocorreu um erro ao salvar as informações do usuário."
      });
    }
  };

  const saveUserToken = async (userData: User) => {
    if (!userData || !userData.profile) {
      console.error("User data or profile missing");
      return;
    }
    
    try {
      console.log("Attempting to save user token to Supabase...");
      
      const userId = userData.profile.sub;
      const username = userData.profile.name || userData.profile.email || 'unknown';
      const accessToken = userData.access_token;
      
      if (!userId) {
        console.error("User ID is missing from profile", userData.profile);
        toast({
          variant: "destructive",
          title: "Erro ao salvar token",
          description: "ID do usuário não encontrado no perfil."
        });
        return;
      }
      
      if (!accessToken) {
        console.error("No access token available to save");
        toast({
          variant: "destructive",
          title: "Erro ao salvar token",
          description: "Token de acesso não disponível."
        });
        return;
      }
      
      console.log("Saving token for user:", userId, "Username:", username);
      
      const { data: existingToken, error: fetchError } = await supabase
        .from('user_tokens')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
        
      if (fetchError) {
        console.error("Error checking if token exists:", fetchError);
        toast({
          variant: "destructive",
          title: "Erro ao verificar token",
          description: "Não foi possível verificar se o token já existe: " + fetchError.message
        });
        return;
      }
      
      let result;
      
      if (existingToken) {
        result = await supabase
          .from('user_tokens')
          .update({
            username: username,
            access_token: accessToken
          })
          .eq('user_id', userId);
      } else {
        result = await supabase
          .from('user_tokens')
          .insert([{
            user_id: userId,
            username: username,
            access_token: accessToken
          }]);
      }
      
      if (result.error) {
        console.error("Error saving user token:", result.error);
        toast({
          variant: "destructive",
          title: "Erro ao salvar token",
          description: "Não foi possível salvar o token de acesso: " + result.error.message
        });
      } else {
        console.log("User token saved successfully:", result.data);
        toast({
          title: "Token salvo",
          description: "Token de acesso salvo com sucesso."
        });
      }
    } catch (err) {
      console.error("Error in saveUserToken:", err);
      toast({
        variant: "destructive",
        title: "Erro ao salvar token",
        description: "Ocorreu um erro ao salvar o token de acesso."
      });
    }
  };

  useEffect(() => {
    const initializeUserManager = () => {
      if (!clientId || !tenant) {
        console.log("Dados de configuração incompletos:", { clientId, tenant });
        setIsLoading(false);
        return null;
      }

      console.log("Iniciando configuração do UserManager com:", { clientId, tenant });
      
      Log.setLogger(console);
      Log.setLevel(Log.DEBUG);

      const authority = `https://login.microsoftonline.com/${tenant}/v2.0`;

      const settings: any = {
        authority,
        client_id: clientId,
        redirect_uri: `${window.location.origin}/auth-callback`,
        post_logout_redirect_uri: window.location.origin,
        response_type: "code",
        scope: "openid profile email",
        automaticSilentRenew: true,
        monitorSession: true,
        userStore: new WebStorageStateStore({ store: window.localStorage }),
      };

      console.log("Configurações finais:", {
        ...settings,
      });

      const manager = new UserManager(settings);
      console.log("UserManager configurado:", manager);
      return manager;
    };

    const manager = initializeUserManager();
    if (manager) {
      setUserManager(manager);

      manager.events.addUserLoaded((loadedUser) => {
        console.log("Usuário carregado:", loadedUser);
        setUser(loadedUser);
        saveUserToken(loadedUser);
        saveUserInfo(loadedUser);
        setIsLoading(false);
      });

      manager.events.addUserUnloaded(() => {
        console.log("Usuário desconectado");
        setUser(null);
        setIsLoading(false);
      });

      manager.events.addSilentRenewError((error) => {
        console.error("Erro na renovação silenciosa:", error);
        setError(error);
      });

      manager.getUser().then((loadedUser) => {
        console.log("Usuario atual verificado:", loadedUser);
        setUser(loadedUser);
        if (loadedUser) {
          saveUserToken(loadedUser);
          saveUserInfo(loadedUser);
        }
        setIsLoading(false);
      }).catch((err) => {
        console.error("Erro ao obter usuário:", err);
        setError(err);
        setIsLoading(false);
      });

      return () => {
        manager.events.removeUserLoaded(() => {});
        manager.events.removeUserUnloaded(() => {});
        manager.events.removeSilentRenewError(() => {});
      };
    } else {
      setIsLoading(false);
    }
  }, [clientId, tenant]);

  const login = async () => {
    if (!userManager) {
      const errorMsg = "Gerenciador de autenticação não inicializado. Verifique suas configurações.";
      console.error(errorMsg);
      toast({
        variant: "destructive",
        title: "Erro de configuração",
        description: errorMsg
      });
      return;
    }

    try {
      console.log("Iniciando redirecionamento para login...");
      await userManager.signinRedirect();
    } catch (err) {
      console.error("Erro no login:", err);
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: error.message
      });
    }
  };

  const logout = async () => {
    if (!userManager) {
      toast({
        variant: "destructive",
        title: "Erro de configuração",
        description: "Gerenciador de autenticação não inicializado."
      });
      return;
    }

    try {
      await userManager.signoutRedirect();
    } catch (err) {
      console.error("Erro no logout:", err);
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      toast({
        variant: "destructive",
        title: "Erro no logout",
        description: error.message
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user && !user.expired,
        user,
        userManager,
        login,
        logout,
        error,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
