import React from 'react';

/**
 * Session validation interface.
 * We will design secure account verification forms and sandbox logs here.
 */

interface LoginProps {
  setView: (view: string) => void;
}

export const Login: React.FC<LoginProps> = ({ setView }) => {
  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-bold font-sans text-zinc-800">Secure Access Login</h2>
      <p className="text-zinc-500 text-sm mt-2">Credentials form will go here.</p>
    </div>
  );
};
