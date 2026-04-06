import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { id } = await params;
  const checklist = await db.checklist.findFirst({
    where: { id, userId: session.user.id },
    include: { items: { orderBy: { order: "asc" } }, report: true },
  });
  if (!checklist) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.checklist.update({
    where: { id },
    data: { status: "completed", completedAt: new Date() },
  });

  const canPdf = user.plan === "TRIAL" || user.plan === "PRO";
  let pdfUrl: string | null = null;

  if (canPdf) {
    // Generate a simple text-based report URL (data URL placeholder)
    const reportData = {
      checklistId: id,
      checklistName: checklist.name,
      completedAt: new Date().toISOString(),
      items: checklist.items.map((item) => ({
        label: item.label,
        checked: item.checked,
        value: item.value,
      })),
    };
    // Store as a JSON data (in production, upload to S3/blob storage)
    pdfUrl = `/api/checklists/${id}/report`;

    if (!checklist.report) {
      await db.checklistReport.create({
        data: {
          checklistId: id,
          pdfUrl,
          generatedAt: new Date(),
        },
      });
    }
  }

  return NextResponse.json({ success: true, pdfUrl });
}
