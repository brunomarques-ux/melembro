"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

interface PaywallGateProps {
  feature: string;
  description?: string;
  children?: React.ReactNode;
  locked?: boolean;
}

export function PaywallGate({
  feature,
  description,
  children,
  locked = true,
}: PaywallGateProps) {
  const router = useRouter();

  if (!locked) return <>{children}</>;

  return (
    <Card className="border-2 border-dashed border-border bg-muted/30">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto bg-primary/10 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-2">
          <Lock className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-lg">{feature}</CardTitle>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="text-center pb-6">
        <p className="text-sm text-muted-foreground mb-4">
          Faça upgrade para o plano PRO e desbloqueie essa funcionalidade por apenas{" "}
          <strong className="text-foreground">R$ 7,90/mês</strong>.
        </p>
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
          onClick={() => router.push("/settings/billing")}
        >
          <Zap className="h-4 w-4" />
          Fazer upgrade para PRO
        </Button>
      </CardContent>
    </Card>
  );
}
