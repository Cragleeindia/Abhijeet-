
import React, { useState, useCallback } from 'react';
import { UploadCloudIcon, AlertCircleIcon } from './icons';

interface HeroSectionProps {
  onVideoSelect: (file: File) => void;
  error: string | null;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onVideoSelect, error }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onVideoSelect(e.target.files[0]);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onVideoSelect(e.dataTransfer.files[0]);
    }
  }, [onVideoSelect]);

  return (
    <div className="text-center w-full max-w-2xl">
      <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
        Turn Any Reel into a Template
      </h2>
      <p className="mt-4 text-lg text-gray-400">
        Upload a video to automatically extract its structure—cuts, effects, captions, and timing. Then, rebuild it with your own media in minutes.
      </p>

      <div className="mt-12">
        <label
          htmlFor="video-upload"
          onDragEnter={handleDragEnter}
          onDragOver={handleDragEnter} // DragOver is needed for drop to work
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative block w-full border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors duration-300 ${isDragging ? 'border-indigo-400 bg-gray-800/50' : 'border-gray-600 hover:border-gray-500'}`}
        >
          <div className="flex flex-col items-center justify-center text-gray-400">
            <UploadCloudIcon className="w-16 h-16 mx-auto mb-4" />
            <span className="font-semibold text-white">Click to upload or drag and drop</span>
            <span className="mt-1 text-sm">MP4 or MOV</span>
          </div>
          <input
            id="video-upload"
            name="video-upload"
            type="file"
            className="sr-only"
            accept="video/mp4,video/quicktime"
            onChange={handleFileChange}
          />
        </label>
      </div>
      {error && (
        <div className="mt-6 flex items-center justify-center bg-red-900/50 text-red-300 border border-red-700 rounded-lg p-3">
          <AlertCircleIcon className="w-5 h-5 mr-2" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default HeroSection;
