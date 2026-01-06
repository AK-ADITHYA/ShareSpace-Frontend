import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer footer-center p-10 bg-base-300 text-base-content rounded mt-auto">
      <div className="grid grid-flow-col gap-4">
        {/* <Link to="/about" className="link link-hover">About us</Link> */}
        <Link to="/contact" className="link link-hover">Contact</Link>
        <Link to="/privacy" className="link link-hover">Privacy Policy</Link>
        <Link to="/terms" className="link link-hover">Terms of Service</Link>
      </div>
      <div>
        <div className="grid grid-flow-col gap-4">
          <a className="cursor-pointer hover:text-primary"><Twitter size={24} /></a>
          <a className="cursor-pointer hover:text-primary"><Facebook size={24} /></a>
          <a className="cursor-pointer hover:text-primary"><Instagram size={24} /></a>
          <a className="cursor-pointer hover:text-primary"><Linkedin size={24} /></a>
        </div>
      </div>
      <div>
        <p>Copyright © 2026 - All right reserved by ShareSpace</p>
      </div>
    </footer>
  );
};

export default Footer;