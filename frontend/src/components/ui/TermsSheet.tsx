"use client";

import React, { useState } from "react";
import { ScrollText, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "./sheet";

type AccountType = "advertiser" | "publisher";

interface TermsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountType: AccountType;
}

// Advertiser Terms Content
const advertiserTerms = {
  title: "Advertiser Terms and Conditions",
  lastUpdated: "December 31, 2025",
  sections: [
    {
      title: "1. Acceptance of Terms",
      content: `By registering as an advertiser on Link6ync ("Platform"), you agree to be bound by these Advertiser Terms and Conditions ("Terms"). If you do not agree to these Terms, you may not use the Platform. Link6ync reserves the right to modify these Terms at any time, and continued use of the Platform constitutes acceptance of any modifications.`,
    },
    {
      title: "2. Definitions",
      content: `• "Advertiser" refers to any individual or entity that creates campaigns and pays for traffic through the Platform.
• "Campaign" refers to advertising content, links, videos, or other promotional materials submitted by the Advertiser.
• "Click" refers to a valid user interaction with an Advertiser's Campaign.
• "Publisher" refers to individuals or entities who drive traffic to Advertiser Campaigns.
• "Premium Traffic" refers to genuine, high-quality user engagement from real users.`,
    },
    {
      title: "3. Account Registration and Security",
      content: `• Advertisers must provide accurate, current, and complete information during registration.
• Advertisers are responsible for maintaining the confidentiality of their account credentials.
• Advertisers must be at least 18 years old or the age of majority in their jurisdiction.
• One person or entity may only maintain one Advertiser account unless explicitly authorized by Link6ync.
• Link6ync reserves the right to suspend or terminate accounts that violate these Terms.`,
    },
    {
      title: "4. Advertiser Responsibilities",
      content: `• Advertisers must ensure all Campaign content complies with applicable laws and regulations.
• Advertisers are solely responsible for the content, accuracy, and legality of their Campaigns.
• Advertisers must not engage in fraudulent, deceptive, or misleading advertising practices.
• Advertisers must respect intellectual property rights and obtain necessary permissions for all content used.`,
    },
    {
      title: "5. Prohibited Content",
      content: `Advertisers may not promote or link to content that:
• Is illegal, harmful, threatening, abusive, harassing, defamatory, or obscene
• Promotes violence, discrimination, or hatred against individuals or groups
• Contains malware, viruses, or other harmful computer code
• Infringes on intellectual property rights or privacy rights
• Promotes illegal drugs, weapons, or other prohibited substances
• Contains adult content or sexually explicit material (unless in designated categories)
• Promotes gambling in prohibited jurisdictions
• Contains pyramid schemes, MLM, or get-rich-quick schemes
• Promotes phishing, hacking, or cybercrime activities`,
    },
    {
      title: "6. Payment and Pricing",
      content: `• Advertisers agree to pay for Clicks delivered to their Campaigns based on the pricing model selected.
• Link6ync uses a pay-per-click (PPC) model where Advertisers are charged for each valid Click.
• Minimum deposit amounts and payment methods are specified on the Platform.
• All prices are in USD unless otherwise specified.
• Link6ync reserves the right to adjust pricing with 30 days' notice.
• Refunds are provided only in cases of proven invalid traffic as determined by Link6ync.`,
    },
    {
      title: "7. Traffic Quality and Fraud Prevention",
      content: `• Link6ync implements advanced fraud detection systems to ensure Premium Traffic quality.
• Invalid Clicks include bot traffic, incentivized clicks, click farms, duplicate clicks, and malware-generated clicks.
• Advertisers will not be charged for Clicks determined to be invalid by Link6ync's systems.
• Traffic quality reports are available in the Advertiser dashboard.`,
    },
    {
      title: "8. Campaign Management",
      content: `• Advertisers can create, modify, pause, or delete Campaigns at any time through the Platform.
• Campaign approval is required before traffic delivery begins (typically within 24-48 hours).
• Link6ync reserves the right to reject or remove Campaigns that violate these Terms.
• Advertisers can set daily budgets, total budgets, and targeting parameters for Campaigns.`,
    },
    {
      title: "9. Data Protection and Privacy",
      content: `• Link6ync collects and processes data in accordance with its Privacy Policy.
• Advertisers must comply with applicable data protection laws (GDPR, CCPA, etc.).
• Advertisers are responsible for obtaining necessary consents for data collection on their destination sites.
• Link6ync does not share personally identifiable information of Publishers with Advertisers.`,
    },
    {
      title: "10. Limitation of Liability",
      content: `• Link6ync provides the Platform "as is" without warranties of any kind.
• Link6ync is not liable for lost profits, indirect damages, or service interruptions.
• Link6ync's total liability shall not exceed the amount paid by the Advertiser in the 3 months preceding the claim.`,
    },
    {
      title: "11. Contact Information",
      content: `For questions about these Terms, contact:
Link6ync Support
Email: advertisers@link6ync.com
Website: https://link6ync.app`,
    },
  ],
};

