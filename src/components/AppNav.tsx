import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Home } from 'lucide-react';

interface AppNavProps {
  showBackToTimeline?: boolean;
}

export const AppNav: React.FC<AppNavProps> = ({ showBackToTimeline = false }) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="container-content py-4">
      <div className="flex items-center justify-between">
        <Link to="/app/timeline" className="flex items-center gap-2">
          <h1 className="text-xl font-bold font-serif text-kairos-dark">
            Kairos
          </h1>
        </Link>

        <div className="flex items-center gap-3">
          {showBackToTimeline && (
            <Link to="/app/timeline">
              <button className="btn-ghost flex items-center gap-2">
                <Home className="w-4 h-4" />
                Timeline
              </button>
            </Link>
          )}
          <button
            onClick={handleSignOut}
            className="btn-ghost flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
};
