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
import { FileText, MoreVertical, Play, Edit, Trash2, QrCode } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useRouter } from "next/navigation";

interface TemplateCardProps {
  template: {
    id: string;
    name: string;
    description?: string | null;
    createdAt: Date;
    category?: { name: string; color: string } | null;
    _count?: { items: number; checklists: number };
  };
  onDelete?: (id: string) => void;
  canQrCode?: boolean;
}

export function TemplateCard({ template, onDelete, canQrCode = false }: TemplateCardProps) {
  const router = useRouter();

  return (
    <Card className="group hover:shadow-md transition-shadow bg-card border-border">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="bg-primary/10 rounded-lg p-2 flex-shrink-0">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-sm font-semibold text-foreground truncate">
                {template.name}
              </CardTitle>
              {template.category && (
                <Badge
                  variant="secondary"
                  className="mt-1 text-xs"
                  style={{ borderColor: template.category.color, color: template.category.color }}
                >
                  {template.category.name}
                </Badge>
              )}
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
              <DropdownMenuItem onClick={() => router.push(`/app/templates/${template.id}`)}>
                <Edit className="h-4 w-4" />
                Editar template
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/app/checklists/new?templateId=${template.id}`)}>
                <Play className="h-4 w-4" />
                Iniciar checklist
              </DropdownMenuItem>
              {canQrCode && (
                <DropdownMenuItem>
                  <QrCode className="h-4 w-4" />
                  Ver QR Code
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete?.(template.id)}
              >
                <Trash2 className="h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {template.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {template.description}
          </p>
        )}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{template._count?.items ?? 0} itens</span>
          <span>
            {formatDistanceToNow(new Date(template.createdAt), {
              addSuffix: true,
              locale: ptBR,
            })}
          </span>
        </div>
        <Link href={`/app/checklists/new?templateId=${template.id}`} className="block mt-3">
          <Button
            size="sm"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
          >
            <Play className="h-3 w-3" />
            Iniciar checklist
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
