import { createContext, useState, useEffect, useContext, useReducer, useMemo, useCallback } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../supabaseClient'; 

const DashboardContext = createContext();

function dashboardReducer(state, action) {
  switch (action.type) {
    case 'SET_TOPICS':
      return { ...state, topics: action.payload };
    case 'ADD_TOPIC':
      return { ...state, topics: [...state.topics, action.payload] };
    case 'DELETE_TOPIC':
      return { ...state, topics: state.topics.filter(t => t.id !== action.payload) };
    case 'MARK_DONE':
      return {
        ...state,
        topics: state.topics.map(t => t.id === action.payload ? { ...t, status: 'Done' } : t)
      };
    case 'REORDER_TOPICS':
      return { ...state, topics: action.payload }; // Sets the new sorted order
    default:
      return state;
  }
}

export function DashboardProvider({ children }) {
  const [state, dispatch] = useReducer(dashboardReducer, { topics: [] });
  const [searchQuery, setSearchQuery] = useState("");
  const [fact, setFact] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTopics() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      // Sort by order_index by default
      const { data, error } = await supabase.from('topics').select('*').order('order_index', { ascending: true });
      
      if (error) {
        console.error("Error fetching:", error);
        setError(error.message);
        toast.error("Could not load topics.");
      } else {
        dispatch({ type: 'SET_TOPICS', payload: data || [] });
      }
      setIsLoading(false);
    }
    fetchTopics();
  }, []);

  useEffect(() => {
    const fetchFact = async () => {
      try {
        const response = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random');
        const data = await response.json();
        setFact(data.text);
      } catch (err) {
        console.error("Fact error:", err);
      }
    };
    fetchFact();
  }, []);

  const handleAddTopic = useCallback(async (title, status, category = 'General') => {
    // New topics get the highest index
    const newIndex = state.topics.length; 
    const { data, error } = await supabase
      .from('topics')
      .insert([{ title, status, category, order_index: newIndex }])
      .select();

    if (error) {
      toast.error("Failed to add topic.");
    } else if (data) {
      dispatch({ type: 'ADD_TOPIC', payload: data[0] });
      toast.success("Topic added!");
    }
  }, [state.topics]);

  const handleDeleteTopic = useCallback(async (id) => {
    const { error } = await supabase.from('topics').delete().eq('id', id);
    if (error) {
      toast.error("Could not delete topic.");
    } else {
      dispatch({ type: 'DELETE_TOPIC', payload: id });
    }
  }, []);

  const handleMarkDone = useCallback(async (id) => {
    const { error } = await supabase
      .from('topics')
      .update({ status: 'Done' })
      .eq('id', id);

    if (error) {
      toast.error("Could not update status.");
    } else {
      dispatch({ type: 'MARK_DONE', payload: id });
    }
  }, []);

  // NEW: Reorder Handler
  const handleReorder = useCallback(async (newTopicsList) => {
    // Optimistic Update
    dispatch({ type: 'REORDER_TOPICS', payload: newTopicsList });

    // Sync changes to Supabase
    const updates = newTopicsList.map((topic, index) => ({
      ...topic,
      order_index: index,
    }));

    const { error } = await supabase.from('topics').upsert(updates);
    if (error) {
      toast.error("Failed to save new order.");
      console.error(error);
    }
  }, []);

  const searchedTopics = useMemo(() => {
    return state.topics.filter(t => t.title?.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [state.topics, searchQuery]);

  return (
    <DashboardContext.Provider value={{
      fact, isLoading, error, searchQuery, setSearchQuery, searchedTopics, 
      totalCount: state.topics.length,
      onAddTopic: handleAddTopic,
      onDeleteTopic: handleDeleteTopic,
      onMarkDone: handleMarkDone,
      onReorder: handleReorder // Added to context
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  return useContext(DashboardContext);
}