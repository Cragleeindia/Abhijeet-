
import React, { useState, useEffect, useMemo } from 'react';
import type { VideoTemplate, UserMedia, Shot } from '../types';
import Timeline from './Timeline';
import MediaBin from './MediaBin';
import PreviewPlayer from './PreviewPlayer';
import { DownloadIcon, LoaderIcon, CheckCircleIcon } from './icons';

// --- Export Modal Component ---
interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const exportSteps = [
  "Stitching clips together...",
  "Applying transitions & effects...",
  "Adding captions and text overlays...",
  "Mixing audio tracks...",
  "Rendering final video (1080p)...",
];

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<'processing' | 'success'>('processing');
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setStatus('processing');
      setCurrentStep(0);

      const stepInterval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < exportSteps.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 700);

      const successTimeout = setTimeout(() => {
        clearInterval(stepInterval);
        setStatus('success');
      }, 700 * exportSteps.length + 500);

      return () => {
        clearInterval(stepInterval);
        clearTimeout(successTimeout);
      };
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
        {status === 'processing' ? (
          <>
            <LoaderIcon className="w-12 h-12 text-indigo-400 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Exporting Your Reel</h2>
            <p className="text-gray-400 mb-6">Hold tight, magic is in the works!</p>
            <div className="text-left w-full space-y-2">
                {exportSteps.map((step, index) => (
                    <div key={index} className="flex items-center space-x-3 transition-opacity duration-300" style={{ opacity: index <= currentStep ? 1 : 0.4 }}>
                        {index < currentStep ? (
                          <CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0" />
                        ) : (
                          <LoaderIcon className="w-5 h-5 text-indigo-400 animate-spin flex-shrink-0" />
                        )}
                        <span className={`text-sm ${index <= currentStep ? 'text-gray-300' : 'text-gray-500'}`}>{step}</span>
                    </div>
                ))}
            </div>
          </>
        ) : (
          <>
            <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Export Complete!</h2>
            <p className="text-gray-400 mb-6">
              In a full-featured application, your video would now be ready for download. This is a frontend demonstration.
            </p>
            <button
              onClick={onClose}
              className="w-full px-4 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            >
              Finish
            </button>
          </>
        )}
      </div>
    </div>
  );
};


// --- Editor Screen Component ---
interface EditorScreenProps {
  template: VideoTemplate;
  setTemplate: React.Dispatch<React.SetStateAction<VideoTemplate | null>>;
  referenceVideo: File;
  userMedia: UserMedia[];
  setUserMedia: React.Dispatch<React.SetStateAction<UserMedia[]>>;
}

const EditorScreen: React.FC<EditorScreenProps> = ({
  template,
  setTemplate,
  referenceVideo,
  userMedia,
  setUserMedia,
}) => {
  const [selectedShotId, setSelectedShotId] = useState<string | null>(null);
  const [activePreview, setActivePreview] = useState<'reference' | 'new'>('reference');
  const [isExporting, setIsExporting] = useState(false);
  
  const referenceVideoUrl = useMemo(() => URL.createObjectURL(referenceVideo), [referenceVideo]);

  const newReelMediaUrls = useMemo(() => {
    return template.shots
      .map(shot => {
        if (shot.userMediaId) {
          const media = userMedia.find(m => m.id === shot.userMediaId);
          return media ? media.previewUrl : null;
        }
        return null;
      })
      .filter((url): url is string => url !== null);
  }, [template.shots, userMedia]);

  const isTimelineEmpty = useMemo(() => {
    return !template.shots.some(shot => shot.userMediaId);
  }, [template.shots]);


  useEffect(() => {
    // Cleanup object URLs
    return () => {
      URL.revokeObjectURL(referenceVideoUrl);
    };
  }, [referenceVideoUrl]);

  const handleAssignMedia = (mediaId: string) => {
    if (!selectedShotId || !template) return;

    const newShots = template.shots.map(shot => {
      if (shot.id === selectedShotId) {
        return { ...shot, userMediaId: mediaId };
      }
      return shot;
    });

    setTemplate({ ...template, shots: newShots });
    setSelectedShotId(null); // Deselect after assigning
  };

  const handleClearShot = (shotId: string) => {
    if (!template) return;
    const newShots = template.shots.map(shot => {
        if (shot.id === shotId) {
            const { userMediaId, ...rest } = shot;
            return rest;
        }
        return shot;
    });
    setTemplate({ ...template, shots: newShots });
  };
  
  const handleExport = () => {
    if (isTimelineEmpty) return;
    setIsExporting(true);
  };


  return (
    <>
      <div className="w-full h-[calc(100vh-120px)] flex flex-col gap-4">
        <div className="flex-grow flex gap-4 overflow-hidden">
          {/* Left Panel */}
          <div className="w-1/3 flex flex-col gap-4">
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex-grow flex flex-col">
              <div className="flex border-b border-gray-600 mb-4">
                <button onClick={() => setActivePreview('reference')} className={`px-4 py-2 text-sm font-medium ${activePreview === 'reference' ? 'text-white border-b-2 border-indigo-500' : 'text-gray-400'}`}>Reference</button>
                <button onClick={() => setActivePreview('new')} className={`px-4 py-2 text-sm font-medium ${activePreview === 'new' ? 'text-white border-b-2 border-indigo-500' : 'text-gray-400'}`}>Your Reel</button>
              </div>
              <div className="aspect-w-9 aspect-h-16 bg-black rounded-lg overflow-hidden flex-grow">
                {activePreview === 'reference' && <video src={referenceVideoUrl} controls muted loop className="w-full h-full object-contain" />}
                {activePreview === 'new' && <PreviewPlayer mediaUrls={newReelMediaUrls} />}
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-2/3 flex flex-col gap-4">
            <MediaBin 
              userMedia={userMedia} 
              setUserMedia={setUserMedia} 
              onMediaSelect={handleAssignMedia}
              selectedShotId={selectedShotId}
              />
          </div>
        </div>
        
        {/* Bottom Panel */}
        <div className="h-auto bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Timeline</h3>
              <button 
                  onClick={handleExport}
                  disabled={isTimelineEmpty}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-semibold transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                  <DownloadIcon className="w-4 h-4" />
                  Export Reel
              </button>
          </div>
          <Timeline 
            template={template} 
            userMedia={userMedia}
            selectedShotId={selectedShotId}
            onShotSelect={setSelectedShotId}
            onClearShot={handleClearShot}
          />
        </div>
      </div>
      <ExportModal isOpen={isExporting} onClose={() => setIsExporting(false)} />
    </>
  );
};

export default EditorScreen;
