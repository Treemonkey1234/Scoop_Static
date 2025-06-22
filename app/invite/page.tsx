import Layout from '../../components/Layout'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Invite Friends - ScoopSocials',
  description: 'Invite your friends to join ScoopSocials',
}

export default function InvitePage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
              🍦 Invite Your Sweet Friends!
            </h1>
            <p className="text-gray-600 text-lg">
              Share the sweetness and invite your friends to join our ice cream themed community!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Share Link */}
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                🔗 Share Your Invite Link
              </h2>
              <div className="bg-white rounded-lg p-4 border-2 border-dashed border-pink-300">
                <code className="text-sm text-gray-600 break-all">
                  https://scoopsocials.com/invite/your-unique-code
                </code>
              </div>
              <button className="w-full mt-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-full font-semibold hover:shadow-lg transition-all duration-300">
                📋 Copy Link
              </button>
            </div>

            {/* Email Invites */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                📧 Send Email Invites
              </h2>
              <div className="space-y-4">
                <textarea
                  placeholder="Enter email addresses separated by commas..."
                  className="w-full p-4 border border-gray-300 rounded-lg resize-none h-24 focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                />
                <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-full font-semibold hover:shadow-lg transition-all duration-300">
                  🚀 Send Invites
                </button>
              </div>
            </div>
          </div>

          {/* Social Sharing */}
          <div className="mt-8 text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Share on Social Media</h3>
            <div className="flex justify-center gap-4">
              <button className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors">
                📘 Facebook
              </button>
              <button className="bg-blue-400 text-white p-3 rounded-full hover:bg-blue-500 transition-colors">
                🐦 Twitter
              </button>
              <button className="bg-pink-500 text-white p-3 rounded-full hover:bg-pink-600 transition-colors">
                📷 Instagram
              </button>
              <button className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition-colors">
                💬 WhatsApp
              </button>
            </div>
          </div>

          {/* Invite Stats */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-orange-600">12</div>
              <div className="text-sm text-gray-600">Invites Sent</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-600">8</div>
              <div className="text-sm text-gray-600">Friends Joined</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-purple-600">67%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
} 