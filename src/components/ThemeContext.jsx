import { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../AuthContext'; // Import AuthContext to know the user

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const { user, profile } = useAuth(); // Access user and profile from AuthContext

  // Sync state with profile preference whenever profile loads
  useEffect(() => {
    if (profile && typeof profile.dark_mode !== 'undefined') {
      setDarkMode(profile.dark_mode);
    }
  }, [profile]);

  const toggleTheme = async () => {
    const newMode = !darkMode;
    setDarkMode(newMode);

    // Save to database if user is logged in
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({ dark_mode: newMode })
        .eq('id', user.id);
      
      if (error) {
        console.error("Failed to sync theme:", error);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}