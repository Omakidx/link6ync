import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { IoIosArrowDown } from "react-icons/io";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white z-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between py-5">
            <div className="flex items-center gap-2">
              <Image src="/logo.svg" alt="Link6ync" width={26} height={32} />
              <span className="text-xl font-bold text-gray-900">Link6ync</span>
            </div>
            <div className="hidden md:flex items-center gap-14">
              <Link href="#advertisers" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Advertisers
                <IoIosArrowDown className="inline-block ml-2" />
              </Link>
              <Link href="#publishers" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Publishers
                <IoIosArrowDown className="inline-block ml-2" />
              </Link>
              <Link href="#works" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                How it works
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/account-type"
                className="inline-flex items-center px-4 py-2 text-white rounded-lg font-medium transition-colors"
                style={{ backgroundColor: "#003DB8" }}
              >
                Sign Up
              </Link>
              <Link
                href="/login"
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors px-4 py-2 rounded-lg border"
                style={{ borderColor: "#808080" }}
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-5 leading-tight">
                Drive Premium <span style={{ color: "#003DB8" }}>Traffic</span>. Maximize Your <span style={{ color: "#003DB8" }}>Revenue</span>.
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Access high-quality traffic and top paying partners to grow your web presence and revenue effortlessly.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link
                  href="/account-type"
                  className="inline-flex items-center px-8 py-3.5 text-white rounded-lg font-semibold transition-colors shadow-lg"
                  style={{ backgroundColor: "#003DB8" }}
                >
                  Get Started
                </Link>
                <Link
                  href="#works"
                  className="inline-flex items-center px-8 py-3.5 bg-white text-gray-900 rounded-lg font-semibold border-2 border-[#808080] hover:border-[#808080] transition-colors"
                >
                  How It Works
                </Link>
              </div>
            </div>

            {/* Right Column - Illustration */}
            <div className="relative">
              <div className="relative w-full h-auto">
                <Image
                  src="/assets/dashboard-illust.png"
                  alt="Dashboard Illustration"
                  width={600}
                  height={600}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-xl overflow-hidden shadow-lg">
            <Image
              src="/assets/dashboard-img.png"
              alt="Dashboard Preview"
              width={1200}
              height={700}
              className="w-full h-auto block"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: "#003DB8" }}>
              ABOUT US
            </p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for
              <br />
              both Sides
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to succeed, whether you're an advertiser looking for quality traffic or a publisher
              maximizing revenue.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#E6F0FF] rounded-xl flex items-center justify-center mb-6">
                <Image src="/assets/target-icon.png" alt="Targeted Traffic" width={32} height={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Targeted Traffic</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced targeting options to reach your ideal audience with precision across web open markets and
                monetized content.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#E6F0FF] rounded-xl flex items-center justify-center mb-6">
                <Image src="/assets/revenue-icon.svg" alt="Maximum Revenue" width={32} height={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Maximum Revenue</h3>
              <p className="text-gray-600 leading-relaxed">
                Publishers earn the highest possible rates with our premium advertiser network and competitive bidding
                system.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#E6F0FF] rounded-xl flex items-center justify-center mb-6">
                <Image src="/assets/real-time-analysis-icon.svg" alt="Real-Time Analysis" width={32} height={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-Time Analysis</h3>
              <p className="text-gray-600 leading-relaxed">
                Track performance with detailed analytics and insights to optimize your campaigns and maximize roi.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#E6F0FF] rounded-xl flex items-center justify-center mb-6">
                <Image src="/assets/fraud-icon.svg" alt="Fraud Protection" width={32} height={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Fraud Protection</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced fraud detection ensures high-quality traffic and protects both advertisers and publishers.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#E6F0FF] rounded-xl flex items-center justify-center mb-6">
                <Image src="/assets/fast-icon.svg" alt="Lightning Fast" width={32} height={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced fraud detection ensures high-quality traffic and protects both advertisers and publishers.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#E6F0FF] rounded-xl flex items-center justify-center mb-6">
                <Image src="/assets/support-icon.svg" alt="Dedicated Support" width={32} height={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Dedicated Support</h3>
              <p className="text-gray-600 leading-relaxed">
                24/7 support team ready to help you succeed with fast response and optimization tips.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-[#003DB8] uppercase tracking-wide mb-3">Our Pricing</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple and Transparent
              <br />
              Pricing
            </h2>
          </div>

          <div className="flex flex-col md:flex-row justify-center" style={{ gap: "24px" }}>
            {/* Advertisers Pricing */}
            <div
              className="bg-white rounded-lg p-6 border border-gray-200"
              style={{ width: "362px", height: "415px" }}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Advertisers</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$0.10</span>
                <p className="text-gray-500 text-sm">Per Click</p>
              </div>
              <Link
                href="/account-type"
                className="block w-full text-center px-6 py-3 text-white rounded-lg font-semibold transition-colors mb-6"
                style={{ backgroundColor: "#003DB8" }}
              >
                Get Started
              </Link>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Image src="/assets/check-icon.svg" alt="" width={20} height={20} className="flex-shrink-0" />
                  <span className="text-gray-600 text-sm">No setup fees</span>
                </li>
                <li className="flex items-center gap-2">
                  <Image src="/assets/check-icon.svg" alt="" width={20} height={20} className="flex-shrink-0" />
                  <span className="text-gray-600 text-sm">Set your own budget</span>
                </li>
                <li className="flex items-center gap-2">
                  <Image src="/assets/check-icon.svg" alt="" width={20} height={20} className="flex-shrink-0" />
                  <span className="text-gray-600 text-sm">Cancel anytime</span>
                </li>
              </ul>
            </div>

            {/* Publishers Pricing */}
            <div
              className="bg-white rounded-lg p-6 border-2 border-[#003DB8] relative"
              style={{ width: "362px", height: "415px" }}
            >
              <div className="absolute top-3 right-3">
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  🔥 Hot
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Publishers</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">80%</span>
                <p className="text-gray-500 text-sm">Revenue Share</p>
              </div>
              <Link
                href="/account-type"
                className="block w-full text-center px-6 py-3 text-white rounded-lg font-semibold transition-colors mb-6"
                style={{ backgroundColor: "#003DB8" }}
              >
                Get Started
              </Link>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Image src="/assets/check-icon.svg" alt="" width={20} height={20} className="flex-shrink-0" />
                  <span className="text-gray-600 text-sm">No minimum traffic required</span>
                </li>
                <li className="flex items-center gap-2">
                  <Image src="/assets/check-icon.svg" alt="" width={20} height={20} className="flex-shrink-0" />
                  <span className="text-gray-600 text-sm">Weekly payments</span>
                </li>
                <li className="flex items-center gap-2">
                  <Image src="/assets/check-icon.svg" alt="" width={20} height={20} className="flex-shrink-0" />
                  <span className="text-gray-600 text-sm">Premium advertiser network</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20 px-4 sm:px-6 lg:px-8 rounded-2xl mx-4 sm:mx-6 lg:mx-8 mb-12"
        style={{ background: "linear-gradient(to right, #003DB8, #001B52)" }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto">
            Join thousands of advertisers and publishers who trust Link6ync for premium traffic and maximum revenue.
          </p>
          <Link
            href="/account-type"
            className="inline-flex items-center px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Create Your Free Account
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="px-12 sm:px-16 lg:px-24 mx-4 sm:mx-6 lg:mx-14 border border-gray-200"
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "16px 16px 0 0",
          paddingTop: "50px",
          paddingBottom: "20px",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-12 mb-12">
            {/* Logo and Description */}
            <div className="max-w-xs">
              <div className="flex items-center gap-2 mb-4">
                <Image src="/logo.svg" alt="Link6ync" width={26} height={32} />
                <span className="text-xl font-bold text-gray-900">Link6ync</span>
              </div>
              <p className="text-gray-500 text-sm mb-6">
                Premium PPC platform connecting advertisers and publishers.
              </p>
              {/* Social Icons */}
              <div className="flex items-center gap-4">
                <Link href="#" className="hover:opacity-80 transition-opacity">
                  <Image src="/assets/telegram-icon.svg" alt="Telegram" width={28} height={28} />
                </Link>
                <Link href="#" className="hover:opacity-80 transition-opacity">
                  <Image src="/assets/twitter-icon.svg" alt="Twitter" width={28} height={28} />
                </Link>
                <Link href="#" className="hover:opacity-80 transition-opacity">
                  <Image src="/assets/github-icon.svg" alt="GitHub" width={28} height={28} />
                </Link>
              </div>
            </div>

            {/* Links Section */}
            <div className="flex gap-16 md:gap-20">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
                      API
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
                      Career
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Link6ync. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
