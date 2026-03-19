import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { ColorRow } from "../ColorRow";

const meta = {
  title: "Components/ColorRow",
  component: ColorRow,
  args: {
    onChange: fn()
  }
} satisfies Meta<typeof ColorRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Background",
    value: "#3498db"
  }
};

export const WithAlpha: Story = {
  args: {
    label: "Overlay",
    value: "rgba(0, 0, 0, 0.5)",
    showAlpha: true
  }
};
