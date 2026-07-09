import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export default function RichTextEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML()); // Saves the content as HTML
    },
  });

  if (!editor) return null;

  return (
    <div className="border rounded p-2 min-h-[150px] bg-gray-50">
      {/* Simple toolbar */}
      <div className="flex gap-2 mb-2 border-b pb-2">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className="font-bold">B</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className="italic">I</button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()}>List</button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}