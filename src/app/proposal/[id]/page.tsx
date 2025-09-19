'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Mail, Phone, Globe, CheckCircle } from 'lucide-react';
import Link from 'next/link';

// This is a demo proposal preview page that works as a fallback for Qodo microsites
export default function ProposalPreviewPage() {
  const params = useParams();
  const proposalId = params.id as string;

  // Demo proposal data - in a real app, this would be fetched from a database
  const proposal = {
    id: proposalId,
    title: "Comprehensive Cloud Infrastructure Migration Solution",
    company: "Auto RFP Demo Company",
    sections: [
      {
        id: "executive_summary",
        title: "Executive Summary",
        content: `Our comprehensive cloud migration solution directly addresses your enterprise infrastructure modernization requirements. With over 15 years of experience in large-scale cloud transformations, we propose a strategic, phased approach that minimizes business disruption while maximizing operational efficiency and cost savings.

Key highlights of our proposal:
• Proven methodology with 98% success rate across 200+ enterprise migrations
• AWS and Azure certified team with deep expertise in hybrid cloud architectures
• Comprehensive security framework ensuring SOC 2 Type II and FedRAMP compliance
• 24/7 support with guaranteed 99.9% uptime during migration phases
• Expected 40% reduction in infrastructure costs within 12 months
• Complete disaster recovery and business continuity solutions

Our solution leverages cutting-edge automation tools and industry best practices to deliver a seamless transition to the cloud while maintaining the highest standards of security, compliance, and performance.`
      },
      {
        id: "technical_approach",
        title: "Technical Approach & Methodology",
        content: `Our technical approach follows a proven 6-phase methodology designed specifically for enterprise-scale cloud migrations:

**Phase 1: Discovery & Assessment (Weeks 1-4)**
• Comprehensive infrastructure audit and application dependency mapping
• Security posture assessment and compliance gap analysis
• Performance baseline establishment and capacity planning
• Risk assessment and mitigation strategy development

**Phase 2: Architecture Design (Weeks 5-8)**
• Cloud-native architecture design optimized for your workloads
• Hybrid connectivity solutions with redundant network paths
• Security architecture with zero-trust principles
• Disaster recovery and backup strategy implementation

**Phase 3: Migration Planning (Weeks 9-12)**
• Detailed migration runbooks for each application and service
• Testing protocols and rollback procedures
• Change management and communication plans
• Resource allocation and timeline optimization

**Phase 4: Pilot Migration (Weeks 13-16)**
• Non-critical workload migration to validate processes
• Performance testing and optimization
• Security validation and compliance verification
• Process refinement based on pilot results

**Phase 5: Production Migration (Weeks 17-52)**
• Systematic migration of production workloads
• Real-time monitoring and performance optimization
• Continuous security scanning and compliance validation
• 24/7 support during critical migration windows

**Phase 6: Optimization & Handover (Weeks 53-64)**
• Cost optimization and right-sizing recommendations
• Performance tuning and automation implementation
• Knowledge transfer and team training
• Ongoing support transition and documentation

Our approach ensures minimal downtime, maintains data integrity, and provides continuous visibility throughout the migration process.`
      },
      {
        id: "security_compliance",
        title: "Security & Compliance Framework",
        content: `Security and compliance are fundamental to our cloud migration approach. Our comprehensive security framework ensures your data and systems remain protected throughout the migration and beyond.

**Security Architecture:**
• Zero-trust network architecture with micro-segmentation
• End-to-end encryption for data in transit and at rest
• Multi-factor authentication and privileged access management
• Advanced threat detection and automated incident response
• Regular security assessments and penetration testing

**Compliance Standards:**
• SOC 2 Type II certification with annual audits
• FedRAMP authorization for government workloads
• HIPAA compliance for healthcare data processing
• GDPR compliance for international data protection
• Industry-specific compliance frameworks as required

**Data Protection:**
• Automated backup solutions with point-in-time recovery
• Cross-region replication for disaster recovery
• Data classification and lifecycle management
• Secure data migration with integrity verification
• Comprehensive audit logging and monitoring

**Governance & Risk Management:**
• Continuous compliance monitoring and reporting
• Risk assessment and mitigation protocols
• Change management with approval workflows
• Regular security training and awareness programs
• Incident response and business continuity planning

Our security team includes certified professionals with expertise in cloud security, compliance frameworks, and industry regulations.`
      },
      {
        id: "project_management",
        title: "Project Management & Timeline",
        content: `Our project management approach ensures successful delivery within budget and timeline constraints while maintaining the highest quality standards.

**Project Management Framework:**
• Agile methodology with 2-week sprint cycles
• Dedicated project manager with PMP certification
• Weekly stakeholder updates and monthly steering committee reviews
• Risk management with proactive mitigation strategies
• Quality assurance with automated testing and validation

**Timeline & Milestones:**
• Project Duration: 12-18 months (depending on scope)
• Phase 1-3: Planning and Design (3 months)
• Phase 4: Pilot Migration (1 month)
• Phase 5: Production Migration (8-12 months)
• Phase 6: Optimization and Handover (2 months)

**Key Deliverables:**
• Comprehensive migration assessment and strategy document
• Detailed technical architecture and security design
• Migration runbooks and testing procedures
• Training materials and documentation
• Post-migration optimization recommendations

**Communication & Reporting:**
• Daily stand-ups during active migration phases
• Weekly progress reports with KPI tracking
• Monthly executive dashboards
• Quarterly business reviews and optimization sessions
• 24/7 escalation procedures for critical issues

**Success Metrics:**
• Zero data loss during migration
• Less than 4 hours total downtime per application
• 99.9% availability during migration phases
• 100% compliance with security requirements
• On-time and on-budget delivery

Our experienced project management team has successfully delivered over 200 enterprise cloud migrations with an average customer satisfaction score of 4.8/5.`
      },
      {
        id: "cost_value",
        title: "Cost Structure & Value Proposition",
        content: `Our pricing model is designed to deliver maximum value while ensuring transparency and predictability throughout the migration process.

**Investment Breakdown:**
• Discovery & Planning: $250,000 (10% of total)
• Migration Services: $1,800,000 (72% of total)
• Security & Compliance: $300,000 (12% of total)
• Training & Support: $150,000 (6% of total)
• **Total Investment: $2,500,000**

**Value Delivered:**
• 40% reduction in infrastructure operational costs
• 60% improvement in system performance and reliability
• 50% faster deployment of new applications and services
• 90% reduction in security incidents and compliance violations
• 24/7 monitoring and support with guaranteed SLAs

**Return on Investment:**
• Break-even point: 14 months post-migration
• 3-year ROI: 280% ($7M in cost savings and productivity gains)
• Ongoing annual savings: $2.1M in reduced infrastructure and operational costs

**Risk Mitigation:**
• Fixed-price contract with no hidden costs
• Performance guarantees with service level agreements
• Insurance coverage for data protection and business continuity
• Proven methodology with 98% success rate
• Dedicated support team for 12 months post-migration

**Additional Benefits:**
• Enhanced scalability and flexibility for future growth
• Improved disaster recovery capabilities
• Better compliance posture and audit readiness
• Increased team productivity and reduced maintenance overhead
• Access to latest cloud technologies and innovations

Our comprehensive solution provides not just a migration service, but a strategic transformation that positions your organization for long-term success in the cloud.`
      }
    ],
    metadata: {
      totalWordCount: 3320,
      createdAt: new Date(),
      status: 'published',
      version: '1.0'
    }
  };

  const formatContent = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          return <h4 key={index} className="font-semibold text-gray-900 mt-4 mb-2">{line.slice(2, -2)}</h4>;
        }
        if (line.startsWith('•')) {
          return <li key={index} className="ml-4 text-gray-700">{line.slice(2)}</li>;
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return <p key={index} className="text-gray-700 mb-2">{line}</p>;
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Demo
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live Proposal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">{proposal.title}</h1>
            <p className="text-xl text-blue-100 mb-6">{proposal.company}</p>
            <div className="flex items-center justify-center space-x-6 text-blue-100">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>{proposal.sections.length} Sections</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>{proposal.metadata.totalWordCount.toLocaleString()} Words</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>Version {proposal.metadata.version}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-12">
          {proposal.sections.map((section, index) => (
            <div key={section.id} className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold mr-4">
                  {index + 1}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
              </div>
              <div className="prose prose-lg max-w-none">
                {formatContent(section.content)}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Contact us to discuss your project requirements and how we can help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a
              href="mailto:contact@autorfp.com?subject=Interest in Cloud Migration Proposal"
              className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Mail className="w-5 h-5 mr-2" />
              Send Email
            </a>
            <a
              href="tel:+1-555-0123"
              className="inline-flex items-center px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-400 transition-colors"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call Us
            </a>
            <a
              href="https://autorfp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-3 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-400 transition-colors"
            >
              <Globe className="w-5 h-5 mr-2" />
              Visit Website
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500">
          <p>Generated by Auto RFP System • Powered by AI Agent Technology</p>
          <p className="mt-2">
            Created on {proposal.metadata.createdAt.toLocaleDateString()} • 
            Status: {proposal.metadata.status} • 
            ID: {proposal.id}
          </p>
        </div>
      </div>
    </div>
  );
}
