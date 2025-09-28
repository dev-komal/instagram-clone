export interface Story {
  id: number;
  username: string;
  avatar: string;
  images: string[];
  viewed: boolean;
}

export interface StoryViewerProps {
  stories: Story[];
  currentStoryIndex: number;
  currentImageIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}