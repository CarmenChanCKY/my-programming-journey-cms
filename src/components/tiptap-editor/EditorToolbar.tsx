import { useCurrentEditor } from "@tiptap/react";
import { Tooltip } from "flowbite-react";
import {
  MdUndo,
  MdRedo,
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
  MdFormatStrikethrough,
  MdFormatListNumbered,
  MdFormatListBulleted,
  MdFormatAlignJustify,
  MdFormatAlignCenter,
  MdFormatAlignLeft,
  MdFormatAlignRight,
  MdOutlineFormatColorText,
  MdFormatColorFill,
  MdFormatQuote,
  MdKeyboardReturn,
  MdFormatClear,
  MdHorizontalRule,
  MdCode,
  MdAddLink,
} from "react-icons/md";
import IconButton from "@/components/ui/button/IconButton";
import { customTooltipTheme } from "@/helper/flowbiteTheme";
import CustomDropdownButton from "@/components/ui/button/CustomDropdownButton";
import { useCallback, useState } from "react";
import EditorColorPicker from "@/components/tiptap-editor/EditorColorPicker";
import prismLanguageList from "@/components/tiptap-editor/prism-plugin/language-list";
import { FaYoutube } from "react-icons/fa";
import calloutItemList from "./callout-plugin/callout-color-list";

