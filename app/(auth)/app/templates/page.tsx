"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, FileText } from "lucide-react";
import { toast } from "sonner";
import { PaywallGate } from "@/components/paywall/PaywallGate";
import { useSession } from "next-auth/react";

export default function TemplatesPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { data: templates, isLoading } = useQuery({
    queryKey: ["templates"],
    queryFn: () => fetch("/api/templates").then((r) => r.json()),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/templates/${id}`, { method: "DELETE" }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast.success("Template excluído.");
    },
    onError: () => toast.error("Erro ao excluir template."),
  });

  const plan = (session?.user as any)?.plan ?? "FREE";
  const canCreateMore = plan !== "FREE" || (templates?.length ?? 0) < 1;
  const canQrCode = plan !== "FREE";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Templates</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Crie e gerencie seus modelos de checklist reutilizáveis
          </p>
        </div>
        {canCreateMore ? (
          <Link href="/app/templates/new">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
              <Plus className="h-4 w-4" />
              Novo template
            </Button>
          </Link>
        ) : (
          <PaywallGate
            feature="Mais templates"
            description="O plano FREE permite apenas 1 template."
            locked={!canCreateMore}
          />
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : templates?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template: any) => (
            <TemplateCard
              key={template.id}
              template={template}
              onDelete={(id) => deleteMutation.mutate(id)}
              canQrCode={canQrCode}
            />
          ))}
          {!canCreateMore && (
            <PaywallGate
              feature="Templates ilimitados"
              description="Faça upgrade para criar quantos templates quiser."
            />
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-muted rounded-full p-6 mb-4">
            <FileText className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum template ainda</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm">
            Crie seu primeiro template de checklist e use-o sempre que precisar.
          </p>
          <Link href="/app/templates/new">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
              <Plus className="h-4 w-4" />
              Criar primeiro template
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
