import Layout from '../../components/Layout'

export default function AboutPage() {
  return (
    <Layout>
      <div className="p-4">
        <div className="card-soft">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">About ScoopSocials</h1>
            <p className="text-slate-600">Beyond Verification, Ensuring Authenticity</p>
          </div>
          
          <div className="space-y-6 text-slate-700">
            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">Our Mission</h2>
              <p>To revolutionize online identity verification and create a more authentic digital world where trust is the foundation of all interactions. We unify users' social media profiles into one verified platform while providing businesses with real-time event tracking and engagement tools.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">The Problem We Solve</h2>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-700 mb-1">🤖 Identity Fraud Crisis</h4>
                  <p className="text-sm text-red-600">Bots now make up nearly 50% of all internet traffic globally, undermining trust in digital interactions.</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-700 mb-1">🔍 Verification Challenges</h4>
                  <p className="text-sm text-orange-600">Users struggle to verify authenticity across multiple platforms, creating widespread trust issues.</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-700 mb-1">📊 Missed Business Opportunities</h4>
                  <p className="text-sm text-yellow-600">Businesses lack real-time attendee insights and engagement tools for events and community building.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">How It Works</h2>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="text-primary-500 font-bold">1.</span>
                  <p><strong>Connect Social Accounts:</strong> Link your social media profiles to verify your identity</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-primary-500 font-bold">2.</span>
                  <p><strong>Build Trust:</strong> Engage with the community through reviews and events</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-primary-500 font-bold">3.</span>
                  <p><strong>Community Validation:</strong> Real people validate other real people</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">Trust Score Algorithm</h2>
              <p>Our 11-factor scoring system evaluates social media verification (20%), community network (20%), platform activity (15%), content quality (15%), and more to create a comprehensive trust profile.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">Community Safety</h2>
              <p>Our flagging system allows community members to report inappropriate content. Moderators review flags while keeping all parties anonymous to each other.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">Key Use Cases</h2>
              <div className="grid grid-cols-1 gap-3">
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-700">🏢 Venue Accounts</h4>
                  <p className="text-sm text-purple-600">Bars and event venues broadcast promotions and track patron engagement in real-time</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-700">👨‍💼 Professional Profiles</h4>
                  <p className="text-sm text-blue-600">Contractors showcase client reviews while keeping personal content private</p>
                </div>
                <div className="p-3 bg-pink-50 rounded-lg border border-pink-200">
                  <h4 className="font-semibold text-pink-700">💕 Dating Platform Integration</h4>
                  <p className="text-sm text-pink-600">Enhanced user trust on platforms like Tinder and Hinge through verified profiles</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-700">🛡️ Insurance Integrations</h4>
                  <p className="text-sm text-green-600">High-trust users receive policy discounts and better risk assessments</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <h4 className="font-semibold text-amber-700">🎓 Educational Institutions</h4>
                  <p className="text-sm text-amber-600">Verify student identities, manage campus events, foster safer community connections</p>
                </div>
                <div className="p-3 bg-cyan-50 rounded-lg border border-cyan-200">
                  <h4 className="font-semibold text-cyan-700">🛒 E-commerce Trust</h4>
                  <p className="text-sm text-cyan-600">Online marketplaces verify seller identities and reduce transaction fraud</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">AI-Powered Technology</h2>
              <div className="space-y-3">
                <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                  <h4 className="font-semibold text-indigo-700 mb-1">🧠 Sentiment Analysis</h4>
                  <p className="text-sm text-indigo-600">Quickly interprets unstructured reviews to gauge trust levels across the platform</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-700 mb-1">🔍 Suspicious Activity Detection</h4>
                  <p className="text-sm text-red-600">Leverages AI to spot patterns of fake or bot-like behavior for enhanced security</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <h4 className="font-semibold text-emerald-700 mb-1">📈 Trend Identification</h4>
                  <p className="text-sm text-emerald-600">Uncovers user insights at scale for proactive community management and engagement</p>
                </div>
                <div className="p-3 bg-violet-50 rounded-lg border border-violet-200">
                  <h4 className="font-semibold text-violet-700 mb-1">⚡ Refined User Experience</h4>
                  <p className="text-sm text-violet-600">Delivers actionable data to enhance credibility scoring and user engagement</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">Business Model</h2>
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <h4 className="font-semibold text-slate-700 mb-1">💎 Freemium Model</h4>
                  <p className="text-sm text-slate-600">Basic version free; premium features via subscription</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <h4 className="font-semibold text-slate-700 mb-1">🏢 Professional & Venue Accounts</h4>
                  <p className="text-sm text-slate-600">Advanced features, analytics, and engagement tools</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <h4 className="font-semibold text-slate-700 mb-1">🤖 Bot Prevention Services</h4>
                  <p className="text-sm text-slate-600">Licensing to third parties for anti-fraud measures</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <h4 className="font-semibold text-slate-700 mb-1">🎯 Trust Marketplace</h4>
                  <p className="text-sm text-slate-600">Partner integrations enabling perks for high-trust users</p>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">Contact Scoop Technologies LLC</p>
              <div className="text-xs text-slate-500 space-y-1">
                <p>📍 1700 Pacific Ave Ste 1820, Dallas</p>
                <p>📧 dev@scoopsocials.com</p>
                <p>📞 (970) 306-7195</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-4">
              © 2025 Scoop Technologies LLC. Beyond Verification, Ensuring Authenticity.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
} 