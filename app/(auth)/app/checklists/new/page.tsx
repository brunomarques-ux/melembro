"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Item {
  label: string;
  fieldType: string;
}

function NewChecklistForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("templateId");

  const [name, setName] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState(templateId ?? "");
  const [customItems, setCustomItems] = useState<Item[]>([
    { label: "", fieldType: "checkbox" },
  ]);
  const [useTemplate, setUseTemplate] = useState(!!templateId);
  const [loading, setLoading] = useState(false);

  const { data: templates } = useQuery({
    queryKey: ["templates"],
    queryFn: () => fetch("/api/templates").then((r) => r.json()),
  });

  const selectedTemplate = templates?.find((t: any) => t.id === selectedTemplateId);

  function addItem() {
    setCustomItems((prev) => [...prev, { label: "", fieldType: "checkbox" }]);
  }

  function removeItem(i: number) {
    setCustomItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateItem(i: number, field: keyof Item, value: string) {
    setCustomItems((prev) => prev.map((item, idx) => (idx === i ? { ...item, [field]: value } : item)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Nome do checklist é obrigatório.");
      return;
    }

    setLoading(true);
    try {
      const body: any = { name };
      if (useTemplate && selectedTemplateId) {
        body.templateId = selectedTemplateId;
      } else {
        const validItems = customItems.filter((i) => i.label.trim());
        if (validItems.length === 0) {
          toast.error("Adicione pelo menos um item.");
          setLoading(false);
          return;
        }
        body.items = validItems.map((item, i) => ({
          label: item.label,
          fieldType: item.fieldType,
          order: i,
        }));
      }

      const res = await fetch("/api/checklists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Erro ao criar checklist.");
      }

      const checklist = await res.json();
      toast.success("Checklist criado!");
      router.push(`/app/checklists/${checklist.id}`);
    } catch (err: any) {
      toast.error(err.message ?? "Erro ao criar checklist.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Link
          href="/app/checklists"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para checklists
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Novo checklist</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Crie um checklist avulso ou a partir de um template
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-card border-border">
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do checklist *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Compras do mês"
                required
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant={useTemplate ? "default" : "outline"}
                size="sm"
                onClick={() => setUseTemplate(true)}
                className={useTemplate ? "bg-primary text-primary-foreground" : ""}
              >
                Usar template
              </Button>
              <Button
                type="button"
                variant={!useTemplate ? "default" : "outline"}
                size="sm"
                onClick={() => setUseTemplate(false)}
                className={!useTemplate ? "bg-primary text-primary-foreground" : ""}
              >
                Checklist avulso
              </Button>
            </div>
          </CardContent>
        </Card>

        {useTemplate ? (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground text-base">Selecionar template</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedTemplateId} onValueChange={(v) => setSelectedTemplateId(v ?? "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha um template" />
                </SelectTrigger>
                <SelectContent>
                  {templates?.map((t: any) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedTemplate && (
                <p className="text-sm text-muted-foreground">
                  {selectedTemplate._count?.items ?? 0} itens serão copiados do template.
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground text-base">Itens</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addItem} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {customItems.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={item.label}
                    onChange={(e) => updateItem(i, "label", e.target.value)}
                    placeholder={`Item ${i + 1}`}
                    className="flex-1"
                  />
                  <Select
                    value={item.fieldType}
                    onValueChange={(v) => updateItem(i, "fieldType", v ?? "checkbox")}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checkbox">Checkbox</SelectItem>
                      <SelectItem value="text">Texto</SelectItem>
                      <SelectItem value="number">Número</SelectItem>
                      <SelectItem value="currency">Valor</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(i)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={loading}
          >
            {loading ? "Criando..." : "Criar checklist"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function NewChecklistPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <NewChecklistForm />
    </Suspense>
  );
}
