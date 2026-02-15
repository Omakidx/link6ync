"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

/* ──────────────────────────────────────────────
   Documentation sections – scalable: just add
   a new object to grow the page.
   ────────────────────────────────────────────── */
const docSections = [
  {
    id: "account",
    icon: "/assets/account-icon.svg",
    title: "Account Setup",
    content: [
      {
        heading: "Creating Your Account",
        body: "Sign up using your email address or social login. After verifying your email you can complete your profile and choose an account type (Advertiser or Publisher).",
      },
      {
        heading: "Profile Configuration",
        body: "Navigate to Dashboard → Profile to update your display name, avatar, phone number, and other personal details. Changes are saved automatically.",
      },
      {
        heading: "Two-Factor Authentication",
        body: "Enable 2FA in Dashboard → Settings → Security for an extra layer of protection. You can use an authenticator app or SMS-based verification.",
      },
    ],
  },
  {
    id: "campaigns",
    icon: "/assets/managing-campign-icon.svg",
    title: "Managing Campaigns",
    content: [
      {
        heading: "Creating a Campaign",
        body: "Go to Dashboard → Campaign and click 'New Campaign'. Fill in the campaign name, budget, target audience, and creative assets, then submit for review.",
      },
      {
        heading: "Editing & Pausing",
        body: "Open any active campaign to edit its budget, schedule, or targeting. Use the pause toggle to temporarily halt delivery without losing your settings.",
      },
      {
        heading: "Performance Monitoring",
        body: "Track impressions, clicks, and conversions in real-time from the campaign detail view. Export reports as CSV for offline analysis.",
      },
    ],
  },
  {
    id: "billing",
    icon: "/assets/help-payment.svg",
    title: "Billing & Payments",
    content: [
      {
        heading: "Payment Methods",
        body: "Link6ync supports Visa, Mastercard, and bank transfers. Add or manage payment methods in Dashboard → Settings → Payment Methods.",
      },
      {
        heading: "Invoices & Receipts",
        body: "Invoices are generated automatically at the end of each billing cycle. Download them from Dashboard → Settings → Billing History.",
      },
      {
        heading: "Refund Policy",
        body: "Unused prepaid balances can be refunded within 30 days of purchase. Contact support for assistance with refund requests.",
      },
    ],
  },
  {
    id: "integration",
    icon: "/assets/integration-icon.svg",
    title: "Integration",
    content: [
      {
        heading: "API Access",
        body: "Generate API keys in Dashboard → Settings → Integrations. Our RESTful API lets you manage campaigns, pull analytics data, and automate workflows.",
      },
      {
        heading: "Third-Party Tools",
        body: "Connect Google Analytics, Facebook Pixel, and other tracking platforms by pasting your tracking IDs into the integration settings panel.",
      },
      {
        heading: "Webhooks",
        body: "Set up webhook endpoints to receive real-time event notifications for campaign status changes, conversions, and billing events.",
      },
    ],
  },
  {
    id: "analytics",
    icon: "/assets/analytic-icon.svg",
    title: "Analytics",
    content: [
      {
        heading: "Dashboard Overview",
        body: "The Analytics dashboard provides a bird's-eye view of impressions, clicks, CTR, and revenue. Use the date range picker to compare different periods.",
      },
      {
        heading: "Custom Reports",
        body: "Build custom reports by selecting dimensions (geo, device, campaign) and metrics. Save report templates for quick access later.",
      },
      {
        heading: "Data Export",
        body: "Export any report as CSV or PDF. Scheduled exports can be configured to send reports to your email on a daily, weekly, or monthly basis.",
      },
    ],
  },
  {
    id: "security",
    icon: "/assets/security-icon.svg",
    title: "Security & Privacy",
    content: [
      {
        heading: "Password Management",
        body: "Use a strong, unique password with at least 8 characters. You can update your password anytime from Dashboard → Settings → Security.",
      },
      {
        heading: "Session Management",
        body: "View all active sessions and revoke access for any device you don't recognize. Sessions automatically expire after 30 days of inactivity.",
      },
      {
        heading: "Data Privacy",
        body: "Link6ync complies with GDPR and CCPA. You can request a full data export or account deletion from Settings → Privacy.",
      },
    ],
  },
  {
    id: "technical",
    icon: "/assets/technical-icon.svg",
    title: "Technical Support",
    content: [
      {
        heading: "Troubleshooting Common Issues",
        body: "Clear your browser cache and cookies if you experience loading issues. Ensure you're using a supported browser (Chrome, Firefox, Safari, or Edge).",
      },
      {
        heading: "Error Codes",
        body: "Check the error code reference below for common API and dashboard errors. If the issue persists, include the error code when contacting support.",
      },
      {
        heading: "System Status",
        body: "Visit our status page for real-time platform health updates and scheduled maintenance windows.",
      },
    ],
  },
  {
    id: "contact",
    icon: "/assets/help-contact-icon.svg",
    title: "Contact Support",
    content: [
      {
        heading: "Live Chat",
        body: "Our support team is available via live chat Monday–Friday, 9 AM–6 PM (UTC). Click the chat icon in the bottom-right corner to start a conversation.",
      },
      {
        heading: "Email Support",
        body: "Send detailed inquiries to support@link6ync.com. We aim to respond within 24 hours on business days.",
      },
      {
        heading: "Community Forum",
        body: "Join the Link6ync community forum to ask questions, share tips, and connect with other advertisers and publishers.",
      },
    ],
  },
];

