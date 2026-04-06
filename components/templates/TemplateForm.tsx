"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, GripVertical, Save } from "lucide-react";
import { toast } from "sonner";

interface TemplateItem {
  id?: string;
  label: string;
  fieldType: string;
  required: boolean;
  order: number;
  options?: string[];
}

interface Category {
  id: string;
  name: string;
  color: string;
}

interface TemplateFormProps {
  initialData?: {
    id?: string;
    name: string;
    description?: string | null;
    categoryId?: string | null;
    items: TemplateItem[];
  };
  categories: Category[];
  maxItems?: number;
}

const FIELD_TYPES = [
  { value: "checkbox", label: "Checkbox" },
  { value: "text", label: "Texto" },
  { value: "number", label: "Número" },
  { value: "currency", label: "Valor (R$)" },
  { value: "select", label: "Seleção" },
];

export function TemplateForm({ initialData, categories, maxItems = Infinity }: TemplateFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? "");
  const [items, setItems] = useState<TemplateItem[]>(
    initialData?.items ?? [{ label: "", fieldType: "checkbox", required: false, order: 0 }]
  );
  const [saving, setSaving] = useState(false);

  function addItem() {
    if (items.length >= maxItems) {
      toast.error(`Limite de ${maxItems} itens por template no plano FREE.`);
      return;
    }
    setItems((prev) => [
      ...prev,
      { label: "", fieldType: "checkbox", required: false, order: prev.length },
    ]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof TemplateItem, value: string | boolean | number) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Nome do template é obrigatório.");
      return;
    }
    if (items.some((i) => !i.label.trim())) {
      toast.error("Todos os itens precisam ter um rótulo.");
      return;
    }

    setSaving(true);
    try {
      const url = initialData?.id
        ? `/api/templates/${initialData.id}`
        : "/api/templates";
      const method = initialData?.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          categoryId: categoryId || null,
          items: items.map((item, i) => ({ ...item, order: i })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Erro ao salvar template.");
      }

      toast.success(initialData?.id ? "Template atualizado!" : "Template criado!");
      router.push("/app/templates");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message ?? "Erro ao salvar template.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Informações do template</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Checklist de viagem"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve descrição do template"
            />
          </div>
          {categories.length > 0 && (
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={categoryId} onValueChange={(v) => setCategoryId(v ?? "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem categoria</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground">
              Itens{" "}
              <Badge variant="secondary" className="ml-2">
                {items.length}
                {maxItems !== Infinity ? `/${maxItems}` : ""}
              </Badge>
            </CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addItem}
              disabled={items.length >= maxItems}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Adicionar item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-6">
              Nenhum item. Clique em "Adicionar item" para começar.
            </p>
          )}
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <Input
                    value={item.label}
                    onChange={(e) => updateItem(index, "label", e.target.value)}
                    placeholder={`Item ${index + 1}`}
                    className="bg-background"
                  />
                </div>
                <Select
                  value={item.fieldType}
                  onValueChange={(v) => updateItem(index, "fieldType", v ?? "checkbox")}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FIELD_TYPES.map((ft) => (
                      <SelectItem key={ft.value} value={ft.value}>
                        {ft.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive flex-shrink-0"
                onClick={() => removeItem(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/app/templates")}
          disabled={saving}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
          disabled={saving}
        >
          <Save className="h-4 w-4" />
          {saving ? "Salvando..." : "Salvar template"}
        </Button>
      </div>
    </form>
  );
}
