import type { Meta, StoryObj } from "@storybook/react";

import { Badge } from "../Badge";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Active: Story = {
  args: {
    variant: "active",
    children: "Active"
  }
};

export const Inactive: Story = {
  args: {
    variant: "inactive",
    children: "Inactive"
  }
};

export const Default: Story = {
  args: {
    variant: "default",
    children: "Default"
  }
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "8px" }}>
      <Badge variant="active">Active</Badge>
      <Badge variant="inactive">Inactive</Badge>
      <Badge variant="default">Default</Badge>
    </div>
  )
};
