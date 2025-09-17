
import React, { useState, useEffect, useRef } from 'react';
import { PlayIcon } from './icons';

interface PreviewPlayerProps {
  mediaUrls: string[];
}

const PreviewPlayer: React.FC<PreviewPlayerProps> = ({ mediaUrls }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setCurrentIndex(0);
  }, [mediaUrls]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement && mediaUrls.length > 0) {
      videoElement.src = mediaUrls[currentIndex];
      videoElement.play().catch(e => console.error("Autoplay was prevented:", e));
    }
  }, [currentIndex, mediaUrls]);

  const handleVideoEnd = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % mediaUrls.length);
  };
  
  if (mediaUrls.length === 0) {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-black text-gray-500">
            <PlayIcon className="w-16 h-16 opacity-20" />
            <p className="mt-2 text-sm">Add media to timeline to see preview</p>
        </div>
    );
  }

  return (
    <video
      ref={videoRef}
      key={currentIndex}
      onEnded={handleVideoEnd}
      className="w-full h-full object-contain"
      muted
      playsInline
    />
  );
};

export default PreviewPlayer;