// Publisher Terms Content
const publisherTerms = {
  title: "Publisher Terms and Conditions",
  lastUpdated: "December 31, 2025",
  sections: [
    {
      title: "1. Acceptance of Terms",
      content: `By registering as a publisher on Link6ync ("Platform"), you agree to be bound by these Publisher Terms and Conditions ("Terms"). If you do not agree to these Terms, you may not use the Platform. Link6ync reserves the right to modify these Terms at any time, and continued use of the Platform constitutes acceptance of any modifications.`,
    },
    {
      title: "2. Definitions",
      content: `• "Publisher" refers to any individual or entity that drives traffic to Advertiser Campaigns through the Platform.
• "Advertiser" refers to individuals or entities who create and pay for Campaigns.
• "Campaign" refers to advertising content, links, videos, or other promotional materials from Advertisers.
• "Click" refers to a valid user interaction with a Campaign generated by the Publisher's traffic.
• "Premium Traffic" refers to genuine, high-quality user engagement from real users.
• "Earnings" refers to revenue generated by Publishers for delivering valid Clicks.`,
    },
    {
      title: "3. Account Registration and Security",
      content: `• Publishers must provide accurate, current, and complete information during registration.
• Publishers are responsible for maintaining the confidentiality of their account credentials.
• Publishers must be at least 18 years old or the age of majority in their jurisdiction.
• One person or entity may only maintain one Publisher account unless explicitly authorized.
• Publishers must provide valid payment information for receiving Earnings.`,
    },
    {
      title: "4. Publisher Responsibilities",
      content: `• Publishers must generate traffic through legitimate, ethical means only.
• Publishers are responsible for ensuring their traffic sources comply with all applicable laws.
• Publishers must disclose their relationship with Link6ync where legally required.
• Publishers must maintain the quality and authenticity of their traffic sources.
• Publishers must not misrepresent the nature of Campaigns to their audience.`,
    },
    {
      title: "5. Prohibited Traffic Generation Methods",
      content: `Publishers shall NOT use any of the following methods to generate Clicks:
• Automated bots, scripts, or software to generate Clicks
• Click farms or paid-to-click services
• Incentivized clicking (offering rewards for clicking)
• Pop-ups, pop-unders, or auto-redirects without user consent
• Malware, adware, or spyware distribution
• Email spam or unsolicited bulk messages
• Self-clicking or clicking by Publisher, friends, or family
• Proxy traffic or VPN manipulation to falsify geographic location
• Traffic exchanges or reciprocal clicking arrangements`,
    },
    {
      title: "6. Quality Standards and Traffic Validation",
      content: `• Link6ync maintains strict quality standards to ensure Premium Traffic.
• All Clicks are subject to automated and manual fraud detection systems.
• Invalid Clicks will not be credited to Publisher Earnings.
• Publishers must maintain a minimum traffic quality score to remain active on the Platform.`,
    },
    {
      title: "7. Earnings and Payment",
      content: `• Publishers earn revenue for each valid Click delivered to Advertiser Campaigns.
• Earnings rates vary based on Campaign, geographic location, traffic quality, and market demand.
• Minimum payout threshold is $10 USD (or equivalent in other currencies).
• Payment processing time is 30 days from the end of the month in which Earnings were generated.
• Payment methods: PayPal, Bank wire transfer (minimum $100), Cryptocurrency (where available).
• Publishers are responsible for any taxes on their Earnings.`,
    },
    {
      title: "8. Traffic Sources and Transparency",
      content: `• Publishers must accurately describe their traffic sources during registration.
• Acceptable traffic sources include: owned websites, social media accounts, email lists (opt-in), mobile applications, YouTube channels, blog posts, and paid advertising.
• Link6ync reserves the right to verify traffic sources and request additional information.`,
    },
    {
      title: "9. Account Suspension and Termination",
      content: `Link6ync may suspend or terminate Publisher accounts immediately for:
• Fraudulent traffic generation
• Violation of prohibited traffic methods
• Consistent delivery of invalid Clicks
• Providing false information
• Attempting to manipulate the Platform or tracking systems

Upon termination for fraud: all pending Earnings are forfeited, and the Publisher is permanently banned.`,
    },
    {
      title: "10. Data Protection and Privacy",
      content: `• Link6ync collects and processes Publisher data in accordance with its Privacy Policy.
• Publishers must comply with applicable data protection laws (GDPR, CCPA, etc.).
• Publishers are responsible for obtaining necessary consents from their audience.
• Publishers must implement appropriate privacy policies on their websites/apps.`,
    },
    {
      title: "11. Limitation of Liability",
      content: `• Link6ync provides the Platform "as is" without warranties of any kind.
• Link6ync is not liable for lost Earnings, payment delays, or service interruptions.
• Link6ync's total liability shall not exceed the amount owed to the Publisher in the 3 months preceding the claim.`,
    },
    {
      title: "12. Contact Information",
      content: `For questions about these Terms, contact:
Link6ync Support
Email: publishers@link6ync.com
Website: https://link6ync.app`,
    },
  ],
};

