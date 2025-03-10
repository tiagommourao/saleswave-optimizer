
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, UserManager, WebStorageStateStore } from "oidc-client-ts";

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

  useEffect(() => {
    const initializeUserManager = () => {
      if (!clientId || !tenant) {
        setIsLoading(false);
        return;
      }

      const authority = `https://login.microsoftonline.com/${tenant}/v2.0`;

      const settings: AuthConfig = {
        authority,
        client_id: clientId,
        redirect_uri: `${window.location.origin}/auth-callback`,
        post_logout_redirect_uri: window.location.origin,
        response_type: "code",
        scope: "openid profile email",
      };

      const manager = new UserManager({
        ...settings,
        userStore: new WebStorageStateStore({ store: window.localStorage }),
      });

      setUserManager(manager);

      manager.events.addUserLoaded((user) => {
        setUser(user);
      });

      manager.events.addUserUnloaded(() => {
        setUser(null);
      });

      manager.events.addSilentRenewError((error) => {
        console.error("Silent renew error", error);
        setError(error);
      });

      manager.getUser().then((user) => {
        setUser(user);
        setIsLoading(false);
      }).catch((err) => {
        console.error("Error getting user", err);
        setError(err);
        setIsLoading(false);
      });

      return manager;
    };

    const manager = initializeUserManager();

    return () => {
      if (manager) {
        manager.events.removeUserLoaded(() => {});
        manager.events.removeUserUnloaded(() => {});
        manager.events.removeSilentRenewError(() => {});
      }
    };
  }, [clientId, tenant]);

  const login = async () => {
    if (userManager) {
      try {
        await userManager.signinRedirect();
      } catch (err) {
        console.error("Login error", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    }
  };

  const logout = async () => {
    if (userManager) {
      try {
        await userManager.signoutRedirect();
      } catch (err) {
        console.error("Logout error", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      }
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