/* ──────────────────────────────────────────────
   Sidebar table-of-contents navigation
   ────────────────────────────────────────────── */
function DocsSidebar({ activeId }: { activeId: string }) {
  return (
    <nav className="hidden lg:block w-56 shrink-0 sticky top-8 self-start">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">On this page</p>
      <ul className="space-y-1">
        {docSections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={`block text-sm px-3 py-1.5 rounded-md transition-colors ${
                activeId === s.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {s.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ──────────────────────────────────────────────
   Main Docs Page
   ────────────────────────────────────────────── */
export default function DocsPage() {
  const searchParams = useSearchParams();
  const sectionParam = searchParams.get("section");

  const [activeId, setActiveId] = React.useState(sectionParam || docSections[0].id);

  /* Scroll to the requested section on mount */
  useEffect(() => {
    if (sectionParam) {
      const el = document.getElementById(sectionParam);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [sectionParam]);

  /* Intersection observer to highlight active sidebar link */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );

    docSections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* Back link */}
      <Link
        href="/dashboard/help"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Help
      </Link>

      {/* Page header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Documentation</h1>
        <p className="text-gray-500 text-lg">Everything you need to know about using Link6ync.</p>
      </div>

      {/* Content + sidebar */}
      <div className="flex gap-10">
        {/* Sections */}
        <div className="flex-1 min-w-0 space-y-14">
          {docSections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              {/* Section heading */}
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-50 p-2.5 rounded-lg w-11 h-11 flex items-center justify-center shrink-0">
                  <Image src={section.icon} alt={section.title} width={22} height={22} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
              </div>

              {/* Sub-articles */}
              <div className="space-y-6 pl-0 sm:pl-14">
                {section.content.map((article, idx) => (
                  <article key={idx}>
                    <h3 className="text-base font-semibold text-gray-800 mb-1">{article.heading}</h3>
                    <p className="text-sm leading-relaxed text-gray-600">{article.body}</p>
                  </article>
                ))}
              </div>

              {/* Divider */}
              <hr className="mt-10 border-gray-100" />
            </section>
          ))}
        </div>

        {/* Sidebar TOC */}
        <DocsSidebar activeId={activeId} />
      </div>

      {/* Footer CTA */}
      <div className="mt-16 rounded-xl bg-gray-50 border border-gray-100 p-8 text-center">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Still need help?</h3>
        <p className="text-gray-500 mb-4 text-sm">Our support team is happy to assist you with any questions.</p>
        <Link
          href="/dashboard/help"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          Contact Support <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
