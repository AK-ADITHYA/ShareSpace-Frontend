// 1. Added 'useEffect' and 'useLocation' to imports
import { Link, useLocation } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, Users, HeartHandshake } from 'lucide-react';
import heroImg from '../assets/hero.jpg'; 

const Home = () => {
  const { user } = useContext(AuthContext);
  
  // 2. Initialize location
  const location = useLocation();

  // 3. Check for the scroll flag when component loads
  useEffect(() => {
    if (location.state && location.state.scrollToAbout) {
      // Small timeout ensures the page is fully rendered before scrolling
      setTimeout(() => {
        const element = document.getElementById('about');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  return (
    <div className="flex flex-col">
      
      {/* HERO SECTION */}
      <div 
        id="hero" 
        className="hero min-h-screen bg-base-200" 
        style={{ 
          backgroundImage: `url(${heroImg})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover', 
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="hero-overlay bg-opacity-70"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-xl">
            <h1 className="mb-5 text-5xl font-bold text-white">Live Together, Smarter.</h1>
            <p className="mb-5 text-gray-200">
              Finding a roommate shouldn't be a gamble. Match with people who fit your lifestyle, budget, and vibe—instantly.
            </p>
            
            {user ? (
              <div className="space-x-2">
                 {user.role === 'admin' ? (
                   <Link to="/admin" className="btn btn-secondary">Go to Dashboard</Link>
                 ) : (
                   <Link to="/matches" className="btn btn-primary">View Matches</Link>
                 )}
              </div>
            ) : (
              <div className="space-x-4">
                <Link to="/register" className="btn btn-primary">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ABOUT SECTION */}
      <div id="about" className="py-20 bg-base-100 text-base-content">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose ShareSpace?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              We know that finding a roommate is about more than just splitting the rent. It's about finding someone you can actually live with.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="card bg-base-200 shadow-xl border border-base-300">
              <div className="card-body items-center text-center">
                <div className="p-4 bg-primary/10 rounded-full mb-2 text-primary">
                  <ShieldCheck size={40} />
                </div>
                <h3 className="card-title">Verified Profiles</h3>
                <p>We ensure every user is real. Say goodbye to bots and scams, and hello to real people.</p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl border border-base-300">
              <div className="card-body items-center text-center">
                <div className="p-4 bg-secondary/10 rounded-full mb-2 text-secondary">
                  <Users size={40} />
                </div>
                <h3 className="card-title">Lifestyle Matching</h3>
                <p>Night owl or early bird? Smoker or non-smoker? We match you based on your daily habits.</p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl border border-base-300">
              <div className="card-body items-center text-center">
                <div className="p-4 bg-accent/10 rounded-full mb-2 text-accent">
                  <HeartHandshake size={40} />
                </div>
                <h3 className="card-title">Community First</h3>
                <p>Build connections before you move in. Chat, meet up, and decide if it's the right fit.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;