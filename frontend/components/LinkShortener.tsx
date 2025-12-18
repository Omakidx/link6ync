'use client';

import React, {
  useState,
} from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import {
  motion,
  AnimatePresence,
} from 'framer-motion';
import {
  Copy,
  Check,
  ExternalLink,
  QrCode,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TbViewportShort } from 'react-icons/tb';
import {
  Card,
  CardContent,
} from '@/components/ui/card';

const LinkShortener =
  () => {
    const [
      originalUrl,
      setOriginalUrl,
    ] =
      useState(
        ''
      );
    const [
      shortUrl,
      setShortUrl,
    ] =
      useState(
        ''
      );
    const [
      loading,
      setLoading,
    ] =
      useState(
        false
      );
    const [
      error,
      setError,
    ] =
      useState(
        ''
      );
    const [
      copied,
      setCopied,
    ] =
      useState(
        false
      );

    const handleSubmit =
      async (
        e: React.FormEvent
      ) => {
        e.preventDefault();
        setLoading(
          true
        );
        setError(
          ''
        );
        setShortUrl(
          ''
        );
        setCopied(
          false
        );

        try {
          // Basic validation
          let urlToShorten =
            originalUrl;
          if (
            !/^https?:\/\//i.test(
              urlToShorten
            )
          ) {
            urlToShorten =
              'https://' +
              urlToShorten;
          }

          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
          const response =
            await axios.post(
              `${apiUrl}/short`,
              {
                originalUrl:
                  urlToShorten,
              }
            );

          // Construct the full short URL
          // Assuming backend returns { message: ..., url: { shortUrl: '...' } } based on server.ts
          // server.ts: res.json({ message: 'URL shortened successfully', url:url });
          // url object has shortUrl property based on schema usage imply

          const shortCode =
            response
              .data
              .url
              .shortUrl;
          setShortUrl(
            `${apiUrl}/${shortCode}`
          );
        } catch (err) {
          console.error(
            err
          );
          setError(
            'Failed to shorten URL. Please try again.'
          );
        } finally {
          setLoading(
            false
          );
        }
      };

    const copyToClipboard =
      () => {
        navigator.clipboard.writeText(
          shortUrl
        );
        setCopied(
          true
        );
        setTimeout(
          () =>
            setCopied(
              false
            ),
          2000
        );
      };

    return (
      <Card className="w-full border-white/10 bg-card/50 backdrop-blur-xl">
        <CardContent className="p-4 md:p-8">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
            {/* Left Column: Input and Action */}
            <div className="space-y-4 md:space-y-6">
              <div className="space-y-2 md:space-y-3">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                  Shorten
                  Your
                  Link
                </h2>
                <p className="text-muted-foreground text-xs md:text-sm">
                  Convert
                  long
                  URLs
                  into
                  short,
                  shareable
                  links
                  with
                  QR
                  codes.
                </p>
              </div>

              <form
                onSubmit={
                  handleSubmit
                }
                className="space-y-3 md:space-y-4"
              >
                <Input
                  type="url"
                  placeholder="https://example.com/your-long-url"
                  value={
                    originalUrl
                  }
                  onChange={(
                    e
                  ) =>
                    setOriginalUrl(
                      e
                        .target
                        .value
                    )
                  }
                  className="h-11 md:h-12 bg-background/80 border-white/10 text-sm md:text-base"
                  required
                />

                <Button
                  type="submit"
                  disabled={
                    loading ||
                    !originalUrl
                  }
                  className="w-full h-11 md:h-12 font-semibold cursor-pointer text-sm md:text-base"
                  size="lg"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    <>
                      Shorten
                      Now{' '}
                      <TbViewportShort
                        className="ml-1"
                        size={
                          30
                        }
                      />
                    </>
                  )}
                </Button>
              </form>

              {error && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm"
                >
                  {
                    error
                  }
                </motion.div>
              )}
            </div>

            {/* Right Column: Results */}
            <Card className="min-h-[280px] md:min-h-[340px] flex items-center justify-center bg-background/60 border-white/10">
              <CardContent className="p-4 md:p-6 w-full">
                <AnimatePresence mode="wait">
                  {shortUrl ? (
                    <motion.div
                      key="result"
                      initial={{
                        opacity: 0,
                        scale: 0.95,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.95,
                      }}
                      className="space-y-6"
                    >
                      {/* QR Code */}
                      <div className="flex flex-col items-center space-y-2 md:space-y-3">
                        <div className="p-2 md:p-3 bg-white rounded-lg md:rounded-xl shadow-sm">
                          <QRCodeSVG
                            value={
                              shortUrl
                            }
                            size={
                              140
                            }
                            level="H"
                            includeMargin={
                              false
                            }
                          />
                        </div>
                        <p className="text-[10px] md:text-xs text-muted-foreground">
                          Scan
                          to
                          visit
                          URL
                        </p>
                      </div>

                      {/* Short URL */}
                      <div className="flex items-center gap-2 p-2 md:p-3 bg-card/50 border border-white/10 rounded-lg hover:border-primary/30 transition-colors">
                        <a
                          href={
                            shortUrl
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 truncate text-xs md:text-sm font-mono hover:text-primary transition-colors"
                        >
                          {
                            shortUrl
                          }
                        </a>
                        <div className="flex gap-0.5 md:gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={
                              copyToClipboard
                            }
                          >
                            {copied ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            asChild
                          >
                            <a
                              href={
                                shortUrl
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="placeholder"
                      initial={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: 1,
                      }}
                      exit={{
                        opacity: 0,
                      }}
                      className="text-center space-y-3 py-8"
                    >
                      <div className="w-20 h-20 mx-auto rounded-full bg-white/5 flex items-center justify-center">
                        <QrCode className="w-10 h-10 text-muted-foreground/30" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Your
                        QR
                        code
                        will
                        appear
                        here
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    );
  };

export default LinkShortener;
