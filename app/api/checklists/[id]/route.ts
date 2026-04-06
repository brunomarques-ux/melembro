import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const checklist = await db.checklist.findFirst({
    where: { id, userId: session.user.id },
    include: {
      items: { orderBy: { order: "asc" } },
      template: { select: { name: true } },
      report: true,
    },
  });

  if (!checklist) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(checklist);
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
  const existing = await db.checklist.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.checklist.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
