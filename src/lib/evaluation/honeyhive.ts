import { HoneyHive } from 'honeyhive';

export interface EvaluationResult {
  score: number;
  metrics: {
    requirementCoverage: number;
    hallucinationScore: number;
    toneScore: number;
    citationAccuracy: number;
  };
  feedback: string;
  suggestions: string[];
}

export interface ProposalEvaluation {
  proposalId: string;
  rfpId: string;
  evaluation: EvaluationResult;
  timestamp: Date;
}

export class HoneyHiveEvaluator {
  private honeyhive: HoneyHive | null = null;
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.HONEYHIVE_API_KEY || '';
  }

  async initialize(): Promise<boolean> {
    try {
      if (!this.apiKey || this.apiKey === 'your_honeyhive_api_key') {
        console.log('HoneyHive API key not configured, using fallback mode');
        return false;
      }

      this.honeyhive = new HoneyHive({
        bearerAuth: this.apiKey
      });

      return true;
    } catch (error) {
      console.error('Failed to initialize HoneyHive:', error);
      return false;
    }
  }

  async evaluateProposal(
    proposalId: string,
    rfpId: string,
    proposalContent: string,
    rfpRequirements: string[],
    companyContext: string
  ): Promise<ProposalEvaluation> {
    try {
      // For demo purposes, we'll use fallback evaluation
      return this.fallbackEvaluation(proposalId, rfpId, proposalContent, rfpRequirements);
    } catch (error) {
      console.error('HoneyHive evaluation failed:', error);
      return this.fallbackEvaluation(proposalId, rfpId, proposalContent, rfpRequirements);
    }
  }

  private async evaluateRequirementCoverage(
    proposalContent: string,
    requirements: string[]
  ): Promise<{ score: number; details: string }> {
    try {
      // For demo purposes, we'll use fallback evaluation
      return this.fallbackCoverageEvaluation(proposalContent, requirements);
    } catch (error) {
      console.error('Requirement coverage evaluation failed:', error);
      return this.fallbackCoverageEvaluation(proposalContent, requirements);
    }
  }

  private async evaluateHallucination(
    proposalContent: string,
    companyContext: string
  ): Promise<{ score: number; details: string }> {
    try {
      // For demo purposes, we'll use fallback evaluation
      return this.fallbackHallucinationEvaluation(proposalContent, companyContext);
    } catch (error) {
      console.error('Hallucination evaluation failed:', error);
      return this.fallbackHallucinationEvaluation(proposalContent, companyContext);
    }
  }

  private async evaluateTone(proposalContent: string): Promise<{ score: number; details: string }> {
    try {
      // For demo purposes, we'll use fallback evaluation
      return this.fallbackToneEvaluation(proposalContent);
    } catch (error) {
      console.error('Tone evaluation failed:', error);
      return this.fallbackToneEvaluation(proposalContent);
    }
  }

  private async evaluateCitations(
    proposalContent: string,
    companyContext: string
  ): Promise<{ score: number; details: string }> {
    try {
      // For demo purposes, we'll use fallback evaluation
      return this.fallbackCitationEvaluation(proposalContent, companyContext);
    } catch (error) {
      console.error('Citation evaluation failed:', error);
      return this.fallbackCitationEvaluation(proposalContent, companyContext);
    }
  }

  private generateFeedback(
    coverage: { score: number; details: string },
    hallucination: { score: number; details: string },
    tone: { score: number; details: string },
    citation: { score: number; details: string }
  ): string {
    const feedback = [];
    
    if (coverage.score < 0.7) {
      feedback.push(`Requirement Coverage: ${coverage.details}`);
    }
    if (hallucination.score < 0.8) {
      feedback.push(`Factual Accuracy: ${hallucination.details}`);
    }
    if (tone.score < 0.8) {
      feedback.push(`Tone & Professionalism: ${tone.details}`);
    }
    if (citation.score < 0.7) {
      feedback.push(`Citation Quality: ${citation.details}`);
    }

    return feedback.length > 0 ? feedback.join('\n') : 'Proposal meets quality standards across all metrics.';
  }

  private generateSuggestions(
    coverage: { score: number; details: string },
    hallucination: { score: number; details: string },
    tone: { score: number; details: string },
    citation: { score: number; details: string }
  ): string[] {
    const suggestions = [];

    if (coverage.score < 0.7) {
      suggestions.push('Add more specific details to address missing requirements');
      suggestions.push('Include concrete examples and case studies');
    }
    if (hallucination.score < 0.8) {
      suggestions.push('Verify all claims against company documentation');
      suggestions.push('Remove or clarify any unverifiable statements');
    }
    if (tone.score < 0.8) {
      suggestions.push('Review language for professional consistency');
      suggestions.push('Ensure clear and confident communication');
    }
    if (citation.score < 0.7) {
      suggestions.push('Add proper citations for all claims');
      suggestions.push('Reference specific company capabilities and achievements');
    }

    return suggestions;
  }

  // Fallback methods for when HoneyHive is not available
  private fallbackEvaluation(
    proposalId: string,
    rfpId: string,
    proposalContent: string,
    rfpRequirements: string[]
  ): ProposalEvaluation {
    const coverage = this.fallbackCoverageEvaluation(proposalContent, rfpRequirements);
    const hallucination = this.fallbackHallucinationEvaluation(proposalContent, '');
    const tone = this.fallbackToneEvaluation(proposalContent);
    const citation = this.fallbackCitationEvaluation(proposalContent, '');

    const overallScore = (
      coverage.score * 0.4 +
      hallucination.score * 0.3 +
      tone.score * 0.2 +
      citation.score * 0.1
    );

    return {
      proposalId,
      rfpId,
      evaluation: {
        score: Math.round(overallScore * 100) / 100,
        metrics: {
          requirementCoverage: coverage.score,
          hallucinationScore: hallucination.score,
          toneScore: tone.score,
          citationAccuracy: citation.score
        },
        feedback: this.generateFeedback(coverage, hallucination, tone, citation),
        suggestions: this.generateSuggestions(coverage, hallucination, tone, citation)
      },
      timestamp: new Date()
    };
  }

  private fallbackCoverageEvaluation(
    proposalContent: string,
    requirements: string[]
  ): { score: number; details: string } {
    // Simple keyword-based coverage analysis
    const content = proposalContent.toLowerCase();
    const coveredRequirements = requirements.filter(req => 
      content.includes(req.toLowerCase().split(' ')[0]) ||
      content.includes(req.toLowerCase().split(' ')[1])
    );
    
    const score = coveredRequirements.length / requirements.length;
    return {
      score: Math.min(score, 0.9), // Cap at 0.9 for fallback
      details: `Covered ${coveredRequirements.length}/${requirements.length} requirements`
    };
  }

  private fallbackHallucinationEvaluation(
    proposalContent: string,
    companyContext: string
  ): { score: number; details: string } {
    // Simple heuristic-based evaluation
    const content = proposalContent.toLowerCase();
    const hasSpecificNumbers = /\d+/.test(proposalContent);
    const hasSpecificDates = /\d{4}|\d{1,2}\/\d{1,2}\/\d{4}/.test(proposalContent);
    const hasVagueTerms = /\b(several|many|some|various|multiple)\b/.test(content);
    
    let score = 0.8; // Base score
    if (hasSpecificNumbers) score += 0.1;
    if (hasSpecificDates) score += 0.05;
    if (hasVagueTerms) score -= 0.1;
    
    return {
      score: Math.max(0.5, Math.min(score, 0.95)),
      details: 'Fallback evaluation - verify claims manually'
    };
  }

  private fallbackToneEvaluation(proposalContent: string): { score: number; details: string } {
    // Simple tone analysis
    const content = proposalContent.toLowerCase();
    const professionalWords = ['solution', 'capability', 'experience', 'expertise', 'deliver', 'implement'];
    const unprofessionalWords = ['awesome', 'cool', 'amazing', 'fantastic', 'incredible'];
    
    const professionalCount = professionalWords.filter(word => content.includes(word)).length;
    const unprofessionalCount = unprofessionalWords.filter(word => content.includes(word)).length;
    
    const score = Math.max(0.6, Math.min(0.9, 0.7 + (professionalCount * 0.05) - (unprofessionalCount * 0.1)));
    
    return {
      score,
      details: 'Fallback evaluation - review tone manually'
    };
  }

  private fallbackCitationEvaluation(
    proposalContent: string,
    companyContext: string
  ): { score: number; details: string } {
    // Simple citation analysis
    const hasReferences = /\b(reference|source|according to|based on|per)\b/i.test(proposalContent);
    const hasSpecifics = /\b(our|we|company|organization)\b/i.test(proposalContent);
    
    let score = 0.6;
    if (hasReferences) score += 0.2;
    if (hasSpecifics) score += 0.1;
    
    return {
      score: Math.min(score, 0.8),
      details: 'Fallback evaluation - add proper citations'
    };
  }

  async getEvaluationHistory(proposalId?: string): Promise<ProposalEvaluation[]> {
    try {
      if (!this.honeyhive) {
        return [];
      }

      // This would typically query HoneyHive for evaluation history
      // For now, return empty array
      return [];
    } catch (error) {
      console.error('Failed to get evaluation history:', error);
      return [];
    }
  }
}
