import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Using the standard Supabase Auth call
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password 
    });

    setLoading(false);
    if (error) {
      alert(error.message);
    } else {
      alert('Check your email for the confirmation link!');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });

    setLoading(false);
    if (error) {
      alert(error.message);
    }
  };

  return (
    <form className="p-8 flex flex-col gap-4 border rounded shadow-sm">
      <input 
        type="email" 
        placeholder="Email" 
        onChange={(e) => setEmail(e.target.value)} 
        className="border p-2 rounded" 
        required 
      />
      <input 
        type="password" 
        placeholder="Password" 
        onChange={(e) => setPassword(e.target.value)} 
        className="border p-2 rounded" 
        required 
      />
      
      <button 
        onClick={handleLogin} 
        disabled={loading}
        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
      >
        {loading ? 'Processing...' : 'Login'}
      </button>
      
      <button 
        onClick={handleSignUp} 
        disabled={loading}
        className="bg-gray-200 p-2 rounded hover:bg-gray-300 disabled:bg-gray-100"
      >
        {loading ? 'Processing...' : 'Sign Up'}
      </button>
    </form>
  );
}