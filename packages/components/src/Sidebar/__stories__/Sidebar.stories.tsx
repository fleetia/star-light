import type { Meta, StoryObj } from "@storybook/react";
import { Sidebar } from "../Sidebar";

const meta = {
  title: "Components/Sidebar",
  component: Sidebar,
  decorators: [
    Story => (
      <div style={{ display: "flex", height: 400, border: "1px solid #ccc" }}>
        <div style={{ flex: 1, padding: 16 }}>Main Content</div>
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div style={{ padding: 16 }}>
        <h3>Sidebar Content</h3>
        <p>Settings panel goes here.</p>
      </div>
    ),
    position: "right"
  }
};

export const LeftPosition: Story = {
  args: {
    children: (
      <div style={{ padding: 16 }}>
        <h3>Left Sidebar</h3>
        <p>Navigation panel goes here.</p>
      </div>
    ),
    position: "left"
  },
  decorators: [
    Story => (
      <div style={{ display: "flex", height: 400, border: "1px solid #ccc" }}>
        <Story />
        <div style={{ flex: 1, padding: 16 }}>Main Content</div>
      </div>
    )
  ]
};
