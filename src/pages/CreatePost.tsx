import React from 'react';

/**
 * Story composition and editing deck.
 * We will implement title bounds, text inputs, and custom save commands here together.
 */

interface CreatePostProps {
  setView: (view: string) => void;
}

export const CreatePost: React.FC<CreatePostProps> = ({ setView }) => {
  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-bold font-sans text-zinc-800">Compose New Story</h2>
      <p className="text-zinc-500 text-sm mt-2">Text editing forms will be placed here.</p>
    </div>
  );
};
