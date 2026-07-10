import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';
import RichTextEditor from './RichTextEditor';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize directly (ensure you have your key in .env)
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export default function TopicCard({ id, title, status, content: initialContent, onDelete, onMarkDone }) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(initialContent || '');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const isDone = status === "Done";

  const handleContentUpdate = async (newContent) => {
    setContent(newContent);
    const { error } = await supabase.from('topics').update({ content: newContent }).eq('id', id);
    if (error) toast.error("Failed to save note");
  };

  const handleSummarize = async () => {
    if (!content) return toast.error("Add content first!");
    
    setIsSummarizing(true);
    toast.loading("AI is summarizing...");
    
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(`Summarize this: ${content}`);
      const summary = result.response.text();

      const summarizedContent = `<strong>Summary:</strong> ${summary}<br><br>${content}`;
      await handleContentUpdate(summarizedContent);
      
      toast.dismiss();
      toast.success("Note summarized!");
    } catch (err) {
      toast.dismiss();
      toast.error("Summarization failed. Check console.");
      console.error(err);
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    // ... your existing JSX remains the same
    <motion.div className={`p-4 my-3 border rounded-xl shadow-sm ${isDone ? 'bg-green-50' : 'bg-blue-50'}`}>
       {/* ... rest of your UI */}
       <button onClick={handleSummarize} disabled={isSummarizing}>
         {isSummarizing ? 'Summarizing...' : '✨ AI Summarize'}
       </button>
    </motion.div>
  );
}