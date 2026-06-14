import React from 'react';

/**
 * Main Stories / Chronicle Feed interface.
 * We will design search, dynamic lists, loading states, and edit callbacks here together.
 */

interface HomeProps {
  setView: (view: string) => void;
  setSelectedPost: (post: any) => void;
}

export const Home: React.FC<HomeProps> = ({ setView, setSelectedPost }) => {
  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-bold font-sans text-zinc-800">Stories Feed</h2>
      <p className="text-zinc-500 text-sm mt-2">Ready to list published articles.</p>
    </div>
  );
};
