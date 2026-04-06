import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1),
  icon: z.string().default("folder"),
  color: z.string().default("#4F46E5"),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const categories = await db.category.findMany({
    where: { userId: session.user.id },
    include: { _count: { select: { templates: true } } },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (user.plan === "FREE") {
    return NextResponse.json(
      { error: "Categorias disponíveis apenas nos planos TRIAL e PRO." },
      { status: 403 }
    );
  }

  const body = await request.json();
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const category = await db.category.create({
    data: {
      userId: user.id,
      name: parsed.data.name,
      icon: parsed.data.icon,
      color: parsed.data.color,
    },
  });

  return NextResponse.json(category, { status: 201 });
}
