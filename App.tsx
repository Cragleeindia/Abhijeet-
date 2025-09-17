
import React, { useState, useCallback } from 'react';
import type { VideoTemplate, UserMedia } from './types';
import { AppState } from './types';
import HeroSection from './components/HeroSection';
import AnalysisScreen from './components/AnalysisScreen';
import EditorScreen from './components/EditorScreen';
import Header from './components/Header';
import { generateTemplateFromPrompt } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IMPORTING);
  const [referenceVideo, setReferenceVideo] = useState<File | null>(null);
  const [videoTemplate, setVideoTemplate] = useState<VideoTemplate | null>(null);
  const [userMedia, setUserMedia] = useState<UserMedia[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleVideoImport = useCallback(async (videoFile: File) => {
    setReferenceVideo(videoFile);
    setAppState(AppState.ANALYZING);
    setError(null);
    try {
      const template = await generateTemplateFromPrompt();
      setVideoTemplate(template);
      // Simulate analysis time before moving to editor
      setTimeout(() => {
        setAppState(AppState.EDITING);
      }, 4000); // Wait for the animation to finish
    } catch (e) {
      console.error(e);
      setError('Failed to generate video template. Please try again.');
      setAppState(AppState.IMPORTING);
    }
  }, []);

  const handleReset = useCallback(() => {
    setAppState(AppState.IMPORTING);
    setReferenceVideo(null);
    setVideoTemplate(null);
    setUserMedia([]);
    setError(null);
  }, []);

  const renderContent = () => {
    switch (appState) {
      case AppState.IMPORTING:
        return <HeroSection onVideoSelect={handleVideoImport} error={error} />;
      case AppState.ANALYZING:
        return <AnalysisScreen />;
      case AppState.EDITING:
        if (videoTemplate && referenceVideo) {
          return (
            <EditorScreen
              template={videoTemplate}
              setTemplate={setVideoTemplate}
              referenceVideo={referenceVideo}
              userMedia={userMedia}
              setUserMedia={setUserMedia}
            />
          );
        }
        // Fallback if state is inconsistent
        handleReset();
        return null;
      default:
        return <HeroSection onVideoSelect={handleVideoImport} error={error} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col font-sans">
      <Header onNewProject={handleReset} showNewProjectButton={appState === AppState.EDITING} />
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
