import React, { useEffect, useState } from 'react';
import { Post } from '../types';
import { postService } from '../api/postService';
import { PostCard } from '../components/PostCard';
import { Search, RefreshCw, Feather } from 'lucide-react';

interface HomeProps {
  setView: (view: string) => void;
  setSelectedPost: (post: any) => void;
}

export const Home: React.FC<HomeProps> = ({ setView, setSelectedPost }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  // 1. Asynchronous fetch method to download records from local storage.
  const loadPosts = async () => {
    setLoading(true);
    try {
      const records = await postService.getAll();
      setPosts(records);
      setError('');
    } catch (e: any) {
      setError(e.message || 'Failed to download items form local storage database.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch posts exactly once when the component renders.
  useEffect(() => {
    loadPosts();
  }, []);

  const handleEdit = (post: Post) => {
    setSelectedPost(post);
    setView('edit-post');
  };

  const handleDelete = async (id: string) => {
    try {
      await postService.delete(id);
      await loadPosts(); // Refresh post lists
    } catch (e: any) {
      alert(e.message || 'Could not verify database deletion.');
    }
  };

  // 3. Immediate text searching logic computed instantly on every typed keyword.
  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.authorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="home-feed-layout" className="space-y-8 animate-fade-in">
      
      {/* Feed Page Heading */}
      <div id="home-feed-header" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-sans font-bold text-2xl text-zinc-900 tracking-tight">
            Chronicle Feed
          </h2>
          <p className="text-zinc-500 text-sm mt-1 leading-relaxed">
            Thoughtful articles exploring visual layouts and modular system architecture.
          </p>
        </div>

        {/* Sync Trigger Button */}
        <button
          id="btn-feed-sync"
          onClick={loadPosts}
          className="self-start sm:self-center p-2.5 text-zinc-500 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer"
          title="Reload articles"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Real-time Search Box */}
      <div id="feed-search-section" className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-400">
          <Search className="w-4 h-4" />
        </span>
        <input
          id="feed-search-input"
          type="text"
          placeholder="Filter stories by title, author nickname, or body contents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-zinc-800 placeholder-zinc-400 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-all text-sm shadow-xs"
        />
      </div>

      {error && (
        <div id="feed-error-container" className="p-4 bg-red-50 text-red-600 border border-red-150 rounded-xl text-sm text-center">
          {error}
        </div>
      )}

      {/* Dynamic List Render block */}
      {loading ? (
        <div id="feed-skeletons" className="space-y-4">
          {[1, 2].map((idx) => (
            <div key={idx} className="p-6 bg-white border border-zinc-200 rounded-xl space-y-3 animate-pulse">
              <div className="h-5 bg-zinc-100 rounded w-1/2"></div>
              <div className="h-4 bg-zinc-100 rounded w-full"></div>
              <div className="h-4 bg-zinc-100 rounded w-5/6"></div>
              <div className="h-3 bg-zinc-100 rounded w-24 pt-4"></div>
            </div>
          ))}
        </div>
      ) : filteredPosts.length > 0 ? (
        <div id="feed-grid" className="grid gap-6 md:grid-cols-2">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div id="feed-empty-pane" className="text-center py-16 bg-zinc-50 border border-zinc-200 rounded-xl">
          <div className="inline-flex p-3 bg-zinc-100 rounded-full text-zinc-400 mb-3">
            <Feather className="w-6 h-6" />
          </div>
          <h4 className="font-sans font-semibold text-zinc-900 text-base">No matching stories found</h4>
          <p className="text-zinc-500 text-sm mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or register a new account to publish your own!
          </p>
        </div>
      )}

    </div>
  );
};
