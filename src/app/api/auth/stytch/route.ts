import { NextRequest, NextResponse } from 'next/server';
import { StytchAuth } from '@/lib/auth/stytch';

export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json();
    const auth = new StytchAuth();

    switch (action) {
      case 'send_magic_link':
        const { email, organizationName } = data;
        const success = await auth.sendMagicLink(email, organizationName);
        
        return NextResponse.json({ 
          success,
          message: success ? 'Magic link sent successfully' : 'Failed to send magic link'
        });

      case 'verify_magic_link':
        const { token } = data;
        const session = await auth.verifyMagicLink(token);
        
        if (session) {
          return NextResponse.json({ 
            success: true, 
            session,
            message: 'Authentication successful'
          });
        } else {
          return NextResponse.json({ 
            success: false, 
            message: 'Invalid or expired token'
          }, { status: 401 });
        }

      case 'authenticate':
        const { sessionToken } = data;
        const authSession = await auth.authenticateUser(sessionToken);
        
        if (authSession) {
          return NextResponse.json({ 
            success: true, 
            session: authSession,
            message: 'Session authenticated'
          });
        } else {
          return NextResponse.json({ 
            success: false, 
            message: 'Invalid session'
          }, { status: 401 });
        }

      case 'logout':
        const { sessionToken: logoutToken } = data;
        const logoutSuccess = await auth.logout(logoutToken);
        
        return NextResponse.json({ 
          success: logoutSuccess,
          message: logoutSuccess ? 'Logged out successfully' : 'Logout failed'
        });

      case 'check_access':
        const { sessionToken: accessToken, proposalId } = data;
        const hasAccess = await auth.canAccessProposal(accessToken, proposalId);
        
        return NextResponse.json({ 
          success: hasAccess,
          message: hasAccess ? 'Access granted' : 'Access denied'
        });

      default:
        return NextResponse.json({ 
          success: false, 
          message: 'Invalid action'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Stytch API error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const token = searchParams.get('token');
    const proposalId = searchParams.get('proposalId');

    const auth = new StytchAuth();

    switch (action) {
      case 'verify_preview_token':
        if (!token || !proposalId) {
          return NextResponse.json({ 
            success: false, 
            message: 'Missing token or proposal ID'
          }, { status: 400 });
        }

        const isValid = await auth.validatePreviewToken(token, proposalId);
        
        return NextResponse.json({ 
          success: isValid,
          message: isValid ? 'Token is valid' : 'Invalid or expired token'
        });

      case 'generate_preview_link':
        if (!proposalId) {
          return NextResponse.json({ 
            success: false, 
            message: 'Missing proposal ID'
          }, { status: 400 });
        }

        const previewLink = await auth.generateProposalPreviewLink(proposalId);
        
        return NextResponse.json({ 
          success: true, 
          previewLink,
          message: 'Preview link generated'
        });

      default:
        return NextResponse.json({ 
          success: false, 
          message: 'Invalid action'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Stytch API error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error'
    }, { status: 500 });
  }
}