function EditorToolbar() {
  const { editor } = useCurrentEditor();

  // for color picker
  const [openColorPicker, setOpenColorPicker] = useState(false);
  const [colorPickerType, setColorPickerType] = useState("");
  const [colorPickerColor, setColorPickerColor] = useState("#000000");

  const setEditorLink = useCallback(() => {
    const previousUrl = editor?.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    } else if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    try {
      editor
        ?.chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    } catch (e: any) {
      alert(e.message);
    }
  }, [editor]);

  const setEditorYoutubeLink = useCallback(() => {
    const url = window.prompt("Enter YouTube URL");

    if (url) {
      editor?.commands.setYoutubeVideo({ src: url });
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  const btnList: Array<Array<any>> = [
    /* undo, redo */
    [
      {
        type: "button",
        name: "undo",
        active: false,
        icon: <MdUndo />,
        tooltipText: "Undo",
        disabled: !editor.can().chain().focus().undo().run(),
        onClick: () => editor.chain().focus().undo().run(),
      },
      {
        type: "button",
        name: "redo",
        active: false,
        icon: <MdRedo />,
        tooltipText: "Redo",
        disabled: !editor.can().chain().focus().redo().run(),
        onClick: () => editor.chain().focus().redo().run(),
      },
    ],

    /* Paragraph, H1 - H6 */
    [
      {
        type: "dropdown",
        name: "textSize",
        active:
          editor?.isActive("heading", { level: 1 }) ||
          editor?.isActive("heading", { level: 2 }) ||
          editor?.isActive("heading", { level: 3 }) ||
          editor?.isActive("heading", { level: 4 }) ||
          editor?.isActive("heading", { level: 5 }) ||
          editor?.isActive("heading", { level: 6 }),
        text: () => {
          let text = "Paragraph";

          if (editor?.isActive("paragraph")) {
          } else if (editor?.isActive("heading", { level: 1 })) {
            text = "H1";
          } else if (editor?.isActive("heading", { level: 2 })) {
            text = "H2";
          } else if (editor?.isActive("heading", { level: 3 })) {
            text = "H3";
          } else if (editor?.isActive("heading", { level: 4 })) {
            text = "H4";
          } else if (editor?.isActive("heading", { level: 5 })) {
            text = "H5";
          } else if (editor?.isActive("heading", { level: 6 })) {
            text = "H6";
          }

          return text;
        },
        itemList: [
          {
            text: "Paragraph",
            onClick: () => {
              editor.chain().focus().setParagraph().run();
            },
          },
          {
            text: "H1",
            onClick: () => {
              editor.chain().focus().toggleHeading({ level: 1 }).run();
            },
          },
          {
            text: "H2",
            onClick: () => {
              editor.chain().focus().toggleHeading({ level: 2 }).run();
            },
          },
          {
            text: "H3",
            onClick: () => {
              editor.chain().focus().toggleHeading({ level: 3 }).run();
            },
          },
          {
            text: "H4",
            onClick: () => {
              editor.chain().focus().toggleHeading({ level: 4 }).run();
            },
          },
          {
            text: "H5",
            onClick: () => {
              editor.chain().focus().toggleHeading({ level: 5 }).run();
            },
          },
          {
            text: "H6",
            onClick: () => {
              editor.chain().focus().toggleHeading({ level: 6 }).run();
            },
          },
        ],
      },
    ],

    /* Bold, Italic, Underline, Strike */
    [
      {
        type: "button",
        name: "bold",
        active: editor.isActive("bold"),
        icon: <MdFormatBold />,
        tooltipText: "Bold",
        disabled: !editor.can().chain().focus().toggleBold().run(),
        onClick: () => editor.chain().focus().toggleBold().run(),
      },
      {
        type: "button",
        name: "italic",
        active: editor.isActive("italic"),
        icon: <MdFormatItalic />,
        tooltipText: "Italic",
        disabled: !editor.can().chain().focus().toggleItalic().run(),
        onClick: () => editor.chain().focus().toggleItalic().run(),
      },
      {
        type: "button",
        name: "underline",
        active: editor.isActive("underline"),
        icon: <MdFormatUnderlined />,
        tooltipText: "Underline",
        disabled: !editor.can().chain().focus().toggleUnderline().run(),
        onClick: () => editor.chain().focus().toggleUnderline().run(),
      },
      {
        type: "button",
        name: "strike",
        active: editor.isActive("strike"),
        icon: <MdFormatStrikethrough />,
        tooltipText: "Strike",
        disabled: !editor.can().chain().focus().toggleStrike().run(),
        onClick: () => editor.chain().focus().toggleStrike().run(),
      },
    ],

    /* text align */
    [
      {
        type: "button",
        name: "leftAlign",
        active: editor.isActive({ textAlign: "left" }),
        icon: <MdFormatAlignLeft />,
        tooltipText: "Align Left",
        disabled: false,
        onClick: () => editor.chain().focus().setTextAlign("left").run(),
      },
      {
        type: "button",
        name: "centerAlign",
        active: editor.isActive({ textAlign: "center" }),
        icon: <MdFormatAlignCenter />,
        tooltipText: "Align Center",
        disabled: false,
        onClick: () => editor.chain().focus().setTextAlign("center").run(),
      },
      {
        type: "button",
        name: "rightAlign",
        active: editor.isActive({ textAlign: "right" }),
        icon: <MdFormatAlignRight />,
        tooltipText: "Align Right",
        disabled: false,
        onClick: () => editor.chain().focus().setTextAlign("right").run(),
      },
      {
        type: "button",
        name: "justify",
        active: editor.isActive({ textAlign: "justify" }),
        icon: <MdFormatAlignJustify />,
        tooltipText: "Justify",
        disabled: false,
        onClick: () => editor.chain().focus().setTextAlign("justify").run(),
      },
    ],

    /* text color, highlight text */
    [
      {
        type: "colorPicker",
        name: "textColor",
        active: editor.isActive("textStyle", "color"),
        icon: undefined,
        tooltipText: "Text Color",
        disabled: false,
        onClick: () => {
          setColorPickerType("textColor");
          setOpenColorPicker(true);
          setColorPickerColor(
            editor.getAttributes("textStyle").color ?? "#000000"
          );
        },
      },
      {
        type: "colorPicker",
        name: "highlight",
        active: editor.isActive("highlight"),
        icon: undefined,
        tooltipText: "Highlight",
        disabled: false,
        onClick: () => {
          setColorPickerType("highlight");
          setOpenColorPicker(true);
          setColorPickerColor(
            editor.getAttributes("highlight").color ?? "#000000"
          );
        },
      },
    ],

    /* inline code, code block */
    [
      {
        type: "button",
        name: "inlineCode",
        active: editor.isActive("code"),
        icon: <MdCode />,
        tooltipText: "Inline Code",
        disabled: !editor.can().chain().focus().toggleCode().run(),
        onClick: () => editor.chain().focus().toggleCode().run(),
      },
      {
        type: "dropdown",
        name: "codeBlock",
        active: editor.isActive("codeBlock"),
        text: () => {
          return "CODE";
        },
        itemList: prismLanguageList.map((obj) => {
          return {
            text: obj.text,
            onClick: () => {
              editor
                .chain()
                .focus()
                .toggleCodeBlock({ language: obj.value })
                .run();
            },
          };
        }),
      },
    ],

    /* bullet list, ordered list */
    [
      {
        type: "button",
        name: "bulletList",
        active: editor.isActive("bulletList"),
        icon: <MdFormatListBulleted />,
        tooltipText: "Bullet List",
        disabled: false,
        onClick: () => editor.chain().focus().toggleBulletList().run(),
      },
      {
        type: "button",
        name: "orderedList",
        active: editor.isActive("orderedList"),
        icon: <MdFormatListNumbered />,
        tooltipText: "Ordered List",
        disabled: false,
        onClick: () => editor.chain().focus().toggleOrderedList().run(),
      },
    ],

    /* link, image, youtube */
    /* TODO: image */
    [
      {
        type: "button",
        name: "link",
        active: editor.isActive("link"),
        icon: <MdAddLink />,
        tooltipText: "Link",
        disabled: !editor,
        onClick: () => setEditorLink(),
      },
      {
        type: "button",
        name: "youtubeEmbed",
        active: editor.isActive("youtube"),
        icon: <FaYoutube />,
        tooltipText: "Youtube",
        disabled: !editor,
        onClick: () => setEditorYoutubeLink(),
      },
    ],

    /* blockquote, callout, horizontal rule */
    [
      {
        type: "button",
        name: "blockquote",
        active: editor.isActive("blockquote"),
        icon: <MdFormatQuote />,
        tooltipText: "Blockquote",
        disabled: !editor.can().toggleBlockquote(),
        onClick: () => editor.commands.toggleBlockquote(),
      },
      {
        type: "dropdown",
        name: "callout",
        active: editor.isActive("callout"),
        text: () => {
          return "CALLOUT";
        },
        itemList: calloutItemList.map((color) => {
          return {
            text: color,
            onClick: () => {
              editor.chain().focus().toggleCallout({ color }).run();
            },
          };
        }),
      },
      {
        type: "button",
        name: "horizontalRule",
        active: false,
        icon: <MdHorizontalRule />,
        tooltipText: "Horizontal Rule",
        disabled: !editor.can().chain().focus().setHorizontalRule().run(),
        onClick: () => editor.chain().focus().setHorizontalRule().run(),
      },
    ],

    /* HardBreak, clear style */
    [
      {
        type: "button",
        name: "hardBreak",
        active: false,
        icon: <MdKeyboardReturn />,
        tooltipText: "HardBreak",
        disabled: !editor.can().chain().focus().setHardBreak().run(),
        onClick: () => editor.chain().focus().setHardBreak().run(),
      },

      {
        type: "button",
        name: "clearStyle",
        active: false,
        icon: <MdFormatClear />,
        tooltipText: "ClearStyle",
        onClick: () =>
          editor.chain().focus().clearNodes().unsetAllMarks().run(),
      },
    ],
  ];

  const onColorPickerUpdated = (
    type: "update" | "clear" | "close",
    color?: string
  ) => {
    if (type === "update") {
      if (colorPickerType === "textColor") {
        editor
          .chain()
          .focus()
          .setColor(color ?? "")
          .run();
      } else {
        editor
          .chain()
          .focus()
          .setHighlight({ color: color ?? "" })
          .run();
      }
    } else if (type === "clear") {
      if (colorPickerType === "textColor") {
        editor.chain().focus().unsetColor().run();
      } else {
        editor.chain().focus().unsetHighlight().run();
      }
    }

    setOpenColorPicker(false);
  };

  const genEditorToolbarBtn = (
    child: any,
    index: number,
    childIndex: number
  ) => {
    if (child.type === "button" || child.type === "colorPicker") {
      let color = undefined;
      let icon = child.icon;

      if (child.type === "button") {
        color = child.active ? "secondary" : "stone";
      } else if (child.type === "colorPicker") {
        color = "";

        if (child.name === "textColor") {
          color = editor.getAttributes("textStyle").color ?? "";
          icon = <MdOutlineFormatColorText color={color} />;
        } else {
          color = editor.getAttributes("highlight").color ?? "";
          icon = <MdFormatColorFill color={color} />;
        }
      }

      return (
        <Tooltip
          content={child.tooltipText}
          placement="bottom"
          key={`group-${index}-${childIndex}`}
          theme={customTooltipTheme}
        >
          <IconButton
            plain
            icon={icon}
            color={color}
            size="sm"
            disabled={child.disabled}
            onClick={(e) => {
              child.onClick();
            }}
          ></IconButton>
        </Tooltip>
      );
    } else if (child.type === "dropdown") {
      return (
        <CustomDropdownButton
          key={`group-${index}-${childIndex}`}
          text={child.text()}
          itemList={child.itemList}
          plain
          size="sm"
          color={child.active ? "secondary" : "stone"}
        ></CustomDropdownButton>
      );
    }

    return null;
  };

  // TODO: https://react-icons.github.io/react-icons/icons/md/
  // TODO: https://tiptap.dev/docs/examples/basics/default-text-editor
  // TODO: https://tiptap.dev/docs/editor/extensions/functionality/bubble-menu
  // TODO: https://tiptap.dev/docs/editor/extensions/nodes/table#page-title

  // TODO: https://egghead.io/lessons/vue-add-custom-routes-for-hidden-pages-with-vue-js-and-nuxt-js

  return (
    <div className="editor-toolbar">
      {btnList.map((parent, index) => {
        return (
          <div className="toolbar-group" key={`group-${index}`}>
            {parent.map((child, childIndex) => {
              return genEditorToolbarBtn(child, index, childIndex);
            })}
          </div>
        );
      })}

      <EditorColorPicker
        openDialog={openColorPicker}
        currentColor={colorPickerColor}
        showLoading={false}
        callback={onColorPickerUpdated}
      ></EditorColorPicker>
    </div>
  );
}

export default EditorToolbar;
