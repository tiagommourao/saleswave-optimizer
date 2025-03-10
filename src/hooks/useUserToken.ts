
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/auth/AuthContext';

interface UserToken {
  id: string;
  user_id: string;
  username: string;
  access_token: string;
  created_at: string;
  updated_at: string;
}

export const useUserToken = () => {
  const [userToken, setUserToken] = useState<UserToken | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchUserToken = async () => {
      if (!isAuthenticated || !user?.profile?.sub) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error: fetchError } = await supabase
          .from('user_tokens')
          .select('*')
          .eq('user_id', user.profile.sub)
          .maybeSingle();

        if (fetchError) {
          throw new Error(fetchError.message);
        }

        setUserToken(data as UserToken);
      } catch (err) {
        console.error('Error fetching user token:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserToken();
  }, [isAuthenticated, user]);

  return { userToken, isLoading, error };
};
