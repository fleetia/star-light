import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";

import { Modal } from "../Modal";

const meta: Meta<typeof Modal> = {
  title: "Components/Modal",
  component: Modal,
  args: {
    isOpen: true,
    onClose: fn()
  }
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  args: {
    title: "Modal Title",
    children: "Modal content goes here."
  }
};

export const Small: Story = {
  args: {
    title: "Small Modal",
    size: "sm",
    children: "A smaller modal dialog."
  }
};

export const Large: Story = {
  args: {
    title: "Large Modal",
    size: "lg",
    children: "A larger modal dialog with more room for content."
  }
};

export const NoTitle: Story = {
  args: {
    children: "Modal without a title header."
  }
};
