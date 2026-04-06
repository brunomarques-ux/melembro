import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeroSection } from "@/components/blocks/hero-section";
import {
  CheckSquare,
  RefreshCw,
  SlidersHorizontal,
  Tag,
  QrCode,
  FileDown,
  Check,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: RefreshCw,
    title: "Templates reutilizáveis",
    description:
      "Crie um modelo uma vez e instancie com 2 toques. Nunca mais recrie a mesma lista do zero.",
  },
  {
    icon: SlidersHorizontal,
    title: "Campos personalizados",
    description:
      "Texto, número, valor, seleção, checkbox — cada item do jeito que você precisa.",
  },
  {
    icon: Tag,
    title: "Categorias",
    description:
      "Organize seus templates por categorias: pessoal, profissional, viagem, hobby e mais.",
  },
  {
    icon: QrCode,
    title: "QR Code do template",
    description:
      "Imprima e cole onde precisar. Escaneie para abrir o checklist na hora, em qualquer dispositivo.",
  },
  {
    icon: FileDown,
    title: "Relatório em PDF",
    description:
      "Gere um registro completo com data, hora e todos os campos preenchidos.",
  },
  {
    icon: CheckSquare,
    title: "Checklists avulsos",
    description:
      "Crie listas rápidas sem precisar de modelo. Perfeito para tarefas únicas.",
  },
];

const freePlan = {
  name: "FREE",
  price: "R$ 0",
  period: "/mês",
  features: ["1 template", "Até 10 itens por template", "Checklists avulsos ilimitados"],
  unavailable: ["QR Code", "Relatório PDF", "Categorias", "Histórico completo"],
  cta: "Começar grátis",
  href: "/login",
  highlight: false,
};

const proPlan = {
  name: "PRO",
  price: "R$ 7,90",
  period: "/mês",
  features: [
    "Templates ilimitados",
    "Itens ilimitados por template",
    "Checklists ilimitados",
    "Categorias ilimitadas",
    "QR Code por template",
    "Relatório em PDF",
    "Histórico completo",
  ],
  unavailable: [],
  cta: "Começar trial grátis (14 dias)",
  href: "/login",
  highlight: true,
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* ── HERO ANIMADO ── */}
      <HeroSection />

      {/* ── FEATURES ── */}
      <section id="features" className="bg-muted/30 py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-semibold text-foreground mb-3 tracking-tight">
              Tudo que você precisa para nunca esquecer nada
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Do simples ao completo — o MeLembro cresce junto com sua necessidade.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="bg-card border-border hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-2">
                  <div className="bg-primary/10 rounded-lg p-2.5 w-fit mb-2">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-semibold text-foreground mb-3 tracking-tight">
              Preço simples e justo
            </h2>
            <p className="text-muted-foreground">
              Comece grátis e faça upgrade quando precisar de mais.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {[freePlan, proPlan].map((plan) => (
              <Card
                key={plan.name}
                className={`bg-card border-border relative ${
                  plan.highlight ? "border-primary/50 shadow-xl shadow-primary/10" : ""
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Mais popular</Badge>
                  </div>
                )}
                <CardHeader className="pb-4">
                  <CardTitle className="text-foreground">{plan.name}</CardTitle>
                  <div>
                    <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-accent flex-shrink-0" />
                        <span className="text-foreground">{f}</span>
                      </div>
                    ))}
                    {plan.unavailable.map((f) => (
                      <div key={f} className="flex items-center gap-2 text-sm">
                        <div className="h-4 w-4 flex-shrink-0" />
                        <span className="text-muted-foreground line-through">{f}</span>
                      </div>
                    ))}
                  </div>
                  <Link href={plan.href} className="block">
                    <Button
                      className="w-full"
                      variant={plan.highlight ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="bg-primary py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-semibold text-primary-foreground mb-4 tracking-tight">
            Pronto para parar de recriar?
          </h2>
          <p className="text-primary-foreground/80 mb-8 text-lg">
            Comece agora e experimente tudo grátis por 14 dias.
          </p>
          <Link href="/login">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 gap-2 text-base px-8"
            >
              Começar agora
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border bg-card py-8">
        <div className="mx-auto max-w-5xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <CheckSquare className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-foreground">MeLembro</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Funcionalidades</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Preços</a>
            <Link href="/login" className="hover:text-foreground transition-colors">Entrar</Link>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} MeLembro. Todos os direitos reservados.
          </p>
        </div>
      </footer>

    </div>
  );
}
