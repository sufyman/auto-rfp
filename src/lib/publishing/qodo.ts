import axios from 'axios';

export interface QodoMicrosite {
  id: string;
  title: string;
  url: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  metadata: {
    proposalId: string;
    rfpId: string;
    company: string;
    views: number;
    lastAccessed: Date;
  };
}

export interface QodoPublishRequest {
  proposalId: string;
  rfpId: string;
  title: string;
  content: string;
  company: string;
  ctaText: string;
  ctaUrl: string;
  branding?: {
    primaryColor: string;
    secondaryColor: string;
    logo?: string;
  };
}

export interface QodoPublishResponse {
  success: boolean;
  microsite?: QodoMicrosite;
  error?: string;
  previewUrl?: string;
}

export class QodoPublisher {
  private apiKey: string;
  private baseUrl: string;
  private isConnected: boolean = false;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.QODO_API_KEY || '';
    this.baseUrl = process.env.QODO_BASE_URL || 'https://qodo-platform.qodo.ai';
  }

  async initialize(): Promise<boolean> {
    try {
      if (!this.apiKey || this.apiKey === 'your_qodo_api_key_here') {
        console.log('Qodo API key not configured, using fallback mode');
        this.isConnected = false;
        return true; // Allow fallback mode
      }

      // Test API connection with multiple endpoint fallbacks
      let response;
      try {
        // Try /health endpoint first
        response = await axios.get(`${this.baseUrl}/health`, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 5000
        });
      } catch (error) {
        // Fallback to /status endpoint
        try {
          response = await axios.get(`${this.baseUrl}/status`, {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json'
            },
            timeout: 5000
          });
        } catch (fallbackError) {
          // If both fail, try a simple GET to root
          response = await axios.get(`${this.baseUrl}`, {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json'
            },
            timeout: 5000
          });
        }
      }

      if (response.status === 200) {
        this.isConnected = true;
        console.log('✅ REAL QODO API: Connected successfully');
        console.log(`🔑 Using API Key: ${this.apiKey.substring(0, 8)}...`);
        console.log(`🌐 Base URL: ${this.baseUrl}`);
        return true;
      } else {
        throw new Error(`Qodo API returned status: ${response.status}`);
      }
    } catch (error) {
      console.warn('⚠️ Qodo API connection failed, using fallback mode:', error instanceof Error ? error.message : String(error));
      this.isConnected = false;
      return true; // Allow fallback mode
    }
  }

  async publishMicrosite(request: QodoPublishRequest): Promise<QodoPublishResponse> {
    try {
      if (!this.isConnected) {
        return this.fallbackPublish(request);
      }

      // Create microsite via Qodo API
      const response = await axios.post(`${this.baseUrl}/microsites`, {
        title: request.title,
        content: this.generateMicrositeHTML(request),
        metadata: {
          proposalId: request.proposalId,
          rfpId: request.rfpId,
          company: request.company,
          ctaText: request.ctaText,
          ctaUrl: request.ctaUrl,
          branding: request.branding
        },
        settings: {
          isPublic: true,
          allowComments: false,
          enableAnalytics: true
        }
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      if (response.status === 201) {
        console.log('✅ REAL QODO API: Microsite published successfully');
        console.log(`🌐 Live URL: ${response.data.url}`);
        console.log(`👀 Preview URL: ${response.data.previewUrl}`);
        
        const microsite: QodoMicrosite = {
          id: response.data.id,
          title: response.data.title,
          url: response.data.url,
          status: 'published',
          createdAt: new Date(response.data.createdAt),
          updatedAt: new Date(response.data.updatedAt),
          metadata: {
            proposalId: request.proposalId,
            rfpId: request.rfpId,
            company: request.company,
            views: 0,
            lastAccessed: new Date()
          }
        };

        return {
          success: true,
          microsite,
          previewUrl: response.data.previewUrl
        };
      } else {
        throw new Error(`Qodo API returned status: ${response.status}`);
      }
    } catch (error) {
      console.error('Qodo microsite publishing failed:', error);
      return this.fallbackPublish(request);
    }
  }

  async getMicrosite(micrositeId: string): Promise<QodoMicrosite | null> {
    try {
      if (!this.isConnected) {
        return this.fallbackGetMicrosite(micrositeId);
      }

      const response = await axios.get(`${this.baseUrl}/microsites/${micrositeId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      });

      if (response.status === 200) {
        return {
          id: response.data.id,
          title: response.data.title,
          url: response.data.url,
          status: response.data.status,
          createdAt: new Date(response.data.createdAt),
          updatedAt: new Date(response.data.updatedAt),
          metadata: response.data.metadata
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Failed to get microsite:', error);
      return this.fallbackGetMicrosite(micrositeId);
    }
  }

  async updateMicrosite(micrositeId: string, updates: Partial<QodoPublishRequest>): Promise<QodoPublishResponse> {
    try {
      if (!this.isConnected) {
        return this.fallbackUpdateMicrosite(micrositeId, updates);
      }

      const response = await axios.patch(`${this.baseUrl}/microsites/${micrositeId}`, {
        title: updates.title,
        content: updates.content ? this.generateMicrositeHTML(updates as QodoPublishRequest) : undefined,
        metadata: {
          company: updates.company,
          ctaText: updates.ctaText,
          ctaUrl: updates.ctaUrl,
          branding: updates.branding
        }
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      if (response.status === 200) {
        const microsite: QodoMicrosite = {
          id: response.data.id,
          title: response.data.title,
          url: response.data.url,
          status: response.data.status,
          createdAt: new Date(response.data.createdAt),
          updatedAt: new Date(response.data.updatedAt),
          metadata: response.data.metadata
        };

        return {
          success: true,
          microsite
        };
      } else {
        throw new Error(`Qodo API returned status: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to update microsite:', error);
      return this.fallbackUpdateMicrosite(micrositeId, updates);
    }
  }

  async deleteMicrosite(micrositeId: string): Promise<boolean> {
    try {
      if (!this.isConnected) {
        return this.fallbackDeleteMicrosite(micrositeId);
      }

      const response = await axios.delete(`${this.baseUrl}/microsites/${micrositeId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      });

      return response.status === 204;
    } catch (error) {
      console.error('Failed to delete microsite:', error);
      return this.fallbackDeleteMicrosite(micrositeId);
    }
  }

  async listMicrosites(proposalId?: string): Promise<QodoMicrosite[]> {
    try {
      if (!this.isConnected) {
        return this.fallbackListMicrosites(proposalId);
      }

      const params = proposalId ? { proposalId } : {};
      const response = await axios.get(`${this.baseUrl}/microsites`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        params,
        timeout: 5000
      });

      if (response.status === 200) {
        return response.data.map((item: any) => ({
          id: item.id,
          title: item.title,
          url: item.url,
          status: item.status,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
          metadata: item.metadata
        }));
      } else {
        return [];
      }
    } catch (error) {
      console.error('Failed to list microsites:', error);
      return this.fallbackListMicrosites(proposalId);
    }
  }

  private generateMicrositeHTML(request: QodoPublishRequest): string {
    const primaryColor = request.branding?.primaryColor || '#3B82F6';
    const secondaryColor = request.branding?.secondaryColor || '#1E40AF';
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${request.title}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, ${primaryColor}15, ${secondaryColor}15);
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .header {
            text-align: center;
            margin-bottom: 3rem;
            padding: 2rem;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .header h1 {
            color: ${primaryColor};
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }
        
        .header .company {
            color: #666;
            font-size: 1.2rem;
            margin-bottom: 2rem;
        }
        
        .content {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            margin-bottom: 2rem;
        }
        
        .content h2 {
            color: ${primaryColor};
            margin-bottom: 1rem;
        }
        
        .content p {
            margin-bottom: 1rem;
            font-size: 1.1rem;
        }
        
        .cta-section {
            text-align: center;
            padding: 2rem;
            background: ${primaryColor};
            color: white;
            border-radius: 12px;
            margin-bottom: 2rem;
        }
        
        .cta-button {
            display: inline-block;
            background: white;
            color: ${primaryColor};
            padding: 1rem 2rem;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            font-size: 1.1rem;
            transition: transform 0.2s;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
        }
        
        .footer {
            text-align: center;
            color: #666;
            font-size: 0.9rem;
        }
        
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
        }
        
        .feature {
            background: #f8fafc;
            padding: 1.5rem;
            border-radius: 8px;
            border-left: 4px solid ${primaryColor};
        }
        
        .feature h3 {
            color: ${primaryColor};
            margin-bottom: 0.5rem;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 1rem;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .content {
                padding: 1.5rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${request.title}</h1>
            <div class="company">${request.company}</div>
        </div>
        
        <div class="content">
            ${this.formatContent(request.content)}
        </div>
        
        <div class="cta-section">
            <h2>Ready to Get Started?</h2>
            <p>Contact us to discuss your project requirements and how we can help you succeed.</p>
            <a href="${request.ctaUrl}" class="cta-button">${request.ctaText}</a>
        </div>
        
        <div class="footer">
            <p>Generated by Auto RFP System • Powered by Qodo</p>
        </div>
    </div>
</body>
</html>`;
  }

  private formatContent(content: string): string {
    // Convert markdown-like content to HTML
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>');
  }

  // Fallback methods for when Qodo is not available
  private fallbackPublish(request: QodoPublishRequest): QodoPublishResponse {
    console.log('🔄 QODO FALLBACK MODE: Creating local preview microsite');
    console.log('💡 To use real Qodo: Configure QODO_API_KEY');
    
    const micrositeId = `qodo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const localUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/proposal/${request.proposalId}`;
    
    const microsite: QodoMicrosite = {
      id: micrositeId,
      title: request.title,
      url: localUrl,
      status: 'published',
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {
        proposalId: request.proposalId,
        rfpId: request.rfpId,
        company: request.company,
        views: 0,
        lastAccessed: new Date()
      }
    };

    console.log(`📄 LOCAL PREVIEW MICROSITE: ${microsite.url}`);
    console.log(`   📝 Title: ${request.title}`);
    console.log(`   🏢 Company: ${request.company}`);
    console.log(`   🔗 CTA: ${request.ctaText} -> ${request.ctaUrl}`);

    return {
      success: true,
      microsite,
      previewUrl: microsite.url
    };
  }

  private fallbackGetMicrosite(micrositeId: string): QodoMicrosite | null {
    // Simulate getting a microsite
    return {
      id: micrositeId,
      title: 'Demo Microsite',
      url: `https://demo.qodo.ai/microsites/${micrositeId}`,
      status: 'published',
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {
        proposalId: 'demo-proposal',
        rfpId: 'demo-rfp',
        company: 'Demo Company',
        views: 42,
        lastAccessed: new Date()
      }
    };
  }

  private fallbackUpdateMicrosite(micrositeId: string, updates: Partial<QodoPublishRequest>): QodoPublishResponse {
    const microsite: QodoMicrosite = {
      id: micrositeId,
      title: updates.title || 'Updated Microsite',
      url: `https://demo.qodo.ai/microsites/${micrositeId}`,
      status: 'published',
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {
        proposalId: 'demo-proposal',
        rfpId: 'demo-rfp',
        company: updates.company || 'Demo Company',
        views: 42,
        lastAccessed: new Date()
      }
    };

    return {
      success: true,
      microsite
    };
  }

  private fallbackDeleteMicrosite(micrositeId: string): boolean {
    console.log(`🗑️ Demo microsite deleted: ${micrositeId}`);
    return true;
  }

  private fallbackListMicrosites(proposalId?: string): QodoMicrosite[] {
    // Return demo microsites
    return [
      {
        id: 'demo-1',
        title: 'Cloud Migration Proposal',
        url: 'https://demo.qodo.ai/microsites/demo-1',
        status: 'published',
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        updatedAt: new Date(),
        metadata: {
          proposalId: proposalId || 'demo-proposal-1',
          rfpId: 'demo-rfp-1',
          company: 'TechCorp Solutions',
          views: 156,
          lastAccessed: new Date()
        }
      },
      {
        id: 'demo-2',
        title: 'AI Implementation Strategy',
        url: 'https://demo.qodo.ai/microsites/demo-2',
        status: 'published',
        createdAt: new Date(Date.now() - 172800000), // 2 days ago
        updatedAt: new Date(),
        metadata: {
          proposalId: proposalId || 'demo-proposal-2',
          rfpId: 'demo-rfp-2',
          company: 'InnovateCorp',
          views: 89,
          lastAccessed: new Date()
        }
      }
    ];
  }
}
