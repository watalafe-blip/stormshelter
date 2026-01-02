import { Link } from 'wouter';
import Layout from '@/components/layout/Layout';

export default function Terms() {
  return (
    <Layout>
      <div className="bg-white" data-testid="terms-page">
        <section className="pt-24 pb-12 md:pt-28 md:pb-16">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <p className="text-[#E69138] font-medium text-sm tracking-wide uppercase mb-3">Legal</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#3E2723] leading-tight tracking-tight mb-4">
              Terms and Conditions
            </h1>
          </div>
        </section>

        <section className="pb-24">
          <div className="max-w-3xl mx-auto px-6">
            <div className="prose prose-lg prose-stone max-w-none">
              
              <p className="text-lg text-stone-600 leading-relaxed mb-8">
                Welcome to Home Defend Pro ("Home Defend Pro," "we," "us," "our"). By accessing or using 
                our website, you agree to be bound by these Terms and Conditions ("Terms"). Please read them carefully.
              </p>

              <p className="text-lg text-stone-600 leading-relaxed mb-8 font-medium">
                If you do not agree to these Terms, do not use our website.
              </p>

              <h2 className="text-2xl font-bold text-[#3E2723] mt-12 mb-4">1) Site Conditions, Property Damage, and Customer Responsibilities</h2>
              <p className="text-lg text-stone-600 leading-relaxed mb-4">
                Home Defend Pro may provide storm shelter products and may coordinate third-party 
                transportation/shipping. We do not provide installation services through this website 
                unless expressly stated in a separate written agreement.
              </p>
              <p className="text-lg text-stone-600 leading-relaxed mb-4">
                You understand and agree that delivery and placement of heavy items may involve risk of 
                damage to property. To the maximum extent permitted by law, Home Defend Pro is not 
                responsible for damage to property arising from or related to:
              </p>
              <ul className="list-disc pl-6 text-lg text-stone-600 space-y-2 mb-6">
                <li>access limitations (narrow driveways, soft ground, slopes, low clearances, etc.);</li>
                <li>underground or hidden conditions (utilities, cables, pipes, sprinkler lines, septic, wells, drainage components, etc.) not disclosed or not properly marked;</li>
                <li>the actions or omissions of any third-party carrier, driver, rigging crew, equipment operator, or any person not under our direct control;</li>
                <li>Customer's failure to provide safe access and appropriate equipment for unloading/handling.</li>
              </ul>
              <p className="text-lg text-stone-600 leading-relaxed mb-4">Customer is responsible for:</p>
              <ul className="list-disc pl-6 text-lg text-stone-600 space-y-2 mb-6">
                <li>ensuring safe and legal access to the delivery location;</li>
                <li>confirming that underground utilities are located/marked where applicable (e.g., calling 811 or the appropriate local service);</li>
                <li>providing any required equipment and labor for unloading/handling unless otherwise agreed in writing.</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#3E2723] mt-12 mb-4">2) Use of Our Website</h2>
              <p className="text-lg text-stone-600 leading-relaxed mb-4">
                You may use our website for lawful purposes only. You agree not to:
              </p>
              <ul className="list-disc pl-6 text-lg text-stone-600 space-y-2 mb-6">
                <li>introduce viruses, malware, or harmful code;</li>
                <li>attempt unauthorized access to our systems;</li>
                <li>interfere with the security or operation of the website.</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#3E2723] mt-12 mb-4">3) Intellectual Property</h2>
              <p className="text-lg text-stone-600 leading-relaxed">
                All content on this website (text, graphics, logos, images, videos, designs, and software) 
                is owned by Home Defend Pro or our licensors and is protected by applicable intellectual 
                property laws. You may not copy, reproduce, distribute, modify, create derivative works, 
                or exploit site content without our prior written consent.
              </p>

              <h2 className="text-2xl font-bold text-[#3E2723] mt-12 mb-4">4) Disclaimers</h2>
              <p className="text-lg text-stone-600 leading-relaxed">
                Information on this website is provided for general informational purposes only. We make 
                no warranties, express or implied, regarding the accuracy, completeness, reliability, or 
                suitability of the website content. Your use of the website is at your own risk.
              </p>

              <h2 className="text-2xl font-bold text-[#3E2723] mt-12 mb-4">5) Limitation of Liability</h2>
              <p className="text-lg text-stone-600 leading-relaxed mb-4">
                To the maximum extent permitted by law, Home Defend Pro will not be liable for any indirect, 
                incidental, special, consequential, exemplary, or punitive damages arising out of or related 
                to your use of (or inability to use) the website.
              </p>
              <p className="text-lg text-stone-600 leading-relaxed">
                To the extent permitted by law, Home Defend Pro's total liability for any claim arising from 
                the website will not exceed the amount you paid us for the specific transaction giving rise 
                to the claim (if any).
              </p>

              <h2 className="text-2xl font-bold text-[#3E2723] mt-12 mb-4">6) Third-Party Links</h2>
              <p className="text-lg text-stone-600 leading-relaxed">
                Our website may contain links to third-party websites. We do not control and are not 
                responsible for the content, terms, or privacy practices of third-party sites. Access them 
                at your own risk.
              </p>

              <h2 className="text-2xl font-bold text-[#3E2723] mt-12 mb-4">7) Changes to These Terms</h2>
              <p className="text-lg text-stone-600 leading-relaxed">
                We may update these Terms at any time. Changes are effective immediately upon posting. 
                Your continued use of the website after changes are posted constitutes acceptance of the 
                updated Terms.
              </p>

              <h2 className="text-2xl font-bold text-[#3E2723] mt-12 mb-4">8) Governing Law and Venue</h2>
              <p className="text-lg text-stone-600 leading-relaxed">
                These Terms are governed by the laws of the State of Wyoming, without regard to conflict-of-law 
                principles. Any dispute arising out of or relating to these Terms will be brought in the state 
                or federal courts located in Natrona County, Wyoming, and you consent to jurisdiction and venue 
                in those courts.
              </p>

              <h2 className="text-2xl font-bold text-[#3E2723] mt-12 mb-4">9) Quotes and Pricing</h2>
              <p className="text-lg text-stone-600 leading-relaxed mb-4">
                Quotes provided via website chat, email, phone, SMS/text, or social media are valid for 
                <strong className="text-[#3E2723]"> 15 days</strong> from the date issued, unless stated otherwise in writing.
              </p>
              <p className="text-lg text-stone-600 leading-relaxed">
                Prices and availability may change without notice. Unless explicitly stated in writing, quotes 
                do not include third-party fees such as permitting, inspections, site preparation, equipment 
                rental, unloading/rigging labor, storage, detention/wait time, or re-delivery charges.
              </p>

              <h2 className="text-2xl font-bold text-[#3E2723] mt-12 mb-4">10) Payment Methods and Processing Fees</h2>
              <p className="text-lg text-stone-600 leading-relaxed">
                If you pay by credit card or another payment method that incurs processing fees, you may be 
                charged an additional fee (for example, 3%) where permitted by law and disclosed at checkout. 
                If a "cash price" and a "card price" are presented, the posted website pricing may reflect the cash price.
              </p>

              <h2 className="text-2xl font-bold text-[#3E2723] mt-12 mb-4">11) Refunds and Cancellations</h2>
              <p className="text-lg text-stone-600 leading-relaxed">
                All deposits and payments are subject to our{' '}
                <Link href="/returns" className="text-[#E69138] hover:underline">
                  Refund & Cancellation Policy
                </Link>, which is incorporated by reference into these Terms. Please review that policy before 
                submitting a deposit or payment.
              </p>

              <h2 className="text-2xl font-bold text-[#3E2723] mt-12 mb-4">12) Delays Outside Our Control</h2>
              <p className="text-lg text-stone-600 leading-relaxed">
                We are not responsible for delays caused by events outside our reasonable control, including 
                weather, supplier delays, carrier delays, road closures, government actions, or similar circumstances.
              </p>

              <h2 className="text-2xl font-bold text-[#3E2723] mt-12 mb-4">13) Communications</h2>
              <p className="text-lg text-stone-600 leading-relaxed">
                By providing your contact information, you consent to receive communications from Home Defend Pro 
                regarding your inquiry, order, or project via email, phone, and/or SMS. You may opt out of 
                non-essential marketing messages; operational communications may still be sent as needed.
              </p>

              <h2 className="text-2xl font-bold text-[#3E2723] mt-12 mb-4">14) Entire Agreement</h2>
              <p className="text-lg text-stone-600 leading-relaxed">
                These Terms, together with any policies expressly referenced (including the{' '}
                <Link href="/returns" className="text-[#E69138] hover:underline">
                  Refund & Cancellation Policy
                </Link>{' '}and{' '}
                <Link href="/privacy" className="text-[#E69138] hover:underline">
                  Privacy Policy
                </Link>), constitute the entire agreement between you and Home Defend Pro regarding use of the 
                website and supersede prior or contemporaneous communications on that subject. Any separate 
                written agreement signed for a specific project will govern that project's terms.
              </p>

              <div className="bg-stone-50 rounded-2xl p-8 mt-12">
                <h2 className="text-2xl font-bold text-[#3E2723] mb-4">Contact Information</h2>
                <p className="text-lg text-stone-600 leading-relaxed">
                  <strong className="text-[#3E2723]">Home Defend Pro</strong><br />
                  312 W 2nd St, Unit #A1936<br />
                  Casper, WY 82601<br />
                  Email: <a href="mailto:info@homedefendpro.com" className="text-[#E69138] hover:underline">info@homedefendpro.com</a><br />
                  Phone: <a href="tel:+18339061077" className="text-[#E69138] hover:underline">(833) 906-1077</a>
                </p>
              </div>

            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
