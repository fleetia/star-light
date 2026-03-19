import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";

import { Toggle } from "../Toggle";

const meta: Meta<typeof Toggle> = {
  title: "Components/Toggle",
  component: Toggle,
  args: {
    onChange: fn()
  }
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Off: Story = {
  args: {
    checked: false,
    label: "Notifications"
  }
};

export const On: Story = {
  args: {
    checked: true,
    label: "Notifications"
  }
};

export const Disabled: Story = {
  args: {
    checked: false,
    label: "Disabled toggle",
    disabled: true
  }
};

export const NoLabel: Story = {
  args: {
    checked: true
  }
};

function ToggleDemo() {
  const [checked, setChecked] = useState(false);
  return <Toggle label="Dark mode" checked={checked} onChange={setChecked} />;
}

export const Interactive: Story = {
  render: () => <ToggleDemo />
};
