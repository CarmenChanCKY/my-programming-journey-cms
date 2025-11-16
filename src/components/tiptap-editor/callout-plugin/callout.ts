import { mergeAttributes, Node } from "@tiptap/core";
import calloutItemList from "./callout-color-list";

export interface CalloutOptions {
  /**
   * HTML attributes to add to the callout element
   * @default {}
   * @example { class: 'foo' }
   */
  HTMLAttributes: Record<string, any>;
  colorList: Array<string>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    callout: {
      /**
       * Set a callout node
       */
      setCallout: (attributes: { color: string }) => ReturnType;
      /**
       * Toggle a callout node
       */
      toggleCallout: (attributes: { color: string }) => ReturnType;
      /**
       * Unset a callout node
       */
      unsetCallout: () => ReturnType;
    };
  }
}

/**
 * This extension allows you to create callout.
 */

export const Callout = Node.create<CalloutOptions>({
  name: "callout",

  addOptions() {
    return {
      colorList: calloutItemList,
      HTMLAttributes: {},
    };
  },

  content: "text*",

  marks: "",

  group: "block",

  defining: true,

  addAttributes() {
    return {
      color: {
        default: "primary",
        rendered: false,
      },
    };
  },

  parseHTML() {
    return [{ tag: "div" }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(
        {
          ...this.options.HTMLAttributes,
          class: `${
            node.attrs.color ? "post-callout-" + node.attrs.color : null
          } post-callout`,
        },
        HTMLAttributes
      ),
      ["div", { class: "callout-prefix" }],
      ["div", { class: "callout-content" }, 0],
    ];
  },

  addCommands() {
    return {
      setCallout:
        (attributes) =>
        ({ commands }) => {
          if (!this.options.colorList.includes(attributes.color)) {
            return false;
          }

          return commands.setNode(this.name, attributes);
        },
      toggleCallout:
        (attributes) =>
        ({ commands }) => {
          if (!this.options.colorList.includes(attributes.color)) {
            return false;
          }

          return commands.toggleNode(this.name, "paragraph", attributes);
        },
      unsetCallout:
        () =>
        ({ commands }) => {
          return commands.deleteNode(this.name);
        },
    };
  },
});
