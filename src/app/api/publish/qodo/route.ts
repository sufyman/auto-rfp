import { NextRequest, NextResponse } from 'next/server';
import { QodoPublisher, QodoPublishRequest } from '@/lib/publishing/qodo';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;
    
    const publisher = new QodoPublisher();
    await publisher.initialize();

    switch (action) {
      case 'publish':
        const publishRequest: QodoPublishRequest = {
          proposalId: data.proposalId,
          rfpId: data.rfpId,
          title: data.title,
          content: data.content,
          company: data.company,
          ctaText: data.ctaText || 'Contact Us Today',
          ctaUrl: data.ctaUrl || 'mailto:contact@company.com',
          branding: data.branding
        };

        const result = await publisher.publishMicrosite(publishRequest);
        
        return NextResponse.json({
          success: result.success,
          microsite: result.microsite,
          previewUrl: result.previewUrl,
          error: result.error
        });

      case 'get':
        const microsite = await publisher.getMicrosite(data.micrositeId);
        
        return NextResponse.json({
          success: !!microsite,
          microsite
        });

      case 'update':
        const updateResult = await publisher.updateMicrosite(
          data.micrositeId, 
          data.updates
        );
        
        return NextResponse.json({
          success: updateResult.success,
          microsite: updateResult.microsite,
          error: updateResult.error
        });

      case 'delete':
        const deleteSuccess = await publisher.deleteMicrosite(data.micrositeId);
        
        return NextResponse.json({
          success: deleteSuccess
        });

      case 'list':
        const microsites = await publisher.listMicrosites(data.proposalId);
        
        return NextResponse.json({
          success: true,
          microsites
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Qodo API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const micrositeId = searchParams.get('micrositeId');
    const proposalId = searchParams.get('proposalId');

    const publisher = new QodoPublisher();
    await publisher.initialize();

    switch (action) {
      case 'get':
        if (!micrositeId) {
          return NextResponse.json({
            success: false,
            error: 'Missing micrositeId'
          }, { status: 400 });
        }

        const microsite = await publisher.getMicrosite(micrositeId);
        
        return NextResponse.json({
          success: !!microsite,
          microsite
        });

      case 'list':
        const microsites = await publisher.listMicrosites(proposalId || undefined);
        
        return NextResponse.json({
          success: true,
          microsites
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Qodo API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
