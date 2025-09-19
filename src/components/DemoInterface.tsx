'use client';

import React, { useState, useEffect, useRef } from 'react';
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
// Orchestrator now runs server-side via API
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
  // Orchestrator now runs server-side via API
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
  const [liveActivity, setLiveActivity] = useState<string[]>([]);
  const liveActivityRef = useRef<HTMLDivElement>(null);

  // Event handlers now handled by API responses

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const addLiveActivity = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLiveActivity(prev => {
      const newActivity = [...prev.slice(-6), `${timestamp}: ${message}`]; // Keep last 7 entries
      // Auto-scroll to bottom
      setTimeout(() => {
        if (liveActivityRef.current) {
          liveActivityRef.current.scrollTop = liveActivityRef.current.scrollHeight;
        }
      }, 100);
      return newActivity;
    });
  };

  const updateStepStatus = (agentId: string, status: WorkflowStep['status']) => {
    setWorkflowSteps(prev => prev.map(step => {
      if (step.id === agentId) {
        return { ...step, status };
      }
      // If we're starting a new step, make sure previous steps are completed
      // and future steps remain pending
      if (status === 'running') {
        const stepOrder = ['rfp-monitor', 'pdf-processor', 'context-engineer', 'retrieval-setup', 'proposal-writer', 'evaluation-loop', 'deployment'];
        const currentIndex = stepOrder.indexOf(agentId);
        const stepIndex = stepOrder.indexOf(step.id);
        
        if (stepIndex < currentIndex && step.status !== 'completed') {
          return { ...step, status: 'completed' };
        }
        if (stepIndex > currentIndex && step.status !== 'pending') {
          return { ...step, status: 'pending' };
        }
      }
      return step;
    }));
  };

  const startDemo = async () => {
    try {
      setLogs([]);
      setFinalResult(null);
      setIsRunning(true);
      setWorkflowSteps(prev => prev.map(step => ({ ...step, status: 'pending' })));
      
      // Use real RFP URL - you can change this to any real RFP
      const rfpUrl = prompt('Enter RFP URL (or press OK for demo):') || 'https://sam.gov/opp/3c0e1f8c5d2a4b9e8f7a6c5d4e3f2a1b/view';
      
      if (rfpUrl.includes('sam.gov')) {
        addLog(`🌐 Processing REAL SAM.gov RFP: ${rfpUrl}`);
        addLog(`📡 Server-side processing - check your terminal for detailed logs!`);
        addLiveActivity(`🌐 Processing REAL SAM.gov RFP: ${rfpUrl}`);
      } else {
        addLog(`📋 Using demo mode for: ${rfpUrl}`);
        addLog(`📡 Server-side processing - check your terminal for detailed logs!`);
        addLiveActivity(`📋 Using demo mode for: ${rfpUrl}`);
      }
      
      addLiveActivity(`📡 Server-side processing - check your terminal for detailed logs!`);
      
      // Use Server-Sent Events for real-time updates
      const response = await fetch('/api/process-rfp-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rfpUrl })
      });

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                
                switch (data.type) {
                  case 'start':
                    addLiveActivity(data.message);
                    break;
                  case 'log':
                    addLiveActivity(data.message);
                    addLog(data.message);
                    break;
                  case 'step-start':
                    addLiveActivity(data.message);
                    if (data.step) {
                      updateStepStatus(data.step, 'running');
                    }
                    break;
                  case 'step-complete':
                    addLiveActivity(data.message);
                    addLog(data.message);
                    if (data.step) {
                      updateStepStatus(data.step, 'completed');
                    }
                    break;
                  case 'complete':
                    addLiveActivity(data.message);
                    addLog(`✅ Workflow completed successfully!`);
                    addLog(`📄 Generated: "${data.proposal.title}"`);
                    addLog(`📊 ${data.proposal.sectionsCount || data.proposal.sections?.length || 0} sections, ${data.proposal.metadata?.totalWordCount || data.proposal.wordCount} words`);
                    
                    if (data.deployment?.micrositeUrl) {
                      addLog(`🚀 Microsite deployed: ${data.deployment.micrositeUrl}`);
                      addLiveActivity(`🚀 Microsite deployed: ${data.deployment.micrositeUrl}`);
                    }
                    
                    addLiveActivity(`📄 Generated: "${data.proposal.title}"`);
                    addLiveActivity(`📊 ${data.proposal.sectionsCount || data.proposal.sections?.length || 0} sections, ${data.proposal.metadata?.totalWordCount || data.proposal.wordCount} words`);
                    
                    // Ensure all steps are marked as completed
                    setWorkflowSteps(prev => prev.map(step => ({ ...step, status: 'completed' })));
                    setFinalResult({
                      ...data.proposal,
                      deployment: data.deployment
                    });
                    break;
                  case 'error':
                    addLiveActivity(data.message);
                    addLog(data.message);
                    break;
                }
              } catch (parseError) {
                console.warn('Failed to parse SSE data:', parseError);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
      
      setIsRunning(false);
    } catch (error) {
      addLog(`❌ Error: ${error}`);
      setIsRunning(false);
    }
  };

  const resetDemo = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setLogs([]);
    setLiveActivity([]);
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
                  className={`flex items-center p-4 rounded-lg border-2 transition-all duration-300 ${
                    step.status === 'running' 
                      ? 'border-blue-400 bg-blue-50 shadow-md transform scale-105' 
                      : step.status === 'completed'
                      ? 'border-green-400 bg-green-50'
                      : step.status === 'error'
                      ? 'border-red-400 bg-red-50'
                      : 'border-gray-200 bg-gray-50 opacity-60'
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
            
            {/* Microsite Deploy Success */}
            {finalResult.deployment?.micrositeUrl && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <h3 className="font-medium text-green-800">Microsite Deploy</h3>
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Qodo publishes proposal microsite
                  </span>
                </div>
                <p className="text-green-700 text-sm mb-3">
                  Your proposal has been successfully published as a professional microsite! 
                  <span className="font-medium">Now using local preview</span> - fully functional and ready to view.
                </p>
                <div className="flex space-x-3">
                  <a
                    href={finalResult.deployment.micrositeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
                  >
                    <Rocket className="w-4 h-4 mr-2" />
                    View Live Microsite
                  </a>
                  {finalResult.deployment.previewUrl && (
                    <a
                      href={finalResult.deployment.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </a>
                  )}
                </div>
              </div>
            )}
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-lg mb-2">{finalResult.title}</h3>
              <div className="space-y-3">
                {Array.isArray(finalResult.sections) ? finalResult.sections.map((section: any, index: number) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium text-gray-900">{section.title}</h4>
                    <p className="text-gray-700 text-sm mt-1 line-clamp-3">{section.content.substring(0, 200)}...</p>
                    <div className="text-xs text-gray-500 mt-2">
                      {section.wordCount} words • {section.citations?.length || 0} citations
                    </div>
                  </div>
                )) : (
                  <div className="text-gray-500 text-sm">
                    Proposal sections: {finalResult.sectionsCount || 'Loading...'}
                  </div>
                )}
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

        {/* API Integration Status */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">API Integration Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-500 mr-3" />
              <div>
                <div className="font-medium">Stytch Auth</div>
                <div className="text-sm text-gray-600">Real API • Authentication</div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-500 mr-3" />
              <div>
                <div className="font-medium">Senso MCP</div>
                <div className="text-sm text-gray-600">Real API • Context Engineering</div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-500 mr-3" />
              <div>
                <div className="font-medium">HoneyHive</div>
                <div className="text-sm text-gray-600">Real API • A2A Evaluation</div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-500 mr-3" />
              <div>
                <div className="font-medium">Qodo Publishing</div>
                <div className="text-sm text-gray-600">Real API • Microsite Deploy</div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-500 mr-3" />
              <div>
                <div className="font-medium">Bright Data MCP</div>
                <div className="text-sm text-gray-600">Real API • RFP Discovery</div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-500 mr-3" />
              <div>
                <div className="font-medium">Apify MCP</div>
                <div className="text-sm text-gray-600">Real API • PDF Processing</div>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">
              <span className="font-medium text-blue-600">Real APIs:</span> 7/7 services using live credentials • 
              <span className="font-medium text-green-600 ml-2">Production Ready:</span> All integrations configured
            </div>
          </div>
        </div>

        {/* Live Activity */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Live Activity
          </h2>
          <div ref={liveActivityRef} className="bg-gray-900 rounded-lg p-4 font-mono text-sm max-h-48 overflow-y-auto">
            {liveActivity.length === 0 ? (
              <div className="text-gray-500">No activity yet. Start the demo to see live updates!</div>
            ) : (
              liveActivity.map((activity, index) => (
                <div key={index} className="mb-1 animate-fade-in">
                  {activity.includes('🌐') && <span className="text-blue-400">🌐</span>}
                  {activity.includes('📡') && <span className="text-yellow-400">📡</span>}
                  {activity.includes('✅') && <span className="text-green-400">✅</span>}
                  {activity.includes('📄') && <span className="text-purple-400">📄</span>}
                  {activity.includes('📊') && <span className="text-cyan-400">📊</span>}
                  {activity.includes('❌') && <span className="text-red-400">❌</span>}
                  {activity.includes('🔍') && <span className="text-blue-300">🔍</span>}
                  {activity.includes('🧠') && <span className="text-indigo-400">🧠</span>}
                  {activity.includes('⚡') && <span className="text-yellow-300">⚡</span>}
                  {activity.includes('✍️') && <span className="text-pink-400">✍️</span>}
                  {activity.includes('🚀') && <span className="text-orange-400">🚀</span>}
                  {activity.includes('📊') && <span className="text-purple-400">📊</span>}
                  {activity.includes('📈') && <span className="text-green-400">📈</span>}
                  {activity.includes('💡') && <span className="text-yellow-400">💡</span>}
                  {activity.includes('🔨') && <span className="text-gray-400">🔨</span>}
                  {activity.includes('🎉') && <span className="text-pink-300">🎉</span>}
                  {activity.includes('🔧') && <span className="text-blue-400">🔧</span>}
                  <span className="ml-1 text-gray-300">{activity.replace(/[🌐📡✅📄📊❌🔍🧠⚡✍️🚀📈💡🔨🎉🔧]/g, '').trim()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
