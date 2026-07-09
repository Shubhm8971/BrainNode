import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../AuthContext';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, profile, setProfile } = useAuth();
  const [username, setUsername] = useState(profile?.username || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    
    // Using toast.promise for that professional UX
    const updatePromise = supabase
      .from('profiles')
      .update({ username })
      .eq('id', user.id);

    toast.promise(updatePromise, {
      loading: 'Saving changes...',
      success: () => {
        // Update local context so the UI reflects changes instantly
        setProfile({ ...profile, username });
        setLoading(false);
        return "Profile updated successfully!";
      },
      error: () => {
        setLoading(false);
        return "Could not update profile.";
      },
    });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <p className="mt-1 p-2 bg-gray-100 rounded w-full text-gray-500">{user?.email}</p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Display Name</label>
        <input 
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your name"
        />
      </div>

      <button 
        onClick={handleUpdate}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors font-semibold"
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}