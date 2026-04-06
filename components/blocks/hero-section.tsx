'use client';

import React from 'react';
import Link from 'next/link';
import { CheckSquare, Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedGroup } from '@/components/ui/animated-group';
import { cn } from '@/lib/utils';
import { useScroll } from 'motion/react';

const transitionVariants = {
  item: {
    hidden: { opacity: 0, filter: 'blur(12px)', y: 12 },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: { type: 'spring', bounce: 0.3, duration: 1.5 },
    },
  },
};

const menuItems = [
  { name: 'Funcionalidades', href: '#features' },
  { name: 'Preços', href: '#pricing' },
  { name: 'Entrar', href: '/login' },
];

export function HeroHeader() {
  const [menuState, setMenuState] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const { scrollYProgress } = useScroll();

  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setScrolled(latest > 0.02);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <header>
      <nav
        data-state={menuState ? 'active' : undefined}
        className={cn(
          'group fixed z-20 w-full border-b border-transparent transition-all duration-300',
          scrolled && 'bg-background/80 border-border backdrop-blur-xl shadow-sm',
        )}
      >
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-4 lg:gap-0">
            {/* Logo */}
            <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <CheckSquare className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-semibold text-foreground">MeLembro</span>
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMenuState(!menuState)}
                aria-label="Toggle menu"
                className="relative z-20 -m-2.5 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="group-data-[state=active]:opacity-0 group-data-[state=active]:scale-0 group-data-[state=active]:rotate-180 m-auto size-5 transition-all duration-200" />
                <X className="group-data-[state=active]:opacity-100 group-data-[state=active]:scale-100 group-data-[state=active]:rotate-0 absolute inset-0 m-auto size-5 -rotate-180 scale-0 opacity-0 transition-all duration-200" />
              </button>

              {/* Desktop nav */}
              <ul className="hidden lg:flex gap-8 text-sm">
                {menuItems.slice(0, 2).map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-foreground transition-colors duration-150"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">Entrar</Button>
              </Link>
              <Link href="/login">
                <Button size="sm">Começar grátis</Button>
              </Link>
            </div>

            {/* Mobile menu */}
            <div className="bg-background group-data-[state=active]:block hidden w-full rounded-2xl border p-6 shadow-xl shadow-zinc-200/30 mb-4 lg:hidden">
              <ul className="space-y-5 text-base mb-6">
                {menuItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setMenuState(false)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/login" className="block w-full">
                <Button className="w-full">Começar grátis</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export function HeroSection() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden">
        {/* Hero */}
        <section>
          <div className="relative pt-28 pb-16 md:pt-36 md:pb-24">
            {/* Radial gradient background */}
            <div className="absolute inset-0 -z-10 [background:radial-gradient(60%_60%_at_50%_0%,#EEF2FF_0%,transparent_70%)]" />

            <div className="mx-auto max-w-5xl px-6">
              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: { staggerChildren: 0.08, delayChildren: 0.2 },
                    },
                  },
                  ...transitionVariants,
                }}
              >
                {/* Badge */}
                <div className="flex justify-center lg:justify-start">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                    <Sparkles className="h-3 w-3" />
                    Checklists inteligentes por template
                  </span>
                </div>

                {/* Headline */}
                <h1 className="mt-6 max-w-3xl text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                  Pare de recriar.{' '}
                  <span className="text-primary">Comece a lembrar.</span>
                </h1>

                {/* Subtítulo */}
                <p className="mt-5 max-w-xl text-pretty text-lg text-muted-foreground">
                  Crie modelos de checklist uma vez e execute em segundos — sempre que precisar,
                  do jeito que precisa.
                </p>

                {/* CTAs */}
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <div className="rounded-[14px] border border-primary/20 bg-primary/5 p-0.5">
                    <Link href="/login">
                      <Button size="lg" className="rounded-xl px-6 text-base">
                        Começar grátis
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  <Link href="#features">
                    <Button size="lg" variant="ghost" className="rounded-xl px-6 text-base">
                      Ver funcionalidades
                    </Button>
                  </Link>
                </div>

                {/* Social proof */}
                <p className="mt-4 text-sm text-muted-foreground">
                  Grátis para começar · Sem cartão de crédito
                </p>
              </AnimatedGroup>
            </div>

            {/* App screenshot / mock */}
            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: { staggerChildren: 0.05, delayChildren: 0.6 },
                  },
                },
                ...transitionVariants,
              }}
            >
              <div className="relative mt-12 overflow-hidden px-4 sm:mt-16 md:mt-20">
                <div
                  aria-hidden
                  className="absolute inset-0 z-10 bg-gradient-to-b from-transparent from-40% to-background"
                />
                <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-border/50 bg-background p-3 shadow-2xl shadow-primary/10 ring-1 ring-border">
                  {/* Mock UI do app */}
                  <div className="rounded-xl bg-muted/30 p-6 min-h-[320px] md:min-h-[400px]">
                    {/* Topbar mock */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <CheckSquare className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="h-3 w-32 rounded bg-foreground/20" />
                          <div className="mt-1 h-2 w-20 rounded bg-foreground/10" />
                        </div>
                      </div>
                      <div className="h-8 w-24 rounded-lg bg-primary/20" />
                    </div>

                    {/* Template cards mock */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { label: 'Viagem', items: 8, color: 'bg-blue-100', dot: 'bg-blue-400' },
                        { label: 'Abertura de loja', items: 12, color: 'bg-emerald-100', dot: 'bg-emerald-400' },
                        { label: 'Contrato', items: 6, color: 'bg-violet-100', dot: 'bg-violet-400' },
                      ].map((card) => (
                        <div key={card.label} className={cn('rounded-xl p-4 border border-border/40 bg-background')}>
                          <div className="flex items-center gap-2 mb-3">
                            <div className={cn('h-2.5 w-2.5 rounded-full', card.dot)} />
                            <span className="text-sm font-medium text-foreground">{card.label}</span>
                          </div>
                          <div className="space-y-2">
                            {Array.from({ length: 3 }).map((_, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <div className={cn('h-3.5 w-3.5 rounded border-2 border-border flex-shrink-0', i === 0 && 'bg-primary border-primary')} />
                                <div className={cn('h-2 rounded bg-foreground/10', i === 0 ? 'w-3/4' : i === 1 ? 'w-1/2' : 'w-2/3')} />
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 text-xs text-muted-foreground">{card.items} itens</div>
                        </div>
                      ))}
                    </div>

                    {/* Progress bar mock */}
                    <div className="mt-4 rounded-xl bg-background border border-border/40 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="h-2.5 w-40 rounded bg-foreground/15" />
                        <span className="text-xs text-muted-foreground">5/8 concluídos</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full w-[62%] rounded-full bg-accent transition-all" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedGroup>
          </div>
        </section>
      </main>
    </>
  );
}
