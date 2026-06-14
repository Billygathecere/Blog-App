import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { FolderGit2, Code, FileText, CheckCircle2 } from 'lucide-react';

function DesignWorkspace() {
  const [currentStep, setCurrentStep] = useState(1);
  
  const files = [
    { name: 'src/types.ts', desc: 'Types & Interfaces defined in code together', status: 'scaffolded' },
    { name: 'src/api/authService.ts', desc: 'Mock signup/login asynchronous methods', status: 'scaffolded' },
    { name: 'src/api/postService.ts', desc: 'Stories list, create, update, and deletion mechanics', status: 'scaffolded' },
    { name: 'src/context/AuthContext.tsx', desc: 'Context provider for session persistence', status: 'scaffolded' },
    { name: 'src/components/Navbar.tsx', desc: 'Dynamic nav with credentials status', status: 'scaffolded' },
    { name: 'src/components/PostCard.tsx', desc: 'Clean cards with owner operation widgets', status: 'scaffolded' },
    { name: 'src/components/ProtectedRoute.tsx', desc: 'Guard layout wrapping restricted pages', status: 'scaffolded' },
    { name: 'src/pages/Home.tsx', desc: 'Public stories feed page with Search filters', status: 'scaffolded' },
    { name: 'src/pages/Login.tsx', desc: 'User credentials security form page', status: 'scaffolded' },
    { name: 'src/pages/Signup.tsx', desc: 'New publisher registration form page', status: 'scaffolded' },
    { name: 'src/pages/CreatePost.tsx', desc: 'Creation deck containing editor textareas', status: 'scaffolded' },
    { name: 'src/pages/EditPost.tsx', desc: 'Modifications panel populated with record details', status: 'scaffolded' },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-800 flex flex-col font-sans">
      <Navbar currentView="home" setView={() => {}} />

      <main className="flex-grow max-w-4xl w-full mx-auto px-6 py-10 space-y-8">
        
        {/* Design Header Card */}
        <section className="bg-white border border-zinc-200 rounded-xl p-8 shadow-xs">
          <div className="flex items-start gap-4">
            <span className="p-3 bg-zinc-100 rounded-lg text-zinc-900 shrink-0">
              <FolderGit2 className="w-6 h-6" />
            </span>
            <div>
              <span className="text-[10px] bg-zinc-100 text-zinc-500 font-mono px-2 py-0.5 rounded uppercase tracking-wider font-semibold">
                Project Directory Bootstrapped
              </span>
              <h1 className="font-sans font-bold text-2xl text-zinc-950 tracking-tight mt-1">
                Collaborative CMS Workspace
              </h1>
              <p className="text-zinc-500 text-sm mt-1.5 leading-relaxed">
                I have cleared the pre-written logics and scaffolded the entire directory structure! All files exist as custom placeholders with clean, easy-to-follow comments so that we can write the application's code together.
              </p>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6">
          
          {/* File Map Column */}
          <div className="md:col-span-2 bg-white border border-zinc-200 rounded-xl p-6 space-y-4 shadow-xs">
            <h3 className="font-sans font-bold text-sm text-zinc-950 uppercase tracking-wider flex items-center gap-2">
              <Code className="w-4 h-4 text-zinc-650" />
              <span>Project Directory Skeleton</span>
            </h3>
            
            <p className="text-zinc-400 text-xs font-serif leading-relaxed">
              Every item has been created empty or as a simple component placeholder with no implementation yet:
            </p>

            <div className="space-y-2 border-t border-zinc-100 pt-4 overflow-y-auto max-h-[380px]">
              {files.map((file, i) => (
                <div key={i} className="flex items-center justify-between p-2 hover:bg-zinc-50 rounded-md transition-colors text-xs font-mono">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <span className="text-zinc-900 font-semibold truncate">{file.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-zinc-400 font-sans text-[11px] truncate hidden sm:inline">{file.desc}</span>
                    <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px] font-sans font-semibold uppercase shrink-0">
                      Exist
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Workflow Guide Column */}
          <div className="bg-zinc-900 text-white border border-zinc-800 rounded-xl p-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <h3 className="font-sans font-bold text-xs text-zinc-400 uppercase tracking-wider">
                How we will build it
              </h3>
              
              <div className="space-y-4 mt-6">
                <div className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 text-xs font-mono flex items-center justify-center font-bold text-zinc-300 shrink-0">
                    1
                  </span>
                  <p className="text-zinc-300 text-xs leading-relaxed font-sans">
                    <strong>Define Entities:</strong> We will first open <span className="font-mono text-[11px] text-zinc-100">src/types.ts</span> to define user models, auth scopes, and stories.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 text-xs font-mono flex items-center justify-center font-bold text-zinc-300 shrink-0">
                    2
                  </span>
                  <p className="text-zinc-300 text-xs leading-relaxed font-sans">
                    <strong>State Providers:</strong> Next we will connect database queries in our service hooks and authentication context.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 text-xs font-mono flex items-center justify-center font-bold text-zinc-300 shrink-0">
                    3
                  </span>
                  <p className="text-zinc-300 text-xs leading-relaxed font-sans">
                    <strong>Polish Interfaces:</strong> Finally, we will build out the navbar, cards, page forms, and routes sequentially.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-4 mt-6">
              <p className="text-[11px] font-mono text-zinc-500 leading-normal flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                <span>Ready to start editing together whenever you are!</span>
              </p>
            </div>
          </div>

        </section>

      </main>

      <footer className="bg-white border-t border-zinc-200 py-6 text-center text-xs text-zinc-400 font-mono">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>CHRONICLE SKELETON v1.0</span>
          <span>&copy; {new Date().getFullYear()} Aesthetic CMS scaffolding layer.</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DesignWorkspace />
    </AuthProvider>
  );
}
