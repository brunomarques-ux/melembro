import type { Meta, StoryObj } from '@storybook/react';
import { HeroSection, HeroHeader } from '@/components/blocks/hero-section';

const meta: Meta<typeof HeroSection> = {
  title: 'Blocks/HeroSection',
  component: HeroSection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Seção hero animada da landing page do MeLembro. Usa `AnimatedGroup` com preset blur-slide, tokens de cor do `design-system/tokens.ts` (primary #4F46E5, accent #10B981, background #F9FAFB) e fonte Inter.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof HeroSection>;

export const Default: Story = {
  render: () => <HeroSection />,
};

export const HeaderOnly: Story = {
  name: 'Navbar (HeroHeader)',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div className="min-h-[200px] bg-background">
      <HeroHeader />
    </div>
  ),
};

export const HeaderScrolled: Story = {
  name: 'Navbar (com scroll simulado)',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div className="min-h-[200px] bg-background">
      {/* Simula aparência com scroll ativo aplicando classes manualmente */}
      <div className="fixed z-20 w-full border-b bg-background/80 backdrop-blur-xl shadow-sm">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <span className="text-lg font-semibold text-foreground">MeLembro</span>
          <div className="flex gap-3">
            <span className="text-sm text-muted-foreground">Funcionalidades</span>
            <span className="text-sm text-muted-foreground">Preços</span>
          </div>
        </div>
      </div>
    </div>
  ),
};
