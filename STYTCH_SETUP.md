# Stytch Setup Guide for Auto RFP System

## Overview

Stytch provides B2B SaaS authentication for gating proposal previews in your Auto RFP system. This guide shows how to configure Stytch for production use.

## Environment Variables

Add these to your `.env.local` file:

```bash
# Stytch Configuration
NEXT_PUBLIC_STYTCH_PROJECT_ID=your_stytch_project_id
STYTCH_SECRET=your_stytch_secret
NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN=your_stytch_public_token
```

## Getting Started with Stytch

1. **Sign up for Stytch**: Visit [stytch.com](https://stytch.com) and create an account
2. **Create a Project**: Set up a new B2B SaaS project
3. **Get API Keys**: Copy your Project ID, Secret, and Public Token
4. **Configure Environment**: Add the keys to your `.env.local` file

## Features Implemented

### ✅ B2B SaaS Authentication
- Magic link authentication
- Session management
- Organization-based access control
- User role management

### ✅ Proposal Gating
- Secure proposal preview links
- Time-limited access tokens
- Session-based authentication
- Automatic access validation

### ✅ Fallback Mode
- Demo authentication for development
- Graceful degradation when Stytch is not configured
- Full functionality without external dependencies

## Usage Examples

### Magic Link Authentication
```typescript
const auth = new StytchAuth();
await auth.sendMagicLink('user@company.com', 'Company Name');
```

### Session Management
```typescript
const session = await auth.authenticateUser(sessionToken);
if (session) {
  // User is authenticated
  console.log(`Welcome ${session.user.email}`);
}
```

### Proposal Access Control
```typescript
const hasAccess = await auth.canAccessProposal(sessionToken, proposalId);
if (hasAccess) {
  // Show proposal content
}
```

### Preview Link Generation
```typescript
const previewLink = await auth.generateProposalPreviewLink(proposalId);
// Share this secure link with authorized users
```

## Integration with Auto RFP

The Stytch integration is used in several key areas:

1. **Proposal Preview Gating**: Only authenticated users can view proposal previews
2. **Organization Management**: Users belong to organizations for access control
3. **Session Persistence**: Maintains user sessions across page refreshes
4. **Secure Sharing**: Generates time-limited preview links for external sharing

## Demo Mode

When Stytch is not configured, the system automatically falls back to demo mode:
- Demo user: `demo@autorfp.com`
- Demo organization: `Demo Organization`
- Demo session token: `demo-session-token`

This allows full testing of the Auto RFP system without requiring Stytch setup.

## Security Features

- **Session Tokens**: Secure, time-limited authentication
- **Preview Tokens**: Cryptographically secure proposal access
- **Organization Isolation**: Users can only access their organization's proposals
- **Automatic Expiration**: Sessions and tokens expire automatically

## Next Steps

1. Set up your Stytch account and get API keys
2. Add the keys to your environment variables
3. Test the authentication flow
4. Configure organization settings for your use case
5. Deploy with production Stytch configuration

For more information, visit the [Stytch Documentation](https://stytch.com/docs).
