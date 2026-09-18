import React, { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import {
  FaBold,
  FaItalic,
  FaListOl,
  FaListUl,
  FaQuoteLeft,
  FaRedo,
  FaUndo,
} from "react-icons/fa";

/*
=================================================
 TOOLBAR BUTTON
=================================================
*/
const ToolbarButton = ({
  onClick,
  active = false,
  disabled = false,
  title,
  children,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2 text-sm transition ${
        active
          ? "border-blue-500 bg-blue-50 text-blue-700"
          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
      } ${
        disabled
          ? "cursor-not-allowed opacity-40"
          : "cursor-pointer"
      }`}
    >
      {children}
    </button>
  );
};

/*
=================================================
 RICH TEXT EDITOR
=================================================
*/
const RichTextEditor = ({ value = "", onChange }) => {
  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
    ],

    content: value || "<p></p>",

    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
  });

  /*
  =================================================
   KEEP EDITOR IN SYNC WITH FORM DATA
  =================================================
  */
  useEffect(() => {
    if (!editor) return;

    const newContent = value || "<p></p>";
    const currentContent = editor.getHTML();

    if (newContent !== currentContent) {
      editor.commands.setContent(newContent, {
        emitUpdate: false,
      });
    }
  }, [editor, value]);

  if (!editor) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-500">
        Loading editor...
      </div>
    );
  }

  /*
  =================================================
   TOOLBAR ACTIONS
  =================================================
  */

  const toggleHeading = (level) => {
    editor.chain().focus().toggleHeading({ level }).run();
  };

  const clearFormatting = () => {
    editor
      .chain()
      .focus()
      .clearNodes()
      .unsetAllMarks()
      .run();
  };

  return (
    <div className="rounded-lg border border-gray-300 bg-white">
      {/* =========================================
          TOOLBAR
      ========================================= */}
      <div className="sticky top-0 z-20 flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 p-2">

        {/* Paragraph */}
        <ToolbarButton
          title="Paragraph"
          active={editor.isActive("paragraph")}
          onClick={() =>
            editor.chain().focus().setParagraph().run()
          }
        >
          P
        </ToolbarButton>

        {/* H2 */}
        <ToolbarButton
          title="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => toggleHeading(2)}
        >
          H2
        </ToolbarButton>

        {/* H3 */}
        <ToolbarButton
          title="Heading 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => toggleHeading(3)}
        >
          H3
        </ToolbarButton>

        <div className="mx-1 h-6 w-px bg-gray-300" />

        {/* Bold */}
        <ToolbarButton
          title="Bold"
          active={editor.isActive("bold")}
          onClick={() =>
            editor.chain().focus().toggleBold().run()
          }
        >
          <FaBold />
        </ToolbarButton>

        {/* Italic */}
        <ToolbarButton
          title="Italic"
          active={editor.isActive("italic")}
          onClick={() =>
            editor.chain().focus().toggleItalic().run()
          }
        >
          <FaItalic />
        </ToolbarButton>

        <div className="mx-1 h-6 w-px bg-gray-300" />

        {/* Bullet List */}
        <ToolbarButton
          title="Bullet List"
          active={editor.isActive("bulletList")}
          onClick={() =>
            editor.chain().focus().toggleBulletList().run()
          }
        >
          <FaListUl />
        </ToolbarButton>

        {/* Ordered List */}
        <ToolbarButton
          title="Numbered List"
          active={editor.isActive("orderedList")}
          onClick={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
        >
          <FaListOl />
        </ToolbarButton>

        {/* Blockquote */}
        <ToolbarButton
          title="Quote"
          active={editor.isActive("blockquote")}
          onClick={() =>
            editor.chain().focus().toggleBlockquote().run()
          }
        >
          <FaQuoteLeft />
        </ToolbarButton>

        <div className="mx-1 h-6 w-px bg-gray-300" />

        {/* Clear Formatting */}
        <ToolbarButton
          title="Clear Formatting"
          onClick={clearFormatting}
        >
          Tx
        </ToolbarButton>

        <div className="ml-auto flex items-center gap-1">
          {/* Undo */}
          <ToolbarButton
            title="Undo"
            disabled={!editor.can().chain().focus().undo().run()}
            onClick={() =>
              editor.chain().focus().undo().run()
            }
          >
            <FaUndo />
          </ToolbarButton>

          {/* Redo */}
          <ToolbarButton
            title="Redo"
            disabled={!editor.can().chain().focus().redo().run()}
            onClick={() =>
              editor.chain().focus().redo().run()
            }
          >
            <FaRedo />
          </ToolbarButton>
        </div>
      </div>

      {/* =========================================
          EDITOR AREA
      ========================================= */}
      <div
        className="
          min-h-[420px]
          px-4
          py-4
          [&_.ProseMirror]:min-h-[380px]
          [&_.ProseMirror]:outline-none
          [&_.ProseMirror]:text-gray-800
          [&_.ProseMirror]:leading-7

          [&_.ProseMirror_p]:mb-4

          [&_.ProseMirror_h2]:mb-3
          [&_.ProseMirror_h2]:mt-7
          [&_.ProseMirror_h2]:text-2xl
          [&_.ProseMirror_h2]:font-bold
          [&_.ProseMirror_h2]:text-gray-900

          [&_.ProseMirror_h3]:mb-2
          [&_.ProseMirror_h3]:mt-6
          [&_.ProseMirror_h3]:text-xl
          [&_.ProseMirror_h3]:font-semibold
          [&_.ProseMirror_h3]:text-gray-900

          [&_.ProseMirror_ul]:mb-4
          [&_.ProseMirror_ul]:list-disc
          [&_.ProseMirror_ul]:pl-6

          [&_.ProseMirror_ol]:mb-4
          [&_.ProseMirror_ol]:list-decimal
          [&_.ProseMirror_ol]:pl-6

          [&_.ProseMirror_li]:mb-1

          [&_.ProseMirror_blockquote]:my-5
          [&_.ProseMirror_blockquote]:border-l-4
          [&_.ProseMirror_blockquote]:border-gray-300
          [&_.ProseMirror_blockquote]:pl-4
          [&_.ProseMirror_blockquote]:italic
          [&_.ProseMirror_blockquote]:text-gray-600
        "
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;