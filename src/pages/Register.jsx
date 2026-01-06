import { useState, useContext } from 'react';
// Removed 'axios' import, replaced with authAPI
import { authAPI } from '../services/api'; 
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Use authAPI instead of axios.post
      const res = await authAPI.register(formData);
      
      // 2. Fix: res is already the data object
      login(res.user, res.token);
      
      toast.success('Account created!');
      navigate('/setup'); // Kept your specific redirect logic
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl font-bold text-primary">Join ShareSpace</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-control w-full">
              <label className="label"><span className="label-text">Full Name</span></label>
              <input type="text" name="username" className="input input-bordered w-full" onChange={handleChange} required />
            </div>
            <div className="form-control mt-2 w-full">
              <label className="label"><span className="label-text">Email</span></label>
              <input type="email" name="email" className="input input-bordered w-full" onChange={handleChange} required />
            </div>
            <div className="form-control mt-2 w-full">
              <label className="label"><span className="label-text">Password</span></label>
              <input type="password" name="password" className="input input-bordered w-full" onChange={handleChange} required />
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary w-full">Register</button>
            </div>
          </form>
          <p className="text-center mt-4 text-sm">
            Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;