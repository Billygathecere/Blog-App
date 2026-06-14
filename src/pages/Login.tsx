import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Key, Mail, Eye, EyeOff, BookOpen, ArrowRight, CornerDownLeft, ServerCrash } from 'lucide-react';

interface LoginProps {
  setView: (view: string) => void;
}

export const Login: React.FC<LoginProps> = ({ setView }) => {
  // --- STATE PARAMETERS (DYNAMIC COMPONENT BINDING) ---
  const { loginUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // --- FORM SUBMIT LOGIC ---
  const handleLogin = async (e: React.FormEvent) => {
    // Stop traditional complete page reloads
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please provide both administrative inputs (Email and Password).');
      return;
    }

    setLoading(true);

    try {
      // Connects to local storage secure account database
      await loginUser(email, password);
      setView('home'); // Send directly to the main Chronicle Feed on success!
    } catch (err: any) {
      setError(err.message || 'Verification rejected. Check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="login-viewport" className="min-h-[70vh] flex items-center justify-center py-6 animate-fade-in">
      <div className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl p-8 shadow-xs space-y-6">
        
        {/* Editorial Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-zinc-100 rounded-xl text-zinc-900 mb-2">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="font-sans font-bold text-2xl text-zinc-950 tracking-tight">
            Welcome Back to Chronicle
          </h2>
          <p className="text-zinc-500 text-xs">
            Authenticate to compose, refine, or remove literary manuscripts.
          </p>
        </div>

        {/* Dynamic Warning Alert Banner */}
        {error && (
          <div id="login-error-alert" className="p-3.5 bg-red-50 text-red-650 border border-red-150 rounded-xl text-xs font-sans leading-relaxed">
            {error}
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Email Element */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-500 font-mono uppercase tracking-wider">
              Email Address & Identity
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                id="login-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E.g. Jane@gmail.com"
                className="w-full pl-9 pr-3.5 py-2.5 text-zinc-850 placeholder-zinc-400 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 text-sm shadow-xs transition-all"
                required
              />
            </div>
          </div>

          {/* Password Element */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-semibold text-zinc-500 font-mono uppercase tracking-wider">
                Passcode / Word Guard
              </label>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                <Key className="w-4 h-4" />
              </span>
              <input
                id="login-password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Type password..."
                className="w-full pl-9 pr-10 py-2.5 text-zinc-850 placeholder-zinc-400 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 text-sm shadow-xs transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-650"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="btn-login-submit"
            type="submit"
            disabled={loading}
            className="w-full px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-50 cursor-pointer pt-3"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <span>Sign In Securely</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

        {/* Dynamic Account Sandbox Hint for developer convenience */}
        <div className="bg-zinc-50 border border-zinc-150 rounded-xl p-4 mt-4 space-y-1.5 text-[11px] text-zinc-500 leading-normal">
          <p className="font-semibold text-zinc-900 font-mono tracking-tight uppercase flex items-center gap-1">
            <ServerCrash className="w-3.5 h-3.5 text-zinc-455" />
            <span>Developer Sandbox Hint</span>
          </p>
          <p>You can sign in using our default preloaded master credentials below, or click <strong>Create Account</strong> to create a custom user account:</p>
          <div className="pt-1 font-mono text-[10px] space-y-0.5">
            <div><span className="text-zinc-400">Email:</span> <strong className="text-zinc-800">designer@chronicle.com</strong></div>
            <div><span className="text-zinc-400">Passcode:</span> <strong className="text-zinc-800">demo123</strong></div>
          </div>
        </div>

        {/* Footer Navigation Switcher */}
        <div className="pt-4 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <button
            onClick={() => setView('signup')}
            className="text-zinc-500 hover:text-zinc-900 font-semibold transition-colors cursor-pointer"
          >
            Create Account
          </button>
          
          <button
            onClick={() => setView('home')}
            className="inline-flex items-center gap-1 text-zinc-450 hover:text-zinc-800 font-mono text-[10px] uppercase transition-colors cursor-pointer"
          >
            <CornerDownLeft className="w-3 h-3" />
            <span>Enter as Guest</span>
          </button>
        </div>

      </div>
    </div>
  );
};

