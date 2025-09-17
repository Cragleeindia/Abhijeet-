import React from 'react';
import type { UserMedia } from '../types';
import { UploadCloudIcon, PlusIcon } from './icons';

interface MediaBinProps {
  userMedia: UserMedia[];
  setUserMedia: React.Dispatch<React.SetStateAction<UserMedia[]>>;
  onMediaSelect: (id: string) => void;
  selectedShotId: string | null;
}

const MediaBin: React.FC<MediaBinProps> = ({ userMedia, setUserMedia, onMediaSelect, selectedShotId }) => {

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // FIX: Explicitly type `file` as `File` to resolve TypeScript errors about property 'name' and `createObjectURL` argument type.
      const newMedia = Array.from(e.target.files).map((file: File) => ({
        id: `${file.name}-${Date.now()}`,
        file,
        previewUrl: URL.createObjectURL(file),
      }));
      setUserMedia(prev => [...prev, ...newMedia]);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex flex-col h-full">
      <h3 className="text-lg font-semibold mb-3">Your Media</h3>
      <div className="flex-grow overflow-y-auto pr-2">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {userMedia.map(media => (
            <div 
              key={media.id} 
              onClick={() => onMediaSelect(media.id)}
              className={`relative aspect-w-1 aspect-h-1 rounded-lg overflow-hidden group transition-transform duration-200 ${selectedShotId ? 'cursor-pointer hover:scale-105' : 'cursor-default'}`}
            >
              <video src={media.previewUrl} muted loop playsInline className="w-full h-full object-cover" />
              {selectedShotId && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <PlusIcon className="w-8 h-8 text-white"/>
                </div>
              )}
            </div>
          ))}
          <label htmlFor="media-upload" className="aspect-w-1 aspect-h-1 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-gray-500 hover:text-white cursor-pointer transition-colors">
            <UploadCloudIcon className="w-8 h-8" />
            <span className="text-xs mt-1 text-center">Add Media</span>
            <input id="media-upload" type="file" multiple className="sr-only" onChange={handleFileChange} accept="video/*,image/*" />
          </label>
        </div>
      </div>
    </div>
  );
};

export default MediaBin;
