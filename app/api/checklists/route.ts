import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1),
  templateId: z.string().optional().nullable(),
  items: z
    .array(
      z.object({
        label: z.string().min(1),
        fieldType: z.string().default("checkbox"),
        order: z.number().default(0),
        templateItemId: z.string().optional().nullable(),
      })
    )
    .optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const checklists = await db.checklist.findMany({
    where: { userId: session.user.id },
    include: {
      template: { select: { name: true } },
      _count: { select: { items: true } },
      items: { select: { checked: true } },
    },
    orderBy: { startedAt: "desc" },
  });

  return NextResponse.json(checklists);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const { name, templateId, items } = parsed.data;

  let checklistItems = items;

  // If template provided and no items given, copy from template
  if (templateId && !items) {
    const template = await db.template.findFirst({
      where: { id: templateId, userId: session.user.id },
      include: { items: { orderBy: { order: "asc" } } },
    });
    if (template) {
      checklistItems = template.items.map((ti) => ({
        label: ti.label,
        fieldType: ti.fieldType,
        order: ti.order,
        templateItemId: ti.id,
      }));
    }
  }

  const checklist = await db.checklist.create({
    data: {
      userId: session.user.id,
      templateId: templateId || null,
      name,
      items: {
        create: (checklistItems ?? []).map((item, i) => ({
          label: item.label,
          fieldType: item.fieldType,
          order: item.order ?? i,
          templateItemId: item.templateItemId || null,
        })),
      },
    },
    include: {
      items: { orderBy: { order: "asc" } },
      template: { select: { name: true } },
    },
  });

  return NextResponse.json(checklist, { status: 201 });
}
