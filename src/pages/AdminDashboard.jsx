import { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FIX: Define your Render URL here ---
  const BASE_URL = 'https://sharespace-backend-xh5c.onrender.com';

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      try {
        // --- FIX: Use BASE_URL instead of localhost ---
        const res = await axios.get(`${BASE_URL}/api/admin/users`, {
          headers: { 
            Authorization: `Bearer ${token}` 
          }
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Admin Access Error", err);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Added Delete Functionality
  const handleDelete = async (userId) => {
    if(!window.confirm("Delete this user?")) return;
    try {
        const token = localStorage.getItem('token');
        // If you have a delete endpoint, use it here:
        // await axios.delete(`${BASE_URL}/api/admin/users/${userId}`, { headers: ... })
        setUsers(users.filter(u => u._id !== userId)); 
        toast.success("User removed");
    } catch (err) {
        toast.error("Error deleting");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Dashboard...</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Shield className="text-primary"/> Admin Dashboard
      </h1>
      
      <div className="overflow-x-auto">
        <table className="table bg-base-100 shadow-xl rounded-lg">
          <thead className="bg-base-300">
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Location</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="hover">
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        {u.profileImage ? (
                           // --- FIX: Use BASE_URL for image source ---
                           <img src={`${BASE_URL}/uploads/${u.profileImage}`} alt="Avatar" />
                        ) : (
                           <div className="bg-neutral text-neutral-content w-full h-full flex items-center justify-center font-bold">
                             {u.name.charAt(0).toUpperCase()}
                           </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{u.name}</div>
                      <div className="text-sm opacity-50">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  {u.role === 'admin' ? 
                    <span className="badge badge-error gap-1 text-white font-bold"><Shield size={12}/> Admin</span> : 
                    <span className="badge badge-ghost">User</span>
                  }
                </td>
                <td>{u.location || 'N/A'}</td>
                <td>
                  {u.isProfileComplete ? 
                    <span className="badge badge-success badge-outline">Active</span> : 
                    <span className="badge badge-warning badge-outline">Incomplete</span>
                  }
                </td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                    <button onClick={() => handleDelete(u._id)} className="btn btn-ghost btn-xs text-error">
                        <Trash2 size={16}/>
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;