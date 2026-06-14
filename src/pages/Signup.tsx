import React from 'react';

/**
 * User registration dashboard.
 * We will design account credential text boxes and custom error labels here.
 */

interface SignupProps {
  setView: (view: string) => void;
}

export const Signup: React.FC<SignupProps> = ({ setView }) => {
  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-bold font-sans text-zinc-800">Account Registration</h2>
      <p className="text-zinc-500 text-sm mt-2">Sign up components go here.</p>
    </div>
  );
};
