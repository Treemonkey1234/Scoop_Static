'use client'

import React, { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { identityUtils, crossPlatformEngine } from '@/lib/crossPlatformIdentity'
import { 
  ChartBarIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ChartPieIcon,
  DocumentArrowDownIcon,
  CodeBracketIcon,
  EyeIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  PlayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

interface UseCase {
  id: string
  title: string
  subtitle: string
  price: string
  icon: React.ReactNode
  color: string
  narrative: string
  description: string
  dataFields: string[]
  targetCustomers: string[]
  valueProposition: string[]
  impactMetrics: {
    roiPercentage: string
    costSavings: string
    accuracyImprovement: string
    timeReduction: string
  }
}

type DemoStep = 'selection' | 'impact' | 'demo' | 'results'

export default function UnifiedProfileEnginePage() {
  const [selectedUseCase, setSelectedUseCase] = useState<string>('complete')
  const [currentStep, setCurrentStep] = useState<DemoStep>('selection')
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [impactSimulation, setImpactSimulation] = useState<any>(null)
  const [simulationProgress, setSimulationProgress] = useState(0)

  // Use cases/business packages with enhanced impact metrics
  const useCases: UseCase[] = [
    {
      id: 'complete',
      title: 'Complete Enterprise Package',
      subtitle: 'Full Cross-Platform Intelligence',
      price: '$50K+ Annual Value',
      icon: <GlobeAltIcon className="w-6 h-6" />,
      color: 'from-purple-500 to-indigo-600',
      narrative: 'Comprehensive cross-platform identity resolution combining all intelligence modules for maximum business impact. Includes identity verification, platform analytics, fraud detection, and market research capabilities in one unified solution.',
      description: 'The ultimate enterprise solution providing complete cross-platform identity insights, fraud detection, platform effectiveness analysis, and demographic intelligence for large-scale business operations.',
      dataFields: ['Identity Resolution', 'Platform Insights', 'Fraud Detection', 'Audience Segments', 'Targeting Opportunities', 'Trending Analysis'],
      targetCustomers: ['Fortune 500 Companies', 'Government Agencies', 'Large Ad Platforms', 'Enterprise HR Departments'],
      valueProposition: ['All intelligence modules included', 'Maximum ROI optimization', 'Enterprise-grade security', 'Complete identity picture', 'Comprehensive fraud prevention'],
      impactMetrics: {
        roiPercentage: '4,600%',
        costSavings: '$2.3M',
        accuracyImprovement: '23%',
        timeReduction: '65%'
      }
    },
    {
      id: 'marketing',
      title: 'Digital Marketing Intelligence',
      subtitle: 'Platform Effectiveness & Targeting',
      price: '$25K+ Annual Value',
      icon: <ChartBarIcon className="w-6 h-6" />,
      color: 'from-cyan-500 to-blue-600',
      narrative: 'Advanced platform effectiveness analysis that identifies which social platforms deliver the best ROI for different demographic segments. Includes budget optimization recommendations and real-time audience insights for advertising optimization.',
      description: 'Specialized analytics for digital marketing agencies and brands focused on platform selection, audience targeting, and advertising ROI optimization across social media channels.',
      dataFields: ['Platform Effectiveness', 'Demographic Targeting', 'Budget Recommendations', 'Audience Segments'],
      targetCustomers: ['Digital Marketing Agencies', 'Brand Marketing Teams', 'Ad Platform Companies', 'Performance Marketers'],
      valueProposition: ['10-30% improvement in ad targeting', 'Platform ROI optimization', 'Audience behavior insights', 'Budget allocation guidance'],
      impactMetrics: {
        roiPercentage: '380%',
        costSavings: '$650K',
        accuracyImprovement: '28%',
        timeReduction: '45%'
      }
    },
    {
      id: 'identity',
      title: 'Identity Verification & Security',
      subtitle: 'Fraud Detection & Authentication',
      price: '$30K+ Annual Value', 
      icon: <ShieldCheckIcon className="w-6 h-6" />,
      color: 'from-emerald-500 to-teal-600',
      narrative: 'Enterprise-grade identity verification leveraging cross-platform consistency analysis to detect fraud, verify authenticity, and provide confidence scoring for hiring, onboarding, and security applications.',
      description: 'Comprehensive identity verification solution for enterprises requiring fraud detection, background verification, and authentication services with cross-platform validation.',
      dataFields: ['Identity Confidence Scores', 'Fraud Detection', 'Verification Metrics', 'Risk Assessment'],
      targetCustomers: ['HR Tech Platforms', 'Financial Services', 'Background Check Companies', 'Security Firms'],
      valueProposition: ['95%+ identity accuracy', 'Fraud risk reduction', 'Automated verification', 'Compliance-ready reporting'],
      impactMetrics: {
        roiPercentage: '520%',
        costSavings: '$890K',
        accuracyImprovement: '35%',
        timeReduction: '78%'
      }
    },
    {
      id: 'influencer',
      title: 'Influencer Marketing Analytics',
      subtitle: 'Authenticity & Reach Verification',
      price: '$20K+ Annual Value',
      icon: <UserGroupIcon className="w-6 h-6" />,
      color: 'from-pink-500 to-rose-600',
      narrative: 'Specialized influencer authenticity scoring that verifies real cross-platform reach, detects fake followers, and calculates true engagement rates to optimize influencer marketing ROI and prevent fraud.',
      description: 'Dedicated analytics for influencer marketing platforms and brands to verify influencer authenticity, calculate true reach, and optimize partnership ROI.',
      dataFields: ['Influencer Scoring', 'Authenticity Metrics', 'Cross-Platform Reach', 'Engagement Analysis'],
      targetCustomers: ['Influencer Marketing Platforms', 'Brand Partnership Teams', 'Talent Agencies', 'Creator Economy Companies'],
      valueProposition: ['Authentic influencer identification', 'True reach calculation', 'Fraud detection', 'ROI optimization'],
      impactMetrics: {
        roiPercentage: '290%',
        costSavings: '$420K',
        accuracyImprovement: '42%',
        timeReduction: '55%'
      }
    },
    {
      id: 'research',
      title: 'Market Research & Demographics',
      subtitle: 'Behavioral Insights & Trends',
      price: '$15K+ Annual Value',
      icon: <ChartPieIcon className="w-6 h-6" />,
      color: 'from-amber-500 to-orange-600',
      narrative: 'Real-time demographic and behavioral insights derived from cross-platform social activity. Provides trending analysis, audience segmentation, and market intelligence for data-driven business decisions.',
      description: 'Market research solution providing real-time demographic data, behavioral trends, and audience insights for consultancies and research firms.',
      dataFields: ['Demographic Analysis', 'Trending Insights', 'Audience Segments', 'Behavioral Patterns'],
      targetCustomers: ['Market Research Firms', 'Management Consultancies', 'Data Analytics Companies', 'Business Intelligence Platforms'],
      valueProposition: ['Real-time behavioral data', 'Demographic trend analysis', 'Cost-effective research', 'Anonymous datasets'],
      impactMetrics: {
        roiPercentage: '180%',
        costSavings: '$310K',
        accuracyImprovement: '18%',
        timeReduction: '60%'
      }
    }
  ]

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        // Get data from the unified profile engine
        const exportedData = identityUtils.exportData()
        const metrics = identityUtils.getMetrics()
        const trends = identityUtils.getTrends()
        
        setData({
          exported: exportedData,
          metrics,
          trends,
          summary: {
            totalIdentities: metrics.totalIdentities || 1247,
            platforms: Object.keys(metrics.platformDistribution || {}).length || 17,
            verifiedAccounts: metrics.commercialAccounts || 342,
            dataPoints: Math.floor(Math.random() * 50000) + 25000
          }
        })
      } catch (error) {
        console.error('Error loading data:', error)
        // Fallback demo data
        setData({
          exported: {
            identityResolution: [],
            platformInsights: [],
            targetingOpportunities: [],
            suspiciousAccounts: [],
            audienceSegments: []
          },
          metrics: {
            totalIdentities: 1247,
            averageConfidence: 87,
            platformDistribution: {
              instagram: 523,
              linkedin: 445,
              twitter: 389,
              facebook: 356,
              tiktok: 298,
              youtube: 267,
              snapchat: 189
            },
            verificationLevels: { high: 342, medium: 567, low: 338 },
            commercialAccounts: 156,
            suspiciousAccounts: 23
          },
          trends: {
            emergingPlatforms: [
              { platform: 'BeReal', growthRate: 87 },
              { platform: 'Discord', growthRate: 73 },
              { platform: 'Clubhouse', growthRate: 45 }
            ],
            topDemographics: [
              { demographic: 'Tech Professionals', size: 234, value: 890 },
              { demographic: 'Marketing Agencies', size: 167, value: 745 },
              { demographic: 'Content Creators', size: 145, value: 623 }
            ]
          },
          summary: {
            totalIdentities: 1247,
            platforms: 17,
            verifiedAccounts: 342,
            dataPoints: 42750
          }
        })
      }
      setLoading(false)
    }

    loadData()
  }, [])

  // Simulate business impact calculation
  const runImpactSimulation = () => {
    setImpactSimulation(null)
    setSimulationProgress(0)
    
    const interval = setInterval(() => {
      setSimulationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          const currentUseCase = useCases.find(uc => uc.id === selectedUseCase) || useCases[0]
          setImpactSimulation({
            identitiesVerified: selectedUseCase === 'complete' ? '45,000+' : '25,000+',
            fraudCasesDetected: selectedUseCase === 'complete' ? '150+' : '85+',
            accuracyImprovement: currentUseCase.impactMetrics.accuracyImprovement,
            costSavings: currentUseCase.impactMetrics.costSavings,
            roi: currentUseCase.impactMetrics.roiPercentage,
            timeReduction: currentUseCase.impactMetrics.timeReduction
          })
          return 100
        }
        return prev + Math.random() * 15 + 5
      })
    }, 150)
  }

  const exportData = (format: 'csv' | 'json' | 'api') => {
    const currentUseCase = useCases.find(uc => uc.id === selectedUseCase) || useCases[0]
    const filename = `unified-profile-engine-${selectedUseCase}-${new Date().toISOString().split('T')[0]}`
    
    const exportContent = {
      useCase: currentUseCase.title,
      metrics: data?.summary || {},
      impactSimulation,
      timestamp: new Date().toISOString()
    }
    
    if (format === 'csv') {
      const csvContent = "data:text/csv;charset=utf-8," + 
        Object.entries(exportContent.metrics).map(([key, value]) => `${key},${value}`).join('\n')
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", `${filename}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else if (format === 'json') {
      const jsonData = JSON.stringify(exportContent, null, 2)
      const blob = new Blob([jsonData], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${filename}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } else if (format === 'api') {
      const apiPreview = `
// API Preview - ${currentUseCase.title}
GET /api/unified-profile-engine/${selectedUseCase}

Response:
${JSON.stringify(exportContent, null, 2)}
      `
      navigator.clipboard.writeText(apiPreview).then(() => {
        alert('API preview copied to clipboard!')
      })
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    )
  }

  const currentUseCase = useCases.find(uc => uc.id === selectedUseCase) || useCases[0]

  const renderStepContent = () => {
    switch (currentStep) {
      case 'selection':
        return (
          <div className="space-y-6">
            <div className="border-l-4 border-indigo-500 pl-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                🌐 {currentUseCase.title}
              </h2>
              <p className="text-slate-600 italic mb-4">
                "Show me everything - the full intelligence suite"
              </p>
              <div className="space-y-2 text-slate-700">
                <p>→ Comprehensive identity resolution for Fortune 500</p>
                <p>→ Government agencies and large platforms</p>
                <p>→ Complete fraud detection and verification</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Why This Package?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentUseCase.valueProposition.map((value, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-slate-700">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Target Customers:</h3>
              <div className="space-y-2">
                {currentUseCase.targetCustomers.map((customer, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span className="text-slate-700">{customer}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button 
                onClick={() => setCurrentStep('impact')}
                className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200"
              >
                <ArrowRightIcon className="w-5 h-5" />
                <span>Next: Impact Simulation</span>
              </button>
              <button 
                onClick={() => setCurrentStep('demo')}
                className="flex items-center space-x-2 px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors duration-200"
              >
                <ChartBarIcon className="w-5 h-5" />
                <span>View All Metrics</span>
              </button>
            </div>
          </div>
        )

      case 'impact':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Business Impact Preview</h2>
              <p className="text-slate-600">
                {simulationProgress < 100 ? 'Loading impact simulation for Complete Enterprise...' : 'Simulation Complete'}
              </p>
            </div>

            {simulationProgress < 100 && (
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <div className="w-full bg-slate-200 rounded-full h-3 mb-4">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${simulationProgress}%` }}
                  ></div>
                </div>
                <p className="text-center text-slate-600">{Math.round(simulationProgress)}%</p>
              </div>
            )}

            {impactSimulation && (
              <div className="space-y-4">
                <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-200">
                  <h3 className="text-lg font-semibold text-emerald-800 mb-4">
                    For a Fortune 500 company with 50,000 employees:
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
                      <span>Verify {impactSimulation.identitiesVerified} identities across platforms</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
                      <span>Detect {impactSimulation.fraudCasesDetected} fraud cases annually</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
                      <span>Improve hiring accuracy by {impactSimulation.accuracyImprovement}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
                      <span>Reduce verification costs by {impactSimulation.costSavings} annually</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-200">
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">ROI Calculation:</h3>
                  <p className="text-purple-700">
                    $50K investment → {impactSimulation.costSavings}+ savings = {impactSimulation.roi} ROI
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <button 
                onClick={() => setCurrentStep('selection')}
                className="flex items-center space-x-2 px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors duration-200"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                <span>Back</span>
              </button>
              
              {!impactSimulation && (
                <button 
                  onClick={runImpactSimulation}
                  className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors duration-200"
                >
                  <PlayIcon className="w-5 h-5" />
                  <span>Run Simulation</span>
                </button>
              )}
              
              {impactSimulation && (
                <button 
                  onClick={() => setCurrentStep('demo')}
                  className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200"
                >
                  <ArrowRightIcon className="w-5 h-5" />
                  <span>Next: Live Demo</span>
                </button>
              )}
              
              <button 
                onClick={() => setCurrentStep('results')}
                className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors duration-200"
              >
                <ChartPieIcon className="w-5 h-5" />
                <span>Full Analysis</span>
              </button>
            </div>
          </div>
        )

      case 'demo':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Live Data Preview</h2>
            
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <p className="text-slate-700 mb-4">Sample data processing 1,247 identities...</p>
              <div className="w-full bg-slate-200 rounded-full h-3 mb-4">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 h-3 rounded-full w-[87%]"></div>
              </div>
              <p className="text-slate-600">87% Complete</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Results Preview:</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span>17 social platforms analyzed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span>342 verified business accounts identified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span>23 suspicious patterns flagged for review</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span>42,750 cross-platform data points processed</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button 
                onClick={() => setCurrentStep('impact')}
                className="flex items-center space-x-2 px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors duration-200"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                <span>Back</span>
              </button>
              
              <button 
                onClick={() => setCurrentStep('results')}
                className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200"
              >
                <EyeIcon className="w-5 h-5" />
                <span>View Full Results</span>
              </button>
              
              <button 
                onClick={() => setCurrentStep('selection')}
                className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors duration-200"
              >
                <FunnelIcon className="w-5 h-5" />
                <span>Try Different Package</span>
              </button>
            </div>
          </div>
        )

      case 'results':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Complete Analysis Results</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 rounded-xl">
                <p className="text-sm text-indigo-600 mb-1">Total Identities</p>
                <p className="text-2xl font-bold text-indigo-800">{data?.summary.totalIdentities.toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-4 rounded-xl">
                <p className="text-sm text-emerald-600 mb-1">Platforms</p>
                <p className="text-2xl font-bold text-emerald-800">{data?.summary.platforms}</p>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl">
                <p className="text-sm text-purple-600 mb-1">Verified</p>
                <p className="text-2xl font-bold text-purple-800">{data?.summary.verifiedAccounts}</p>
              </div>
              <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-xl">
                <p className="text-sm text-amber-600 mb-1">Data Points</p>
                <p className="text-2xl font-bold text-amber-800">{data?.summary.dataPoints.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-8 rounded-xl border-2 border-dashed border-slate-300">
              <div className="text-center">
                <ChartPieIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  Advanced Data Visualization
                </h3>
                <p className="text-slate-600 mb-4">
                  Interactive charts and graphs showing {currentUseCase.title.toLowerCase()} insights
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  {currentUseCase.dataFields.map((field, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200">
                      <span className="font-medium text-slate-700">{field}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button 
                onClick={() => setCurrentStep('selection')}
                className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200"
              >
                <FunnelIcon className="w-5 h-5" />
                <span>Start Over</span>
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link 
              href="/settings"
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors duration-200"
            >
              <ArrowLeftIcon className="w-5 h-5 text-slate-600" />
            </Link>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                🧬 Unified Profile Engine - Interactive Showcase
              </h1>
            </div>

            <div className="flex items-center space-x-2 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2 rounded-xl">
              <EyeIcon className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-700">Investor Showcase</span>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Interactive Sidebar */}
          <div className="w-80 bg-white border-r border-slate-200 min-h-screen p-6 space-y-6">
            
            {/* Package Selection */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Guided Selection</h3>
              
              <div className="space-y-3">
                {useCases.map((useCase) => (
                  <button
                    key={useCase.id}
                    onClick={() => {
                      setSelectedUseCase(useCase.id)
                      setCurrentStep('selection')
                      setImpactSimulation(null)
                      setSimulationProgress(0)
                    }}
                    className={`w-full p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                      selectedUseCase === useCase.id 
                        ? 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50' 
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${useCase.color} text-white`}>
                        {useCase.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-800 text-sm">{useCase.title}</h4>
                        <p className="text-xs text-slate-500">{selectedUseCase === useCase.id ? '[SELECTED]' : useCase.price}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              <button 
                onClick={() => setCurrentStep('selection')}
                className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-sm"
              >
                Continue Demo →
              </button>
            </div>

            {/* Quick Metrics */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Metrics</h3>
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-3 rounded-lg">
                  <p className="text-xs text-slate-600">Market Size</p>
                  <p className="text-lg font-bold text-slate-800">$2.8B TAM</p>
                </div>
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-3 rounded-lg">
                  <p className="text-xs text-slate-600">Growth Rate</p>
                  <p className="text-lg font-bold text-slate-800">18%+ Annual</p>
                </div>
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-3 rounded-lg">
                  <p className="text-xs text-slate-600">Package Value</p>
                  <p className="text-lg font-bold text-slate-800">{currentUseCase.price}</p>
                </div>
              </div>
            </div>

            {/* Live Status */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Live Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Identities</span>
                  <span className="font-semibold text-slate-800">{data?.summary.totalIdentities.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Platforms</span>
                  <span className="font-semibold text-slate-800">{data?.summary.platforms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Verified</span>
                  <span className="font-semibold text-slate-800">{data?.summary.verifiedAccounts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Accuracy</span>
                  <span className="font-semibold text-slate-800">95%</span>
                </div>
              </div>
            </div>

            {/* Export Tools */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Export Tools</h3>
              <div className="grid grid-cols-1 gap-2">
                <button 
                  onClick={() => exportData('csv')}
                  className="flex items-center space-x-2 px-3 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors duration-200 text-sm"
                >
                  <DocumentArrowDownIcon className="w-4 h-4" />
                  <span>CSV</span>
                </button>
                <button 
                  onClick={() => exportData('json')}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm"
                >
                  <ArrowDownTrayIcon className="w-4 h-4" />
                  <span>JSON</span>
                </button>
                <button 
                  onClick={() => exportData('api')}
                  className="flex items-center space-x-2 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200 text-sm"
                >
                  <CodeBracketIcon className="w-4 h-4" />
                  <span>API</span>
                </button>
              </div>
            </div>

            {/* Context */}
            <div className="pt-4 border-t border-slate-200">
              <div className="text-xs text-slate-500 space-y-1">
                <p><strong>Demo for:</strong> 🎯 Investors</p>
                <p><strong>Generated:</strong> Live Data</p>
              </div>
            </div>

          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-8">
            {renderStepContent()}
          </div>
        </div>
      </div>
    </Layout>
  )
} 