import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api'; // Correct import
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Use the authAPI
      const res = await authAPI.login(formData);
      
      // 2. Fix: res is already the data object (user, token)
      login(res.user, res.token);
      
      toast.success('Logged in successfully');
      navigate('/'); 
      
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl mb-4 font-bold text-primary">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-control w-full">
              <label className="label"><span className="label-text">Email</span></label>
              <input 
                type="email" 
                name="email" 
                className="input input-bordered w-full" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="form-control w-full mt-2">
              <label className="label"><span className="label-text">Password</span></label>
              <input 
                type="password" 
                name="password" 
                className="input input-bordered w-full" 
                value={formData.password} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary w-full">Login</button>
            </div>
          </form>
          <p className="text-center mt-4 text-sm">
            Don't have an account? <Link to="/register" className="text-primary font-bold hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;