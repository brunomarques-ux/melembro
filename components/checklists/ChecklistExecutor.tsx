"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Square, Check, FileDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ChecklistItemData {
  id: string;
  label: string;
  fieldType: string;
  value?: string | null;
  checked: boolean;
  order: number;
}

interface ChecklistExecutorProps {
  checklist: {
    id: string;
    name: string;
    status: string;
    items: ChecklistItemData[];
  };
  canPdf?: boolean;
}

export function ChecklistExecutor({ checklist: initial, canPdf = false }: ChecklistExecutorProps) {
  const router = useRouter();
  const [items, setItems] = useState<ChecklistItemData[]>(
    [...initial.items].sort((a, b) => a.order - b.order)
  );
  const [completing, setCompleting] = useState(false);
  const [status, setStatus] = useState(initial.status);

  const totalItems = items.length;
  const checkedItems = items.filter((i) => i.checked).length;
  const progress = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;
  const isCompleted = status === "completed";

  async function toggleItem(itemId: string, checked: boolean, value?: string) {
    const prevItems = items;
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, checked, value: value !== undefined ? value : item.value }
          : item
      )
    );

    try {
      const res = await fetch(`/api/checklists/${initial.id}/items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checked, value }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setItems(prevItems);
      toast.error("Erro ao atualizar item.");
    }
  }

  async function updateItemValue(itemId: string, value: string) {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, value } : item))
    );
  }

  async function handleBlurValue(itemId: string, value: string) {
    try {
      await fetch(`/api/checklists/${initial.id}/items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      });
    } catch {
      toast.error("Erro ao salvar valor.");
    }
  }

  async function handleComplete() {
    setCompleting(true);
    try {
      const res = await fetch(`/api/checklists/${initial.id}/complete`, {
        method: "POST",
      });
      if (!res.ok) throw new Error();
      setStatus("completed");
      toast.success("Checklist concluído!");
      router.refresh();
    } catch {
      toast.error("Erro ao concluir checklist.");
    } finally {
      setCompleting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              {checkedItems} de {totalItems} itens
            </span>
            <Badge
              className={cn(
                "text-xs",
                isCompleted
                  ? "bg-accent text-accent-foreground"
                  : "bg-primary text-primary-foreground"
              )}
            >
              {isCompleted ? "Concluído" : `${progress}%`}
            </Badge>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300",
                isCompleted ? "bg-accent" : "bg-primary"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-foreground text-base">Itens do checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg border transition-colors",
                item.checked
                  ? "bg-accent/5 border-accent/20"
                  : "bg-muted/30 border-border hover:bg-muted/50"
              )}
            >
              {item.fieldType === "checkbox" ? (
                <button
                  type="button"
                  className="mt-0.5 flex-shrink-0"
                  onClick={() => !isCompleted && toggleItem(item.id, !item.checked)}
                  disabled={isCompleted}
                >
                  {item.checked ? (
                    <CheckSquare className="h-5 w-5 text-accent" />
                  ) : (
                    <Square className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  className="mt-0.5 flex-shrink-0"
                  onClick={() => !isCompleted && toggleItem(item.id, !item.checked)}
                  disabled={isCompleted}
                >
                  {item.checked ? (
                    <CheckSquare className="h-5 w-5 text-accent" />
                  ) : (
                    <Square className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
              )}
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-sm font-medium",
                    item.checked ? "line-through text-muted-foreground" : "text-foreground"
                  )}
                >
                  {item.label}
                </p>
                {item.fieldType !== "checkbox" && (
                  <Input
                    className="mt-2 bg-background text-sm h-8"
                    type={item.fieldType === "number" ? "number" : "text"}
                    placeholder={
                      item.fieldType === "currency"
                        ? "R$ 0,00"
                        : item.fieldType === "number"
                        ? "0"
                        : "Digite aqui..."
                    }
                    value={item.value ?? ""}
                    onChange={(e) => updateItemValue(item.id, e.target.value)}
                    onBlur={(e) => handleBlurValue(item.id, e.target.value)}
                    disabled={isCompleted}
                  />
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Actions */}
      {!isCompleted && (
        <div className="flex justify-end gap-3">
          <Button
            onClick={handleComplete}
            disabled={completing || checkedItems === 0}
            className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2"
          >
            <Check className="h-4 w-4" />
            {completing ? "Concluindo..." : "Concluir checklist"}
          </Button>
        </div>
      )}

      {isCompleted && canPdf && (
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            className="gap-2"
            onClick={async () => {
              try {
                const res = await fetch(`/api/checklists/${initial.id}/complete`, {
                  method: "POST",
                });
                if (res.ok) {
                  const data = await res.json();
                  if (data.pdfUrl) {
                    window.open(data.pdfUrl, "_blank");
                  }
                }
              } catch {
                toast.error("Erro ao gerar PDF.");
              }
            }}
          >
            <FileDown className="h-4 w-4" />
            Baixar relatório PDF
          </Button>
        </div>
      )}
    </div>
  );
}
