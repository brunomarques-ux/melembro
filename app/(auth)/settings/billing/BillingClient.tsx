"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  Zap,
  CreditCard,
  Lock,
  FileText,
  CheckSquare,
  Tag,
  QrCode,
  FileDown,
  History,
  Infinity as InfinityIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Suspense } from "react";
import { cn } from "@/lib/utils";

interface BillingClientProps {
  plan: string;
  trialEndsAt: string | null;
  stripeCurrentPeriodEnd: string | null;
  hasStripeCustomer: boolean;
}

const PRO_FEATURES = [
  { icon: FileText, text: "Templates ilimitados" },
  { icon: CheckSquare, text: "Checklists ilimitados" },
  { icon: Tag, text: "Categorias ilimitadas" },
  { icon: QrCode, text: "QR Code por template" },
  { icon: FileDown, text: "Relatório em PDF" },
  { icon: History, text: "Histórico completo" },
];

const FREE_FEATURES = [
  { icon: FileText, text: "1 template" },
  { icon: CheckSquare, text: "Checklists avulsos ilimitados" },
  { icon: Lock, text: "Sem QR Code" },
  { icon: Lock, text: "Sem relatório PDF" },
];

function BillingContent({
  plan,
  trialEndsAt,
  stripeCurrentPeriodEnd,
  hasStripeCustomer,
}: BillingClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get("success");

  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [loadingPortal, setLoadingPortal] = useState(false);

  const isPro = plan === "PRO";
  const isTrial = plan === "TRIAL";
  const isFree = plan === "FREE";

  const trialEnd = trialEndsAt ? new Date(trialEndsAt) : null;
  const periodEnd = stripeCurrentPeriodEnd ? new Date(stripeCurrentPeriodEnd) : null;
  const daysLeft = trialEnd
    ? Math.max(0, Math.ceil((trialEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  async function handleUpgrade() {
    setLoadingCheckout(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error ?? "Erro ao criar sessão de pagamento.");
      }
    } catch {
      toast.error("Erro ao conectar com o Stripe.");
    } finally {
      setLoadingCheckout(false);
    }
  }

  async function handlePortal() {
    setLoadingPortal(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error ?? "Erro ao abrir portal.");
      }
    } catch {
      toast.error("Erro ao conectar com o Stripe.");
    } finally {
      setLoadingPortal(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Assinatura</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Gerencie seu plano e pagamento
        </p>
      </div>

      {success && (
        <Card className="bg-accent/10 border-accent/30">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-accent" />
              <p className="text-sm font-medium text-foreground">
                Assinatura ativada com sucesso! Bem-vindo ao PRO.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current plan */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground">Plano atual</CardTitle>
            <Badge
              className={cn(
                "text-xs",
                isPro
                  ? "bg-accent text-accent-foreground"
                  : isTrial
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              )}
            >
              {isPro ? "PRO" : isTrial ? "TRIAL" : "FREE"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isTrial && trialEnd && (
            <p className="text-sm text-muted-foreground">
              Seu trial expira em{" "}
              <strong className="text-foreground">{daysLeft} dia{daysLeft !== 1 ? "s" : ""}</strong>{" "}
              ({trialEnd.toLocaleDateString("pt-BR")})
            </p>
          )}
          {isPro && periodEnd && (
            <p className="text-sm text-muted-foreground">
              Próxima renovação:{" "}
              <strong className="text-foreground">
                {periodEnd.toLocaleDateString("pt-BR")}
              </strong>
            </p>
          )}
          {isFree && (
            <p className="text-sm text-muted-foreground">
              Você está no plano gratuito com recursos limitados.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Plans comparison */}
      {!isPro && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* FREE */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground text-base">FREE</CardTitle>
              <CardDescription>
                <span className="text-2xl font-bold text-foreground">R$ 0</span>
                <span className="text-muted-foreground">/mês</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {FREE_FEATURES.map((f) => (
                <div key={f.text} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <f.icon className="h-4 w-4 flex-shrink-0" />
                  {f.text}
                </div>
              ))}
              <div className="pt-2">
                <Badge variant="secondary" className="w-full justify-center">
                  Plano atual
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* PRO */}
          <Card className="bg-primary/5 border-primary/30 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground text-xs">Recomendado</Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-foreground text-base">PRO</CardTitle>
              <CardDescription>
                <span className="text-2xl font-bold text-foreground">R$ 7,90</span>
                <span className="text-muted-foreground">/mês</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {PRO_FEATURES.map((f) => (
                <div key={f.text} className="flex items-center gap-2 text-sm text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                  {f.text}
                </div>
              ))}
              <div className="pt-2">
                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                  onClick={handleUpgrade}
                  disabled={loadingCheckout}
                >
                  <Zap className="h-4 w-4" />
                  {loadingCheckout ? "Redirecionando..." : "Fazer upgrade para PRO"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Manage subscription */}
      {isPro && hasStripeCustomer && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-base">Gerenciar assinatura</CardTitle>
            <CardDescription>
              Altere seu método de pagamento, cancele ou veja o histórico de faturas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={handlePortal}
              disabled={loadingPortal}
              className="gap-2"
            >
              <CreditCard className="h-4 w-4" />
              {loadingPortal ? "Abrindo portal..." : "Acessar portal de pagamento"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export function BillingClient(props: BillingClientProps) {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <BillingContent {...props} />
    </Suspense>
  );
}
