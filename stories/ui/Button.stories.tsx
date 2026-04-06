import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "../../components/ui/button";
import { Plus, Zap, Trash2 } from "lucide-react";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
    },
    disabled: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Criar template",
    variant: "default",
  },
};

export const Primary: Story = {
  args: {
    children: "Começar grátis",
    className: "bg-primary text-primary-foreground hover:bg-primary/90",
  },
};

export const Accent: Story = {
  args: {
    children: "Concluir checklist",
    className: "bg-accent text-accent-foreground hover:bg-accent/90",
  },
};

export const Outline: Story = {
  args: {
    children: "Cancelar",
    variant: "outline",
  },
};

export const Destructive: Story = {
  args: {
    children: "Excluir",
    variant: "destructive",
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Plus className="h-4 w-4" />
        Novo template
      </>
    ),
    className: "bg-primary text-primary-foreground hover:bg-primary/90",
  },
};

export const Upgrade: Story = {
  args: {
    children: (
      <>
        <Zap className="h-4 w-4" />
        Fazer upgrade para PRO
      </>
    ),
    className: "bg-primary text-primary-foreground hover:bg-primary/90",
  },
};

export const Small: Story = {
  args: {
    children: "Iniciar",
    size: "sm",
    className: "bg-primary text-primary-foreground hover:bg-primary/90",
  },
};

export const Disabled: Story = {
  args: {
    children: "Salvando...",
    disabled: true,
    className: "bg-primary text-primary-foreground",
  },
};
