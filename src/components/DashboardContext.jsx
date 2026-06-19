import { createContext, useState, useEffect, useContext, useReducer, useMemo, useCallback } from 'react';

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
  // 1. Initializer Pattern: Load once immediately, avoiding a re-render "flicker"
  const [state, dispatch] = useReducer(dashboardReducer, { topics: [] }, (initial) => {
    const saved = localStorage.getItem('shubh_dashboard_topics');
    return saved ? { topics: JSON.parse(saved) } : { topics: [
        { id: 1, title: "HTML & CSS Review", status: "Done" },
        { id: 2, title: "JavaScript ES6 Essentials", status: "In Progress" },
    ]};
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [fact, setFact] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync to Local Storage whenever topics change
  useEffect(() => {
    localStorage.setItem('shubh_dashboard_topics', JSON.stringify(state.topics));
  }, [state.topics]);

  // Fetch API Fact
  useEffect(() => {
    const fetchFact = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random');
        const data = await response.json();
        setFact(data.text);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFact();
  }, []);

  const handleAddTopic = useCallback((title, status) => {
    dispatch({ type: 'ADD_TOPIC', payload: { id: Date.now(), title, status } });
  }, []);

  const handleDeleteTopic = useCallback((id) => {
    dispatch({ type: 'DELETE_TOPIC', payload: id });
  }, []);

  const handleMarkDone = useCallback((id) => {
    dispatch({ type: 'MARK_DONE', payload: id });
  }, []);

  const searchedTopics = useMemo(() => {
    return state.topics.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [state.topics, searchQuery]);

  const remainingCount = useMemo(() => {
    return state.topics.filter(t => t.status !== "Done").length;
  }, [state.topics]);

  return (
    <DashboardContext.Provider value={{
      fact, isLoading, error, searchQuery, setSearchQuery, searchedTopics, 
      totalCount: state.topics.length, remainingCount,
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