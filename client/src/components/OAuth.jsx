// import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
// import { app } from '../firebase';
// import { useDispatch } from 'react-redux';
// import { signInSuccess } from '../redux/user/userSlice';
// // import { toast } from 'react-toastify';
// import toast from 'react-hot-toast';
// import { useNavigate } from 'react-router-dom';

// export default function OAuth() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleGoogleClick = async () => {
//     try {
//       const provider = new GoogleAuthProvider();
//       const auth = getAuth(app);

//       const result = await signInWithPopup(auth, provider);

//       const res = await fetch('/api/auth/google', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           name: result.user.displayName,
//           email: result.user.email,
//           photo: result.user.photoURL,
//         }),
//       });
//       const data = await res.json();
//       dispatch(signInSuccess(data));
//       toast.success('User Logged in Successfully!');
//       navigate('/');
//     } catch (error) {
//       console.log('Could not sign in with Google', error);
//     }
//   };

//   return (
//     <button
//       onClick={handleGoogleClick}
//       type="button"
//       className="p-3 text-white uppercase transition bg-red-700 rounded-lg hover:bg-opacity-95"
//     >
//       Continue with Google
//     </button>
//   );
// }
