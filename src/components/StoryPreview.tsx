import { Story } from "@/types/story";
import { cn } from "@/lib/utils";

interface StoryPreviewProps {
  story: Story;
  onClick: () => void;
}

export const StoryPreview = ({ story, onClick }: StoryPreviewProps) => {
  return (
    <div 
      className="flex flex-col items-center space-y-2 cursor-pointer"
      onClick={onClick}
    >
      <div 
        className={cn(
          "relative w-16 h-16 rounded-full p-0.5",
          story.viewed 
            ? "bg-story-viewed" 
            : "bg-gradient-to-tr from-story-gradient-start via-story-gradient-mid to-story-gradient-end"
        )}
      >
        <div className="w-full h-full rounded-full bg-background p-0.5">
          <img
            src={story.avatar}
            alt={story.username}
            className="w-full h-full object-cover rounded-full"
            loading="lazy"
          />
        </div>
      </div>
      <span className="text-xs text-foreground font-medium max-w-16 truncate">
        {story.username}
      </span>
    </div>
  );
};