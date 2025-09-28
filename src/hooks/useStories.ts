import { useState, useEffect } from "react";
import { Story } from "@/types/story";

export const useStories = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch("/stories.json");
        if (!response.ok) {
          throw new Error("Failed to fetch stories");
        }
        const data = await response.json();
        setStories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const markStoryAsViewed = (storyId: number) => {
    setStories(prev => 
      prev.map(story => 
        story.id === storyId ? { ...story, viewed: true } : story
      )
    );
  };

  return { stories, loading, error, markStoryAsViewed };
};