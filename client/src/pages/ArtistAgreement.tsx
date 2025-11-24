import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';

export default function ArtistAgreement() {
  return (
    <Layout>
      <div className="container py-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">Artist Agreement</h1>

        <Card className="p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">1. Agreement Overview</h2>
            <p className="text-muted-foreground leading-relaxed">
              This Artist Agreement ("Agreement") is entered into between Ateker Music ("Platform") and the artist ("Artist") who uploads content to the Platform. By registering as an artist and uploading content, you agree to be bound by this Agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">2. Artist Eligibility</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              To be eligible as an artist on Ateker Music, you must:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Be at least 18 years of age</li>
              <li>Provide accurate and complete registration information including National ID Number (NIN)</li>
              <li>Be a resident of Uganda or have strong ties to Eastern Uganda music culture</li>
              <li>Own all rights to the content you upload or have obtained necessary permissions</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">3. Content Ownership and Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              By uploading content to Ateker Music, you represent and warrant that:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>You are the original creator and copyright owner of all uploaded content</li>
              <li>You have obtained all necessary rights, licenses, and permissions for any samples, beats, or third-party content included in your music</li>
              <li>Your content does not infringe on any third-party intellectual property rights</li>
              <li>You grant Ateker Music a non-exclusive, worldwide, royalty-free license to host, store, distribute, and promote your content</li>
              <li>You retain all ownership rights to your content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">4. Platform License</h2>
            <p className="text-muted-foreground leading-relaxed">
              You grant Ateker Music a non-exclusive, transferable, sub-licensable, royalty-free, worldwide license to use, reproduce, distribute, prepare derivative works of, display, and perform your content in connection with the Platform and Platform's business operations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">5. Revenue and Monetization</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Ateker Music offers both free and premium music options:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Free Music:</strong> Artists can choose to offer their music for free download. Benefits include exposure, promotion, and building a fan base.</li>
              <li><strong>Premium Music:</strong> Artists can set a price (in UGX) for their music downloads. Premium revenue is shared as follows:
                <ul className="list-circle list-inside ml-6 mt-2 space-y-1">
                  <li>Artist receives 55% of the sale price</li>
                  <li>Platform retains 45% for hosting, payment processing, and operations</li>
                </ul>
              </li>
              <li>Premium earnings are paid out monthly via Mobile Money to artists who have earned at least UGX 50,000</li>
              <li>Artists must provide valid Mobile Money details for payouts</li>
              <li>Platform reserves the right to withhold payments if fraud or policy violations are suspected</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">6. Content Guidelines</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              All uploaded content must:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Be in MP3 format, maximum 8MB file size</li>
              <li>Include accurate metadata (title, genre, language, etc.)</li>
              <li>Have a square cover art image (automatically cropped, max 1MB)</li>
              <li>Not contain explicit content without appropriate labeling</li>
              <li>Not promote violence, hate speech, or illegal activities</li>
              <li>Not infringe on any copyrights or trademarks</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">7. Approval Process</h2>
            <p className="text-muted-foreground leading-relaxed">
              All artist registrations and song uploads are subject to admin approval. The Platform reserves the right to reject any content or artist registration without providing a reason. Typical approval time is 24-48 hours.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">8. Content Removal</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Ateker Music reserves the right to remove any content that:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Violates this Agreement or Platform Terms of Service</li>
              <li>Infringes on third-party rights</li>
              <li>Receives valid DMCA takedown notices</li>
              <li>Is deemed inappropriate or harmful by Platform administrators</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Artists will be notified of content removal when possible, but the Platform is not obligated to provide advance notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">9. Artist Responsibilities</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              As an artist on the Platform, you agree to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Maintain accurate profile information</li>
              <li>Respond to copyright claims or disputes in a timely manner</li>
              <li>Not upload duplicate or spam content</li>
              <li>Not attempt to manipulate play counts, downloads, or likes</li>
              <li>Respect other artists and users on the Platform</li>
              <li>Promote your music responsibly and ethically</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">10. Account Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              Ateker Music may terminate or suspend your artist account at any time for violations of this Agreement, Terms of Service, or for any other reason deemed necessary by the Platform. Upon termination, your content may be removed from the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">11. Indemnification</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree to indemnify and hold harmless Ateker Music, its operators, and affiliates from any claims, damages, losses, liabilities, and expenses arising from your content, your use of the Platform, or your violation of this Agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">12. Changes to Agreement</h2>
            <p className="text-muted-foreground leading-relaxed">
              Ateker Music reserves the right to modify this Agreement at any time. Continued use of the Platform after changes constitutes acceptance of the modified Agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">13. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              For questions about this Artist Agreement, please contact:
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
