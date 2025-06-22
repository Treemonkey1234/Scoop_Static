'use client'

import React, { useState } from 'react'
import Layout from '../../components/Layout'
import { 
  CreditCardIcon, 
  CheckIcon,
  StarIcon,
  BuildingOfficeIcon,
  UserIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import { CheckIcon as CheckIconSolid } from '@heroicons/react/24/solid'

export default function BillingPage() {
  const [selectedPlan, setSelectedPlan] = useState('free')
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  const plans = [
    {
      id: 'free',
      name: 'Free',
      description: 'Perfect for getting started',
      price: { monthly: 0, yearly: 0 },
      icon: <UserIcon className="w-8 h-8 text-slate-600" />,
      features: [
        'Basic profile verification',
        'Up to 5 reviews per month',
        'Community trust score',
        'Basic event RSVP',
        'Standard support'
      ],
      limitations: [
        'Limited social platform connections',
        'Basic analytics only',
        'No priority support'
      ]
    },
    {
      id: 'pro',
      name: 'Professional',
      description: 'Enhanced features for power users',
      price: { monthly: 9.99, yearly: 99.99 },
      icon: <StarIcon className="w-8 h-8 text-primary-600" />,
      popular: true,
      features: [
        'Advanced profile verification',
        'Unlimited reviews',
        'Priority trust scoring',
        'Advanced event management',
        'Premium analytics dashboard',
        'Priority support',
        'Custom profile themes',
        'Enhanced privacy controls'
      ]
    },
    {
      id: 'venue',
      name: 'Venue & Business',
      description: 'Complete solution for businesses',
      price: { monthly: 29.99, yearly: 299.99 },
      icon: <BuildingOfficeIcon className="w-8 h-8 text-purple-600" />,
      features: [
        'Business profile verification',
        'Unlimited customer reviews',
        'Real-time event analytics',
        'Customer insight dashboard',
        'Bot prevention suite',
        'API access',
        'White-label options',
        'Dedicated account manager',
        'Custom integrations',
        'Advanced fraud detection'
      ]
    }
  ]

  const currentPlan = plans.find(plan => plan.id === 'free') // Simulating current plan

  return (
    <Layout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Billing & Subscription</h1>
          <p className="text-slate-600">Manage your ScoopSocials subscription and billing</p>
        </div>

        {/* Current Plan */}
        <div className="card-soft">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <CreditCardIcon className="w-5 h-5 mr-2 text-primary-500" />
            Current Plan
          </h2>
          
          <div className="flex items-center justify-between p-4 bg-primary-50 rounded-xl">
            <div className="flex items-center space-x-3">
              {currentPlan?.icon}
              <div>
                <span className="font-semibold text-slate-800">{currentPlan?.name} Plan</span>
                <p className="text-sm text-slate-600">{currentPlan?.description}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-primary-600">
                ${currentPlan?.price.monthly}/mo
              </span>
            </div>
          </div>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="card-soft">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-slate-800' : 'text-slate-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                billingCycle === 'yearly' ? 'bg-primary-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-slate-800' : 'text-slate-500'}`}>
                Yearly
              </span>
              {billingCycle === 'yearly' && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  Save 17%
                </span>
              )}
            </div>
          </div>

          {/* Plans */}
          <div className="space-y-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                  plan.popular
                    ? 'border-primary-500 bg-primary-50'
                    : selectedPlan === plan.id
                    ? 'border-primary-300 bg-primary-25'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-4">
                    <span className="px-3 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {plan.icon}
                    <div>
                      <h3 className="font-semibold text-slate-800">{plan.name}</h3>
                      <p className="text-sm text-slate-600">{plan.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-slate-800">
                      ${plan.price[billingCycle]}
                    </span>
                    <span className="text-sm text-slate-500">
                      /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckIconSolid className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {currentPlan?.id === plan.id ? (
                  <div className="flex items-center justify-center py-2 text-sm font-medium text-primary-600">
                    Current Plan
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
                      plan.popular
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {plan.price.monthly === 0 ? 'Downgrade to Free' : 'Upgrade Plan'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div className="card-soft">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Payment Method</h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">VISA</span>
                </div>
                <div>
                  <span className="font-medium text-slate-800">•••• •••• •••• 4242</span>
                  <p className="text-sm text-slate-500">Expires 12/25</p>
                </div>
              </div>
              <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                Edit
              </button>
            </div>

            <button className="flex items-center justify-between w-full p-4 border-2 border-dashed border-slate-300 rounded-xl hover:border-primary-300 transition-colors duration-200">
              <span className="text-slate-600">Add Payment Method</span>
              <ChevronRightIcon className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Billing History */}
        <div className="card-soft">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Billing History</h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
              <div>
                <span className="font-medium text-slate-800">Free Plan</span>
                <p className="text-sm text-slate-500">Current billing period</p>
              </div>
              <div className="text-right">
                <span className="font-medium text-slate-800">$0.00</span>
                <p className="text-sm text-green-600">Active</p>
              </div>
            </div>

            <div className="text-center py-8 text-slate-500">
              <p className="text-sm">No previous billing history</p>
            </div>
          </div>
        </div>

        {/* Enterprise Contact */}
        <div className="card-soft bg-gradient-to-r from-purple-50 to-primary-50">
          <div className="text-center">
            <BuildingOfficeIcon className="w-12 h-12 text-purple-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Need Enterprise Solutions?</h3>
            <p className="text-slate-600 mb-4">
              Custom pricing for large organizations with advanced security and compliance needs.
            </p>
            <button className="btn-primary">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
} 