import Layout from '../../components/Layout'
import { 
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'

export default function HelpPage() {
  const faqItems = [
    {
      question: "How is my trust score calculated?",
      answer: "Your trust score is based on 11 factors including social media verification (20%), community network (20%), platform activity (15%), content quality (15%), and more. It's designed to reflect your authenticity and community engagement."
    },
    {
      question: "What happens when content gets flagged?",
      answer: "Flagged content becomes temporarily invisible until a moderator reviews it. Both the flagger and content creator remain anonymous to each other, but moderators can see all identities. False flagging affects your trust score negatively."
    },
    {
      question: "How do I verify my social media accounts?",
      answer: "Go to your profile settings and connect your social media accounts. We verify the accounts are real and active, but we don't store passwords or post on your behalf. Verification is optional but helps build trust."
    },
    {
      question: "Why can I only review friends?",
      answer: "This ensures authentic feedback within trusted networks. You must be friends with someone before you can review them, which prevents spam and encourages genuine relationships."
    },
    {
      question: "What are the different account types?",
      answer: "Free accounts have basic features, Pro accounts get advanced analytics and priority support, and Venue accounts are for businesses hosting events with special event management tools."
    }
  ]

  const helpCategories = [
    {
      icon: <ShieldCheckIcon className="w-6 h-6" />,
      title: "Trust & Safety",
      description: "Learn about trust scores, verification, and community safety",
      topics: ["Trust Score", "Account Verification", "Flagging System", "Community Guidelines"]
    },
    {
      icon: <UserGroupIcon className="w-6 h-6" />,
      title: "Friends & Reviews",
      description: "Managing connections and leaving authentic reviews",
      topics: ["Adding Friends", "Writing Reviews", "Review Guidelines", "Privacy Settings"]
    },
    {
      icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />,
      title: "Events & Community",
      description: "Creating events, joining activities, and community features",
      topics: ["Creating Events", "RSVP System", "Event Safety", "Community Standards"]
    }
  ]

  return (
    <Layout>
      <div className="p-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <QuestionMarkCircleIcon className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Help Center</h1>
          <p className="text-slate-600">Find answers to common questions and get support</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          <div className="card-soft bg-gradient-to-r from-primary-50 to-primary-100/50 border border-primary-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center">
                <EnvelopeIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 mb-1">Contact Support</h3>
                <p className="text-sm text-slate-600">Get help from our support team</p>
              </div>
              <button className="btn-primary px-4 py-2">
                Contact Us
              </button>
            </div>
          </div>
        </div>

        {/* Help Categories */}
        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-semibold text-slate-800">Browse by Category</h2>
          
          {helpCategories.map((category, index) => (
            <div key={index} className="card-soft">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                  {category.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 mb-1">{category.title}</h3>
                  <p className="text-sm text-slate-600 mb-3">{category.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {category.topics.map((topic, topicIndex) => (
                      <span
                        key={topicIndex}
                        className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-800">Frequently Asked Questions</h2>
          
          {faqItems.map((item, index) => (
            <div key={index} className="card-soft">
              <h3 className="font-semibold text-slate-800 mb-2">{item.question}</h3>
              <p className="text-slate-700 text-sm leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="card-soft mt-8 text-center">
          <h3 className="font-semibold text-slate-800 mb-2">Still need help?</h3>
          <p className="text-slate-600 text-sm mb-4">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <button className="btn-primary">
            Contact Support
          </button>
        </div>
      </div>
    </Layout>
  )
} 