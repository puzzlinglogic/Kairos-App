import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AppPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to timeline when user accesses /app
    navigate('/app/timeline', { replace: true });
  }, [navigate]);

  return null;
};
