import { useState } from "react";
import { StoryPreview } from "./StoryPreview";
import { StoryViewer } from "./StoryViewer";
import { PostCard } from "./PostCard";
import { useStories } from "@/hooks/useStories";
import { usePosts } from "@/hooks/usePosts";
import { Story } from "@/types/story";

export const StoriesApp = () => {
  const { stories, loading: storiesLoading, error: storiesError, markStoryAsViewed } = useStories();
  const { posts, loading: postsLoading, error: postsError, toggleLike } = usePosts();
  const [selectedStory, setSelectedStory] = useState<{
    storyIndex: number;
    imageIndex: number;
  } | null>(null);

  const handleStoryClick = (story: Story) => {
    const storyIndex = stories.findIndex(s => s.id === story.id);
    setSelectedStory({ storyIndex, imageIndex: 0 });
    markStoryAsViewed(story.id);
  };

  const handleNext = () => {
    if (!selectedStory) return;

    const currentStory = stories[selectedStory.storyIndex];
    if (!currentStory) return;

    // Next image in current story
    if (selectedStory.imageIndex < currentStory.images.length - 1) {
      setSelectedStory(prev => prev ? { 
        ...prev, 
        imageIndex: prev.imageIndex + 1 
      } : null);
      return;
    }

    // Next story
    if (selectedStory.storyIndex < stories.length - 1) {
      const nextStoryIndex = selectedStory.storyIndex + 1;
      setSelectedStory({ 
        storyIndex: nextStoryIndex, 
        imageIndex: 0 
      });
      markStoryAsViewed(stories[nextStoryIndex].id);
      return;
    }

    // End of stories
    setSelectedStory(null);
  };

  const handlePrevious = () => {
    if (!selectedStory) return;

    // Previous image in current story
    if (selectedStory.imageIndex > 0) {
      setSelectedStory(prev => prev ? { 
        ...prev, 
        imageIndex: prev.imageIndex - 1 
      } : null);
      return;
    }

    // Previous story
    if (selectedStory.storyIndex > 0) {
      const prevStoryIndex = selectedStory.storyIndex - 1;
      const prevStory = stories[prevStoryIndex];
      setSelectedStory({ 
        storyIndex: prevStoryIndex, 
        imageIndex: prevStory.images.length - 1 
      });
      return;
    }

    // At beginning, close viewer
    setSelectedStory(null);
  };

  const handleClose = () => {
    setSelectedStory(null);
  };

  const loading = storiesLoading || postsLoading;
  const error = storiesError || postsError;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex space-x-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-primary rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="text-destructive mb-2">Failed to load stories</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Stories preview list */}
      <div className="border-b border-border bg-card">
        <div className="p-4">
          <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
            {stories.map((story) => (
              <div key={story.id} className="flex-shrink-0">
                <StoryPreview 
                  story={story} 
                  onClick={() => handleStoryClick(story)} 
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Posts feed */}
      <div className="pb-8">
        {posts.map((post) => (
          <PostCard 
            key={post.id}
            post={post}
            onToggleLike={toggleLike}
          />
        ))}
      </div>

      {/* Story viewer */}
      {selectedStory && (
        <StoryViewer
          stories={stories}
          currentStoryIndex={selectedStory.storyIndex}
          currentImageIndex={selectedStory.imageIndex}
          onClose={handleClose}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}
    </div>
  );
};