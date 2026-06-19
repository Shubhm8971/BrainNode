import { motion } from 'framer-motion';

export default function TopicCard({ id, title, status, onDelete, onMarkDone }) {
  const isDone = status === "Done";
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, x: -50 }}
      className={`p-4 my-3 border rounded-xl flex justify-between items-center transition-all shadow-sm ${
        isDone ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'
      }`}
    >
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          {title} 
        </h3>
        {/* Status Badge */}
        <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${
          isDone ? 'bg-green-200 text-green-800' : 'bg-amber-200 text-amber-800'
        }`}>
          {status}
        </span>
      </div>

      <div className="flex gap-2">
        {!isDone && (
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => onMarkDone(id)} 
            className="px-3 py-1.5 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-colors"
          >
            Done ✓
          </motion.button>
        )}
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => onDelete(id)} 
          className="px-3 py-1.5 bg-red-500 text-white text-sm font-bold rounded-lg hover:bg-red-600 transition-colors"
        >
          Delete 🗑️
        </motion.button>
      </div>
    </motion.div>
  );
}