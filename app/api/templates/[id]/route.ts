import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  items: z
    .array(
      z.object({
        id: z.string().optional(),
        label: z.string().min(1),
        fieldType: z.string().default("checkbox"),
        required: z.boolean().default(false),
        order: z.number().default(0),
        options: z.array(z.string()).optional().nullable(),
      })
    )
    .optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const template = await db.template.findFirst({
    where: { id, userId: session.user.id },
    include: { items: { orderBy: { order: "asc" } }, category: true },
  });

  if (!template) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(template);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await db.template.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const { name, description, categoryId, items } = parsed.data;

  const template = await db.template.update({
    where: { id },
    data: {
      ...(name && { name }),
      description: description ?? null,
      categoryId: categoryId ?? null,
      ...(items && {
        items: {
          deleteMany: {},
          create: items.map((item, i) => ({
            label: item.label,
            fieldType: item.fieldType,
            required: item.required,
            order: item.order ?? i,
            options: item.options ? item.options : undefined,
          })),
        },
      }),
    },
    include: { items: { orderBy: { order: "asc" } }, category: true },
  });

  return NextResponse.json(template);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await db.template.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.template.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
