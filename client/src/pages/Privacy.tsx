import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';

export default function Privacy() {
  return (
    <Layout>
      <div className="container py-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>

        <Card className="p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">1. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Name and artist name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>National Identification Number (NIN) for artist verification</li>
              <li>Location information (District, Sub-County, Parish, Village)</li>
              <li>Profile information and biography</li>
              <li>Music files and associated metadata</li>
              <li>Payment information for premium downloads (processed securely by third-party payment providers)</li>
              <li>Transaction history and purchase records</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">2. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Verify artist identities and prevent fraud</li>
              <li>Process and manage music uploads</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Track music plays, downloads, and likes for analytics</li>
              <li>Communicate with you about products, services, and events</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">3. Information Sharing</h2>
            <p className="text-muted-foreground leading-relaxed">
              We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners and trusted affiliates.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">4. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information. All data is stored securely using Supabase infrastructure with industry-standard encryption.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">5. Cookies and Tracking</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use cookies and similar tracking technologies to track activity on our service and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">6. Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We use third-party services that may collect information used to identify you:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Supabase (Database and Authentication)</li>
              <li>Google OAuth (Optional login method)</li>
              <li>Payment processors (for premium downloads - we do not store credit card information)</li>
              <li>Hugging Face (AI-powered content generation)</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              <strong>Payment Security:</strong> All payment transactions are processed through secure, PCI-compliant payment gateways. We do not store your credit card or mobile money PIN information. Payment data is encrypted and handled according to industry standards.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">7. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Request transfer of your data</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">8. Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our service is intended for users who are 18 years of age or older. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">9. Changes to This Privacy Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">10. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="mt-3 text-muted-foreground">
              <p>Email: info@atekermusic.com</p>
              <p>Phone: +256 787 168666 / +256 757 566144</p>
              <p>Developer: Enocha Engulu (YOGASWAM I.T SOLUTIONS)</p>
            </div>
          </section>

          <p className="text-sm text-muted-foreground italic mt-8">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </Card>
      </div>
    </Layout>
  );
}
