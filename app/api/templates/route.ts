import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { PLAN_LIMITS } from "@/lib/limits";
import { hasAccess } from "@/lib/subscription";
import { z } from "zod";

const templateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  items: z.array(
    z.object({
      id: z.string().optional(),
      label: z.string().min(1),
      fieldType: z.string().default("checkbox"),
      required: z.boolean().default(false),
      order: z.number().default(0),
      options: z.array(z.string()).optional().nullable(),
    })
  ),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const templates = await db.template.findMany({
    where: { userId: session.user.id },
    include: {
      category: true,
      _count: { select: { items: true, checklists: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(templates);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const limits = PLAN_LIMITS[user.plan];

  if (limits.templates !== Infinity) {
    const count = await db.template.count({ where: { userId: user.id } });
    if (count >= limits.templates) {
      return NextResponse.json(
        { error: `Limite de ${limits.templates} template(s) no plano ${user.plan}.` },
        { status: 403 }
      );
    }
  }

  const body = await request.json();
  const parsed = templateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const { name, description, categoryId, items } = parsed.data;

  const maxItems = limits.itemsPerTemplate;
  if (maxItems !== Infinity && items.length > maxItems) {
    return NextResponse.json(
      { error: `Limite de ${maxItems} itens por template no plano ${user.plan}.` },
      { status: 403 }
    );
  }

  const template = await db.template.create({
    data: {
      userId: user.id,
      name,
      description,
      categoryId: categoryId || null,
      items: {
        create: items.map((item, i) => ({
          label: item.label,
          fieldType: item.fieldType,
          required: item.required,
          order: item.order ?? i,
          options: item.options ? item.options : undefined,
        })),
      },
    },
    include: { items: true, category: true },
  });

  return NextResponse.json(template, { status: 201 });
}
