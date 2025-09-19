# Auto RFP - AI Agent Demo

An end-to-end AI agent system that demonstrates Context Engineering and A2A (Agent-to-Agent) communication for automated RFP processing and proposal generation.

## 🎯 Demo Overview

This system showcases advanced AI agent capabilities through a complete RFP workflow:

1. **RFP Discovery** - Bright Data MCP fetches fresh RFP listings from public portals
2. **PDF Processing** - Apify actor extracts and chunks RFP content
3. **Context Engineering** - Senso normalizes extracted data into structured schema
4. **Retrieval Index** - Redis VL + LlamaIndex build knowledge graph
5. **Proposal Generation** - Agent drafts proposal using retrieved context
6. **A2A Evaluation** - HoneyHive evaluates and agent self-improves
7. **Microsite Deploy** - Qodo publishes proposal microsite

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## 🏗️ Architecture

### Core Components

- **Agent Orchestrator** - Coordinates multi-agent workflow
- **MCP Integrations** - Bright Data, Apify, Senso integrations
- **Context Engineering** - PDF → chunks → schema → retrieval pipeline
- **A2A Loops** - Self-improvement through evaluation feedback
- **Demo Interface** - Real-time visualization of agent activity

### Key Features

- **Context Engineering**: Transforms messy PDFs into structured, retrievable context
- **A2A Communication**: Agents collaborate and self-improve through feedback loops
- **MCP Integration**: Uses Model Context Protocol for tool integration
- **Real-time Demo**: Live visualization of agent workflow and decision-making

## 🎬 Demo Flow (3 minutes)

1. **Start Demo** - Click "Start Demo" to begin the workflow
2. **Watch Agents Work** - See each agent complete its specialized task
3. **A2A Evaluation** - Observe the self-improvement loop in action
4. **Final Result** - View the generated proposal and microsite

## 🛠️ Technical Implementation

### Agent Types
- `rfp-monitor` - Discovers and monitors RFP portals
- `pdf-processor` - Extracts and chunks PDF content
- `context-engineer` - Normalizes data into structured schemas
- `proposal-writer` - Generates proposals using retrieved context
- `evaluator` - Evaluates proposals and generates improvement feedback
- `deployer` - Deploys final microsite

### MCP Tools
- **Bright Data MCP**: Web scraping and data extraction
- **Apify MCP**: PDF processing and content extraction
- **Senso MCP**: Data normalization and schema mapping

### Context Engineering Pipeline
1. PDF extraction and chunking
2. Requirement and criteria extraction
3. Schema normalization and validation
4. Vector embedding generation
5. Knowledge graph construction
6. Retrieval index building

## 🎯 Competition Focus

This demo is designed for the **Context Engineering AI Agent Competition** and showcases:

- **Advanced Reasoning**: Multi-step problem solving across agents
- **Tool Integration**: 3+ sponsor tools (Bright Data, Apify, Senso)
- **A2A Communication**: Self-improving agent loops
- **Context Engineering**: Sophisticated data transformation pipeline
- **Live Demo**: Real-time visualization of agent behavior

## 📁 Project Structure

```
src/
├── components/
│   └── DemoInterface.tsx      # Main demo interface
├── lib/
│   ├── agents/
│   │   └── orchestrator.ts    # Agent coordination
│   ├── mcp/
│   │   ├── bright-data.ts     # Bright Data MCP
│   │   ├── apify.ts          # Apify MCP
│   │   └── senso.ts          # Senso MCP
│   └── retrieval/
│       └── redis-llamaindex.ts # Vector store integration
├── types/
│   ├── rfp.ts                # RFP data types
│   └── agent.ts              # Agent communication types
└── app/
    └── page.tsx              # Main page
```

## 🔧 Configuration

Set up environment variables for MCP servers and API keys:

```bash
# MCP Server URLs
BRIGHT_DATA_MCP_URL=http://localhost:3001
APIFY_MCP_URL=http://localhost:3002
SENSO_MCP_URL=http://localhost:3003

# Redis Configuration
REDIS_URL=redis://localhost:6379

# API Keys
OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
```

## 🎪 Demo Script

1. **Introduction** (30s)
   - "This is Auto RFP, an AI agent system that processes RFPs end-to-end"
   - "It uses Context Engineering to transform messy PDFs into structured data"
   - "And A2A communication for self-improvement"

2. **Live Demo** (2m)
   - Click "Start Demo"
   - Show agent workflow progression
   - Highlight A2A evaluation loop
   - Display final proposal result

3. **Wrap-up** (30s)
   - "The system demonstrates advanced agent reasoning"
   - "Uses 3+ sponsor tools with MCP integration"
   - "Shows real-time A2A communication and self-improvement"

## 🏆 Competition Criteria

- **Idea (25%)**: Unique value proposition with advanced reasoning
- **Technical Implementation (25%)**: Novel use of tools and agent architecture
- **Tool Use (25%)**: Integration of 3+ sponsor tools
- **Presentation (25%)**: Clear 3-minute demo showcasing agent impact

## 📝 License

MIT License - Built for Context Engineering AI Agent Competition