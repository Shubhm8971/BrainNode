import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';
import RichTextEditor from './RichTextEditor';

export default function TopicCard({ id, title, status, content: initialContent, onDelete, onMarkDone }) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(initialContent || '');
  const isDone = status === "Done";

  const handleContentUpdate = async (newContent) => {
    setContent(newContent);
    const { error } = await supabase
      .from('topics')
      .update({ content: newContent })
      .eq('id', id);

    if (error) toast.error("Failed to save note");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, x: -50 }}
      className={`p-4 my-3 border rounded-xl transition-all shadow-sm ${
        isDone ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${
            isDone ? 'bg-green-200 text-green-800' : 'bg-amber-200 text-amber-800'
          }`}>
            {status}
          </span>
        </div>
        
        <div className="flex gap-2">
          {!isDone && (
            <button onClick={() => onMarkDone(id)} className="text-sm font-bold text-green-700 hover:text-green-900">Done ✓</button>
          )}
          <button onClick={() => onDelete(id)} className="text-sm font-bold text-red-500 hover:text-red-700">Delete 🗑️</button>
        </div>
      </div>

      {/* Rich Text Section */}
      <div className="mt-2">
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs text-blue-600 font-medium mb-2 hover:underline"
        >
          {isEditing ? 'Save Note' : content ? 'Edit Note' : '+ Add Note'}
        </button>

        {isEditing ? (
          <RichTextEditor content={content} onChange={handleContentUpdate} />
        ) : (
          <div 
            className="prose prose-sm max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: content || '<p class="text-gray-400 italic">No notes yet...</p>' }} 
          />
        )}
      </div>
    </motion.div>
  );
}