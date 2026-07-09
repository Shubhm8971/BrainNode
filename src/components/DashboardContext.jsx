import { createContext, useState, useEffect, useContext, useReducer, useMemo, useCallback } from 'react';
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

  // 1. FETCH FROM SUPABASE WITH AUTH CHECK
  useEffect(() => {
    async function fetchTopics() {
      // Check if user is logged in before even trying the database
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
      } else {
        dispatch({ type: 'SET_TOPICS', payload: data || [] });
      }
      setIsLoading(false);
    }
    fetchTopics();
  }, []); // Only runs once on mount

  // Fact fetch (Kept as is)
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

  // 2. ASYNC HANDLERS
  const handleAddTopic = useCallback(async (title, status) => {
    const { data, error } = await supabase
      .from('topics')
      .insert([{ title, status }])
      .select();

    if (error) {
      console.error("Error adding:", error);
    } else if (data) {
      dispatch({ type: 'ADD_TOPIC', payload: data[0] });
    }
  }, []);

  const handleDeleteTopic = useCallback(async (id) => {
    const { error } = await supabase.from('topics').delete().eq('id', id);
    if (error) console.error("Error deleting:", error);
    else dispatch({ type: 'DELETE_TOPIC', payload: id });
  }, []);

  const handleMarkDone = useCallback(async (id) => {
    const { error } = await supabase
      .from('topics')
      .update({ status: 'Done' })
      .eq('id', id);

    if (error) console.error("Error updating:", error);
    else dispatch({ type: 'MARK_DONE', payload: id });
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
      onMarkDone: handleMarkDone
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  return useContext(DashboardContext);
}