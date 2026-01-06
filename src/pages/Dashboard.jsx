import { useEffect, useState, useContext } from 'react';
import { userAPI } from '../services/api'; 
import { AuthContext } from '../context/AuthContext';
import { MapPin, Home, Search, Coffee, Sparkles, Utensils, Moon } from 'lucide-react'; 
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await userAPI.getMatches(); 
        // Ensure we handle the response data correctly
        setMatches(res.data ? res.data : res);
      } catch (err) {
        console.error("Error fetching matches", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.location)  {
      fetchMatches();
    } else {
      setLoading(false); // Stop loading if no location is set
    }
  }, [user]);

  // If user hasn't set up profile yet
  if (!user?.location || !user?.isProfileComplete) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Complete your profile</h2>
          <p className="mb-6">We need your location to find matches for you.</p>
          <Link to="/setup" className="btn btn-primary">Complete Profile</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="container mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-base-content">Your Matches</h1>
          <p className="text-gray-500 mt-2">People in <span className="font-bold text-primary">{user.location}</span> compatible with you.</p>
        </div>
        
        {loading ? (
           <div className="flex justify-center mt-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>
        ) : matches.length === 0 ? (
          <div className="hero bg-base-100 rounded-box py-10 shadow-sm mx-auto max-w-2xl">
            <div className="hero-content text-center">
              <div className="max-w-md">
                <h1 className="text-2xl font-bold">No matches found</h1>
                <p className="py-6">We couldn't find anyone in {user.location} right now.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {matches.map((match) => (
              <div key={match._id} className="card w-full md:w-96 bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-200">
                <div className="card-body">
                  
                  {/* HEADER */}
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                         <div className="avatar">
                            <div className="w-12 h-12 rounded-full">
                                {match.profileImage ? (
                                    // FIX 1: Updated alt text to use name
                                    <img src={`http://localhost:5000/uploads/${match.profileImage}`} alt={match.name} />
                                ) : (
                                    // FIX 2: Updated fallback initial to use name
                                    <div className="bg-neutral text-neutral-content w-full h-full flex items-center justify-center">
                                        {match.name ? match.name[0] : '?'}
                                    </div>
                                )}
                            </div>
                         </div>
                         <div>
                            {/* FIX 3: Display Full Name (match.name) instead of username */}
                            <h2 className="card-title text-xl capitalize font-bold">{match.name}</h2>
                            <div className="badge badge-ghost badge-sm">{match.gender}</div>
                         </div>
                    </div>
                  </div>
                  
                  {/* FLAGS */}
                  <div className="flex flex-wrap gap-2 my-2">
                    {match.hasApartment === 'yes' && <div className="badge badge-secondary gap-1 text-white shadow-sm"><Home size={12} /> Has Apartment</div>}
                    {match.isLookingForRoommate === 'yes' && <div className="badge badge-accent badge-outline gap-1"><Search size={12} /> Looking</div>}
                  </div>

                  {/* STATS */}
                  <div className="flex flex-col gap-2 my-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2"><MapPin size={16} className="text-neutral"/> <span>{match.location}</span></div>
                    <div className="flex items-center gap-2"> <span>Budget: <strong>{match.budget}</strong></span></div>
                  </div>

                  <div className="divider my-1"></div> 
                  
                  {/* HABITS */}
                  <div className="flex gap-2 mb-2">
                    <div className={`badge gap-1 p-3 ${match.smoking === 'non-smoker' ? 'badge-success badge-outline' : 'badge-warning badge-outline'}`}>
                      <Coffee size={12} /> {match.smoking}
                    </div>
                    <div className="badge badge-info badge-outline gap-1 p-3">
                      <Sparkles size={12} /> {match.cleanliness}
                    </div>
                  </div>

                  <div className="flex gap-2 mb-3">
                      <div className="badge badge-ghost gap-1 p-3 capitalize"><Utensils size={12} /> {match.foodPreference}</div>
                      <div className="badge badge-ghost gap-1 p-3 capitalize"><Moon size={12} /> {match.sleepSchedule}</div>
                  </div>

                  <p className="text-sm text-gray-500 italic bg-base-200 p-3 rounded-lg mb-4 line-clamp-3">
                    "{match.bio || "No bio provided."}"
                  </p>
                  
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary btn-sm w-full">Connect</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Dashboard;