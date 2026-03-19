import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { NavigationButton } from "../NavigationButton";

const meta = {
  title: "Components/NavigationButton",
  component: NavigationButton
} satisfies Meta<typeof NavigationButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Left: Story = {
  args: {
    direction: "left",
    onClick: fn()
  }
};

export const Right: Story = {
  args: {
    direction: "right",
    onClick: fn()
  }
};
