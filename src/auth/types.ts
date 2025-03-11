
import { User, UserManager } from "oidc-client-ts";

export type AuthConfig = {
  authority: string;
  client_id: string;
  redirect_uri: string;
  post_logout_redirect_uri: string;
  response_type: string;
  scope: string;
  client_secret?: string;
};

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  userManager: UserManager | null;
  login: () => void;
  logout: () => void;
  error: Error | null;
  isLoading: boolean;
}

export interface AuthProviderProps {
  children: React.ReactNode;
  clientId: string;
  tenant: string;
  clientSecret?: string;
}
