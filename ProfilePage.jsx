export default function ProfilePage() {
  const { profile } = useAuth(); // Assume you've exposed profile here

  const handleUpdate = async (newName) => {
    const { error } = await supabase
      .from('profiles')
      .update({ username: newName })
      .eq('id', profile.id);
    
    if (error) toast.error("Update failed");
    else toast.success("Profile updated!");
  };

  return (
    <div className="p-4">
      <h1>User Profile</h1>
      <p>Email: {profile?.email}</p>
      <input defaultValue={profile?.username} />
      <button onClick={handleUpdate}>Save Changes</button>
    </div>
  );
}