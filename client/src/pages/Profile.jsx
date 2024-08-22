import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { GoSignOut } from 'react-icons/go';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from '../redux/user/userSlice';

// import { toast } from 'react-toastify';

import toast from 'react-hot-toast';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  // firebase storage
  // allow read;
  // allow wirte: if
  // request.resource.size < 2 * 1014 * 1024 &&
  // request.resource.contentType.matches('image/.*')

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials:'include',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      toast.success('User Updated Successfully!');
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      toast.error(error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        credentials:'include',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      toast.success(data);
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      toast.error(error);
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/auth/signout`,{credentials:'include',});
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
      toast.success(data);
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
      toast.error(error);
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/user/listings/${currentUser._id}`,{credentials:'include',});
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/listing/delete/${listingId}`, {
        method: 'DELETE',
        credentials:'include',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      toast.success(data);

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="max-w-lg p-3 mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="avatar"
          className="self-center object-cover w-24 h-24 transition duration-200 ease-in-out rounded-full shadow-lg cursor-pointer hover:ring-2 ring-gray-400 ring-offset-2"
        />
        <p className="text-sm text-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image Upload(image size must be less than 2mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image Uploaded Successfully!</span>
          ) : (
            ''
          )}
        </p>
        <input
          type="text"
          placeholder="Username"
          defaultValue={currentUser.username}
          id="username"
          className="p-3 border rounded-lg focus:outline-none"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          defaultValue={currentUser.email}
          id="email"
          className="p-3 border rounded-lg focus:outline-none"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="p-3 border rounded-lg focus:outline-none"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="p-3 text-white uppercase transition rounded-lg bg-slate-700 hover:bg-opacity-95"
        >
          {loading ? 'Updating Info...' : 'Update'}
        </button>
        <Link
          className="p-3 text-center text-white uppercase transition-all bg-green-700 rounded-lg hover:bg-opacity-95"
          to={'/create-listing'}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-500 transition cursor-pointer hover:text-red-600"
        >
          Delete Account
        </span>
        <span
          onClick={handleSignOut}
          className="flex items-center gap-2 text-red-500 transition cursor-pointer hover:text-red-600"
        >
          Sign Out{' '}
          <i>
            <GoSignOut />
          </i>
        </span>
      </div>
      <p className="mt-5 text-red-700">{error ? error : ''}</p>
      <button
        onClick={handleShowListings}
        className="w-full px-4 py-2 font-medium text-green-700 uppercase transition-all border border-green-700 rounded-lg hover:ring-2 hover:ring-green-700 ring-offset-1"
      >
        Show Listings
      </button>
      <p className="mt-5 text-red-700">
        {showListingsError ? 'Error Showing Listings' : ''}
      </p>

      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-semibold text-center mt-7">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="flex items-center justify-between gap-4 p-3 border rounded-lg"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="object-contain w-16 h-16"
                />
              </Link>
              <Link
                to={`/listing/${listing._id}`}
                className="flex-1 font-semibold truncate text-slate-700 hover:underline"
              >
                <p>{listing.name}</p>
              </Link>

              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-600 uppercase transition hover:text-red-700"
                >
                  Delete
                </button>

                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-600 uppercase transition hover:text-green-700">
                    Edit
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
