import type { Meta, StoryObj } from '@storybook/react';
import { AnimatedGroup } from '@/components/ui/animated-group';

const meta: Meta<typeof AnimatedGroup> = {
  title: 'UI/AnimatedGroup',
  component: AnimatedGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Componente de animação em grupo usando Framer Motion. Aplica animações escalonadas nos filhos. Fonte única: `design-system/tokens.ts`.',
      },
    },
  },
  argTypes: {
    preset: {
      control: 'select',
      options: ['fade', 'slide', 'scale', 'blur', 'blur-slide', 'zoom', 'flip', 'bounce', 'rotate', 'swing'],
      description: 'Preset de animação pré-definido',
    },
  },
};

export default meta;
type Story = StoryObj<typeof AnimatedGroup>;

const DemoCard = ({ label }: { label: string }) => (
  <div className="rounded-xl border border-border bg-card px-6 py-4 shadow-sm text-sm font-medium text-foreground">
    {label}
  </div>
);

export const Fade: Story = {
  args: { preset: 'fade' },
  render: (args) => (
    <AnimatedGroup {...args} className="flex flex-col gap-3">
      <DemoCard label="Item 1 — fade" />
      <DemoCard label="Item 2 — fade" />
      <DemoCard label="Item 3 — fade" />
    </AnimatedGroup>
  ),
};

export const BlurSlide: Story = {
  args: { preset: 'blur-slide' },
  render: (args) => (
    <AnimatedGroup {...args} className="flex flex-col gap-3">
      <DemoCard label="Item 1 — blur-slide" />
      <DemoCard label="Item 2 — blur-slide" />
      <DemoCard label="Item 3 — blur-slide" />
    </AnimatedGroup>
  ),
};

export const Bounce: Story = {
  args: { preset: 'bounce' },
  render: (args) => (
    <AnimatedGroup {...args} className="flex flex-col gap-3">
      <DemoCard label="Item 1 — bounce" />
      <DemoCard label="Item 2 — bounce" />
      <DemoCard label="Item 3 — bounce" />
    </AnimatedGroup>
  ),
};

export const Zoom: Story = {
  args: { preset: 'zoom' },
  render: (args) => (
    <AnimatedGroup {...args} className="flex flex-col gap-3">
      <DemoCard label="Item 1 — zoom" />
      <DemoCard label="Item 2 — zoom" />
      <DemoCard label="Item 3 — zoom" />
    </AnimatedGroup>
  ),
};

export const GridLayout: Story = {
  args: { preset: 'blur-slide' },
  render: (args) => (
    <AnimatedGroup {...args} className="grid grid-cols-3 gap-3 w-[500px]">
      {Array.from({ length: 6 }).map((_, i) => (
        <DemoCard key={i} label={`Card ${i + 1}`} />
      ))}
    </AnimatedGroup>
  ),
};
