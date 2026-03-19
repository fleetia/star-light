import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { Breadcrumb } from "../Breadcrumb";

const meta = {
  title: "Components/Breadcrumb",
  component: Breadcrumb
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { label: "Home", onClick: fn() },
      { label: "Settings", onClick: fn() },
      { label: "Theme" }
    ]
  }
};

export const WithMultipleItems: Story = {
  args: {
    items: [
      { label: "Root", onClick: fn() },
      { label: "Projects", onClick: fn() },
      { label: "Launchpad", onClick: fn() },
      { label: "Components", onClick: fn() },
      { label: "Breadcrumb" }
    ]
  }
};

export const SingleItem: Story = {
  args: {
    items: [{ label: "Home" }]
  }
};
