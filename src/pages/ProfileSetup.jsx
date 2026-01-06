import { useState, useContext, useEffect } from 'react';
import axios from 'axios'; 
import { userAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Camera, Trash2 } from 'lucide-react'; 

const ProfileSetup = () => {
  const { user, login } = useContext(AuthContext); 
  const navigate = useNavigate();
  
  // --- FIX: Define your Render URL here ---
  const BASE_URL = 'https://sharespace-backend-xh5c.onrender.com';

  const isInitialSetup = !user?.location;
  const pageTitle = isInitialSetup ? "Setup Your Profile" : "Edit Profile";

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', 
    location: '', budget: '', gender: 'Male', smoking: 'non-smoker', 
    cleanliness: 'standard', bio: '', isLookingForRoommate: 'yes', hasApartment: 'no',
    foodPreference: 'any', sleepSchedule: 'flexible'
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- FIX: Fetch Fresh Data on Mount ---
  useEffect(() => {
    const fetchLatestProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // --- FIX: Use BASE_URL instead of localhost ---
        const res = await axios.get(`${BASE_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const freshUser = res.data;

        setFormData(prev => ({
            ...prev,
            name: freshUser.name || '',
            email: freshUser.email || '',
            password: '', 
            location: freshUser.location || '',
            budget: freshUser.budget || '',
            gender: freshUser.gender || 'Male',
            smoking: freshUser.smoking || 'non-smoker',
            cleanliness: freshUser.cleanliness || 'standard',
            bio: freshUser.bio || '',
            isLookingForRoommate: freshUser.isLookingForRoommate || 'yes',
            hasApartment: freshUser.hasApartment || 'no',
            foodPreference: freshUser.foodPreference || 'any',
            sleepSchedule: freshUser.sleepSchedule || 'flexible'
        }));

        if (freshUser.profileImage) {
            // --- FIX: Use BASE_URL for images too ---
            setPreviewUrl(`${BASE_URL}/uploads/${freshUser.profileImage}`);
        }
        setLoading(false);

      } catch (err) {
        console.error("Error fetching profile", err);
        // Fallback to Context User if fetch fails
        if(user) {
            setFormData(prev => ({...prev, email: user.email || ''})); 
        }
        setLoading(false);
      }
    };

    fetchLatestProfile();
  }, []); // Run once on mount

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setRemoveImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setRemoveImage(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'password') {
            if(formData[key]) data.append(key, formData[key]); 
        } else {
            data.append(key, formData[key]);
        }
      });

      if (imageFile) data.append('profileImage', imageFile);
      if (removeImage) data.append('removeImage', 'true');

      const res = await userAPI.updateProfile(data);
      
      const updatedUser = res.data ? res.data : res; 
      const token = localStorage.getItem('token');
      
      // Update Context with the new data
      login({ ...user, ...updatedUser }, token); 
      
      toast.success("Profile Updated!");
      navigate("/profile"); 
    } catch (err) {
      console.error(err);
      toast.error("Error updating profile");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center py-10">
      <div className="card w-full max-w-lg bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl justify-center mb-4 font-bold">{pageTitle}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* IMAGE UPLOAD */}
            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="avatar">
                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden flex items-center justify-center bg-neutral text-neutral-content">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl">{user?.username?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                 <input type="file" id="file-upload" className="hidden" accept="image/*" onChange={handleFileChange} />
                 <label htmlFor="file-upload" className="btn btn-sm btn-outline gap-2 cursor-pointer">
                    <Camera size={16}/> Change Photo
                 </label>
                 {previewUrl && (
                   <button type="button" onClick={handleRemoveImage} className="btn btn-sm btn-ghost text-error" title="Remove Photo"><Trash2 size={16}/></button>
                 )}
              </div>
            </div>

            {/* BASIC INFO */}
            <div className="form-control">
                <label className="label"><span className="label-text">Full Name</span></label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="input input-bordered" placeholder="Your Name" />
            </div>
            <div className="form-control">
                <label className="label"><span className="label-text">Email</span></label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="input input-bordered" />
            </div>
            <div className="form-control">
                <label className="label"><span className="label-text">New Password (Optional)</span></label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} className="input input-bordered" placeholder="Leave blank to keep current" />
            </div>

            {/* PREFERENCES (Regular Users Only) */}
            {user?.role !== 'admin' && (
                <>
                <div className="divider text-sm text-gray-500">Living Preferences</div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="form-control">
                      <label className="label"><span className="label-text">Looking?</span></label>
                      <select name="isLookingForRoommate" className="select select-bordered" value={formData.isLookingForRoommate} onChange={handleChange}>
                          <option value="yes">Yes</option><option value="no">No</option>
                      </select>
                   </div>
                   <div className="form-control">
                      <label className="label"><span className="label-text">Apartment?</span></label>
                      <select name="hasApartment" className="select select-bordered" value={formData.hasApartment} onChange={handleChange}>
                          <option value="yes">Yes</option><option value="no">No</option>
                      </select>
                   </div>
                </div>
                
                <div className="form-control">
                    <label className="label"><span className="label-text">Location (Required)</span></label>
                    <input type="text" name="location" value={formData.location} className="input input-bordered" onChange={handleChange} required />
                </div>

                <div className="form-control">
                    <label className="label"><span className="label-text">Budget</span></label>
                    <input type="text" name="budget" value={formData.budget} className="input input-bordered" onChange={handleChange} placeholder="e.g. 5000" />
                </div>

                <div className="divider text-sm text-gray-500">Lifestyle</div>

                <div className="form-control">
                    <label className="label"><span className="label-text">Gender</span></label>
                    <select name="gender" className="select select-bordered" value={formData.gender} onChange={handleChange}>
                        <option>Male</option><option>Female</option><option>Transgender</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label"><span className="label-text">Food</span></label>
                    <select name="foodPreference" className="select select-bordered" value={formData.foodPreference} onChange={handleChange}>
                      <option value="any">Any</option><option value="veg">Vegetarian</option><option value="non-veg">Non-Vegetarian</option><option value="vegan">Vegan</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label"><span className="label-text">Sleep</span></label>
                    <select name="sleepSchedule" className="select select-bordered" value={formData.sleepSchedule} onChange={handleChange}>
                      <option value="flexible">Flexible</option><option value="early-bird">Early Bird</option><option value="night-owl">Night Owl</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label"><span className="label-text">Smoking?</span></label>
                    <select name="smoking" className="select select-bordered" value={formData.smoking} onChange={handleChange}>
                      <option value="non-smoker">Non-Smoker</option><option value="smoker">Smoker</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label"><span className="label-text">Cleanliness</span></label>
                    <select name="cleanliness" className="select select-bordered" value={formData.cleanliness} onChange={handleChange}>
                      <option value="standard">Standard</option><option value="neat">Neat</option><option value="messy">Messy</option>
                    </select>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text">Bio</span></label>
                  <textarea name="bio" className="textarea textarea-bordered h-24" value={formData.bio} onChange={handleChange}></textarea>
                </div>
                </>
            )}

            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ProfileSetup;