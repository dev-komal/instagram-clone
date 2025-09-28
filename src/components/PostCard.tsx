import { useState } from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";
import { Post } from "@/types/post";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  onToggleLike: (postId: number) => void;
}

export const PostCard = ({ post, onToggleLike }: PostCardProps) => {
  const [showAllComments, setShowAllComments] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const displayedComments = showAllComments ? post.comments : post.comments.slice(0, 2);
  const hasMoreComments = post.comments.length > 2;

  return (
    <article className="bg-card border-b border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <img
            src={post.avatar}
            alt={post.username}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="font-semibold text-sm text-foreground">
            {post.username}
          </span>
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Image */}
      <div className="relative bg-muted">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <img
          src={post.image}
          alt="Post"
          className={cn(
            "w-full aspect-square object-cover transition-opacity duration-300",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
        />
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onToggleLike(post.id)}
              className={cn(
                "transition-colors hover:opacity-70",
                post.liked ? "text-red-500" : "text-foreground"
              )}
            >
              <Heart 
                size={24} 
                className={cn(post.liked && "fill-current")}
              />
            </button>
            <button className="text-foreground hover:opacity-70 transition-opacity">
              <MessageCircle size={24} />
            </button>
            <button className="text-foreground hover:opacity-70 transition-opacity">
              <Send size={24} />
            </button>
          </div>
          <button className="text-foreground hover:opacity-70 transition-opacity">
            <Bookmark size={24} />
          </button>
        </div>

        {/* Likes */}
        <div className="mb-2">
          <span className="font-semibold text-sm text-foreground">
            {post.likes.toLocaleString()} likes
          </span>
        </div>

        {/* Caption */}
        <div className="mb-2">
          <span className="font-semibold text-sm text-foreground mr-2">
            {post.username}
          </span>
          <span className="text-sm text-foreground">
            {post.caption}
          </span>
        </div>

        {/* Comments */}
        {post.comments.length > 0 && (
          <div className="space-y-1">
            {hasMoreComments && !showAllComments && (
              <button
                onClick={() => setShowAllComments(true)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                View all {post.comments.length} comments
              </button>
            )}
            
            {displayedComments.map((comment, index) => (
              <div key={index}>
                <span className="font-semibold text-sm text-foreground mr-2">
                  {comment.username}
                </span>
                <span className="text-sm text-foreground">
                  {comment.text}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <div className="mt-2">
          <span className="text-xs text-muted-foreground uppercase">
            {post.timestamp}
          </span>
        </div>
      </div>
    </article>
  );
};