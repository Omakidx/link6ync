"use client";

import React from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { ArrowRight } from "lucide-react";

const helpTopics = [
  {
    title: "Account Setup",
    description: "Learn how to get started",
    icon: "/assets/account-icon.svg",
    href: "/dashboard/help/account",
  },
  {
    title: "Managing Campaign",
    description: "Optimize your ad campaign",
    icon: "/assets/managing-campign-icon.svg",
    href: "/dashboard/help/campaigns",
  },
  {
    title: "Billing & Payments",
    description: "Understand your invoices",
    icon: "/assets/help-payment.svg",
    href: "/dashboard/help/billing",
  },
  {
    title: "Integration",
    description: "Connect with older tools",
    icon: "/assets/integration-icon.svg",
    href: "/dashboard/help/integration",
  },
  {
    title: "Analytics",
    description: "Track and analyze your data",
    icon: "/assets/analytic-icon.svg",
    href: "/dashboard/help/analytics",
  },
  {
    title: "Security & Privacy",
    description: "Keep your account secure",
    icon: "/assets/security-icon.svg",
    href: "/dashboard/help/security",
  },
  {
    title: "Technical Support",
    description: "Fix technical issue.",
    icon: "/assets/technical-icon.svg",
    href: "/dashboard/help/technical",
  },
  {
    title: "Contact Support",
    description: "Reach out to our team",
    icon: "/assets/support-icon.svg",
    href: "/dashboard/help/contact",
  },
];

export default function HelpPage() {
  return (
    <div className="p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Help & Support</h1>
        <p className="text-gray-500 text-lg">How can we assist you today?</p>
      </div>

      {/* Search Bar */}
      <div className="w-full max-w-[892px] mb-12">
        <div className="relative flex items-center">
          <Input
            type="text"
            placeholder="Search for answers"
            className="w-full pl-12 pr-32 h-[66px] text-lg rounded-[8px] border-gray-200 shadow-sm"
            leftIcon={<Search className="w-5 h-5 text-gray-400" />}
          />
          <div className="absolute right-3">
            <Button className="bg-[#003DB8] hover:bg-[#002f8a] text-white rounded-[8px] px-8 h-10 font-medium">
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Popular Topics */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Popular Topics</h2>
        <div className="flex flex-wrap gap-6">
          {helpTopics.map((topic, index) => (
            <Link key={index} href={topic.href} className="group block">
              <Card className="w-[325px] h-[171px] border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl group-hover:border-primary/20 flex flex-col justify-between">
                <CardHeader className="p-6 h-full flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="bg-purple-50 p-2.5 rounded-lg w-12 h-12 flex items-center justify-center shrink-0">
                        <Image
                          src={topic.icon}
                          alt={topic.title}
                          width={24}
                          height={24}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <CardTitle className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors">
                          {topic.title}
                        </CardTitle>
                        <CardDescription className="text-gray-500 text-sm line-clamp-2">
                          {topic.description}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-auto">
                     <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors transform group-hover:translate-x-1" />
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
