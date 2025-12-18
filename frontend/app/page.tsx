'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import LinkShortener from '@/components/LinkShortener';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-background">
      {/* Logo at Top Left */}
      <motion.div
        className="fixed top-6 left-6 z-50"
        initial={{
          opacity: 0,
          x: -20,
        }}
        animate={{
          opacity: 1,
          x: 0,
        }}
        transition={{
          duration: 0.5,
        }}
      >
        <Link
          href="/"
          className="block"
        >
          <Image
            src="/link6ync-icon.svg"
            alt="Link6ync Logo"
            width={
              150
            }
            height={
              60
            }
            className="hover:scale-110 transition-transform duration-300 cursor-pointer"
          />
        </Link>
      </motion.div>

      {/* Theme Toggle & GitHub */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-card/50 backdrop-blur-md border-white/10"
          asChild
        >
          <a
            href="https://github.com/omakidx"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="h-[1.2rem] w-[1.2rem]" />
          </a>
        </Button>
        <ModeToggle />
      </div>

      {/* Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-600px h-600px rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-600px h-600px rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 min-h-screen flex flex-col">
        {/* Header */}
        <motion.header
          initial={{
            opacity: 0,
            y: -20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="text-center mb-5 space-y-3"
        >
          <p className="text-foreground md:text-lg max-w-2xl mx-auto font-[family-name:var(--font-gloria)]">
            Transform
            long
            URLs
            into
            elegant
            short
            links.
          </p>
        </motion.header>

        {/* Main Content */}
        <motion.div
          className="w-full max-w-5xl mx-auto flex-1"
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
          }}
        >
          <LinkShortener />
        </motion.div>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="inline-block px-6 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full">
            <p className="text-muted-foreground text-sm">
              ©
              2025
              Link6ync
              ·
              Powered
              by
              Omakidx
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
