"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white  z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-1.5">
              <Image src="/logo.svg" alt="Link6ync" width={24} height={30} />
              <span className="text-xl font-bold text-gray-900">Link6ync</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-gray-700 hover:text-gray-900 font-medium transition-colors px-4 py-2">
                Log in
              </Link>
              <Link
                href="/account-type"
                className="inline-flex items-center px-5 py-2.5 text-white rounded-lg font-medium transition-colors"
                style={{ backgroundColor: "#003DB8" }}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 404 Content */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-[150px] sm:text-[200px] font-bold leading-none" style={{ color: "#E6F0FF" }}>
              404
            </h1>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">Page Not Found</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or the URL might be
            incorrect.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center px-8 py-3.5 text-white rounded-lg font-semibold transition-colors shadow-lg"
              style={{ backgroundColor: "#003DB8" }}
            >
              Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-8 py-3.5 bg-white text-gray-900 rounded-lg font-semibold border-2 border-gray-300 hover:border-gray-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-1.5 mb-4">
                <Image src="/logo.svg" alt="Link6ync" width={24} height={30} />
                <span className="text-lg font-bold text-gray-900">Link6ync</span>
              </div>
              <p className="text-gray-600 text-sm">Premium CPC platform connecting advertisers and publishers.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    Publishers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    Advertisers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-sm">© {new Date().getFullYear()} Link6ync. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