const TermsSheet: React.FC<TermsSheetProps> = ({ open, onOpenChange, accountType }) => {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));
  const terms = accountType === "advertiser" ? advertiserTerms : publisherTerms;

  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  const expandAll = () => {
    setExpandedSections(new Set(terms.sections.map((_, i) => i)));
  };

  const collapseAll = () => {
    setExpandedSections(new Set());
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg md:max-w-xl overflow-hidden flex flex-col bg-white">
        <SheetHeader className="border-b border-gray-200 pb-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <ScrollText className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <SheetTitle className="text-lg font-bold text-gray-900">{terms.title}</SheetTitle>
              <SheetDescription className="text-sm text-gray-500">Last updated: {terms.lastUpdated}</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Action buttons */}
        <div className="flex items-center justify-between py-3 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{terms.sections.length} sections</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={expandAll}
              className="text-xs text-primary-600 hover:text-primary-700 font-medium px-2 py-1 rounded hover:bg-primary-50 transition-colors"
            >
              Expand all
            </button>
            <button
              onClick={collapseAll}
              className="text-xs text-gray-500 hover:text-gray-700 font-medium px-2 py-1 rounded hover:bg-gray-100 transition-colors"
            >
              Collapse all
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto py-4 -mx-6 px-6">
          <div className="space-y-2">
            {terms.sections.map((section, index) => (
              <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection(index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 text-sm">{section.title}</span>
                  {expandedSections.has(index) ? (
                    <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {expandedSections.has(index) && (
                  <div className="px-4 pb-4 pt-0">
                    <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line border-t border-gray-100 pt-3">
                      {section.content}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-6 p-4 bg-primary-50 rounded-xl border border-dashed border-primary-100">
            <p className="text-xs text-primary-700 leading-relaxed">
              By using the Link6ync Platform as {accountType === "advertiser" ? "an Advertiser" : "a Publisher"}, you
              acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
            </p>
          </div>

          {/* Copyright */}
          <p className="text-center text-xs text-gray-400 mt-4">© 2025 Link6ync. All rights reserved.</p>
        </div>

        {/* Fixed footer with close button */}
        <div className="border-t border-gray-200 pt-4 flex-shrink-0">
          <SheetClose asChild>
            <button className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors">
              I Understand
            </button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TermsSheet;
