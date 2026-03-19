import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { RangeInput } from "../RangeInput";

const meta = {
  title: "Components/RangeInput",
  component: RangeInput,
  args: {
    onChange: fn()
  }
} satisfies Meta<typeof RangeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Opacity",
    value: 50,
    min: 0,
    max: 100
  }
};

export const WithDisplayValue: Story = {
  args: {
    label: "Font Size",
    value: 16,
    min: 8,
    max: 72,
    displayValue: "16px"
  }
};

export const WithStep: Story = {
  args: {
    label: "Volume",
    value: 0.5,
    min: 0,
    max: 1,
    step: 0.1,
    displayValue: "50%"
  }
};
