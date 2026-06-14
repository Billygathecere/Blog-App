import React from 'react';

/**
 * Updating existing published items.
 * We will pre-populate editorial states and connect saved parameters here.
 */

interface EditPostProps {
  post: any;
  setView: (view: string) => void;
}

export const EditPost: React.FC<EditPostProps> = ({ post, setView }) => {
  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-bold font-sans text-zinc-800">Update Story</h2>
      <p className="text-zinc-500 text-sm mt-2">Predefined editorial attributes will render here.</p>
    </div>
  );
};
