import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import tokens from "../../design-system/tokens";

function TypographyShowcase() {
  return (
    <div className="p-6 space-y-8 bg-white min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Design Tokens — Typography</h1>
        <p className="text-gray-500 text-sm">Escala tipográfica do MeLembro</p>
      </div>

      <section className="space-y-4">
        {Object.entries(tokens.typography).map(([key, value]) => (
          <div key={key} className="flex items-baseline gap-4 border-b border-gray-100 pb-3">
            <span className="text-xs text-gray-400 w-12 flex-shrink-0">{key}</span>
            <span className="text-xs text-gray-400 w-16 flex-shrink-0">{value}</span>
            <span style={{ fontSize: value }} className="text-gray-900 font-medium">
              Pare de recriar. Comece a lembrar.
            </span>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Font Weights</h2>
        <div className="space-y-3">
          {[
            { weight: "400", label: "Regular" },
            { weight: "500", label: "Medium" },
            { weight: "600", label: "Semibold" },
            { weight: "700", label: "Bold" },
          ].map(({ weight, label }) => (
            <div key={weight} className="flex items-baseline gap-4">
              <span className="text-xs text-gray-400 w-20">{label} {weight}</span>
              <span style={{ fontWeight: weight }} className="text-lg text-gray-900">
                MeLembro — Templates inteligentes
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const meta: Meta = {
  title: "Design Tokens/Typography",
  component: TypographyShowcase,
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;

type Story = StoryObj;

export const TypeScale: Story = {
  name: "Type Scale",
};
