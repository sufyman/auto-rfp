# Qodo Usage Guide for Auto RFP System

## Overview

Qodo is the final step in your Auto RFP system - it publishes your generated proposals as beautiful, professional microsites that can be shared with clients. This guide shows you how to use Qodo effectively.

## What Qodo Does

Qodo takes your generated proposal content and creates:
- **Professional Microsites**: Beautiful, responsive web pages
- **Custom Branding**: Your company colors and styling
- **Call-to-Action Integration**: Direct contact buttons
- **Mobile-Responsive Design**: Works on all devices
- **SEO Optimization**: Search engine friendly
- **Analytics Tracking**: Monitor views and engagement

## How to Use Qodo

### 1. **Automatic Publishing**

When your Auto RFP agent completes a proposal, it automatically:
1. Generates the proposal content
2. Applies your company branding
3. Creates a microsite with Qodo
4. Provides a shareable URL

### 2. **Manual Publishing**

You can also publish proposals manually:

```typescript
import { QodoPublisher } from '@/lib/publishing/qodo';

const publisher = new QodoPublisher();
await publisher.initialize();

const result = await publisher.publishMicrosite({
  proposalId: 'prop_123',
  rfpId: 'rfp_456',
  title: 'Cloud Migration Proposal',
  content: 'Your proposal content...',
  company: 'Your Company',
  ctaText: 'Contact Us Today',
  ctaUrl: 'mailto:contact@company.com',
  branding: {
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF'
  }
});

console.log('Microsite URL:', result.microsite?.url);
```

### 3. **Customization Options**

#### Branding
- **Primary Color**: Main brand color for headers and CTAs
- **Secondary Color**: Accent color for backgrounds
- **Logo**: Your company logo (optional)

#### Content
- **Title**: Proposal title
- **Content**: Full proposal text with formatting
- **Company**: Your company name
- **Call-to-Action**: Button text and destination URL

### 4. **Microsite Management**

#### List All Microsites
```typescript
const microsites = await publisher.listMicrosites();
console.log(`Found ${microsites.length} microsites`);
```

#### Get Specific Microsite
```typescript
const microsite = await publisher.getMicrosite('microsite-id');
console.log('URL:', microsite?.url);
console.log('Views:', microsite?.metadata.views);
```

#### Update Microsite
```typescript
await publisher.updateMicrosite('microsite-id', {
  title: 'Updated Title',
  ctaText: 'New CTA Text'
});
```

#### Delete Microsite
```typescript
await publisher.deleteMicrosite('microsite-id');
```

## Integration with Auto RFP Workflow

### 1. **Agent Workflow Integration**

Your Auto RFP agent automatically uses Qodo:

```typescript
// In your agent orchestrator
async function deployProposal(proposal: Proposal) {
  const publisher = new QodoPublisher();
  await publisher.initialize();
  
  const result = await publisher.publishMicrosite({
    proposalId: proposal.id,
    rfpId: proposal.rfpId,
    title: proposal.title,
    content: proposal.content,
    company: proposal.company,
    ctaText: 'Schedule a Meeting',
    ctaUrl: 'mailto:sales@company.com',
    branding: {
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF'
    }
  });
  
  if (result.success) {
    console.log('✅ Proposal published:', result.microsite?.url);
    return result.microsite;
  }
}
```

### 2. **React Component Usage**

Use the QodoPublisher component in your UI:

```tsx
import QodoPublisherComponent from '@/components/publishing/QodoPublisher';

function ProposalPage({ proposal }) {
  return (
    <div>
      <h1>{proposal.title}</h1>
      <QodoPublisherComponent
        proposalId={proposal.id}
        rfpId={proposal.rfpId}
        proposalData={{
          title: proposal.title,
          content: proposal.content,
          company: proposal.company
        }}
        onPublish={(microsite) => {
          console.log('Published:', microsite.url);
        }}
      />
    </div>
  );
}
```

## API Endpoints

