"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckSquare, Mail, Globe } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/app/dashboard";

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const result = await signIn("resend", {
        email,
        callbackUrl,
        redirect: false,
      });
      if (result?.error) {
        toast.error("Erro ao enviar o link. Tente novamente.");
      } else {
        setEmailSent(true);
        toast.success("Link enviado! Verifique seu e-mail.");
      }
    } catch {
      toast.error("Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setLoading(true);
    await signIn("google", { callbackUrl });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary rounded-lg p-2">
              <CheckSquare className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">MeLembro</span>
          </div>
          <p className="text-muted-foreground">Pare de recriar. Comece a lembrar.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Entrar na sua conta</CardTitle>
            <CardDescription>
              Acesse com Google ou receba um link mágico no seu e-mail
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {emailSent ? (
              <div className="text-center space-y-3 py-4">
                <div className="bg-accent/10 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center">
                  <Mail className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground">Verifique seu e-mail</h3>
                <p className="text-sm text-muted-foreground">
                  Enviamos um link de acesso para <strong>{email}</strong>. Clique no link para entrar.
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEmailSent(false)}
                  className="text-muted-foreground"
                >
                  Usar outro e-mail
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                >
                  <Globe className="h-4 w-4" />
                  Continuar com Google
                </Button>

                <div className="flex items-center gap-3">
                  <Separator className="flex-1" />
                  <span className="text-xs text-muted-foreground">ou</span>
                  <Separator className="flex-1" />
                </div>

                <form onSubmit={handleEmailSignIn} className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={loading || !email}
                  >
                    {loading ? "Enviando..." : "Receber link mágico"}
                  </Button>
                </form>
              </>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Ao entrar, você concorda com nossos{" "}
          <a href="#" className="underline hover:text-foreground">
            Termos de Uso
          </a>{" "}
          e{" "}
          <a href="#" className="underline hover:text-foreground">
            Política de Privacidade
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
      <LoginForm />
    </Suspense>
  );
}
