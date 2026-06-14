import React, { useState, useEffect } from 'react';
import { postService } from '../api/postService';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, Save, Feather, User, Image, Upload, Link, Trash2, Check, Compass } from 'lucide-react';

interface CreatePostProps {
  setView: (view: string) => void;
}

// Preset design artwork to provide premium instant aesthetics
const STOCK_ARTWORKS = [
  {
    id: 'stock_1',
    name: 'Journal',
    url: 'https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&w=800&q=80',
    desc: 'Classic visual workspace'
  },
  {
    id: 'stock_2',
    name: 'Workspace',
    url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    desc: 'Modern electronic setup'
  },
  {
    id: 'stock_3',
    name: 'Structure',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    desc: 'Aesthetic slate layout'
  },
  {
    id: 'stock_4',
    name: 'Warm Coffee',
    url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
    desc: 'Cozy editorial reading'
  }
];

export const CreatePost: React.FC<CreatePostProps> = ({ setView }) => {
  const { user } = useAuth();
  
  // --- REACT STATE HOOKS ---
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Prefill signature name when user sessions resolve
  useEffect(() => {
    if (user && !authorName) {
      setAuthorName(user.name);
    }
  }, [user]);


  // Cover image interactive settings
  const [imageMode, setImageMode] = useState<'stock' | 'upload' | 'url'>('stock');
  const [imageUrl, setImageUrl] = useState(STOCK_ARTWORKS[0].url);
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // --- BASE64 GENERATOR (PURE FRONT-END FILE CONVERSION) ---
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please provide a valid image file type (PNG, JPEG, WEBP).');
      return;
    }

    setFileName(file.name);
    setError('');

    // FileReader is a standard browser Web API.
    // It reads file blobs asynchronously on the client and encodes raw data into Base64 format strings.
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageUrl(event.target.result as string);
      }
    };
    reader.onerror = () => {
      setError('Could not decode the specified photo binary.');
    };
    reader.readAsDataURL(file);
  };

  // --- DRAG AND DROP HANDLERS ---
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  // --- SUBMIT COMPOSITION HANDLER ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!title.trim() || !body.trim() || !authorName.trim()) {
      setError('Please fill in all available input parameters before publishing.');
      return;
    }

    setSubmitting(true);

    try {
      const activeAuthorId = user?.id || `usr_${Math.random().toString(36).substr(2, 6)}`;
      await postService.create(title, body, activeAuthorId, authorName, imageUrl || undefined);
      setView('home');
    } catch (err: any) {
      setError(err.message || 'An unexpected issue occurred while publishing.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="create-post-container" className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      
      {/* Back navigation button */}
      <div id="create-post-back-action">
        <button
          id="btn-create-back"
          onClick={() => setView('home')}
          className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 text-sm font-medium transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Cancel & Back to Feed</span>
        </button>
      </div>

      {/* Editor Main Form Layout Grid */}
      <div className="grid md:grid-cols-3 gap-6 items-start">
        
        {/* Editor Block Form (occupies 2 cols) */}
        <div id="create-post-card" className="md:col-span-2 bg-white border border-zinc-200 rounded-2xl p-8 shadow-xs space-y-6">
          
          {/* Header Section */}
          <div id="create-post-header" className="flex items-center gap-2.5 pb-6 border-b border-zinc-150">
            <span className="p-2.5 bg-zinc-100 rounded-xl text-zinc-800">
              <Feather className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-sans font-bold text-xl text-zinc-950 tracking-tight">
                Publish New Narrative
              </h2>
              <p className="text-zinc-500 text-xs mt-1 leading-normal">
                Share your designs, thoughts, and technical concepts with the Chronicle.
              </p>
            </div>
          </div>

          {/* Form validation alert banner */}
          {error && (
            <div id="create-post-error" className="p-4 bg-red-50 text-red-600 border border-red-150 rounded-xl text-xs font-sans leading-relaxed">
              {error}
            </div>
          )}

          {/* Form fields */}
          <form id="create-post-form" onSubmit={handleSubmit} className="space-y-5">
            
            {/* Author Identification Input */}
            <div id="create-author-group">
              <label className="block text-xs font-semibold text-zinc-500 font-mono uppercase mb-2 tracking-wider">
                Author name / Signature
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  id="create-author-input"
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="E.g. Jane Doe"
                  className="w-full pl-9 pr-3.5 py-2.5 text-zinc-850 placeholder-zinc-400 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 text-sm shadow-xs transition-all"
                />
              </div>
            </div>

            {/* Story Title Input */}
            <div id="create-title-group">
              <label className="block text-xs font-semibold text-zinc-500 font-mono uppercase mb-2 tracking-wider">
                Post Title
              </label>
              <input
                id="create-title-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your article a clear, catchy designation..."
                className="w-full px-3.5 py-2.5 text-zinc-850 placeholder-zinc-400 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 text-sm shadow-xs transition-all"
              />
            </div>

            {/* HIGH-QUALITY COVER IMAGE DECK (INCORPORAL COMPONENT) */}
            <div id="cover-image-deck" className="space-y-3">
              <label className="block text-xs font-semibold text-zinc-500 font-mono uppercase tracking-wider">
                Article Cover Photo
              </label>
              
              {/* Image Input mode toggle header tabs */}
              <div className="grid grid-cols-3 bg-zinc-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setImageMode('stock');
                    setImageUrl(STOCK_ARTWORKS[0].url);
                  }}
                  className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-sans font-semibold tracking-wide transition-all ${
                    imageMode === 'stock' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-850'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Preset</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setImageMode('upload');
                    setImageUrl('');
                    setFileName('');
                  }}
                  className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-sans font-semibold tracking-wide transition-all ${
                    imageMode === 'upload' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-850'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>File Device</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setImageMode('url');
                    setImageUrl('');
                  }}
                  className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-sans font-semibold tracking-wide transition-all ${
                    imageMode === 'url' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-850'
                  }`}
                >
                  <Link className="w-3.5 h-3.5" />
                  <span>Image Link</span>
                </button>
              </div>

              {/* Dynamic Interface based on imageMode tab Selection */}
              {imageMode === 'stock' && (
                <div id="stock-selector-grid" className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  {STOCK_ARTWORKS.map((img) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setImageUrl(img.url)}
                      className={`relative aspect-video rounded-xl overflow-hidden border-2 text-left group transition-all ${
                        imageUrl === img.url ? 'border-zinc-900 scale-[1.02]' : 'border-transparent hover:border-zinc-300'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-2 flex flex-col justify-end">
                        <span className="text-[10px] font-bold text-white tracking-tight truncate leading-none">
                          {img.name}
                        </span>
                        <span className="text-[8px] text-zinc-300 truncate mt-0.5">
                          {img.desc}
                        </span>
                      </div>
                      {imageUrl === img.url && (
                        <div className="absolute top-1.5 right-1.5 p-0.5 bg-zinc-900 rounded-full text-white">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* device upload mode */}
              {imageMode === 'upload' && (
                <div
                  id="drag-and-drop-board"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                    isDragging 
                      ? 'border-zinc-900 bg-zinc-50 scale-[0.99]' 
                      : imageUrl 
                        ? 'border-zinc-200 bg-white' 
                        : 'border-zinc-200 hover:border-zinc-400 bg-zinc-52'
                  }`}
                >
                  <input
                    id="local-file-chooser"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  {imageUrl ? (
                    <div className="flex flex-col items-center space-y-3">
                      <div className="relative aspect-video w-32 rounded-xl overflow-hidden border border-zinc-150">
                        <img 
                          src={imageUrl} 
                          alt="Local preview" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-semibold text-zinc-900 truncate max-w-[200px]">
                          {fileName || 'File uploaded successfully'}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setImageUrl('');
                            setFileName('');
                          }}
                          className="mt-2 text-[10px] text-red-650 font-bold tracking-wide uppercase hover:underline inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove Image</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label htmlFor="local-file-chooser" className="cursor-pointer block space-y-2">
                      <div className="mx-auto w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-500">
                        <Upload className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-zinc-800">
                          Drag and drop your image file here, or <span className="text-zinc-950 underline decoration-zinc-400">browse device</span>
                        </p>
                        <p className="text-[10px] text-zinc-400 mt-1">
                          PNG, JPEG or WEBP files accepted
                        </p>
                      </div>
                    </label>
                  )}
                </div>
              )}

              {/* image URL mode */}
              {imageMode === 'url' && (
                <div id="url-input-block" className="space-y-2">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                      <Link className="w-4 h-4" />
                    </span>
                    <input
                      id="url-photo-input"
                      type="text"
                      value={imageUrl.startsWith('data:') ? '' : imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Paste cover image link here (https://...)"
                      className="w-full pl-9 pr-3.5 py-2 text-zinc-850 placeholder-zinc-400 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 text-sm shadow-xs transition-all"
                    />
                  </div>
                  {imageUrl && !imageUrl.startsWith('data:') && (
                    <p className="text-[10px] text-zinc-400">
                      Linking visual resource asynchronously: <span className="font-mono text-zinc-600 truncate">{imageUrl}</span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Content Narrative field */}
            <div id="create-body-group">
              <label className="block text-xs font-semibold text-zinc-500 font-mono uppercase mb-2 tracking-wider">
                Story Narrative
              </label>
              <textarea
                id="create-body-input"
                rows={10}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="What architectural or visual thoughts are on your mind? Begin keying them here..."
                className="w-full px-3.5 py-3 text-zinc-850 placeholder-zinc-400 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 text-sm shadow-xs transition-all font-sans leading-relaxed resize-y"
              />
            </div>

            {/* Form actions submitting row */}
            <div id="create-post-submission" className="pt-4 border-t border-zinc-100 flex items-center justify-end">
              <button
                id="btn-create-submit"
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-sans font-semibold inline-flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{submitting ? 'Publishing Story...' : 'Publish story'}</span>
              </button>
            </div>

          </form>
        </div>

        {/* Live Premium Preview Widget Display Group (occupies 1 col) */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 space-y-4 shadow-3xs sticky top-24">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1 px-1.5 bg-zinc-200/60 text-zinc-650 rounded text-[9px] font-mono tracking-wider font-bold uppercase">
              Live Canvas Preview
            </span>
          </div>
          
          <div className="bg-white border border-zinc-200/80 rounded-xl shadow-xs overflow-hidden flex flex-col justify-between aspect-[1/1.2] opacity-85 hover:opacity-100 transition-opacity">
            <div>
              {imageUrl ? (
                <div className="w-full aspect-video overflow-hidden border-b border-zinc-100 bg-zinc-100 relative">
                  <img
                    src={imageUrl}
                    alt="Current upload preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-all"
                  />
                </div>
              ) : (
                <div className="w-full aspect-video bg-zinc-100/75 border-b border-zinc-100 flex items-center justify-center text-zinc-400">
                  <Image className="w-8 h-8 opacity-45 stroke-[1.2]" />
                </div>
              )}

              <div className="p-4 space-y-2">
                <span className="text-[10px] font-mono text-zinc-400 tracking-wider font-semibold uppercase block">
                  {authorName.trim() ? authorName : 'Anonymous Author'}
                </span>
                <h4 className="font-sans font-bold text-sm text-zinc-900 tracking-tight leading-snug line-clamp-2">
                  {title.trim() ? title : 'Untitled Story Title'}
                </h4>
                <p className="text-zinc-500 text-[11px] leading-relaxed line-clamp-3">
                  {body.trim() ? body : 'Begin keying characters in the form to generate real-time layout previews...'}
                </p>
              </div>
            </div>

            <div className="m-4 mt-0 pt-2 border-t border-zinc-100 text-[9px] text-zinc-400 font-mono flex items-center justify-between">
              <span>{new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
              <span className="flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active draft</span>
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
