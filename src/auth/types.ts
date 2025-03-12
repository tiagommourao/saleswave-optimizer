
import { User, UserManager } from "oidc-client-ts";

export type AuthConfig = {
  authority: string;
  client_id: string;
  redirect_uri: string;
  post_logout_redirect_uri: string;
  response_type: string;
  scope: string;
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
}

export interface GraphProfile {
  displayName?: string;
  givenName?: string;
  surname?: string;
  jobTitle?: string;
  officeLocation?: string;
  mail?: string;
  userPrincipalName?: string;
  photoUrl?: string;
}

export interface UserInfo {
  user_id: string;
  email: string | null;
  display_name: string | null;
  first_name: string | null;
  last_name: string | null;
  profile_image_url: string | null;
  job_title: string | null;
  department: string | null;
  office_location: string | null;
  user_agent: string;
  ip_address: string;
  id_token: string;
  raw_profile: any;
  login_timestamp: string;
  last_active: string;
  access_token: string;
}

export interface AdfsUserInfo {
  user_id: string;
  display_name?: string;
  given_name?: string;
  job_title?: string;
  email?: string;
  user_principal_name?: string;
  codigo_bp?: string;
  nome_bp?: string;
  login_adfs?: string;
  is_representante?: string;
  erp_email?: string;
  data_sincronizacao?: Date;
  hora_sincronizacao?: string;
  raw_data?: any;
}
