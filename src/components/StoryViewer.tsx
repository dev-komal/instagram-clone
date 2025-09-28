import { useEffect, useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { StoryViewerProps } from "@/types/story";
import { cn } from "@/lib/utils";

export const StoryViewer = ({
  stories,
  currentStoryIndex,
  currentImageIndex,
  onClose,
  onNext,
  onPrevious,
}: StoryViewerProps) => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);

  const currentStory = stories[currentStoryIndex];
  const currentImage = currentStory?.images[currentImageIndex];
  const totalImages = currentStory?.images.length || 0;

  const resetProgress = useCallback(() => {
    setProgress(0);
    setIsLoading(true);
  }, []);

  const handleNext = useCallback(() => {
    setSlideDirection('left');
    setTimeout(() => {
      onNext();
      setSlideDirection(null);
      resetProgress();
    }, 150);
  }, [onNext, resetProgress]);

  const handlePrevious = useCallback(() => {
    setSlideDirection('right');
    setTimeout(() => {
      onPrevious();
      setSlideDirection(null);
      resetProgress();
    }, 150);
  }, [onPrevious, resetProgress]);

  useEffect(() => {
    resetProgress();
  }, [currentStoryIndex, currentImageIndex, resetProgress]);

  useEffect(() => {
    if (!currentImage || isLoading) return;

    const timer = setTimeout(() => {
      handleNext();
    }, 5000);

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, [currentImage, isLoading, handleNext]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleLeftTap = () => {
    handlePrevious();
  };

  const handleRightTap = () => {
    handleNext();
  };

  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 bg-story-background z-50 flex flex-col ">
      {/* Header */}
      <div className="relative z-10 p-4">
        {/* Progress bars */}
        <div className="flex space-x-1 mb-4">
          {Array.from({ length: totalImages }).map((_, index) => (
            <div key={index} className="flex-1 h-0.5 bg-story-progress-bg rounded">
              <div
                className={cn(
                  "h-full bg-story-progress rounded transition-all duration-100",
                  index < currentImageIndex ? "w-full" : 
                  index === currentImageIndex ? `w-[${progress}%]` : "w-0"
                )}
                style={index === currentImageIndex ? { width: `${progress}%` } : {}}
              />
            </div>
          ))}
        </div>

        {/* User info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={currentStory.avatar}
              alt={currentStory.username}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-story-text font-medium text-sm">
              {currentStory.username}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-story-text hover:opacity-70 transition-opacity"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Story content */}
      <div className="flex-1 relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-story-background">
            <div className="w-8 h-8 border-2 border-story-progress border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        <div className="relative w-full h-full">
          <img
            src={currentImage}
            alt="Story"
            className={cn(
              "w-full h-full object-cover transition-all duration-300",
              slideDirection === 'left' && "animate-slide-left",
              slideDirection === 'right' && "animate-slide-right",
              isLoading && "opacity-0"
            )}
            onLoad={handleImageLoad}
          />
          
          {/* Tap areas */}
          <button
            className="absolute left-0 top-0 w-1/3 h-full z-10 outline-none"
            onClick={handleLeftTap}
            aria-label="Previous story"
          />
          <button
            className="absolute right-0 top-0 w-1/3 h-full z-10 outline-none"
            onClick={handleRightTap}
            aria-label="Next story"
          />
        </div>
      </div>
    </div>
  );
};