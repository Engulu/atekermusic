import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';

export default function Terms() {
  return (
    <Layout>
      <div className="container py-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">Terms & Conditions</h1>

        <Card className="p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using Ateker Music, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">2. Use License</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Permission is granted to temporarily download one copy of the materials (music files) on Ateker Music for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on Ateker Music</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">3. User Accounts</h2>
            <p className="text-muted-foreground leading-relaxed">
              Artists who register for an account must provide accurate and complete information. You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">4. Content Upload</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Artists uploading content to Ateker Music agree that:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>They own all rights to the content being uploaded</li>
              <li>The content does not infringe on any third-party rights</li>
              <li>The content complies with all applicable laws and regulations</li>
              <li>Ateker Music reserves the right to remove any content that violates these terms</li>
              <li>All uploads are subject to admin approval before publication</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">5. Downloads (Free & Premium)</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Ateker Music offers both free and premium music downloads:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Free Music:</strong> Available for download at no cost for personal, non-commercial use</li>
              <li><strong>Premium Music:</strong> Requires payment as specified by the artist. Premium downloads grant you a personal use license</li>
              <li>Commercial use of any downloaded music (free or premium) requires explicit permission from the copyright holder (artist)</li>
              <li>Premium purchases are final and non-refundable except as required by law</li>
              <li>You may not redistribute, resell, or share premium music files with others</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">6. Payment & Refunds</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              For premium music downloads:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>All prices are displayed in Ugandan Shillings (UGX)</li>
              <li>Payment is processed securely through our payment partners</li>
              <li>Refunds are only provided in cases of technical errors preventing download</li>
              <li>Refund requests must be submitted within 7 days of purchase</li>
              <li>Artists receive a revenue share from premium downloads as per the Artist Agreement</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">7. Disclaimer</h2>
            <p className="text-muted-foreground leading-relaxed">
              The materials on Ateker Music are provided on an 'as is' basis. Ateker Music makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">8. Limitations</h2>
            <p className="text-muted-foreground leading-relaxed">
              In no event shall Ateker Music or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Ateker Music.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">9. Revisions</h2>
            <p className="text-muted-foreground leading-relaxed">
              Ateker Music may revise these terms of service at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">9. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These terms and conditions are governed by and construed in accordance with the laws of Uganda and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">10. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms & Conditions, please contact us at:
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
