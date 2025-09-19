'use client';

import React, { useState, useEffect } from 'react';
import { StytchAuth, AuthSession } from '@/lib/auth/stytch';

interface StytchAuthProps {
  onAuthSuccess: (session: AuthSession) => void;
  onAuthError: (error: string) => void;
}

export default function StytchAuthComponent({ onAuthSuccess, onAuthError }: StytchAuthProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [auth, setAuth] = useState<StytchAuth | null>(null);

  useEffect(() => {
    const stytchAuth = new StytchAuth();
    stytchAuth.initialize().then(() => {
      setAuth(stytchAuth);
    });
  }, []);

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !email) return;

    setIsLoading(true);
    setMessage('');

    try {
      const success = await auth.sendMagicLink(email);
      if (success) {
        setMessage('Magic link sent! Check your email and click the link to sign in.');
      } else {
        onAuthError('Failed to send magic link. Please try again.');
      }
    } catch (error) {
      onAuthError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    if (!auth) return;

    // Demo mode - simulate successful authentication
    const demoSession: AuthSession = {
      sessionToken: 'demo-session-token',
      sessionJwt: 'demo-jwt-token',
      user: {
        userId: 'demo-user-123',
        email: 'demo@autorfp.com',
        name: 'Demo User',
        organizationId: 'demo-org-123',
        organizationName: 'Demo Organization',
        role: 'admin'
      },
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    };

    onAuthSuccess(demoSession);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Access Auto RFP Proposals
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to view and manage your RFP proposals
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSendMagicLink}>
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Enter your email address"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || !email}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send Magic Link'}
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Or</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Demo Login
              </button>
            </div>
          </div>
        </form>

        {message && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">{message}</p>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
}
