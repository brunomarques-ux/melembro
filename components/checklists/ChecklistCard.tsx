"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckSquare, MoreVertical, Play, Trash2, FileDown, Check } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface ChecklistCardProps {
  checklist: {
    id: string;
    name: string;
    status: string;
    startedAt: Date;
    completedAt?: Date | null;
    template?: { name: string } | null;
    _count?: { items: number };
    items?: { checked: boolean }[];
  };
  onDelete?: (id: string) => void;
  canPdf?: boolean;
}

export function ChecklistCard({ checklist, onDelete, canPdf = false }: ChecklistCardProps) {
  const router = useRouter();
  const isCompleted = checklist.status === "completed";
  const totalItems = checklist._count?.items ?? checklist.items?.length ?? 0;
  const checkedItems = checklist.items?.filter((i) => i.checked).length ?? 0;
  const progress = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  return (
    <Card
      className={cn(
        "group hover:shadow-md transition-shadow bg-card border-border",
        isCompleted && "opacity-80"
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={cn(
                "rounded-lg p-2 flex-shrink-0",
                isCompleted ? "bg-accent/10" : "bg-primary/10"
              )}
            >
              {isCompleted ? (
                <Check className="h-4 w-4 text-accent" />
              ) : (
                <CheckSquare className="h-4 w-4 text-primary" />
              )}
            </div>
            <div className="min-w-0">
              <CardTitle className="text-sm font-semibold text-foreground truncate">
                {checklist.name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  className={cn(
                    "text-xs",
                    isCompleted
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-secondary-foreground"
                  )}
                >
                  {isCompleted ? "Concluído" : "Ativo"}
                </Badge>
                {checklist.template && (
                  <span className="text-xs text-muted-foreground truncate">
                    {checklist.template.name}
                  </span>
                )}
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              {!isCompleted && (
                <DropdownMenuItem onClick={() => router.push(`/app/checklists/${checklist.id}`)}>
                  <Play className="h-4 w-4" />
                  Continuar
                </DropdownMenuItem>
              )}
              {isCompleted && canPdf && (
                <DropdownMenuItem>
                  <FileDown className="h-4 w-4" />
                  Baixar relatório PDF
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete?.(checklist.id)}
              >
                <Trash2 className="h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {totalItems > 0 && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>{checkedItems}/{totalItems} itens</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  isCompleted ? "bg-accent" : "bg-primary"
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {isCompleted && checklist.completedAt
              ? `Concluído ${formatDistanceToNow(new Date(checklist.completedAt), {
                  addSuffix: true,
                  locale: ptBR,
                })}`
              : `Iniciado ${formatDistanceToNow(new Date(checklist.startedAt), {
                  addSuffix: true,
                  locale: ptBR,
                })}`}
          </span>
        </div>
        {!isCompleted && (
          <Link href={`/app/checklists/${checklist.id}`} className="block mt-3">
            <Button
              size="sm"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            >
              <Play className="h-3 w-3" />
              Continuar checklist
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
