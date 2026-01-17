import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List } from "lucide-react";

export function DescriptionEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex gap-2 border p-2 rounded-md bg-gray-50">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="p-1 hover:bg-gray-200 rounded"
        >
          <Bold size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="p-1 hover:bg-gray-200 rounded"
        >
          <Italic size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="p-1 hover:bg-gray-200 rounded"
        >
          <List size={16} />
        </button>
      </div>

      {/* Editor */}
      <div className="p-2 min-h-[120px] rounded">
        <EditorContent editor={editor} className="focus:outline-none" />
      </div>

      {/* Character Counter */}
      <div className="text-xs text-gray-500">
        Characters: {editor.getText().length}/5000
      </div>
    </div>
  );
}
