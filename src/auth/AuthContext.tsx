
import React, { createContext, useEffect, useState } from "react";
import { User, UserManager, WebStorageStateStore, Log } from "oidc-client-ts";
import { useToast } from "@/hooks/use-toast";
import { AuthContextType, AuthProviderProps } from "./types";
import { createUserManager, saveUserInfo } from "./authUtils";

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  userManager: null,
  login: () => {},
  logout: () => {},
  error: null,
  isLoading: true
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, clientId, tenant }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userManager, setUserManager] = useState<UserManager | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initializeUserManager = () => {
      if (!clientId || !tenant) {
        console.log("Dados de configuração incompletos:", { clientId, tenant });
        setIsLoading(false);
        return null;
      }

      console.log("Iniciando configuração do UserManager com:", { clientId, tenant });
      
      Log.setLogger(console);
      Log.setLevel(Log.INFO);  // Changed from DEBUG to INFO to reduce console noise

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

      console.log("Configurações finais:", settings);

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

      manager.getUser()
        .then((loadedUser) => {
          console.log("Usuario atual verificado:", loadedUser);
          setUser(loadedUser);
          if (loadedUser) {
            saveUserInfo(loadedUser);
          }
          setIsLoading(false);
        })
        .catch((err) => {
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
