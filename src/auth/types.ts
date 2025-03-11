
import { User as OidcUser } from 'oidc-client-ts';

export interface ExtendedUser extends OidcUser {
  role?: string;
  email?: string;
  id?: string;
}