### Publish Microsite
```bash
POST /api/publish/qodo
{
  "action": "publish",
  "proposalId": "prop_123",
  "rfpId": "rfp_456",
  "title": "Proposal Title",
  "content": "Proposal content...",
  "company": "Company Name",
  "ctaText": "Contact Us",
  "ctaUrl": "mailto:contact@company.com",
  "branding": {
    "primaryColor": "#3B82F6",
    "secondaryColor": "#1E40AF"
  }
}
```

### List Microsites
```bash
GET /api/publish/qodo?action=list&proposalId=prop_123
```

### Get Microsite
```bash
GET /api/publish/qodo?action=get&micrositeId=microsite-id
```

### Update Microsite
```bash
POST /api/publish/qodo
{
  "action": "update",
  "micrositeId": "microsite-id",
  "updates": {
    "title": "New Title",
    "ctaText": "New CTA"
  }
}
```

### Delete Microsite
```bash
POST /api/publish/qodo
{
  "action": "delete",
  "micrositeId": "microsite-id"
}
```

## Demo Mode

When Qodo API is not configured, the system automatically falls back to demo mode:

- **Demo URLs**: `https://demo.qodo.ai/microsites/[id]`
- **Full Functionality**: All features work without external API
- **Realistic Data**: Sample microsites for testing
- **No Configuration**: Works out of the box

## Production Setup

To use Qodo in production:

1. **Get Qodo API Key**: Sign up at [qodo.ai](https://qodo.ai)
2. **Configure Environment**: Add to `.env.local`:
   ```bash
   QODO_API_KEY=your_qodo_api_key
   QODO_BASE_URL=https://api.qodo.ai/v1
   ```
3. **Test Integration**: Verify API connectivity
4. **Deploy**: Your system will use real Qodo API

## Best Practices

### 1. **Content Optimization**
- Keep titles concise and compelling
- Use clear, professional language
- Include specific benefits and outcomes
- Add relevant keywords for SEO

### 2. **Branding Consistency**
- Use your brand colors consistently
- Match your company's visual identity
- Test on different devices and browsers
- Ensure accessibility compliance

### 3. **Call-to-Action Design**
- Use action-oriented language
- Make CTAs prominent and clickable
- Test different CTA texts and URLs
- Track conversion rates

### 4. **Performance**
- Optimize images and content
- Use fast loading fonts
- Minimize external dependencies
- Monitor page load times

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check your Qodo API key
   - Verify network connectivity
   - Check API endpoint URL

2. **Microsite Not Publishing**
   - Validate all required fields
   - Check content formatting
   - Verify branding options

3. **Styling Issues**
   - Check color format (hex codes)
   - Validate HTML content
   - Test responsive design

### Debug Mode

Enable debug logging:
```typescript
const publisher = new QodoPublisher();
publisher.debug = true; // Enable detailed logging
```

## Examples

### Basic Proposal
```typescript
const basicProposal = {
  proposalId: 'prop_001',
  rfpId: 'rfp_001',
  title: 'Cloud Migration Services',
  content: 'We offer comprehensive cloud migration services...',
  company: 'TechCorp Solutions',
  ctaText: 'Get Started',
  ctaUrl: 'mailto:sales@techcorp.com'
};
```

### Branded Proposal
```typescript
const brandedProposal = {
  ...basicProposal,
  branding: {
    primaryColor: '#FF6B6B',
    secondaryColor: '#4ECDC4',
    logo: 'https://company.com/logo.png'
  }
};
```

### Enterprise Proposal
```typescript
const enterpriseProposal = {
  ...basicProposal,
  ctaText: 'Schedule Enterprise Demo',
  ctaUrl: 'https://company.com/enterprise-demo',
  branding: {
    primaryColor: '#2C3E50',
    secondaryColor: '#34495E'
  }
};
```

## Support

For Qodo-specific issues:
- Check the [Qodo documentation](https://qodo.ai/docs)
- Contact Qodo support
- Use the fallback mode for development

For Auto RFP system issues:
- Check the system logs
- Verify all integrations
- Test with demo data first

Your Auto RFP system is now complete with Qodo integration for professional proposal publishing! 🎉
