"use client";

import Link from "next/link";
import { AlertTriangle,} from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-white">
          {/* Navigation */}
          <nav className="fixed top-0 w-full bg-white border-b border-gray-100 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <Link href="/" className="flex items-center gap-1.5">
                  <svg width="24" height="30" viewBox="0 0 48 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="48" height="60" fill="#003DB8" />
                  </svg>
                  <span className="text-xl font-bold text-gray-900">Link6ync</span>
                </Link>
                <div className="flex items-center gap-3">
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-gray-900 font-medium transition-colors px-4 py-2"
                  >
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

          {/* Error Content */}
          <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto text-center">
              <div
                className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-8"
                style={{ backgroundColor: "#FEE2E2" }}
              >
                <AlertTriangle className="w-10 h-10" style={{ color: "#DC2626" }} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Critical Error</h2>
              <p className="text-gray-600 mb-10 leading-relaxed">
                A critical error occurred. Please refresh the page or try again later.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={reset}
                  className="inline-flex items-center px-8 py-3.5 text-white rounded-lg font-semibold transition-colors shadow-lg w-full sm:w-auto justify-center"
                  style={{ backgroundColor: "#003DB8" }}
                >
                  
                  Try Again
                </button>
                <Link
                  href="/"
                  className="inline-flex items-center px-8 py-3.5 bg-white text-gray-900 rounded-lg font-semibold border-2 border-gray-300 hover:border-gray-400 transition-colors w-full sm:w-auto justify-center"
                >
                 
                  Go Home
                </Link>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto">
              <div className="grid md:grid-cols-4 gap-8 mb-8">
                <div>
                  <div className="flex items-center gap-1.5 mb-4">
                    <svg width="24" height="30" viewBox="0 0 48 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="48" height="60" fill="#003DB8" />
                    </svg>
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
      </body>
    </html>
  );
}
