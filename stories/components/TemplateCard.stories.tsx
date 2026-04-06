import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TemplateCard } from "../../components/templates/TemplateCard";

const meta: Meta<typeof TemplateCard> = {
  title: "Components/TemplateCard",
  component: TemplateCard,
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
    },
  },
};
export default meta;

type Story = StoryObj<typeof TemplateCard>;

const baseTemplate = {
  id: "tmpl_01",
  name: "Checklist de Viagem",
  description: "Lista completa para viagens internacionais com documentos e itens essenciais.",
  createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  _count: { items: 12, checklists: 5 },
};

export const Default: Story = {
  args: {
    template: baseTemplate,
    canQrCode: false,
  },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
};

export const WithCategory: Story = {
  args: {
    template: {
      ...baseTemplate,
      category: { name: "Viagem", color: "#10B981" },
    },
    canQrCode: false,
  },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
};

export const WithQrCode: Story = {
  args: {
    template: {
      ...baseTemplate,
      name: "Reunião Semanal",
      description: "Pauta e tarefas da reunião de time.",
      category: { name: "Trabalho", color: "#4F46E5" },
      _count: { items: 8, checklists: 20 },
    },
    canQrCode: true,
  },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
};

export const NoDescription: Story = {
  args: {
    template: {
      id: "tmpl_02",
      name: "Lista de Compras",
      createdAt: new Date(),
      _count: { items: 5, checklists: 2 },
    },
    canQrCode: false,
  },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
};

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 p-4 bg-background">
      <TemplateCard
        template={{ ...baseTemplate, name: "Viagem" }}
        canQrCode={false}
      />
      <TemplateCard
        template={{
          ...baseTemplate,
          id: "tmpl_2",
          name: "Reunião",
          category: { name: "Trabalho", color: "#4F46E5" },
        }}
        canQrCode={true}
      />
      <TemplateCard
        template={{
          ...baseTemplate,
          id: "tmpl_3",
          name: "Compras",
          description: null,
          _count: { items: 3, checklists: 10 },
        }}
        canQrCode={false}
      />
    </div>
  ),
  parameters: {
    layout: "fullscreen",
  },
};
