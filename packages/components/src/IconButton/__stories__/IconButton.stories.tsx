import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { IconButton } from "../IconButton";

const meta = {
  title: "Components/IconButton",
  component: IconButton,
  args: {
    onClick: fn()
  }
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    type: "normal",
    name: "Chrome"
  }
};

export const Folder: Story = {
  args: {
    type: "folder",
    name: "Applications"
  }
};

export const Empty: Story = {
  args: {
    type: "empty"
  }
};

export const Horizontal: Story = {
  args: {
    type: "normal",
    name: "Safari",
    layout: "horizontal"
  }
};
