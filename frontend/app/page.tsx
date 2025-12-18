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
        className="fixed top-4 left-4 md:top-6 md:left-6 z-50"
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
            className="hover:scale-110 transition-transform duration-300 cursor-pointer w-24 h-auto md:w-[150px]"
          />
        </Link>
      </motion.div>

      {/* Theme Toggle & GitHub */}
      <div className="fixed top-4 right-4 md:top-6 md:right-6 z-50 flex items-center gap-2 md:gap-3">
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

      <div className="relative z-10 container mx-auto px-4 md:px-6 py-20 md:py-16 min-h-screen flex flex-col">
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
          className="text-center mb-5 md:mb-8 space-y-3 mt-8 md:mt-0"
        >
          <p className="text-sm md:text-lg max-w-2xl mx-auto font-[family-name:var(--font-gloria)] px-4">
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
        <footer className="mt-8 md:mt-16 text-center pb-4">
          <div className="inline-block px-4 md:px-6 py-2 md:py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full">
            <p className="text-muted-foreground text-xs md:text-sm">
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
