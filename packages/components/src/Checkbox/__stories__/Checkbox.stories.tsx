import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";

import { Checkbox } from "../Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
  args: {
    onChange: fn()
  }
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Unchecked: Story = {
  args: {
    label: "Accept terms",
    checked: false
  }
};

export const Checked: Story = {
  args: {
    label: "Accept terms",
    checked: true
  }
};

export const Disabled: Story = {
  args: {
    label: "Disabled option",
    checked: false,
    disabled: true
  }
};

function CheckboxDemo() {
  const [checked, setChecked] = useState(false);
  return <Checkbox label="Toggle me" checked={checked} onChange={setChecked} />;
}

export const Interactive: Story = {
  render: () => <CheckboxDemo />
};
