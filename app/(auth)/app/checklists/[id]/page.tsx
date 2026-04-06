import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { ChecklistExecutor } from "@/components/checklists/ChecklistExecutor";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ChecklistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/login");

  const checklist = await db.checklist.findFirst({
    where: { id, userId: user.id },
    include: {
      items: { orderBy: { order: "asc" } },
      template: { select: { name: true } },
      report: true,
    },
  });
  if (!checklist) notFound();

  const canPdf = user.plan !== "FREE";
  const isCompleted = checklist.status === "completed";

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Link
          href="/app/checklists"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para checklists
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">{checklist.name}</h1>
          <Badge
            className={
              isCompleted
                ? "bg-accent text-accent-foreground"
                : "bg-primary text-primary-foreground"
            }
          >
            {isCompleted ? "Concluído" : "Ativo"}
          </Badge>
        </div>
        {checklist.template && (
          <p className="text-muted-foreground text-sm mt-1">
            Template: {checklist.template.name}
          </p>
        )}
      </div>

      <ChecklistExecutor
        checklist={{
          id: checklist.id,
          name: checklist.name,
          status: checklist.status,
          items: checklist.items,
        }}
        canPdf={canPdf}
      />
    </div>
  );
}
