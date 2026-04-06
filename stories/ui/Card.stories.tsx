import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { FileText, CheckSquare } from "lucide-react";

const meta: Meta = {
  title: "UI/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
};
export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => (
    <Card className="w-80 bg-card border-border">
      <CardHeader>
        <CardTitle>Checklist de viagem</CardTitle>
        <CardDescription>Template para viagens internacionais</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">5 itens · Criado há 3 dias</p>
      </CardContent>
    </Card>
  ),
};

export const WithBadge: Story = {
  render: () => (
    <Card className="w-80 bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Reunião semanal</CardTitle>
          <Badge className="bg-accent text-accent-foreground">Concluído</Badge>
        </div>
        <CardDescription>Pauta e tarefas da reunião</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full w-full bg-accent rounded-full" />
        </div>
        <p className="text-xs text-muted-foreground mt-2">8/8 itens concluídos</p>
      </CardContent>
    </Card>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <Card className="w-80 bg-card border-border">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 rounded-lg p-2">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">Templates</CardTitle>
            <CardDescription>3 templates ativos</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Button size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          Ver todos
        </Button>
      </CardContent>
    </Card>
  ),
};

export const Dashed: Story = {
  render: () => (
    <Card className="w-80 bg-card border-border border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-10 text-center">
        <CheckSquare className="h-10 w-10 text-muted-foreground mb-3" />
        <p className="text-muted-foreground text-sm mb-3">Nenhum template ainda</p>
        <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
          Criar primeiro template
        </Button>
      </CardContent>
    </Card>
  ),
};
