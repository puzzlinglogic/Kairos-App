import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Settings } from 'lucide-react';

interface AppNavProps {
  showBackToTimeline?: boolean;
}

export const AppNav: React.FC<AppNavProps> = ({ showBackToTimeline = false }) => {

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
          <Link to="/app/settings">
            <button className="btn-ghost flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};
