import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert('Check your email for the confirmation link!');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
  };

  return (
    <form className="p-8 flex flex-col gap-4">
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="border p-2" />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="border p-2" />
      <button onClick={handleLogin} className="bg-blue-600 text-white p-2">Login</button>
      <button onClick={handleSignUp} className="bg-gray-200 p-2">Sign Up</button>
    </form>
  );
}