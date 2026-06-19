import { useState } from 'react';
import { motion } from 'framer-motion';

export default function TopicForm({ onAddTopic }) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation Logic
    if (title.trim().length < 3) {
      setError("Title must be at least 3 characters long.");
      return;
    }
    
    onAddTopic(title, "In Progress");
    setTitle(""); // Reset
    setError(""); // Clear error
  };

  return (
    <div className="mb-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input 
            type="text"
            placeholder="Add a new study topic..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError(""); // Clear error while typing
            }}
            className={`flex-grow p-4 border-2 rounded-xl focus:outline-none transition-all ${
              error ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-500'
            }`}
          />
          <motion.button 
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-blue-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg"
          >
            Add
          </motion.button>
        </div>
        {/* Error Message */}
        {error && (
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-red-500 text-sm font-medium ml-1"
          >
            {error}
          </motion.p>
        )}
      </form>
    </div>
  );
}