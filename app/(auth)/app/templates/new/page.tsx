import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { TemplateForm } from "@/components/templates/TemplateForm";
import { PLAN_LIMITS } from "@/lib/limits";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function NewTemplatePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/login");

  const limits = PLAN_LIMITS[user.plan];

  if (limits.templates !== Infinity) {
    const count = await db.template.count({ where: { userId: user.id } });
    if (count >= limits.templates) {
      redirect("/app/templates");
    }
  }

  const categories = await db.category.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Link
          href="/app/templates"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para templates
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Novo template</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Crie um modelo de checklist para reutilizar sempre que precisar
        </p>
      </div>
      <TemplateForm
        categories={categories}
        maxItems={limits.itemsPerTemplate === Infinity ? undefined : limits.itemsPerTemplate}
      />
    </div>
  );
}
