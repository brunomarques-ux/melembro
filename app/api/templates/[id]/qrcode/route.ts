import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { hasAccess } from "@/lib/subscription";
import QRCode from "qrcode";

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

  const canQr = user.plan === "TRIAL" || user.plan === "PRO";
  if (!canQr) {
    return NextResponse.json(
      { error: "QR Code disponível apenas nos planos TRIAL e PRO." },
      { status: 403 }
    );
  }

  const { id } = await params;
  const template = await db.template.findFirst({
    where: { id, userId: user.id },
  });
  if (!template) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const url = `${process.env.NEXT_PUBLIC_APP_URL}/app/checklists/new?templateId=${id}`;
  const qrDataUrl = await QRCode.toDataURL(url, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 300,
  });

  const updated = await db.template.update({
    where: { id },
    data: { qrCodeUrl: qrDataUrl },
  });

  return NextResponse.json({ qrCodeUrl: updated.qrCodeUrl });
}
