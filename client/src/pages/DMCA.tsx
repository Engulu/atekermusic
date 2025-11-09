import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';

export default function DMCA() {
  return (
    <Layout>
      <div className="container py-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">DMCA Policy</h1>

        <Card className="p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">Digital Millennium Copyright Act</h2>
            <p className="text-muted-foreground leading-relaxed">
              Ateker Music respects the intellectual property rights of others and expects its users to do the same. In accordance with the Digital Millennium Copyright Act of 1998 (DMCA), we will respond expeditiously to claims of copyright infringement committed using our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">Copyright Infringement Notification</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement and is accessible on this site, you may notify our copyright agent, as set forth in the DMCA. For your complaint to be valid under the DMCA, you must provide the following information in writing:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>An electronic or physical signature of a person authorized to act on behalf of the copyright owner</li>
              <li>Identification of the copyrighted work that you claim has been infringed</li>
              <li>Identification of the material that is claimed to be infringing and where it is located on the website</li>
              <li>Information reasonably sufficient to permit us to contact you, such as your address, telephone number, and email address</li>
              <li>A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or law</li>
              <li>A statement, made under penalty of perjury, that the above information is accurate, and that you are the copyright owner or are authorized to act on behalf of the owner</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">Counter-Notification</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              If you believe that the material you posted was removed by mistake or misidentification, you may file a counter-notification with us by providing the following information:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Your physical or electronic signature</li>
              <li>Identification of the material that has been removed or to which access has been disabled and the location at which the material appeared before it was removed or access to it was disabled</li>
              <li>A statement under penalty of perjury that you have a good faith belief that the material was removed or disabled as a result of mistake or misidentification</li>
              <li>Your name, address, and telephone number, and a statement that you consent to the jurisdiction of the courts in Uganda</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">Repeat Infringers</h2>
            <p className="text-muted-foreground leading-relaxed">
              It is our policy to terminate the accounts of users who are repeat infringers of copyright.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">Artist Responsibility</h2>
            <p className="text-muted-foreground leading-relaxed">
              Artists uploading content to Ateker Music warrant that they own all rights to the content or have obtained all necessary permissions. Any artist found to be uploading copyrighted material without authorization will have their account terminated and may face legal action.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">Content Review</h2>
            <p className="text-muted-foreground leading-relaxed">
              All uploaded content is subject to admin review before publication. However, this review process does not guarantee that all content is free from copyright infringement. We rely on artists to upload only content they have the right to distribute.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Please send all DMCA notices and counter-notifications to:
            </p>
            <div className="bg-muted p-4 rounded-lg text-muted-foreground">
              <p className="font-semibold">DMCA Agent</p>
              <p>Ateker Music / YOGASWAM I.T SOLUTIONS</p>
              <p>Email: info@atekermusic.com</p>
              <p>Phone: +256 787 168666 / +256 757 566144</p>
              <p>Contact: Enocha Engulu</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">Response Time</h2>
            <p className="text-muted-foreground leading-relaxed">
              We will respond to valid DMCA notices within 48-72 hours. Infringing content will be removed promptly upon verification of the claim.
            </p>
          </section>

          <p className="text-sm text-muted-foreground italic mt-8">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </Card>
      </div>
    </Layout>
  );
}
