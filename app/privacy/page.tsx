import Layout from '../../components/Layout'

export default function PrivacyPage() {
  return (
    <Layout>
      <div className="p-4">
        <div className="card-soft">
          <h1 className="text-2xl font-bold text-slate-800 mb-6">Privacy Policy</h1>
          
          <div className="space-y-6 text-slate-700">
            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">Information We Collect</h2>
              <p>We collect information you provide directly, such as your profile details, reviews, and social media connections you choose to verify.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">Trust Score Calculation</h2>
              <p>Your trust score is calculated using community interactions, review quality, social verification, and platform engagement. This helps maintain a safe community.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">Social Media Verification</h2>
              <p>Connecting social accounts is optional and helps verify your identity. We don't store your social media passwords or post on your behalf.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">Data Sharing</h2>
              <p>We don't sell your personal data. Information is shared only as necessary for platform functionality and with your explicit consent.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">Content Moderation</h2>
              <p>Flagged content is reviewed by moderators. Both flaggers and content creators remain anonymous to each other, but moderators can see all identities.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">Your Rights</h2>
              <p>You can access, update, or delete your personal information. You can also disconnect social accounts and adjust privacy settings at any time.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">Contact Us</h2>
              <p>For privacy questions or concerns, contact us at privacy@scoopsocials.com</p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              Last updated: June 21, 2025
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
} 