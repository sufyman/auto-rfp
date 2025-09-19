'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  FileText, 
  Brain, 
  Zap,
  Eye,
  Rocket
} from 'lucide-react';
import { AgentOrchestrator } from '@/lib/agents/orchestrator';
import { BrightDataMCP } from '@/lib/mcp/bright-data';
import { ApifyMCP } from '@/lib/mcp/apify';
import { SensoMCP } from '@/lib/mcp/senso';
import { RedisLlamaIndexRetrieval } from '@/lib/retrieval/redis-llamaindex';

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  duration?: number;
  result?: any;
  icon: React.ReactNode;
}

export default function DemoInterface() {
  const [orchestrator] = useState(() => new AgentOrchestrator());
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([
    {
      id: 'rfp-monitor',
      name: 'RFP Discovery',
      description: 'Bright Data MCP fetches fresh RFP listings',
      status: 'pending',
      icon: <Eye className="w-5 h-5" />
    },
    {
      id: 'pdf-processor',
      name: 'PDF Processing',
      description: 'Apify actor extracts and chunks RFP content',
      status: 'pending',
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: 'context-engineer',
      name: 'Context Engineering',
      description: 'Senso normalizes data into structured schema',
      status: 'pending',
      icon: <Brain className="w-5 h-5" />
    },
    {
      id: 'retrieval-setup',
      name: 'Retrieval Index',
      description: 'Redis VL + LlamaIndex build knowledge graph',
      status: 'pending',
      icon: <Zap className="w-5 h-5" />
    },
    {
      id: 'proposal-writer',
      name: 'Proposal Generation',
      description: 'Agent drafts proposal using retrieved context',
      status: 'pending',
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: 'evaluation-loop',
      name: 'A2A Evaluation',
      description: 'HoneyHive evaluates and agent self-improves',
      status: 'pending',
      icon: <CheckCircle className="w-5 h-5" />
    },
    {
      id: 'deployment',
      name: 'Microsite Deploy',
      description: 'Qodo publishes proposal microsite',
      status: 'pending',
      icon: <Rocket className="w-5 h-5" />
    }
  ]);

  const [agentStates, setAgentStates] = useState<any[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [finalResult, setFinalResult] = useState<any>(null);

  useEffect(() => {
    // Set up event listeners
    const handleWorkflowStarted = (data: any) => {
      addLog(`🚀 Workflow started: ${data.rfpUrl}`);
      setIsRunning(true);
    };

    const handleWorkflowCompleted = (data: any) => {
      addLog(`✅ Workflow completed successfully!`);
      setFinalResult(data.proposal);
      setIsRunning(false);
    };

    const handleAgentWorking = (data: any) => {
      addLog(`🤖 ${data.agentId} is working on: ${data.task}`);
      updateStepStatus(data.agentId, 'running');
    };

    const handleAgentCompleted = (data: any) => {
      addLog(`✅ ${data.agentId} completed successfully`);
      updateStepStatus(data.agentId, 'completed');
    };

    const handleEvaluationIteration = (data: any) => {
      addLog(`🔄 Evaluation iteration ${data.iteration}: Score ${data.score}`);
    };

    orchestrator.onWorkflowStarted(handleWorkflowStarted);
    orchestrator.onWorkflowCompleted(handleWorkflowCompleted);
    orchestrator.onAgentWorking(handleAgentWorking);
    orchestrator.onAgentCompleted(handleAgentCompleted);
    orchestrator.onEvaluationIteration(handleEvaluationIteration);

    return () => {
      // Cleanup listeners
    };
  }, [orchestrator]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const updateStepStatus = (agentId: string, status: WorkflowStep['status']) => {
    setWorkflowSteps(prev => prev.map(step => 
      step.id === agentId ? { ...step, status } : step
    ));
  };

  const startDemo = async () => {
    try {
      setLogs([]);
      setFinalResult(null);
      setWorkflowSteps(prev => prev.map(step => ({ ...step, status: 'pending' })));
      
      // Simulate RFP URL
      const rfpUrl = 'https://procurement.gov/rfp/cloud-migration-2024';
      await orchestrator.processRFP(rfpUrl);
    } catch (error) {
      addLog(`❌ Error: ${error}`);
      setIsRunning(false);
    }
  };

  const resetDemo = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setLogs([]);
    setFinalResult(null);
    setWorkflowSteps(prev => prev.map(step => ({ ...step, status: 'pending' })));
  };

  const getStatusColor = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed': return 'text-green-500';
      case 'running': return 'text-blue-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'running': return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <div className="w-4 h-4 rounded-full border-2 border-gray-300" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Auto RFP Agent Demo</h1>
              <p className="text-gray-600 mt-2">
                End-to-end AI agent workflow with Context Engineering and A2A loops
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={startDemo}
                disabled={isRunning}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRunning ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                {isRunning ? 'Running...' : 'Start Demo'}
              </button>
              <button
                onClick={resetDemo}
                disabled={isRunning}
                className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Workflow Steps */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Agent Workflow</h2>
            <div className="space-y-4">
              {workflowSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center p-4 rounded-lg border-2 transition-all ${
                    step.status === 'running' 
                      ? 'border-blue-200 bg-blue-50' 
                      : step.status === 'completed'
                      ? 'border-green-200 bg-green-50'
                      : step.status === 'error'
                      ? 'border-red-200 bg-red-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex-shrink-0 mr-4">
                    {getStatusIcon(step.status)}
                  </div>
                  <div className="flex-shrink-0 mr-4">
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{step.name}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Live Logs */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Live Activity</h2>
            <div className="bg-gray-900 rounded-lg p-4 h-96 overflow-y-auto">
              <div className="space-y-2 font-mono text-sm">
                <AnimatePresence>
                  {logs.map((log, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-green-400"
                    >
                      {log}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {logs.length === 0 && (
                  <div className="text-gray-500">Waiting for activity...</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Final Result */}
        {finalResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-white rounded-lg shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Generated Proposal</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-lg mb-2">{finalResult.title}</h3>
              <div className="space-y-3">
                {finalResult.sections?.map((section: any, index: number) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium text-gray-900">{section.title}</h4>
                    <p className="text-gray-700 text-sm mt-1">{section.content}</p>
                    <div className="text-xs text-gray-500 mt-2">
                      {section.wordCount} words • {section.citations?.length || 0} citations
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Total Word Count: {finalResult.metadata?.totalWordCount}</span>
                  <span>Status: {finalResult.metadata?.status}</span>
                  <span>Version: {finalResult.metadata?.version}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* MCP Tools Status */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">MCP Tools Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
              <div>
                <div className="font-medium">Bright Data MCP</div>
                <div className="text-sm text-gray-600">RFP Discovery</div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
              <div>
                <div className="font-medium">Apify MCP</div>
                <div className="text-sm text-gray-600">PDF Processing</div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
              <div>
                <div className="font-medium">Senso MCP</div>
                <div className="text-sm text-gray-600">Data Normalization</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
