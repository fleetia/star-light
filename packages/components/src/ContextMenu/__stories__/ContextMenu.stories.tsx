import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { ContextMenu } from "../ContextMenu";

const meta = {
  title: "Components/ContextMenu",
  component: ContextMenu,
  decorators: [
    Story => (
      <div style={{ position: "relative", height: 200 }}>
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    x: 20,
    y: 20,
    items: [
      { label: "Edit", onClick: fn() },
      { label: "Duplicate", onClick: fn() },
      { label: "Move", onClick: fn() }
    ]
  }
};

export const WithDangerItem: Story = {
  args: {
    x: 20,
    y: 20,
    items: [
      { label: "Edit", onClick: fn() },
      { label: "Duplicate", onClick: fn() },
      { label: "Delete", onClick: fn(), variant: "danger" }
    ]
  }
};
