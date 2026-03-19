import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";

import { Tree, type TreeItem } from "../Tree";

const meta: Meta<typeof Tree> = {
  title: "Components/Tree",
  component: Tree,
  args: {
    onToggle: fn()
  }
};

export default meta;
type Story = StoryObj<typeof Tree>;

const sampleItems: TreeItem[] = [
  {
    id: "1",
    label: "Documents",
    expanded: true,
    children: [
      { id: "1-1", label: "Resume.pdf", visible: true },
      { id: "1-2", label: "Cover Letter.pdf", visible: true },
      {
        id: "1-3",
        label: "Projects",
        expanded: false,
        children: [
          { id: "1-3-1", label: "Project A", visible: true },
          { id: "1-3-2", label: "Project B", visible: false }
        ]
      }
    ]
  },
  {
    id: "2",
    label: "Images",
    expanded: false,
    children: [
      { id: "2-1", label: "Photo.png", visible: true },
      { id: "2-2", label: "Screenshot.jpg", visible: true }
    ]
  },
  {
    id: "3",
    label: "Notes.txt",
    visible: true
  }
];

export const Default: Story = {
  args: {
    items: sampleItems
  }
};

export const WithVisibilityToggle: Story = {
  args: {
    items: sampleItems,
    onVisibilityToggle: fn()
  }
};

export const WithReorder: Story = {
  args: {
    items: sampleItems,
    onReorder: fn(),
    onVisibilityToggle: fn()
  }
};

function TreeDemo() {
  const [items, setItems] = useState<TreeItem[]>(sampleItems);

  const toggleExpand = (id: string) => {
    const toggle = (nodes: TreeItem[]): TreeItem[] =>
      nodes.map(node => {
        if (node.id === id) {
          return { ...node, expanded: !node.expanded };
        }
        if (node.children) {
          return { ...node, children: toggle(node.children) };
        }
        return node;
      });
    setItems(toggle(items));
  };

  const toggleVisibility = (id: string) => {
    const toggle = (nodes: TreeItem[]): TreeItem[] =>
      nodes.map(node => {
        if (node.id === id) {
          return { ...node, visible: !(node.visible ?? true) };
        }
        if (node.children) {
          return { ...node, children: toggle(node.children) };
        }
        return node;
      });
    setItems(toggle(items));
  };

  return (
    <Tree
      items={items}
      onToggle={toggleExpand}
      onVisibilityToggle={toggleVisibility}
      onReorder={fn()}
    />
  );
}

export const Interactive: Story = {
  render: () => <TreeDemo />
};
