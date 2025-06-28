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
      subtitle: 'Full Cross-Platform Data',
      price: 'Complete Identity Intelligence',
      icon: <GlobeAltIcon className="w-6 h-6" />,
      color: 'from-purple-500 to-indigo-600',
      narrative: 'Give me the complete picture - every data point, every platform, every insight for comprehensive employee verification and enterprise security.',
      description: 'Complete cross-platform identity resolution and behavioral analysis for enterprise applications.',
      dataFields: ['Identity Resolution', 'Cross-Platform Consistency', 'Behavioral Patterns', 'Network Mapping', 'Account Verification', 'Activity Analysis'],
      targetCustomers: ['Large Enterprises: Complete employee background verification', 'Government Agencies: Comprehensive identity analysis', 'Fortune 500 HR: Thorough candidate screening', 'Corporate Security: Full identity verification'],
      valueProposition: ['360-degree identity view across all platforms', 'Comprehensive verification for enterprise security', 'Complete behavioral and network analysis', 'Enterprise-grade identity intelligence'],
      impactMetrics: {
        roiPercentage: 'Processing: 5 Demo Profiles',
        costSavings: 'Platforms: 3-5 Connected',
        accuracyImprovement: 'Accuracy: Testing Phase',
        timeReduction: 'Data: Live Processing'
      }
    },
    {
      id: 'marketing',
      title: 'Digital Marketing Intelligence',
      subtitle: 'Platform Effectiveness & Targeting',
      price: 'Audience Demographics & Behavior',
      icon: <ChartBarIcon className="w-6 h-6" />,
      color: 'from-cyan-500 to-blue-600',
      narrative: 'Help me understand my audience - who they really are, where they spend time, and how to reach them effectively across platforms.',
      description: 'Specialized analytics for digital marketing agencies and brands focused on audience understanding and platform selection.',
      dataFields: ['Platform Effectiveness', 'Demographic Targeting', 'Audience Segments', 'Behavioral Patterns'],
      targetCustomers: ['Marketing Agencies: Optimize ad spend across platforms', 'Brand Marketers: Understand actual audience demographics', 'Media Buyers: Select the right platforms for campaigns', 'Performance Marketers: Maximize audience targeting efficiency'],
      valueProposition: ['Platform effectiveness analysis for ad optimization', 'Real audience demographics vs claimed metrics', 'Cross-platform behavior insights for targeting', 'Media spend optimization guidance'],
      impactMetrics: {
        roiPercentage: 'Processing: 5 Demo Profiles',
        costSavings: 'Platforms: 3-5 Connected',
        accuracyImprovement: 'Focus: Marketing Analytics',
        timeReduction: 'Data: Audience Insights'
      }
    },
    {
      id: 'identity',
      title: 'Identity Verification & Security',
      subtitle: 'Fraud Detection & Authentication',
      price: 'Cross-Platform Identity Scoring', 
      icon: <ShieldCheckIcon className="w-6 h-6" />,
      color: 'from-emerald-500 to-teal-600',
      narrative: 'Is this person who they claim to be? Verify authenticity and detect suspicious patterns across platforms to prevent fraud.',
      description: 'Identity verification solution using cross-platform validation to detect inconsistencies and provide confidence scoring.',
      dataFields: ['Identity Confidence Scores', 'Fraud Detection', 'Verification Metrics', 'Cross-Platform Consistency'],
      targetCustomers: ['HR Teams: Verify job candidate authenticity', 'Financial Services: KYC verification and fraud prevention', 'Background Check Companies: Identity validation services', 'Security Firms: Fraud detection and risk assessment'],
      valueProposition: ['Fraud detection through cross-platform analysis', 'Identity authenticity scoring and verification', 'Suspicious pattern recognition and alerts', 'Risk assessment for hiring and onboarding'],
      impactMetrics: {
        roiPercentage: 'Processing: 5 Demo Profiles',
        costSavings: 'Platforms: 3-5 Connected',
        accuracyImprovement: 'Focus: Identity Security',
        timeReduction: 'Data: Fraud Detection'
      }
    },
    {
      id: 'influencer',
      title: 'Influencer Marketing Analytics',
      subtitle: 'Authenticity & Reach Verification',
      price: 'Creator Authenticity Analysis',
      icon: <UserGroupIcon className="w-6 h-6" />,
      color: 'from-pink-500 to-rose-600',
      narrative: 'Is this influencer authentic? Do they have real followers, genuine engagement, and legitimate cross-platform reach worth your partnership investment?',
      description: 'Analytics for influencer marketing platforms and brands to verify creator authenticity and cross-platform consistency.',
      dataFields: ['Influencer Scoring', 'Authenticity Metrics', 'Cross-Platform Reach', 'Engagement Patterns'],
      targetCustomers: ['Influencer Marketing Platforms: Screen and vet creators', 'Brand Partnership Teams: Evaluate potential influencer collaborations', 'Talent Agencies: Verify influencer metrics and authenticity', 'Creator Economy Companies: Maintain platform integrity'],
      valueProposition: ['Fake follower detection and real audience verification', 'Authentic engagement rate calculation', 'Cross-platform reach validation', 'Influencer fraud prevention and risk assessment'],
      impactMetrics: {
        roiPercentage: 'Processing: 5 Demo Profiles',
        costSavings: 'Platforms: 3-5 Connected',
        accuracyImprovement: 'Focus: Influencer Analysis',
        timeReduction: 'Data: Creator Insights'
      }
    },
    {
      id: 'research',
      title: 'Market Research & Demographics',
      subtitle: 'Behavioral Insights & Trends',
      price: 'Demographic & Behavioral Analysis',
      icon: <ChartPieIcon className="w-6 h-6" />,
      color: 'from-amber-500 to-orange-600',
      narrative: 'Show me behavioral trends and demographic patterns across social platforms for data-driven insights and market intelligence.',
      description: 'Market research solution providing demographic data and behavioral patterns across social platforms for research and analysis.',
      dataFields: ['Demographic Analysis', 'Behavioral Patterns', 'Audience Segments', 'Platform Activity'],
      targetCustomers: ['Market Research Firms: Analyze social behavior and demographic shifts', 'Management Consultancies: Understand consumer trends and patterns', 'Data Analytics Companies: Access anonymized social insights', 'Business Intelligence Teams: Track demographic and behavioral trends'],
      valueProposition: ['Anonymized behavioral analysis for trend identification', 'Demographic shift tracking across platforms', 'Consumer behavior pattern insights', 'Market intelligence through social data analysis'],
      impactMetrics: {
        roiPercentage: 'Processing: 5 Demo Profiles',
        costSavings: 'Platforms: 3-5 Connected',
        accuracyImprovement: 'Focus: Research Analytics',
        timeReduction: 'Data: Market Insights'
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
            totalIdentities: 5, // 5 demo profiles + investor
            platforms: 3, // Instagram, LinkedIn, Twitter
            verifiedAccounts: 2, // Some verified accounts in demo
            dataPoints: 450 // Realistic data points for 5 profiles
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
            totalIdentities: 5,
            averageConfidence: 87,
            platformDistribution: {
              instagram: 4,
              linkedin: 5,
              twitter: 3
            },
            verificationLevels: { high: 2, medium: 2, low: 1 },
            commercialAccounts: 2,
            suspiciousAccounts: 0
          },
          trends: {
            emergingPlatforms: [
              { platform: 'Instagram', growthRate: 2 },
              { platform: 'LinkedIn', growthRate: 1 },
              { platform: 'Twitter', growthRate: 1 }
            ],
            topDemographics: [
              { demographic: 'Professionals', size: 3, value: 0 },
              { demographic: 'Creators', size: 1, value: 0 },
              { demographic: 'General Users', size: 1, value: 0 }
            ]
          },
          summary: {
            totalIdentities: 5,
            platforms: 3,
            verifiedAccounts: 2,
            dataPoints: 450
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
            identitiesProcessed: '5 demo profiles',
            platformsAnalyzed: '3 social platforms',
            dataPointsExtracted: '450+ data points',
            processingTime: '2.3 seconds',
            accuracyLevel: 'Testing phase',
            useCase: currentUseCase.impactMetrics.accuracyImprovement
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
      // Create realistic user profile CSV data
      const csvHeaders = 'User_ID,Confidence_Score,Real_Name,Age_Range,Location,Email_Verified,Phone_Verified,Connected_Platforms,Friends_Count,Followers_Count,Following_Count,Activity_Level,Cross_Platform_Consistency,Account_Age_Average,Risk_Assessment'
      const csvRows = [
        'INVESTOR_001,95,Your Profile,35-44,Your Location,Yes,Yes,"Instagram+LinkedIn+Twitter",487,1520,892,High_Activity,High,3.2_years,Low_Risk',
        'DEMO_001,87,Sarah Chen,25-34,Austin TX,Yes,Yes,"Instagram+LinkedIn",234,2100,456,Medium_Activity,High,2.8_years,Low_Risk',
        'DEMO_002,92,Mike Johnson,28-32,NYC,Yes,No,"LinkedIn+Twitter+Facebook",892,3400,234,High_Activity,Medium,4.1_years,Low_Risk',
        'DEMO_003,78,Alex Rivera,22-28,Seattle WA,No,Yes,"Instagram+TikTok",156,890,678,Medium_Activity,Medium,1.5_years,Medium_Risk',
        'DEMO_004,94,Jordan Kim,30-35,San Francisco,Yes,Yes,"LinkedIn+Instagram+Twitter",567,4200,321,High_Activity,High,3.7_years,Low_Risk',
        'DEMO_005,83,Taylor Swift,26-32,Nashville TN,Yes,Yes,"Instagram+Twitter",345,1800,567,Medium_Activity,High,2.3_years,Low_Risk'
      ]
      const csvContent = "data:text/csv;charset=utf-8," + csvHeaders + '\n' + csvRows.join('\n')
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
                "{currentUseCase.narrative}"
              </p>
              <div className="space-y-2 text-slate-700">
                {currentUseCase.targetCustomers.slice(0, 3).map((customer, idx) => (
                  <p key={idx}>→ {customer}</p>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">What This Delivers:</h3>
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
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Who Uses This:</h3>
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
                <span>Next: Process Your Data</span>
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
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Process Your Data Preview</h2>
              <p className="text-slate-600">
                {simulationProgress < 100 ? 'Processing your connected social accounts...' : 'Processing Complete'}
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
                    Live Processing Results:
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
                      <span>Processed {impactSimulation.identitiesProcessed}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
                      <span>Analyzed {impactSimulation.platformsAnalyzed}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
                      <span>Extracted {impactSimulation.dataPointsExtracted}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
                      <span>Processing time: {impactSimulation.processingTime}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-200">
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">Use Case Focus:</h3>
                  <p className="text-purple-700">
                    {impactSimulation.useCase} - {currentUseCase.narrative}
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
                  <span>Process Data</span>
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
              <p className="text-slate-700 mb-4">Processing 5 demo profiles + your data...</p>
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
                  <span>3 social platforms analyzed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span>2 verified accounts identified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span>0 suspicious patterns detected</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span>450+ cross-platform data points extracted</span>
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
                🧬 Unified Profile Engine - Live Demo
              </h1>
            </div>

            <div className="flex items-center space-x-2 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2 rounded-xl">
              <EyeIcon className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-700">Live Data Processing</span>
            </div>
          </div>
        </div>

        {/* Mobile Swiper Navigation */}
        <div className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex justify-center mb-4">
            {/* Dot Navigation */}
            <div className="flex space-x-2">
              {useCases.map((useCase, index) => (
                <button
                  key={useCase.id}
                  onClick={() => {
                    setSelectedUseCase(useCase.id)
                    setCurrentStep('selection')
                    setImpactSimulation(null)
                    setSimulationProgress(0)
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    selectedUseCase === useCase.id 
                      ? 'bg-indigo-600' 
                      : 'bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          </div>
          
          {/* Current Package Title */}
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-800 mb-1">
              {currentUseCase.title}
            </h2>
            <p className="text-sm text-slate-600">{currentUseCase.price}</p>
          </div>
        </div>

        {/* Swipe Navigation Arrows */}
        <div className="bg-white border-b border-slate-200 px-6 py-2">
          <div className="flex justify-between items-center">
            <button
              onClick={() => {
                const currentIndex = useCases.findIndex(uc => uc.id === selectedUseCase)
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : useCases.length - 1
                setSelectedUseCase(useCases[prevIndex].id)
                setCurrentStep('selection')
                setImpactSimulation(null)
                setSimulationProgress(0)
              }}
              className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-indigo-600 transition-colors duration-200"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span className="text-sm">Previous</span>
            </button>
            
            <span className="text-sm text-slate-500">
              {useCases.findIndex(uc => uc.id === selectedUseCase) + 1} of {useCases.length}
            </span>
            
            <button
              onClick={() => {
                const currentIndex = useCases.findIndex(uc => uc.id === selectedUseCase)
                const nextIndex = currentIndex < useCases.length - 1 ? currentIndex + 1 : 0
                setSelectedUseCase(useCases[nextIndex].id)
                setCurrentStep('selection')
                setImpactSimulation(null)
                setSimulationProgress(0)
              }}
              className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-indigo-600 transition-colors duration-200"
            >
              <span className="text-sm">Next</span>
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content Area - Full Width */}
        <div className="flex-1 p-6 max-w-4xl mx-auto">
          {renderStepContent()}
          
          {/* Export Tools at Bottom */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => exportData('csv')}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors duration-200"
              >
                <DocumentArrowDownIcon className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
              <button 
                onClick={() => exportData('json')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                <span>Export JSON</span>
              </button>
              <button 
                onClick={() => exportData('api')}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200"
              >
                <CodeBracketIcon className="w-4 h-4" />
                <span>API Preview</span>
              </button>
            </div>
            
            {/* Live Stats */}
            <div className="mt-4 text-center text-sm text-slate-500">
              {data?.summary.totalIdentities} Profiles • {data?.summary.platforms} Platforms • {data?.summary.verifiedAccounts} Verified • {data?.summary.dataPoints} Data Points
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
} 