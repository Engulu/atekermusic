import React from 'react';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function LegalPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <main className="min-h-screen bg-navy-900 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* User Agreement */}
          <section className="bg-navy-800 rounded-lg p-8">
            <button
              onClick={() => toggleSection('user')}
              className="w-full flex items-center justify-between text-2xl font-bold text-white mb-6"
            >
              <span>User Agreement</span>
              {expandedSection === 'user' ? (
                <ChevronUp className="w-6 h-6" />
              ) : (
                <ChevronDown className="w-6 h-6" />
              )}
            </button>
            
            {expandedSection === 'user' && (
              <div className="prose prose-invert max-w-none">
                <h3 className="text-white">1. Acceptance of Terms</h3>
                <p className="text-gray-400">
                  By accessing and using Ateker Music, you agree to be bound by these terms and conditions,
                  which are governed by the laws of Uganda. These terms constitute a legally binding agreement
                  between you and Ateker Music.
                </p>

                <h3 className="text-white">2. User Registration</h3>
                <p className="text-gray-400">
                  2.1. You must be at least 18 years old to create an account.<br />
                  2.2. You are responsible for maintaining the confidentiality of your account credentials.<br />
                  2.3. You agree to provide accurate and complete information during registration.<br />
                  2.4. Multiple accounts for the same user are not permitted.
                </p>

                <h3 className="text-white">3. Payment and Purchases</h3>
                <p className="text-gray-400">
                  3.1. All payments are processed in Uganda Shillings (UGX).<br />
                  3.2. Prices include all applicable taxes as per Ugandan law.<br />
                  3.3. Payments are processed through authorized mobile money providers (MTN, Airtel).<br />
                  3.4. All sales are final unless required otherwise by Ugandan consumer protection laws.
                </p>

                <h3 className="text-white">4. Content Usage Rights</h3>
                <p className="text-gray-400">
                  4.1. Purchased music is for personal, non-commercial use only.<br />
                  4.2. Redistribution or resale of downloaded content is strictly prohibited.<br />
                  4.3. You may not use the content for public performances without proper licensing.<br />
                  4.4. Content usage is subject to Uganda's Copyright and Neighbouring Rights Act, 2006.
                </p>

                <h3 className="text-white">5. User Conduct</h3>
                <p className="text-gray-400">
                  5.1. You agree not to use the platform for any illegal purposes.<br />
                  5.2. You will not attempt to circumvent any security measures.<br />
                  5.3. You will not engage in harassment or abusive behavior.<br />
                  5.4. Violations may result in account termination.
                </p>

                <h3 className="text-white">6. Privacy and Data Protection</h3>
                <p className="text-gray-400">
                  6.1. Your data is protected under the Data Protection and Privacy Act, 2019 of Uganda.<br />
                  6.2. We collect and process your data in accordance with our Privacy Policy.<br />
                  6.3. You have the right to access, correct, and delete your personal data.<br />
                  6.4. We implement appropriate security measures to protect your data.
                </p>

                <h3 className="text-white">7. Dispute Resolution</h3>
                <p className="text-gray-400">
                  7.1. Any disputes will be resolved under Ugandan law.<br />
                  7.2. Mediation will be attempted before legal proceedings.<br />
                  7.3. The courts of Uganda shall have exclusive jurisdiction.<br />
                  7.4. Small claims may be resolved through the Uganda Consumer Protection Framework.
                </p>
              </div>
            )}
          </section>

          {/* Artist Agreement */}
          <section className="bg-navy-800 rounded-lg p-8">
            <button
              onClick={() => toggleSection('artist')}
              className="w-full flex items-center justify-between text-2xl font-bold text-white mb-6"
            >
              <span>Artist Agreement</span>
              {expandedSection === 'artist' ? (
                <ChevronUp className="w-6 h-6" />
              ) : (
                <ChevronDown className="w-6 h-6" />
              )}
            </button>
            
            {expandedSection === 'artist' && (
              <div className="prose prose-invert max-w-none">
                <h3 className="text-white">1. Artist Eligibility</h3>
                <p className="text-gray-400">
                  1.1. Must be at least 18 years old or have legal guardian consent.<br />
                  1.2. Must provide valid National ID (NIN) for verification.<br />
                  1.3. Must have legal rights to distribute submitted content.<br />
                  1.4. Must be a resident of Uganda or have proper work permits.
                </p>

                <h3 className="text-white">2. Content Rights and Ownership</h3>
                <p className="text-gray-400">
                  2.1. You retain ownership of your original content.<br />
                  2.2. You grant Ateker Music a non-exclusive license to distribute your content.<br />
                  2.3. You warrant that your content doesn't infringe on third-party rights.<br />
                  2.4. Content is protected under the Copyright and Neighbouring Rights Act, 2006.
                </p>

                <h3 className="text-white">3. Revenue Sharing</h3>
                <p className="text-gray-400">
                  3.1. Artists receive 55% of net revenue from sales, while Ateker Music retains 45%.<br />
                  3.2. The revenue split applies to all monetization channels including:<br />
                    &nbsp;&nbsp;a) Direct song downloads<br />
                    &nbsp;&nbsp;b) Streaming revenue<br />
                    &nbsp;&nbsp;c) In-app purchases<br />
                    &nbsp;&nbsp;d) Promotional features<br />
                  3.3. Revenue distribution process:<br />
                    &nbsp;&nbsp;a) Calculated after deducting transaction fees and taxes<br />
                    &nbsp;&nbsp;b) Mobile money processing fees are shared proportionally<br />
                    &nbsp;&nbsp;c) VAT and other applicable taxes are deducted before split<br />
                  3.4. Payment terms:<br />
                    &nbsp;&nbsp;a) Monthly payments for balances exceeding 50,000 UGX<br />
                    &nbsp;&nbsp;b) Payments processed between 1st-5th of each month<br />
                    &nbsp;&nbsp;c) Via registered mobile money accounts only<br />
                    &nbsp;&nbsp;d) Artist must maintain valid payment information<br />
                  3.5. Revenue reporting:<br />
                    &nbsp;&nbsp;a) Real-time earnings visible in artist dashboard<br />
                    &nbsp;&nbsp;b) Monthly detailed revenue statements<br />
                    &nbsp;&nbsp;c) Annual tax documentation provided<br />
                  3.6. Revenue verification:<br />
                    &nbsp;&nbsp;a) Artists can audit revenue calculations<br />
                    &nbsp;&nbsp;b) Discrepancies must be reported within 30 days<br />
                    &nbsp;&nbsp;c) Platform maintains transparent transaction logs
                </p>

                <h3 className="text-white mt-6">4. Content Guidelines</h3>
                <p className="text-gray-400">
                  4.1. Technical requirements:<br />
                    &nbsp;&nbsp;a) Audio quality minimum: 320kbps MP3<br />
                    &nbsp;&nbsp;b) Cover art: 3000x3000px minimum resolution<br />
                    &nbsp;&nbsp;c) No audible artifacts or distortion<br />
                  4.2. Content standards:<br />
                    &nbsp;&nbsp;a) Must comply with Uganda Communications Commission guidelines<br />
                    &nbsp;&nbsp;b) Explicit content must be clearly labeled<br />
                    &nbsp;&nbsp;c) No hate speech or discriminatory content<br />
                  4.3. Metadata requirements:<br />
                    &nbsp;&nbsp;a) Accurate song title and artist information<br />
                    &nbsp;&nbsp;b) Proper genre classification<br />
                    &nbsp;&nbsp;c) Complete songwriter and producer credits
                </p>

                <h3 className="text-white mt-6">5. Artist Obligations</h3>
                <p className="text-gray-400">
                  5.1. Legal compliance:<br />
                    &nbsp;&nbsp;a) Register with Uganda Revenue Authority<br />
                    &nbsp;&nbsp;b) Maintain valid tax identification number<br />
                    &nbsp;&nbsp;c) Comply with music industry regulations<br />
                  5.2. Content responsibility:<br />
                    &nbsp;&nbsp;a) Obtain necessary licenses for covers/samples<br />
                    &nbsp;&nbsp;b) Respond to copyright claims within 48 hours<br />
                    &nbsp;&nbsp;c) Maintain proof of content ownership<br />
                  5.3. Account management:<br />
                    &nbsp;&nbsp;a) Keep profile information current<br />
                    &nbsp;&nbsp;b) Maintain active mobile money accounts<br />
                    &nbsp;&nbsp;c) Regular monitoring of revenue reports<br />
                  5.4. Prohibited activities:<br />
                    &nbsp;&nbsp;a) No artificial streaming/download manipulation<br />
                    &nbsp;&nbsp;b) No false marketing or misrepresentation<br />
                    &nbsp;&nbsp;c) No unauthorized use of third-party content
                </p>

                <h3 className="text-white mt-6">6. Platform Rights</h3>
                <p className="text-gray-400">
                  6.1. Content moderation:<br />
                    &nbsp;&nbsp;a) Remove content violating terms<br />
                    &nbsp;&nbsp;b) Suspend accounts for investigation<br />
                    &nbsp;&nbsp;c) Ban repeat offenders<br />
                  6.2. Service management:<br />
                    &nbsp;&nbsp;a) Modify features and functionality<br />
                    &nbsp;&nbsp;b) Set technical requirements<br />
                    &nbsp;&nbsp;c) Implement security measures<br />
                  6.3. Commercial rights:<br />
                    &nbsp;&nbsp;a) Use content for platform promotion<br />
                    &nbsp;&nbsp;b) Set pricing and payment terms<br />
                    &nbsp;&nbsp;c) Partner with third-party services
                </p>

                <h3 className="text-white mt-6">7. Termination</h3>
                <p className="text-gray-400">
                  7.1. Voluntary termination:<br />
                    &nbsp;&nbsp;a) 30 days written notice required<br />
                    &nbsp;&nbsp;b) Content remains live during notice period<br />
                    &nbsp;&nbsp;c) Final revenue calculation and payment<br />
                  7.2. Involuntary termination:<br />
                    &nbsp;&nbsp;a) Immediate for serious violations<br />
                    &nbsp;&nbsp;b) Content removed within 24 hours<br />
                    &nbsp;&nbsp;c) Revenue may be withheld for violations<br />
                  7.3. Post-termination:<br />
                    &nbsp;&nbsp;a) Content archived for legal purposes<br />
                    &nbsp;&nbsp;b) Final payment within 60 days<br />
                    &nbsp;&nbsp;c) Data retention as required by law
                </p>

                <h3 className="text-white mt-6">8. Dispute Resolution</h3>
                <p className="text-gray-400">
                  8.1. Resolution process:<br />
                    &nbsp;&nbsp;a) Direct negotiation first<br />
                    &nbsp;&nbsp;b) Mandatory mediation before litigation<br />
                    &nbsp;&nbsp;c) Final resolution in Ugandan courts<br />
                  8.2. Applicable law:<br />
                    &nbsp;&nbsp;a) Uganda Copyright and Neighbouring Rights Act<br />
                    &nbsp;&nbsp;b) Uganda Communications Act<br />
                    &nbsp;&nbsp;c) Electronic Transactions Act<br />
                  8.3. Jurisdiction:<br />
                    &nbsp;&nbsp;a) Courts in Kampala, Uganda<br />
                    &nbsp;&nbsp;b) Uganda Registration Services Bureau<br />
                    &nbsp;&nbsp;c) Uganda Communications Commission
                </p>
              </div>
            )}
          </section>

          {/* DMCA */}
          <section className="bg-navy-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6">DMCA Policy</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-400">
                Ateker Music respects the intellectual property rights of others and expects its users to do the same. In accordance with the Digital Millennium Copyright Act (DMCA), we will respond expeditiously to claims of copyright infringement that are reported to our designated copyright agent.
              </p>
              <h3 className="text-white mt-4 mb-2">If you are a copyright owner, or authorized on behalf of one, please report alleged copyright infringements by:</h3>
              <ul className="list-disc pl-6 text-gray-400 space-y-2">
                <li>Identifying the copyrighted work that you claim has been infringed</li>
                <li>Identifying the material that you claim is infringing and needs to be removed</li>
                <li>Providing your contact information</li>
                <li>Providing a statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law</li>
              </ul>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="bg-navy-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Disclaimer</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-400">
                The content on Ateker Music is provided by individual artists and users. We do not claim ownership of any music or content uploaded to our platform. Each artist is responsible for ensuring they have the necessary rights to distribute their music.
              </p>
              <p className="text-gray-400 mt-4">
                While we strive to maintain the security and integrity of our platform, we are not responsible for:
              </p>
              <ul className="list-disc pl-6 text-gray-400 space-y-2">
                <li>Content uploaded by users</li>
                <li>Any unauthorized use of copyrighted material</li>
                <li>Any data breaches beyond our control</li>
                <li>Technical issues or service interruptions</li>
              </ul>
            </div>
          </section>

          {/* Rules and Regulations */}
          <section className="bg-navy-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Rules and Regulations</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-400">
                To maintain a safe and respectful environment, all users must adhere to the following rules:
              </p>
              <ul className="list-disc pl-6 text-gray-400 space-y-2">
                <li>Only upload content that you have the rights to distribute</li>
                <li>Respect other users and their intellectual property</li>
                <li>Do not engage in harassment or abusive behavior</li>
                <li>Do not share explicit or inappropriate content</li>
                <li>Do not attempt to manipulate play counts or statistics</li>
              </ul>
              <p className="text-gray-400 mt-4">
                Violation of these rules may result in account suspension or termination.
              </p>
            </div>
          </section>

          {/* Terms and Conditions */}
          <section className="bg-navy-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Terms and Conditions</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-400">
                By using Ateker Music, you agree to the following terms:
              </p>
              <ul className="list-disc pl-6 text-gray-400 space-y-2">
                <li>You are responsible for all content you upload</li>
                <li>We reserve the right to remove content or suspend accounts that violate our policies</li>
                <li>We may modify or discontinue services at any time</li>
                <li>You use the platform at your own risk</li>
                <li>We are not liable for any damages or losses resulting from your use of the platform</li>
              </ul>
              <h3 className="text-white mt-6 mb-2">Privacy and Data</h3>
              <p className="text-gray-400">
                While we implement security measures to protect user data, we cannot guarantee absolute security. Users should:
              </p>
              <ul className="list-disc pl-6 text-gray-400 space-y-2">
                <li>Keep their login credentials secure</li>
                <li>Not share sensitive information publicly</li>
                <li>Report any security concerns immediately</li>
              </ul>
              <p className="text-gray-400 mt-4">
                We reserve the right to update these terms at any time. Continued use of the platform constitutes acceptance of any changes.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}