import type { Meta, StoryObj } from "@storybook/react";
import { fn, expect, userEvent, within } from "storybook/test";
import { PositionGrid } from "../PositionGrid";

const POSITIONS = [
  "top-left",
  "top-center",
  "top-right",
  "center-left",
  "center",
  "center-right",
  "bottom-left",
  "bottom-center",
  "bottom-right"
];

const meta = {
  title: "Components/PositionGrid",
  component: PositionGrid,
  args: {
    options: POSITIONS,
    onChange: fn()
  }
} satisfies Meta<typeof PositionGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: "top-left"
  }
};

export const CenterSelected: Story = {
  args: {
    value: "center"
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole("button");
    await userEvent.click(buttons[0]);
    await expect(args.onChange).toHaveBeenCalledWith("top-left");
  }
};
