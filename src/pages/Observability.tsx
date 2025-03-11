
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import ObservabilityDashboard from '@/components/ObservabilityDashboard';

const ObservabilityPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect non-admin users away from this page
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);
  
  // Only render the dashboard if user is admin
  if (user?.role !== 'admin') {
    return null;
  }
  
  return <ObservabilityDashboard />;
};

export default ObservabilityPage;
