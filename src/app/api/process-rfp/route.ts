import { NextRequest, NextResponse } from 'next/server';
import { AgentOrchestrator } from '@/lib/agents/orchestrator';

export async function POST(request: NextRequest) {
  try {
    const { rfpUrl } = await request.json();
    
    console.log('\n🎯 RFP PROCESSING API CALLED');
    console.log(`📋 RFP URL: ${rfpUrl}`);
    console.log('🌐 Running server-side - logs will appear in terminal');
    console.log('=' .repeat(60));
    
    const orchestrator = new AgentOrchestrator();
    const proposal = await orchestrator.processRFP(rfpUrl || 'https://sam.gov/test-rfp');
    
    console.log('=' .repeat(60));
    console.log('✅ RFP PROCESSING API COMPLETED');
    console.log(`📄 Generated proposal: "${proposal.title}"`);
    console.log(`📊 Sections: ${proposal.sections.length}, Words: ${proposal.metadata.totalWordCount}`);
    console.log('=' .repeat(60));
    
    return NextResponse.json({
      success: true,
      proposal
    });
  } catch (error) {
    console.error('❌ RFP PROCESSING API FAILED:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
