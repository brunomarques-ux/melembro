import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckSquare,
  FileText,
  RefreshCw,
  SlidersHorizontal,
  Tag,
  QrCode,
  FileDown,
  Plus,
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
  features: [
    "1 template",
    "Até 10 itens por template",
    "Checklists avulsos ilimitados",
  ],
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
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary rounded-lg p-1.5">
              <CheckSquare className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">MeLembro</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Começar grátis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-24 text-center">
        <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
          14 dias grátis no plano PRO
        </Badge>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
          Pare de recriar.
          <br />
          <span className="text-primary">Comece a lembrar.</span>
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Crie modelos de checklist uma vez e execute em segundos — sempre que precisar, do jeito
          que precisa.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 text-base px-8"
            >
              Começar grátis
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline" className="text-base px-8">
              Ver funcionalidades
            </Button>
          </Link>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Sem cartão de crédito. Trial de 14 dias no PRO.
        </p>
      </section>

      {/* Features */}
      <section id="features" className="bg-muted/30 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">
              Tudo que você precisa para nunca esquecer nada
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Do simples ao completo — o MeLembro cresce junto com sua necessidade.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="bg-card border-border hover:shadow-md transition-shadow">
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

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">
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
                  plan.highlight ? "border-primary/50 shadow-lg shadow-primary/10" : ""
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
                      className={`w-full gap-2 ${
                        plan.highlight
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : ""
                      }`}
                      variant={plan.highlight ? "default" : "outline"}
                    >
                      {plan.highlight && <Plus className="h-4 w-4" />}
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
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

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary rounded-lg p-1">
              <CheckSquare className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">MeLembro</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground">
              Funcionalidades
            </a>
            <a href="#pricing" className="hover:text-foreground">
              Preços
            </a>
            <Link href="/login" className="hover:text-foreground">
              Entrar
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} MeLembro. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
