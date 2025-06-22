import Layout from '../../components/Layout'

export default function TermsPage() {
  return (
    <Layout>
      <div className="p-4">
        <div className="card-soft">
          <h1 className="text-2xl font-bold text-slate-800 mb-6">Terms of Service</h1>
          
          <div className="space-y-6 text-slate-700">
            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">1. Acceptance of Terms</h2>
              <p>By accessing and using ScoopSocials, you accept and agree to be bound by the terms and provision of this agreement.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">2. Community Standards</h2>
              <p>ScoopSocials is built on trust and community verification. Users must provide accurate information and engage constructively with the community.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">3. Trust Score System</h2>
              <p>Your trust score is calculated based on community interactions, reviews, and verified social connections. Attempting to manipulate the trust score system is prohibited.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">4. Content Guidelines</h2>
              <p>Users are responsible for their content. Prohibited content includes harassment, misinformation, doxxing, and spam. Content may be flagged and reviewed by moderators.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">5. Privacy and Data</h2>
              <p>We respect your privacy and handle your data according to our Privacy Policy. Social media verification is optional but helps build trust.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">6. Limitation of Liability</h2>
              <p>ScoopSocials provides a platform for community interaction. We are not liable for user-generated content or interactions between users.</p>
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