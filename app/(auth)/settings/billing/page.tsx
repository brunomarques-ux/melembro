import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { BillingClient } from "./BillingClient";
import { daysLeftInTrial, isSubscribed } from "@/lib/subscription";

export default async function BillingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/login");

  return (
    <BillingClient
      plan={user.plan}
      trialEndsAt={user.trialEndsAt?.toISOString() ?? null}
      stripeCurrentPeriodEnd={user.stripeCurrentPeriodEnd?.toISOString() ?? null}
      hasStripeCustomer={!!user.stripeCustomerId}
    />
  );
}
