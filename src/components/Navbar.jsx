import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User, Home, LayoutDashboard } from 'lucide-react';
import logo from '../assets/logo.png'; 

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- NEW: Handle "About" click from any page ---
  const handleAboutClick = (e) => {
    e.preventDefault(); // Stop the default anchor link behavior
    
    if (location.pathname === '/') {
      // If we are already Home, just find the section and scroll
      const element = document.getElementById('about');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If we are NOT Home, navigate to Home and pass a "state" flag
      navigate('/', { state: { scrollToAbout: true } });
    }
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="navbar bg-base-100 shadow-md px-4 md:px-8 z-50 fixed top-0 w-full">
      <div className="flex-1">
        <Link 
          to="/" 
          onClick={scrollToTop}
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          <img src={logo} alt="ShareSpace Logo" className="h-16 w-auto object-contain" />
        </Link>
      </div>
      
      <div className="flex-none gap-4">
        {isAuthPage ? (
             null 
        ) : user ? (
          <div className="flex items-center gap-4">
            
            {user.role === 'admin' ? (
              <>
                <Link to="/" onClick={scrollToTop} className="btn btn-ghost btn-md gap-2">
                  <Home size={16}/> Home
                </Link>
                <Link to="/profile" className="btn btn-ghost btn-md gap-2">
                  <User size={16}/> Profile
                </Link>
                <Link to="/admin" className="btn btn-primary btn-md gap-2">
                  <LayoutDashboard size={16}/> Dashboard
                </Link>
              </>
            ) : (
              /* --- REGULAR USER --- */
              <>
                <Link to="/" onClick={scrollToTop} className="btn btn-ghost btn-md">Home</Link>
                
                {/* Updated About Link */}
                <a href="#about" onClick={handleAboutClick} className="btn btn-ghost btn-md">About</a>

                <Link to="/matches" className="btn btn-ghost btn-md">Matches</Link>
                <Link to="/profile" className="btn btn-ghost btn-md gap-2">
                  <User size={16}/> Profile
                </Link>
              </>
            )}
            
            <button onClick={handleLogout} className="btn btn-ghost btn-md text-error gap-2">
               <LogOut size={16}/> Logout
            </button>
          </div>
        ) : (
          /* --- VISITOR --- */
          <div className="flex gap-2">
            <Link to="/" onClick={scrollToTop} className="btn btn-ghost btn-md">Home</Link>
            
            {/* Updated About Link */}
            <a href="#about" onClick={handleAboutClick} className="btn btn-ghost btn-md">About</a>

            <Link to="/login" className="btn btn-primary">Login/Register</Link>
            {/* <Link to="/register" className="btn btn-primary">Register</Link> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;