import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";

import { Button } from "../Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  args: {
    onClick: fn(),
    children: "Button"
  }
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: "primary" }
};

export const Secondary: Story = {
  args: { variant: "secondary" }
};

export const Ghost: Story = {
  args: { variant: "ghost" }
};

export const Danger: Story = {
  args: { variant: "danger" }
};

export const Small: Story = {
  args: { variant: "primary", size: "sm" }
};

export const Disabled: Story = {
  args: { variant: "primary", disabled: true }
};
