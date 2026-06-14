import React from 'react';
import { Post } from '../types';
import { useAuth } from '../context/AuthContext';
import { Calendar, User, Trash2 } from 'lucide-react';

interface PostCardProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onEdit, onDelete }) => {
  const { user, isAuthenticated } = useAuth();
  
  // A post is owned by the logged-in user if their IDs match, 
  // or if we are using the live mock account (usr_main_demo).
  const isOwner = isAuthenticated && (post.authorId === user?.id || post.authorId === 'usr_main_demo');

  const formatDate = (isoStr: string) => {
    return new Date(isoStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <article 
      id={`post-card-${post.id}`} 
      className="bg-white border border-zinc-200 rounded-xl shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden"
    >
      <div>
        {/* Cover Image element */}
        {post.imageUrl && (
          <div className="w-full aspect-video overflow-hidden border-b border-zinc-100 bg-zinc-50 relative group">
            <img 
              src={post.imageUrl} 
              alt={post.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        <div className="p-6 pb-0">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className="font-sans font-bold text-lg text-zinc-900 tracking-tight leading-snug">
              {post.title}
            </h3>
            
            {/* Conditional Owner Action Section */}
            {isOwner && (
              <button
                id={`btn-delete-${post.id}`}
                onClick={() => {
                  if (confirm('Are you sure you want to delete this story?')) {
                    onDelete(post.id);
                  }
                }}
                className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all shrink-0 cursor-pointer"
                title="Delete Story"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <p className="text-zinc-650 text-sm leading-relaxed mb-6 font-sans whitespace-pre-line line-clamp-4">
            {post.body}
          </p>
        </div>
      </div>

      {/* Narrative Metadata Footer */}
      <div className="mx-6 mb-6 flex items-center gap-4 pt-4 border-t border-zinc-100 text-[11px] text-zinc-400 font-mono">
        <span className="flex items-center gap-1">
          <User className="w-3.5 h-3.5 text-zinc-400" />
          <span>{post.authorName}</span>
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-zinc-400" />
          <span>{formatDate(post.createdAt)}</span>
        </span>
      </div>
    </article>
  );
};
