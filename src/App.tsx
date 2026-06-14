import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { CreatePost } from './pages/CreatePost';
import { EditPost } from './pages/EditPost';
import { Post } from './types';
import { Terminal, Database } from 'lucide-react';

function BlogApp() {
  const [view, setView] = useState<string>('home');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Dynamic router based on simple state views
  const renderView = () => {
    switch (view) {
      case 'home':
        return <Home setView={setView} setSelectedPost={setSelectedPost} />;
      case 'login':
        return <Login setView={setView} />;
      case 'signup':
        return <Signup setView={setView} />;
      case 'create-post':
        return (
          <ProtectedRoute setView={setView}>
            <CreatePost setView={setView} />
          </ProtectedRoute>
        );
      case 'edit-post':
        return (
          <ProtectedRoute setView={setView}>
            <EditPost post={selectedPost} setView={setView} />
          </ProtectedRoute>
        );
      default:
        return <Home setView={setView} setSelectedPost={setSelectedPost} />;
    }
  };

  return (
    <div id="blog-app-layout" className="min-h-screen bg-zinc-50 flex flex-col font-sans text-zinc-800">
      
      {/* Navigation bar at top */}
      <Navbar currentView={view} setView={setView} />

      {/* Main Canvas view */}
      <main id="blog-app-main" className="flex-grow max-w-5xl w-full mx-auto px-6 py-10">
        {renderView()}
      </main>

      {/* Footer information bar */}
      <footer id="blog-app-footer" className="bg-white border-t border-zinc-200 py-8 text-center text-xs text-zinc-400 font-mono">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 font-bold">
            <Terminal className="w-3.5 h-3.5 text-zinc-400" />
            <span>CHRONICLE PLATFORM v1.0</span>
          </div>
          <div className="flex items-center gap-1">
            <Database className="w-3.5 h-3.5 text-zinc-400" />
            <span>Mock client-side localStorage DB</span>
          </div>
          <div>
            <span>&copy; {new Date().getFullYear()} Aesthetic blog system.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BlogApp />
    </AuthProvider>
  );
}
