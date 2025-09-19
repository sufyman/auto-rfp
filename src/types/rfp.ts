import { z } from 'zod';

// RFP Portal Types
export const RFPPortalSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  lastChecked: z.date().optional(),
  isActive: z.boolean().default(true),
  config: z.object({
    selectors: z.record(z.string()),
    filters: z.record(z.any()).optional(),
  }),
});

export const RFPSourceSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  url: z.string(),
  portalId: z.string(),
  publishedDate: z.date(),
  deadline: z.date(),
  budget: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(['new', 'processing', 'draft', 'submitted', 'rejected']),
  rawData: z.record(z.any()).optional(),
});

// RFP Document Types
export const RFPRequirementSchema = z.object({
  id: z.string(),
  section: z.string(),
  subsection: z.string().optional(),
  text: z.string(),
  type: z.enum(['mandatory', 'desirable', 'technical', 'commercial', 'legal']),
  priority: z.enum(['high', 'medium', 'low']),
  pageNumber: z.number().optional(),
  lineNumber: z.number().optional(),
});

export const RFPEvaluationCriteriaSchema = z.object({
  id: z.string(),
  criteria: z.string(),
  weight: z.number().min(0).max(100),
  description: z.string().optional(),
  maxScore: z.number().optional(),
});

export const RFPDocumentSchema = z.object({
  id: z.string(),
  sourceId: z.string(),
  title: z.string(),
  content: z.string(),
  chunks: z.array(z.object({
    id: z.string(),
    content: z.string(),
    metadata: z.object({
      pageNumber: z.number(),
      section: z.string().optional(),
      chunkIndex: z.number(),
    }),
  })),
  requirements: z.array(RFPRequirementSchema),
  evaluationCriteria: z.array(RFPEvaluationCriteriaSchema),
  metadata: z.object({
    totalPages: z.number(),
    extractedAt: z.date(),
    processingTime: z.number(),
    confidence: z.number().min(0).max(1),
  }),
});

// Proposal Types
export const ProposalSectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  requirements: z.array(z.string()), // IDs of requirements this section addresses
  citations: z.array(z.object({
    requirementId: z.string(),
    text: z.string(),
    pageNumber: z.number().optional(),
  })),
  wordCount: z.number(),
  lastModified: z.date(),
});

export const ProposalSchema = z.object({
  id: z.string(),
  rfpId: z.string(),
  title: z.string(),
  sections: z.array(ProposalSectionSchema),
  metadata: z.object({
    totalWordCount: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
    status: z.enum(['draft', 'review', 'final', 'submitted']),
    version: z.string(),
  }),
  evaluation: z.object({
    coverage: z.number().min(0).max(100),
    tone: z.enum(['professional', 'casual', 'technical', 'sales']),
    hallucinationScore: z.number().min(0).max(1),
    citations: z.array(z.string()),
    lastEvaluated: z.date(),
  }).optional(),
});

// Company Knowledge Base Types
export const CompanyDocumentSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  type: z.enum(['capability', 'case_study', 'pricing', 'legal', 'technical']),
  tags: z.array(z.string()),
  lastUpdated: z.date(),
  isActive: z.boolean().default(true),
});

// Evaluation Types
export const EvaluationResultSchema = z.object({
  id: z.string(),
  proposalId: z.string(),
  metrics: z.object({
    requirementCoverage: z.number().min(0).max(100),
    hallucinationScore: z.number().min(0).max(1),
    toneScore: z.number().min(0).max(1),
    citationAccuracy: z.number().min(0).max(1),
    overallScore: z.number().min(0).max(100),
  }),
  feedback: z.array(z.object({
    type: z.enum(['error', 'warning', 'suggestion']),
    section: z.string(),
    message: z.string(),
    requirementId: z.string().optional(),
  })),
  generatedAt: z.date(),
});

// Microsite Types
export const MicrositeSchema = z.object({
  id: z.string(),
  proposalId: z.string(),
  title: z.string(),
  summary: z.string(),
  ctaText: z.string(),
  ctaUrl: z.string(),
  deployedAt: z.date().optional(),
  qodoId: z.string().optional(),
  isPublic: z.boolean().default(false),
});

// API Response Types
export const APIResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  timestamp: z.date(),
});

// Type exports
export type RFPPortal = z.infer<typeof RFPPortalSchema>;
export type RFPSource = z.infer<typeof RFPSourceSchema>;
export type RFPRequirement = z.infer<typeof RFPRequirementSchema>;
export type RFPEvaluationCriteria = z.infer<typeof RFPEvaluationCriteriaSchema>;
export type RFPDocument = z.infer<typeof RFPDocumentSchema>;
export type ProposalSection = z.infer<typeof ProposalSectionSchema>;
export type Proposal = z.infer<typeof ProposalSchema>;
export type CompanyDocument = z.infer<typeof CompanyDocumentSchema>;
export type EvaluationResult = z.infer<typeof EvaluationResultSchema>;
export type Microsite = z.infer<typeof MicrositeSchema>;
export type APIResponse<T = any> = z.infer<typeof APIResponseSchema> & { data?: T };
