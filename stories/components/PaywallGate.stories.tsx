import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PaywallGate } from "../../components/paywall/PaywallGate";

const meta: Meta<typeof PaywallGate> = {
  title: "Components/PaywallGate",
  component: PaywallGate,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    locked: { control: "boolean" },
    feature: { control: "text" },
    description: { control: "text" },
  },
};
export default meta;

type Story = StoryObj<typeof PaywallGate>;

export const QrCodeGate: Story = {
  args: {
    feature: "QR Code do Template",
    description: "Gere um QR Code para seu template e cole onde precisar.",
    locked: true,
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export const PdfGate: Story = {
  args: {
    feature: "Relatório em PDF",
    description: "Exporte um relatório completo com data, hora e campos preenchidos.",
    locked: true,
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export const MoreTemplatesGate: Story = {
  args: {
    feature: "Templates ilimitados",
    description: "O plano FREE permite apenas 1 template. Faça upgrade para criar quantos quiser.",
    locked: true,
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export const Unlocked: Story = {
  args: {
    feature: "QR Code do Template",
    description: "Esta feature está desbloqueada.",
    locked: false,
    children: (
      <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
        <p className="text-sm text-accent font-medium">Feature desbloqueada!</p>
      </div>
    ) as any,
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};
