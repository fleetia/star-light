import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";

import { TextInput } from "../TextInput";

const meta: Meta<typeof TextInput> = {
  title: "Components/TextInput",
  component: TextInput,
  args: {
    onChange: fn()
  }
};

export default meta;
type Story = StoryObj<typeof TextInput>;

export const Default: Story = {
  args: {
    value: "",
    placeholder: "Enter text..."
  }
};

export const WithLabel: Story = {
  args: {
    label: "Email",
    value: "",
    placeholder: "you@example.com",
    type: "email"
  }
};

export const WithError: Story = {
  args: {
    label: "Username",
    value: "ab",
    error: "Username must be at least 3 characters."
  }
};

function TextInputDemo() {
  const [value, setValue] = useState("");
  return (
    <TextInput
      label="Name"
      value={value}
      onChange={setValue}
      placeholder="Type here..."
    />
  );
}

export const Interactive: Story = {
  render: () => <TextInputDemo />
};
