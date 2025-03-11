import { useAuth } from '@/auth/AuthContext';
import { ExtendedUser } from '@/auth/types';
import * as Sentry from "@sentry/react";
import { useEffect } from 'react';

const useErrorMonitoring = () => {
  const { user } = useAuth();
  const userEmail = (user as ExtendedUser)?.email;
  const userId = (user as ExtendedUser)?.id;

  useEffect(() => {
    if (userEmail && userId) {
      Sentry.setUser({
        email: userEmail,
        id: userId,
      });
    } else {
      Sentry.setUser(null);
    }
  }, [userEmail, userId]);
};

export default useErrorMonitoring;
