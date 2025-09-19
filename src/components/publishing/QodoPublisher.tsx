'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { QodoPublisher, QodoMicrosite, QodoPublishRequest } from '@/lib/publishing/qodo';

interface QodoPublisherProps {
  proposalId: string;
  rfpId: string;
  proposalData: {
    title: string;
    content: string;
    company: string;
  };
  onPublish?: (microsite: QodoMicrosite) => void;
}

export default function QodoPublisherComponent({ 
  proposalId, 
  rfpId, 
  proposalData, 
  onPublish 
}: QodoPublisherProps) {
  const [publisher, setPublisher] = useState<QodoPublisher | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedMicrosites, setPublishedMicrosites] = useState<QodoMicrosite[]>([]);
  const [customization, setCustomization] = useState({
    ctaText: 'Contact Us Today',
    ctaUrl: 'mailto:contact@company.com',
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF'
  });

  useEffect(() => {
    const qodoPublisher = new QodoPublisher();
    qodoPublisher.initialize().then(() => {
      setPublisher(qodoPublisher);
      loadMicrosites();
    });
  }, [loadMicrosites]);

  const loadMicrosites = useCallback(async () => {
    if (!publisher) return;
    
    try {
      const microsites = await publisher.listMicrosites(proposalId);
      setPublishedMicrosites(microsites);
    } catch (error) {
      console.error('Failed to load microsites:', error);
    }
  }, [publisher, proposalId]);

  const handlePublish = async () => {
    if (!publisher) return;

    setIsPublishing(true);
    try {
      const publishRequest: QodoPublishRequest = {
        proposalId,
        rfpId,
        title: proposalData.title,
        content: proposalData.content,
        company: proposalData.company,
        ctaText: customization.ctaText,
        ctaUrl: customization.ctaUrl,
        branding: {
          primaryColor: customization.primaryColor,
          secondaryColor: customization.secondaryColor
        }
      };

      const result = await publisher.publishMicrosite(publishRequest);
      
      if (result.success && result.microsite) {
        setPublishedMicrosites(prev => [result.microsite!, ...prev]);
        onPublish?.(result.microsite);
        
        // Show success message
        alert(`✅ Microsite published successfully!\n\nURL: ${result.microsite.url}\nPreview: ${result.previewUrl}`);
      } else {
        alert(`❌ Failed to publish microsite: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Publishing failed:', error);
      alert('❌ Publishing failed. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDelete = async (micrositeId: string) => {
    if (!publisher) return;
    
    if (confirm('Are you sure you want to delete this microsite?')) {
      try {
        const success = await publisher.deleteMicrosite(micrositeId);
        if (success) {
          setPublishedMicrosites(prev => prev.filter(m => m.id !== micrositeId));
          alert('✅ Microsite deleted successfully');
        } else {
          alert('❌ Failed to delete microsite');
        }
      } catch (error) {
        console.error('Delete failed:', error);
        alert('❌ Delete failed. Please try again.');
      }
    }
  };

  if (!publisher) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2">Initializing Qodo Publisher...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Publish Microsite with Qodo
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customization Options */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Customization</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Call-to-Action Text
                </label>
                <input
                  type="text"
                  value={customization.ctaText}
                  onChange={(e) => setCustomization(prev => ({ ...prev, ctaText: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Contact Us Today"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Call-to-Action URL
                </label>
                <input
                  type="url"
                  value={customization.ctaUrl}
                  onChange={(e) => setCustomization(prev => ({ ...prev, ctaUrl: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="mailto:contact@company.com"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <input
                    type="color"
                    value={customization.primaryColor}
                    onChange={(e) => setCustomization(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="w-full h-10 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Color
                  </label>
                  <input
                    type="color"
                    value={customization.secondaryColor}
                    onChange={(e) => setCustomization(prev => ({ ...prev, secondaryColor: e.target.value }))}
                    className="w-full h-10 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Preview */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Preview</h3>
            
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="text-center mb-4">
                <h4 className="text-xl font-bold" style={{ color: customization.primaryColor }}>
                  {proposalData.title}
                </h4>
                <p className="text-gray-600">{proposalData.company}</p>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-700 line-clamp-3">
                  {proposalData.content.substring(0, 150)}...
                </p>
              </div>
              
              <div 
                className="text-center p-4 rounded-lg text-white"
                style={{ backgroundColor: customization.primaryColor }}
              >
                <p className="mb-2">Ready to Get Started?</p>
                <button 
                  className="bg-white px-4 py-2 rounded text-sm font-medium"
                  style={{ color: customization.primaryColor }}
                >
                  {customization.ctaText}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isPublishing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Publishing...
              </>
            ) : (
              'Publish Microsite'
            )}
          </button>
        </div>
      </div>
      
      {/* Published Microsites */}
      {publishedMicrosites.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Published Microsites
          </h3>
          
          <div className="space-y-4">
            {publishedMicrosites.map((microsite) => (
              <div key={microsite.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{microsite.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {microsite.metadata.company} • {microsite.metadata.views} views
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Created: {microsite.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <a
                      href={microsite.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      View
                    </a>
                    <button
                      onClick={() => handleDelete(microsite.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
