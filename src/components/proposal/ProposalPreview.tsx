'use client';

import React, { useState, useEffect } from 'react';
import { StytchAuth, AuthSession } from '@/lib/auth/stytch';

interface ProposalPreviewProps {
  proposalId: string;
  proposalData: {
    title: string;
    content: string;
    rfpTitle: string;
    company: string;
    status: string;
    createdAt: string;
  };
}

export default function ProposalPreview({ proposalId, proposalData }: ProposalPreviewProps) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [auth, setAuth] = useState<StytchAuth | null>(null);

  useEffect(() => {
    const stytchAuth = new StytchAuth();
    stytchAuth.initialize().then(() => {
      setAuth(stytchAuth);
    });
  }, []);

  useEffect(() => {
    const checkAccess = async () => {
      if (!auth) return;

      // Check for session token in URL or localStorage
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token') || localStorage.getItem('stytch_session_token');

      if (token) {
        const session = await auth.authenticateUser(token);
        if (session) {
          setSession(session);
          localStorage.setItem('stytch_session_token', token);
        } else {
          setError('Invalid or expired session. Please sign in again.');
        }
      } else {
        setError('No session found. Please sign in to view this proposal.');
      }

      setIsLoading(false);
    };

    checkAccess();
  }, [auth]);

  const handleSignOut = async () => {
    if (auth && session) {
      await auth.logout(session.sessionToken);
    }
    localStorage.removeItem('stytch_session_token');
    setSession(null);
    setError('Please sign in to view this proposal.');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Access Required
            </h2>
            <p className="text-gray-600 mb-8">
              {error || 'Please sign in to view this proposal.'}
            </p>
            <button
              onClick={() => window.location.href = '/auth'}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {proposalData.title}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                RFP: {proposalData.rfpTitle} • {proposalData.company}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Signed in as {session.user.email}
              </div>
              <button
                onClick={handleSignOut}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Proposal Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          {/* Proposal Header */}
          <div className="border-b pb-6 mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Proposal Summary
                </h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Status: <span className="font-medium text-green-600">{proposalData.status}</span></span>
                  <span>Created: {new Date(proposalData.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Organization</div>
                <div className="font-medium text-gray-900">{session.user.organizationName}</div>
              </div>
            </div>
          </div>

          {/* Proposal Content */}
          <div className="prose max-w-none">
            <div 
              className="text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: proposalData.content }}
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                This proposal is protected by Stytch authentication
              </div>
              <div className="flex space-x-4">
                <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  Download PDF
                </button>
                <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Share Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
