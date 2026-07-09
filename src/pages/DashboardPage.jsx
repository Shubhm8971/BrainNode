import { useRef, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import DashboardStats from '../components/DashboardStats';
import TopicForm from '../components/TopicForm';
import TopicCard from '../components/TopicCard';
import Skeleton from '../components/Skeleton';
import { useDashboard } from '../components/DashboardContext';

export default function DashboardPage() {
  const { 
    fact, isLoading, error, remainingCount, totalCount, 
    onAddTopic, searchQuery, setSearchQuery, searchedTopics, 
    onDeleteTopic, onMarkDone 
  } = useDashboard();

  // Local state for the new category feature
  const [selectedCategory, setSelectedCategory] = useState('General');
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Helper to handle the form submission with category
  const handleAddWithCategory = (title, status) => {
    onAddTopic(title, status, selectedCategory);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* API Block */}
      <div className="bg-white p-5 rounded-xl border-l-4 border-blue-500 shadow-sm mb-6 italic text-gray-700">
        <strong className="block text-blue-600 mb-1">💡 Random Fact:</strong>
        {isLoading && <p className="animate-pulse">⏳ Streaming live...</p>}
        {error && <p className="text-red-500">❌ {error}</p>}
        {!isLoading && !error && <p>"{fact}"</p>}
      </div>

      <DashboardStats remainingCount={remainingCount} totalCount={totalCount} />
      
      {/* Category Selection */}
      <div className="mb-4">
        <label className="text-sm font-semibold text-gray-600 block mb-1">Select Category:</label>
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2 border-2 border-gray-200 rounded-lg focus:border-blue-500"
        >
          <option value="General">General</option>
          <option value="Research">Research</option>
          <option value="Code">Code</option>
          <option value="Idea">Idea</option>
        </select>
      </div>

      <TopicForm onAddTopic={handleAddWithCategory} />

      {/* Search Bar */}
      <div className="mb-8">
        <input 
          ref={searchInputRef}
          type="text"
          placeholder="🔍 Search your topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all shadow-sm"
        />
      </div>

      {/* Topics Render List */}
      <div className="space-y-2">
        <AnimatePresence mode="wait"> 
          {isLoading ? (
            <Skeleton count={3} />
          ) : searchedTopics.length > 0 ? (
            searchedTopics.map((topic) => (
              <TopicCard 
                key={topic.id} 
                {...topic} 
                onDelete={onDeleteTopic} 
                onMarkDone={onMarkDone} 
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 opacity-60">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-500 font-medium">No topics found for "{searchQuery}"</p>
              <button 
                onClick={() => setSearchQuery("")}
                className="mt-4 text-blue-600 hover:underline font-semibold transition-all hover:scale-105"
              >
                Clear search
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}