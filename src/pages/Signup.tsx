import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Key, Eye, EyeOff, BookOpen, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react';

interface SignupProps {
  setView: (view: string) => void;
}

export const Signup: React.FC<SignupProps> = ({ setView }) => {
  // --- SIGNUP STATES (DYNAMIC COMPONENT REACT STATE BINDINGS) ---
  const { registerUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // --- SUBMIT COMPONENT HANDLER ---
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Input constraints check
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all available registration parameters.');
      return;
    }

    if (password.length < 5) {
      setError('A secure passcode should consist of at least 5 character blocks.');
      return;
    }

    setLoading(true);

    try {
      // Executes standard register callback write to client DB (localStorage)
      await registerUser(name, email, password);
      setView('home'); // Send directly to feed as a newly authenticated active user!
    } catch (err: any) {
      setError(err.message || 'Registration rejected. Please specify alternative inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="signup-viewport" className="min-h-[70vh] flex items-center justify-center py-6 animate-fade-in">
      <div className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl p-8 shadow-xs space-y-6">
        
        {/* Registration Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-zinc-100 rounded-xl text-zinc-900 mb-2">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="font-sans font-bold text-2xl text-zinc-950 tracking-tight">
            Create Your Account
          </h2>
          <p className="text-zinc-500 text-xs">
            Join the Chronicle platform to publish customized design stories.
          </p>
        </div>

        {/* Dynamic Warning Alert Banner */}
        {error && (
          <div id="signup-error-alert" className="p-3.5 bg-red-50 text-red-650 border border-red-150 rounded-xl text-xs font-sans leading-relaxed">
            {error}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          
          {/* Public Nickname Identification Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-500 font-mono uppercase tracking-wider">
              Public Nickname / Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                <User className="w-4 h-4" />
              </span>
              <input
                id="signup-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="E.g. Jane Doe"
                className="w-full pl-9 pr-3.5 py-2.5 text-zinc-850 placeholder-zinc-400 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 text-sm shadow-xs transition-all"
                required
              />
            </div>
          </div>

          {/* Email Address Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-500 font-mono uppercase tracking-wider">
              Email Address & Identity
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                id="signup-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E.g. Jane@gmail.com"
                className="w-full pl-9 pr-3.5 py-2.5 text-zinc-850 placeholder-zinc-400 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 text-sm shadow-xs transition-all"
                required
              />
            </div>
          </div>

          {/* Password Code Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-500 font-mono uppercase tracking-wider">
              Passcode Word Guard
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                <Key className="w-4 h-4" />
              </span>
              <input
                id="signup-password-input"
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
            <span className="block text-[10px] text-zinc-400">
              Passcode criteria: Minimum of five alphanumeric blocks
            </span>
          </div>

          {/* Submit Action Button */}
          <button
            id="btn-signup-submit"
            type="submit"
            disabled={loading}
            className="w-full px-5 py-2.5 bg-zinc-900 hover:bg-zinc-805 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-50 cursor-pointer pt-3"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <span>Register & Login</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

        {/* Dynamic Navigation Switcher footer */}
        <div className="pt-4 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <button
            onClick={() => setView('login')}
            className="text-zinc-500 hover:text-zinc-900 font-semibold transition-colors cursor-pointer"
          >
            Already registered? Sign In
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

