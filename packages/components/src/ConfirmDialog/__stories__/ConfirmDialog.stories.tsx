import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";

import { ConfirmDialog } from "../ConfirmDialog";

const meta: Meta<typeof ConfirmDialog> = {
  title: "Components/ConfirmDialog",
  component: ConfirmDialog,
  args: {
    isOpen: true,
    onConfirm: fn(),
    onCancel: fn()
  }
};

export default meta;
type Story = StoryObj<typeof ConfirmDialog>;

export const Default: Story = {
  args: {
    title: "Discard changes?",
    message: "You have unsaved changes. Are you sure you want to close?"
  }
};

export const CustomLabels: Story = {
  args: {
    title: "Delete item",
    message: "This action cannot be undone.",
    confirmLabel: "Delete",
    cancelLabel: "Keep"
  }
};
