import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";

import { Tabs } from "../Tabs";

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
  args: {
    onChange: fn()
  }
};

export default meta;
type Story = StoryObj<typeof Tabs>;

const items = [
  { key: "appearance", label: "Appearance" },
  { key: "layout", label: "Layout" },
  { key: "settings", label: "Settings" }
];

export const Primary: Story = {
  args: {
    items,
    activeKey: "appearance",
    variant: "primary"
  }
};

export const Secondary: Story = {
  args: {
    items: [
      { key: "background", label: "Background" },
      { key: "container", label: "Container" },
      { key: "bookmark", label: "Bookmark" },
      { key: "folder", label: "Folder" }
    ],
    activeKey: "background",
    variant: "secondary"
  }
};

function TabsDemo() {
  const [active, setActive] = useState("appearance");
  return <Tabs items={items} activeKey={active} onChange={setActive} />;
}

export const Interactive: Story = {
  render: () => <TabsDemo />
};
