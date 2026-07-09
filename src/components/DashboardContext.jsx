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
      const { data, error } = await supabase.from('topics').select('*');
      
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

  // UPDATED HANDLER TO INCLUDE CATEGORY
  const handleAddTopic = useCallback(async (title, status, category = 'General') => {
    const { data, error } = await supabase
      .from('topics')
      .insert([{ title, status, category }])
      .select();

    if (error) {
      toast.error("Failed to add topic.");
      console.error("Error adding:", error);
    } else if (data) {
      dispatch({ type: 'ADD_TOPIC', payload: data[0] });
      toast.success("Topic added!");
    }
  }, []);

  const handleDeleteTopic = useCallback(async (id) => {
    const { error } = await supabase.from('topics').delete().eq('id', id);
    if (error) {
      toast.error("Could not delete topic.");
      console.error("Error deleting:", error);
    } else {
      dispatch({ type: 'DELETE_TOPIC', payload: id });
      toast.success("Topic removed.");
    }
  }, []);

  const handleMarkDone = useCallback(async (id) => {
    const { error } = await supabase
      .from('topics')
      .update({ status: 'Done' })
      .eq('id', id);

    if (error) {
      toast.error("Could not update status.");
      console.error("Error updating:", error);
    } else {
      dispatch({ type: 'MARK_DONE', payload: id });
      toast.success("Great job! Marked as done.");
    }
  }, []);

  const searchedTopics = useMemo(() => {
    return state.topics.filter(t => t.title?.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [state.topics, searchQuery]);

  return (
    <DashboardContext.Provider value={{
      fact, isLoading, error, searchQuery, setSearchQuery, searchedTopics, 
      totalCount: state.topics.length,
      onAddTopic: handleAddTopic, // Now expects (title, status, category)
      onDeleteTopic: handleDeleteTopic,
      onMarkDone: handleMarkDone
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  return useContext(DashboardContext);
}