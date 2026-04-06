import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const patchSchema = z.object({
  checked: z.boolean().optional(),
  value: z.string().optional().nullable(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, itemId } = await params;

  const checklist = await db.checklist.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!checklist) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (checklist.status === "completed") {
    return NextResponse.json({ error: "Checklist already completed" }, { status: 400 });
  }

  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const item = await db.checklistItem.update({
    where: { id: itemId },
    data: {
      ...(parsed.data.checked !== undefined && { checked: parsed.data.checked }),
      ...(parsed.data.value !== undefined && { value: parsed.data.value }),
    },
  });

  return NextResponse.json(item);
}
