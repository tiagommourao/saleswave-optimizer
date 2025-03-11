
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import ObservabilityDashboard from '@/components/ObservabilityDashboard';
import { ExtendedUser } from '@/auth/types';

const ObservabilityPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user && (user as ExtendedUser)?.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);
  
  if ((user as ExtendedUser)?.role !== 'admin') {
    return null;
  }
  
  return <ObservabilityDashboard />;
};

export default ObservabilityPage;
