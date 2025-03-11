
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

  const fetchGraphProfile = async (accessToken: string) => {
    try {
      console.log("Fetching user profile from Microsoft Graph API...");
      
      const response = await fetch("https://graph.microsoft.com/v1.0/me", {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Graph API error:", response.status, errorText);
        toast({
          variant: "destructive",
          title: "Erro ao buscar perfil",
          description: `Erro ao buscar perfil do Microsoft Graph: ${response.status}`
        });
        return null;
      }
      
      const profileData = await response.json();
      console.log("Graph API response:", profileData);
      
      // Try to fetch profile photo
      let photoUrl = null;
      try {
        const photoResponse = await fetch("https://graph.microsoft.com/v1.0/me/photo/$value", {
          headers: {
            "Authorization": `Bearer ${accessToken}`
          }
        });
        
        if (photoResponse.ok) {
          const blob = await photoResponse.blob();
          photoUrl = URL.createObjectURL(blob);
          console.log("Retrieved profile photo URL:", photoUrl);
        } else {
          console.log("No profile photo available:", photoResponse.status);
        }
      } catch (photoError) {
        console.error("Error fetching profile photo:", photoError);
      }
      
      return {
        ...profileData,
        photoUrl
      };
    } catch (err) {
      console.error("Error fetching Graph profile:", err);
      toast({
        variant: "destructive",
        title: "Erro ao buscar perfil",
        description: "Não foi possível buscar informações do Microsoft Graph"
      });
      return null;
    }
  };

  const saveUserInfo = async (userData: User) => {
    if (!userData || !userData.profile) {
      console.error("User data or profile missing");
      return;
    }
    
    try {
      console.log("Attempting to save user info to Supabase...");
      
      // Log the entire profile object for debugging
      console.log("User profile data from token:", userData.profile);
      console.log("Access token:", userData.access_token);
      
      // Extract user_id from profile
      const userId = userData.profile.sub;
      if (!userId) {
        console.error("User ID is missing from profile", userData.profile);
        return;
      }

      // Get IP address
      let ipAddress = '';
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        ipAddress = data.ip;
        console.log("Retrieved IP address:", ipAddress);
      } catch (ipError) {
        console.error("Error getting IP address:", ipError);
      }

      // Get user agent
      const userAgent = window.navigator.userAgent;
      
      // Get additional user information from Microsoft Graph API
      const graphProfile = await fetchGraphProfile(userData.access_token);
      console.log("Graph profile retrieved:", graphProfile);
      
      // Prepare user info combining token data and graph API data
      const email = userData.profile.email || 
                   userData.profile.preferred_username || 
                   (graphProfile ? graphProfile.mail || graphProfile.userPrincipalName : null);
                   
      const displayName = userData.profile.name || 
                         (graphProfile ? graphProfile.displayName : null);
                         
      const firstName = graphProfile ? graphProfile.givenName : null;
      const lastName = graphProfile ? graphProfile.surname : null;
      const jobTitle = graphProfile ? graphProfile.jobTitle : null;
      
      // Map officeLocation to department as requested
      const department = graphProfile ? graphProfile.officeLocation : null;
      
      // Map the actual office location from graph
      const officeLocation = graphProfile ? graphProfile.officeLocation : null;
      
      // Use the photo from Graph API for the profile image
      const profileImageUrl = graphProfile ? graphProfile.photoUrl : null;
      
      console.log("Final mapped user fields:", {
        email,
        displayName,
        firstName,
        lastName,
        profileImageUrl,
        jobTitle,
        department, // This is mapped from officeLocation
        officeLocation
      });

      const userInfo = {
        user_id: userId,
        email: email,
        display_name: displayName,
        first_name: firstName,
        last_name: lastName,
        profile_image_url: profileImageUrl,
        job_title: jobTitle,
        department: department, // Now mapped from officeLocation
        office_location: officeLocation,
        user_agent: userAgent,
        ip_address: ipAddress,
        id_token: userData.id_token,
        raw_profile: userData.profile,
        login_timestamp: new Date().toISOString(),
        last_active: new Date().toISOString(),
        access_token: userData.access_token // Added access token to user_info
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
        scope: "openid profile email User.Read User.ReadBasic.All",
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
