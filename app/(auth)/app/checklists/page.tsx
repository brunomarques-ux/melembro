"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChecklistCard } from "@/components/checklists/ChecklistCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, CheckSquare } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export default function ChecklistsPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { data: checklists, isLoading } = useQuery({
    queryKey: ["checklists"],
    queryFn: () => fetch("/api/checklists").then((r) => r.json()),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/checklists/${id}`, { method: "DELETE" }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklists"] });
      toast.success("Checklist excluído.");
    },
    onError: () => toast.error("Erro ao excluir checklist."),
  });

  const plan = (session?.user as any)?.plan ?? "FREE";
  const canPdf = plan !== "FREE";

  const active = checklists?.filter((c: any) => c.status === "active") ?? [];
  const completed = checklists?.filter((c: any) => c.status === "completed") ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Checklists</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Execute checklists avulsos ou a partir de templates
          </p>
        </div>
        <Link href="/app/checklists/new">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            <Plus className="h-4 w-4" />
            Novo checklist
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : (
        <Tabs defaultValue="active">
          <TabsList className="mb-4">
            <TabsTrigger value="active">
              Ativos ({active.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Concluídos ({completed.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {active.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {active.map((checklist: any) => (
                  <ChecklistCard
                    key={checklist.id}
                    checklist={checklist}
                    onDelete={(id) => deleteMutation.mutate(id)}
                    canPdf={canPdf}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="bg-muted rounded-full p-6 mb-4">
                  <CheckSquare className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Nenhum checklist ativo
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Crie um novo checklist para começar.
                </p>
                <Link href="/app/checklists/new">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                    <Plus className="h-4 w-4" />
                    Criar checklist
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed">
            {completed.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {completed.map((checklist: any) => (
                  <ChecklistCard
                    key={checklist.id}
                    checklist={checklist}
                    onDelete={(id) => deleteMutation.mutate(id)}
                    canPdf={canPdf}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-muted-foreground text-sm">
                  Nenhum checklist concluído ainda.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
