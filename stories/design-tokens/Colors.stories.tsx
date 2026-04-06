import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import tokens from "../../design-system/tokens";

const ColorSwatch = ({
  name,
  value,
  textColor,
}: {
  name: string;
  value: string;
  textColor?: string;
}) => (
  <div className="flex flex-col gap-1">
    <div
      className="h-16 w-full rounded-lg border border-gray-200 shadow-sm"
      style={{ backgroundColor: value }}
    />
    <p className="text-xs font-medium text-gray-800">{name}</p>
    <p className="text-xs text-gray-500">{value}</p>
  </div>
);

function ColorPalette() {
  return (
    <div className="p-6 space-y-8 bg-white min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Design Tokens — Colors</h1>
        <p className="text-gray-500 text-sm">Fonte única de verdade para as cores do MeLembro</p>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Brand Colors</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(tokens.colors).map(([key, value]) => (
            <ColorSwatch key={key} name={key} value={value} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Sidebar Colors</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(tokens.sidebar).map(([key, value]) => (
            <ColorSwatch key={key} name={`sidebar.${key}`} value={value} />
          ))}
        </div>
      </section>
    </div>
  );
}

const meta: Meta = {
  title: "Design Tokens/Colors",
  component: ColorPalette,
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;

type Story = StoryObj;

export const AllColors: Story = {
  name: "All Colors",
};
