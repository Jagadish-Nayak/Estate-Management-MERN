import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
import toast from 'react-hot-toast';
//import OAuth from '../components/OAuth';
import usePasswordToggle from '../../hooks/usePasswordToggle';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [PassworInputType, ToggleIcon] = usePasswordToggle();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials:'include',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      toast.success('User Created Successfully!');
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-lg p-3 mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Sign Up</h1>
      <form
        onSubmit={handleSubmit}
        className="relative flex flex-col gap-4 p-4 rounded-md shadow-xl bg-slate-200"
      >
        <input
          type="text"
          required
          placeholder="Username"
          className="p-3 transition border rounded-lg focus:outline-none"
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          required
          placeholder="Email"
          className="p-3 transition border rounded-lg focus:outline-none"
          id="email"
          onChange={handleChange}
        />
        <div className="relative">
          <input
            type={PassworInputType}
            required
            placeholder="Password"
            className="w-full p-3 transition border rounded-lg focus:outline-none"
            id="password"
            onChange={handleChange}
          />
          <span className="absolute cursor-pointer right-4 bottom-[12px] hover:opacity-70 transition-all">
            {ToggleIcon}
          </span>
        </div>

        <button
          disabled={loading}
          className="p-3 text-white uppercase transition rounded-lg bg-slate-700 hover:bg-opacity-95 disabled:opacity-80"
        >
          {loading ? 'Creating User...' : 'Sign Up'}
        </button>
        {/* <OAuth /> */}
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account? </p>
        <Link to="/sign-in">
          <span className="text-blue-700 hover:underline">Sign In</span>
        </Link>
      </div>
      {error && <p className="mt-5 text-red-500">{error}</p>}
    </div>
  );
}
