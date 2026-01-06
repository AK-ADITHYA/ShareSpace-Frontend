import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Fixed Navbar */}
      <Navbar />

      {/* ADDED 'pt-24' (Padding Top) 
         This pushes all page content down so it starts BELOW the fixed navbar.
         Adjust to pt-20 or pt-28 if you need less/more space.
      */}
      <div className="flex-grow pt-20">
        {children}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;