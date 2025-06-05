import { useState, useRef } from 'react';

export default function VerticalVideoPlayer({ videoUrl }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
    }
  };

  const handleSeek = (e) => {
    const rect = e.target.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const seekTime = (clickX / rect.width) * duration;
    
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleError = () => {
    console.log(videoUrl);
    setIsLoading(false);
    setHasError(true);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (hasError) {
    return (
      <div className="w-full max-w-xs mx-auto aspect-[9/16] bg-gray-100 rounded-lg border-2 border-cyan-300 flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-gray-600 mb-2">Failed to load video</p>
          <button 
            onClick={() => {
              setHasError(false);
              setIsLoading(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xs mx-auto relative">
      {/* Video Container */}
      <div className="relative aspect-[9/16] bg-black rounded-lg overflow-hidden border-2 border-cyan-300 shadow-lg">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full"></div>
          </div>
        )}

        {/* Video Element */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onError={handleError}
          playsInline
          preload="metadata"
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Play/Pause Overlay */}
        <div 
          className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
          onClick={handlePlayPause}
        >
          {!isPlaying && (
            <div className="bg-black bg-opacity-50 rounded-full p-4 transition-opacity hover:bg-opacity-70">
              <svg 
                className="w-12 h-12 text-white" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          )}
        </div>

        {/* Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 z-10">
          {/* Progress Bar */}
          <div 
            className="w-full h-2 bg-gray-600 rounded-full cursor-pointer mb-3"
            onClick={handleSeek}
          >
            <div 
              className="h-full bg-cyan-400 rounded-full transition-all duration-100"
              style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
            />
          </div>

          {/* Time Display and Controls */}
          <div className="flex items-center justify-between text-white text-sm">
            <span>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            
            <button
              onClick={handlePlayPause}
              className="bg-cyan-600 hover:bg-cyan-700 p-2 rounded-full transition-colors"
            >
              {isPlaying ? (
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              ) : (
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}