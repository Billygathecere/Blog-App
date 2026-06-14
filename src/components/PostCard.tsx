import React from 'react';

/**
 * Individual post renderer showing summaries and ownership controls.
 * We will implement custom layout templates, date formatters, and owner buttons here.
 */

interface PostCardProps {
  post: any;
  onEdit: (post: any) => void;
  onDelete: (id: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onEdit, onDelete }) => {
  return (
    <div className="p-6 bg-white border border-zinc-200 rounded-lg">
      {/* We will build the layout of individual stories here */}
    </div>
  );
};
