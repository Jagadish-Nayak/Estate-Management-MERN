import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import { toast } from 'react-toastify';

import toast from 'react-hot-toast';

import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
//import OAuth from '../components/OAuth';
import usePasswordToggle from '../../hooks/usePasswordToggle';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
      dispatch(signInStart());
      const res = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials:'include',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      toast.success('User Logged In Successfully!');
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
      // toast.error(error.message);
    }
  };

  return (
    <div className="max-w-lg p-3 mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Sign In</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-4 rounded-md shadow-xl bg-slate-200"
      >
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
          //disabled={loading}
          className="p-3 text-white uppercase transition rounded-lg bg-slate-700 hover:bg-opacity-95 disabled:opacity-80"
        >
          {loading ? 'Signing in the User...' : 'Sign In'}
        </button>
        {/* <OAuth /> */}
      </form>
      <div className="flex gap-2 mt-5">
        <p>Dont have an account? </p>
        <Link to="/sign-up">
          <span className="text-blue-700 hover:underline">Sign Up</span>
        </Link>
      </div>
      {error && <p className="mt-5 text-red-500">{error}</p>}
    </div>
  );
}
