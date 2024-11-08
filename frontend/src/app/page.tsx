'use client';

import * as React from 'react';
import { Menu } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ModeToggle } from '@/components/mode-toggle';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';
import { SiteFooter } from '@/components/site-footer';
import { TypewriterEffectSmooth } from '@/components/ui/typewriter-effect';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';

const words = [
  {
    text: 'Manage',
  },
  {
    text: 'your',
  },
  {
    text: 'projects',
  },
  {
    text: 'with',
  },
  {
    text: siteConfig.name,
    className: 'text-primary dark:text-primary',
  },
];
const slogan =
  'The open source project management tool for software teams. Plan, track, and ship your projects with ease.';

const navLinks = [
  { name: 'Features', href: '#' },
  { name: 'Pricing', href: '#' },
  { name: 'About', href: '#' },
  { name: 'Contact', href: '#' },
];

const keyFeatures = [
  {
    title: 'Project Planning',
    description: 'Easily plan and organize your projects with intuitive tools.',
    icon: Icons.ClipboardIcon,
  },
  {
    title: 'Task Tracking',
    description: 'Keep track of tasks and their progress in real-time.',
    icon: Icons.BarChartIcon,
  },
  {
    title: 'Team Collaboration',
    description: 'Collaborate seamlessly with your team members on projects.',
    icon: Icons.UsersIcon,
  },
];
export default function Homepage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center justify-between">
        <a className="flex items-center justify-center relative" href="#">
          <Icons.logo className="h-6 w-6" />
          <span className="sr-only">{siteConfig.name}</span>
        </a>
        <nav className="absolute inset-x-96 items-center justify-center gap-4 sm:gap-6 hidden md:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              {link.name}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <nav className="flex items-center">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="hidden md:block"
            >
              <div
                className={cn(
                  buttonVariants({
                    variant: 'ghost',
                  }),
                  'h-8 w-8 px-0'
                )}
              >
                <Icons.gitHub className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <Link
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
              className="hidden md:block"
            >
              <div
                className={cn(
                  buttonVariants({
                    variant: 'ghost',
                  }),
                  'h-8 w-8 px-0'
                )}
              >
                <Icons.twitter className="h-3 w-3 fill-current" />
                <span className="sr-only">Twitter</span>
              </div>
            </Link>
            <ModeToggle />
          </nav>
          <Link href='/'
            className={cn(buttonVariants({
              variant: 'default',
            }))}
          >
            Sign In
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-sm font-medium hover:underline underline-offset-4"
                  >
                    {link.name}
                  </a>
                ))}
                <Link
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div
                    className={cn(
                      buttonVariants({
                        variant: 'ghost',
                      }),
                      'h-8 w-8 px-0'
                    )}
                  >
                    <Icons.gitHub className="h-4 w-4" />
                    <span className="sr-only">GitHub</span>
                  </div>
                </Link>
                <Link
                  href={siteConfig.links.twitter}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div
                    className={cn(
                      buttonVariants({
                        variant: 'ghost',
                      }),
                      'h-8 w-8 px-0'
                    )}
                  >
                    <Icons.twitter className="h-3 w-3 fill-current" />
                    <span className="sr-only">Twitter</span>
                  </div>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2 flex flex-col items-center">
                <h1
                  className="inline-block text-5xl uppercase font-black !bg-clip-text text-transparent !bg-cover !bg-center"
                  style={{
                    background: 'linear-gradient(to top left, #fc00ff,#00dbde)',
                  }}
                >
                  Welcome to {siteConfig.name}
                </h1>
                <TypewriterEffectSmooth words={words} className="mx-auto" />
                <TextGenerateEffect
                  words={slogan}
                  className="mx-auto max-w-[700px] text-muted-foreground md:text-xl dark:text-muted-foreground"
                />
              </div>
              <div className="space-x-4">
                <Button>Get Started</Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted dark:bg-muted">
          <div className="px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-primary">
              Key Features
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              {keyFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className="flex flex-col items-center space-y-4"
                >
                  <feature.icon className="h-12 w-12" />
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground dark:text-muted-foreground text-center">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
