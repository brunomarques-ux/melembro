import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { TemplateForm } from "@/components/templates/TemplateForm";
import { PLAN_LIMITS } from "@/lib/limits";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function EditTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/login");

  const template = await db.template.findFirst({
    where: { id, userId: user.id },
    include: { items: { orderBy: { order: "asc" } } },
  });
  if (!template) notFound();

  const categories = await db.category.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
  });

  const limits = PLAN_LIMITS[user.plan];

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
        <h1 className="text-2xl font-bold text-foreground">Editar template</h1>
        <p className="text-muted-foreground text-sm mt-1">{template.name}</p>
      </div>
      <TemplateForm
        initialData={{
          id: template.id,
          name: template.name,
          description: template.description,
          categoryId: template.categoryId,
          items: template.items.map((item) => ({
            id: item.id,
            label: item.label,
            fieldType: item.fieldType,
            required: item.required,
            order: item.order,
          })),
        }}
        categories={categories}
        maxItems={limits.itemsPerTemplate === Infinity ? undefined : limits.itemsPerTemplate}
      />
    </div>
  );
}
