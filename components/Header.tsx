
import React from 'react';
import { FilmIcon } from './icons';

interface HeaderProps {
  onNewProject: () => void;
  showNewProjectButton: boolean;
}

const Header: React.FC<HeaderProps> = ({ onNewProject, showNewProjectButton }) => {
  return (
    <header className="w-full p-4 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <FilmIcon className="w-8 h-8 text-indigo-400" />
          <h1 className="text-xl font-bold tracking-tight text-white">Reel Template Generator</h1>
        </div>
        {showNewProjectButton && (
          <button
            onClick={onNewProject}
            className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            New Project
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
