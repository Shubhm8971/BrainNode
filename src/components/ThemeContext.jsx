import { createContext, useState, useContext } from 'react';

// 1. Create the raw Context object
const ThemeContext = createContext();

// 2. Create a custom Provider component that manages the theme state
export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Broadcast both the current mode and the toggle function
  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. Create a clean shortcut hook so our child components can tune in easily
export function useTheme() {
  return useContext(ThemeContext);
}