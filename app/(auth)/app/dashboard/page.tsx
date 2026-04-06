import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { ChecklistCard } from "@/components/checklists/ChecklistCard";
import { daysLeftInTrial } from "@/lib/subscription";
import { Plus, FileText, CheckSquare, Zap } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/login");

  const [templates, checklists, templateCount, checklistCount] = await Promise.all([
    db.template.findMany({
      where: { userId: user.id },
      include: {
        category: true,
        _count: { select: { items: true, checklists: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    db.checklist.findMany({
      where: { userId: user.id },
      include: {
        template: { select: { name: true } },
        _count: { select: { items: true } },
        items: { select: { checked: true } },
      },
      orderBy: { startedAt: "desc" },
      take: 4,
    }),
    db.template.count({ where: { userId: user.id } }),
    db.checklist.count({ where: { userId: user.id } }),
  ]);

  const isTrial = user.plan === "TRIAL";
  const daysLeft = isTrial ? daysLeftInTrial(user) : 0;
  const canPdf = user.plan !== "FREE";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Olá, {user.name?.split(" ")[0] ?? "usuário"}!
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Aqui está um resumo da sua conta
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/app/checklists/new">
            <Button variant="outline" size="sm" className="gap-2">
              <CheckSquare className="h-4 w-4" />
              Novo checklist
            </Button>
          </Link>
          <Link href="/app/templates">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
              <Plus className="h-4 w-4" />
              Novo template
            </Button>
          </Link>
        </div>
      </div>

      {/* Trial banner */}
      {isTrial && daysLeft > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-full p-2">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Trial expira em {daysLeft} dia{daysLeft !== 1 ? "s" : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Faça upgrade para continuar com acesso ilimitado
                  </p>
                </div>
              </div>
              <Link href="/settings/billing">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 flex-shrink-0">
                  <Zap className="h-4 w-4" />
                  Upgrade PRO
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-lg p-2">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{templateCount}</p>
                <p className="text-xs text-muted-foreground">Templates</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-accent/10 rounded-lg p-2">
                <CheckSquare className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{checklistCount}</p>
                <p className="text-xs text-muted-foreground">Checklists</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent templates */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Templates recentes</h2>
          <Link href="/app/templates" className="text-sm text-primary hover:underline">
            Ver todos
          </Link>
        </div>
        {templates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                canQrCode={canPdf}
              />
            ))}
          </div>
        ) : (
          <Card className="bg-card border-border border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
              <FileText className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-sm mb-3">
                Nenhum template ainda. Crie o seu primeiro!
              </p>
              <Link href="/app/templates">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                  <Plus className="h-4 w-4" />
                  Criar template
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Recent checklists */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Checklists recentes</h2>
          <Link href="/app/checklists" className="text-sm text-primary hover:underline">
            Ver todos
          </Link>
        </div>
        {checklists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {checklists.map((checklist) => (
              <ChecklistCard
                key={checklist.id}
                checklist={checklist}
                canPdf={canPdf}
              />
            ))}
          </div>
        ) : (
          <Card className="bg-card border-border border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
              <CheckSquare className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-sm mb-3">
                Nenhum checklist ainda. Comece agora!
              </p>
              <Link href="/app/checklists/new">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                  <Plus className="h-4 w-4" />
                  Criar checklist
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
