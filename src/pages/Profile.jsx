import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Edit, Home, Search, Shield, Utensils, Moon } from 'lucide-react'; 

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <div className="p-10 text-center">Loading...</div>;

  const imageUrl = user.profileImage 
    ? `http://localhost:5000/uploads/${user.profileImage}` 
    : null;

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-base-100 shadow-xl rounded-xl overflow-hidden">
        
        {/* Banner */}
        <div className={`h-48 bg-gradient-to-r ${user.role === 'admin' ? 'from-red-600 to-orange-600' : 'from-primary to-secondary'}`}></div>

        <div className="px-8 pb-8 relative">
          
          {/* Avatar */}
          <div className="flex justify-between items-end -mt-12 mb-6">
             <div className="avatar ring ring-white ring-offset-base-100 ring-offset-2 rounded-full">
                <div className="w-24 h-24 rounded-full bg-neutral text-neutral-content flex items-center justify-center overflow-hidden">
                  {imageUrl ? (
                    <img src={imageUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl">{user.username?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
             </div>
             
             {/* Edit Button */}
             <Link to="/setup" className="btn btn-outline btn-sm gap-2">
                <Edit size={16}/> {user.role === 'admin' ? 'Edit Profile' : 'Edit Profile'}
             </Link>
          </div>

          {/* User Details */}
          <div>
              <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold">{user.name || user.username}</h1>
                  {user.role === 'admin' && <div className="badge badge-error gap-1"><Shield size={12}/> Admin</div>}
              </div>
              <p className="text-gray-500">{user.email}</p>
              
              {user.role !== 'admin' && (
                <>
                <div className="flex flex-wrap gap-2 mt-3">
                    {user.isLookingForRoommate === 'yes' && <span className="badge badge-accent gap-1 p-3 text-white"><Search size={14} /> Looking</span>}
                    {user.hasApartment === 'yes' && <span className="badge badge-secondary gap-1 p-3 text-white"><Home size={14} /> Has Apartment</span>}
                </div>
                
                <div className="flex gap-4 mt-4">
                   <span className="badge badge-lg badge-primary badge-outline gap-1"><MapPin size={14}/> {user.location || "N/A"}</span>
                   <span className="badge badge-lg badge-secondary badge-outline gap-1">
                        Budget: {user.budget || "N/A"}
                   </span>
                </div>

                <div className="divider"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {/* LIFESTYLE CARD */}
                     <div className="card bg-base-200 p-4">
                       <h3 className="font-bold text-lg mb-2 text-primary">Lifestyle</h3>
                       <ul className="space-y-3">
                         <li className="flex justify-between border-b border-gray-300 pb-1">
                            <span className="flex items-center gap-2 text-gray-700"><Utensils size={16}/> Food:</span> 
                            <span className="font-semibold capitalize">{user.foodPreference || "Any"}</span>
                         </li>
                         <li className="flex justify-between border-b border-gray-300 pb-1">
                            <span className="flex items-center gap-2 text-gray-700"><Moon size={16}/> Sleep:</span> 
                            <span className="font-semibold capitalize">{user.sleepSchedule?.replace('-', ' ') || "Flexible"}</span>
                         </li>
                         <li className="flex justify-between"><span>Smoking:</span> <span className="font-semibold capitalize">{user.smoking || "N/A"}</span></li>
                         <li className="flex justify-between"><span>Cleanliness:</span> <span className="font-semibold capitalize">{user.cleanliness || "N/A"}</span></li>
                         <li className="flex justify-between"><span>Gender:</span> <span className="font-semibold capitalize">{user.gender || "N/A"}</span></li>
                       </ul>
                     </div>

                     {/* ABOUT ME CARD */}
                     <div className="card bg-base-200 p-4">
                       <h3 className="font-bold text-lg mb-2 text-primary">About Me</h3>
                       <p className="italic text-gray-600">"{user.bio || "No bio added yet."}"</p>
                     </div>
                </div>
                </>
              )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;