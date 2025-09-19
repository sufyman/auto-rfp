import { z } from 'zod';

// Agent Communication Types
export const AgentMessageSchema = z.object({
  id: z.string(),
  from: z.string(),
  to: z.string(),
  type: z.enum(['request', 'response', 'notification', 'error']),
  payload: z.any(),
  timestamp: z.date(),
  correlationId: z.string().optional(),
});

export const AgentCapabilitySchema = z.object({
  name: z.string(),
  description: z.string(),
  inputSchema: z.any(),
  outputSchema: z.any(),
  isAsync: z.boolean().default(false),
});

// Tool Calling Types
export const ToolCallSchema = z.object({
  id: z.string(),
  name: z.string(),
  parameters: z.record(z.any()),
  result: z.any().optional(),
  error: z.string().optional(),
  status: z.enum(['pending', 'running', 'completed', 'failed']),
  startedAt: z.date().optional(),
  completedAt: z.date().optional(),
});

export const AgentStateSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(['idle', 'working', 'waiting', 'error']),
  currentTask: z.string().optional(),
  context: z.record(z.any()),
  toolCalls: z.array(ToolCallSchema),
  lastActivity: z.date(),
});

// Context Engineering Types
export const ContextChunkSchema = z.object({
  id: z.string(),
  content: z.string(),
  metadata: z.object({
    source: z.string(),
    section: z.string().optional(),
    pageNumber: z.number().optional(),
    confidence: z.number().min(0).max(1),
    embeddings: z.array(z.number()).optional(),
  }),
  relationships: z.array(z.object({
    type: z.enum(['similar', 'related', 'contradicts', 'supports']),
    targetChunkId: z.string(),
    strength: z.number().min(0).max(1),
  })),
});

export const ContextPackSchema = z.object({
  id: z.string(),
  rfpId: z.string(),
  chunks: z.array(ContextChunkSchema),
  schema: z.object({
    requirements: z.array(z.string()),
    evaluationCriteria: z.array(z.string()),
    deadlines: z.array(z.string()),
    budget: z.string().optional(),
  }),
  metadata: z.object({
    totalChunks: z.number(),
    processingTime: z.number(),
    confidence: z.number().min(0).max(1),
    lastUpdated: z.date(),
    sensoContentId: z.string().optional(),
  }),
});

// A2A Loop Types
export const EvaluationFeedbackSchema = z.object({
  id: z.string(),
  proposalId: z.string(),
  sectionId: z.string(),
  issue: z.string(),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  suggestion: z.string().optional(),
  requirementId: z.string().optional(),
  autoFixable: z.boolean().default(false),
});

export const SelfImprovementActionSchema = z.object({
  id: z.string(),
  type: z.enum(['regenerate_section', 'add_citation', 'improve_tone', 'fix_hallucination']),
  targetId: z.string(),
  parameters: z.record(z.any()),
  reason: z.string(),
  confidence: z.number().min(0).max(1),
});

// MCP Integration Types
export const MCPToolSchema = z.object({
  name: z.string(),
  description: z.string(),
  inputSchema: z.any(),
  server: z.string(),
  capabilities: z.array(z.string()),
});

export const MCPConnectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  server: z.string(),
  tools: z.array(MCPToolSchema),
  status: z.enum(['connected', 'disconnected', 'error']),
  lastPing: z.date().optional(),
});

// Type exports
export type AgentMessage = z.infer<typeof AgentMessageSchema>;
export type AgentCapability = z.infer<typeof AgentCapabilitySchema>;
export type ToolCall = z.infer<typeof ToolCallSchema>;
export type AgentState = z.infer<typeof AgentStateSchema>;
export type ContextChunk = z.infer<typeof ContextChunkSchema>;
export type ContextPack = z.infer<typeof ContextPackSchema>;
export type EvaluationFeedback = z.infer<typeof EvaluationFeedbackSchema>;
export type SelfImprovementAction = z.infer<typeof SelfImprovementActionSchema>;
export type MCPTool = z.infer<typeof MCPToolSchema>;
export type MCPConnection = z.infer<typeof MCPConnectionSchema>;
