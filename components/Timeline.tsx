
import React from 'react';
import type { VideoTemplate, UserMedia, Shot } from '../types';
import { FilmIcon, SparklesIcon, TypeIcon, XIcon } from './icons';

interface TimelineProps {
  template: VideoTemplate;
  userMedia: UserMedia[];
  selectedShotId: string | null;
  onShotSelect: (id: string) => void;
  onClearShot: (id: string) => void;
}

const ShotCard: React.FC<{ shot: Shot; isSelected: boolean; onSelect: () => void; onClear: () => void; media?: UserMedia }> = ({ shot, isSelected, onSelect, onClear, media }) => {
  const width = shot.duration * 100; // 1 second = 100px
  
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClear();
  };

  return (
    <div
      onClick={onSelect}
      className={`relative flex-shrink-0 h-36 bg-gray-700 rounded-lg cursor-pointer transition-all duration-200 border-2 ${isSelected ? 'border-indigo-500 scale-105' : 'border-transparent hover:border-gray-500'}`}
      style={{ width: `${width}px` }}
    >
      {media ? (
         <>
            <video src={media.previewUrl} muted loop playsInline className="w-full h-full object-cover rounded-md" />
            <div className="absolute top-1 right-1">
                <button onClick={handleClear} className="p-1 bg-black/50 rounded-full text-white hover:bg-red-500 transition-colors">
                    <XIcon className="w-3 h-3"/>
                </button>
            </div>
         </>
      ) : (
        <div className="p-2 flex flex-col justify-between h-full">
            <div>
                <p className="text-xs font-semibold text-gray-200 truncate">{shot.description}</p>
                {shot.caption && <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><TypeIcon className="w-3 h-3"/>"{shot.caption}"</p>}
            </div>
            <div className="text-xs text-gray-300 flex items-center gap-2">
                {shot.effect !== 'None' && <span className="flex items-center gap-1"><SparklesIcon className="w-3 h-3"/>{shot.effect}</span>}
                {shot.transition !== 'Hard Cut' && <span className="flex items-center gap-1"><FilmIcon className="w-3 h-3"/>{shot.transition}</span>}
            </div>
        </div>
      )}
      <div className="absolute bottom-1 right-2 px-1.5 py-0.5 bg-black/50 text-white text-xs rounded-full">
        {shot.duration.toFixed(1)}s
      </div>
    </div>
  );
};

const Timeline: React.FC<TimelineProps> = ({ template, userMedia, selectedShotId, onShotSelect, onClearShot }) => {
  const mediaMap = React.useMemo(() => {
    const map = new Map<string, UserMedia>();
    userMedia.forEach(m => map.set(m.id, m));
    return map;
  }, [userMedia]);

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="flex items-center gap-2 h-40 py-2">
        {template.shots.map(shot => (
          <ShotCard
            key={shot.id}
            shot={shot}
            isSelected={selectedShotId === shot.id}
            onSelect={() => onShotSelect(shot.id)}
            onClear={() => onClearShot(shot.id)}
            media={shot.userMediaId ? mediaMap.get(shot.userMediaId) : undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default Timeline;
