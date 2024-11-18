import React from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteUserById} from '../misc/BookApi';
import { useAuth } from '../context/AuthContext';

function DeleteAccount() {
  const navigate = useNavigate();
  const { getUser, userLogout } = useAuth();
  const user = getUser()

  console.log('Current user:', user); // Check if user is available

  const handleConfirmDelete = async () => {
    try {
      await deleteUserById(user,user.id);
      userLogout(); // Log out the user after deletion
      navigate('/'); // Redirect to home page
    } catch (error) {
      console.error('Failed to delete account:', error);
      // Handle error (show notification, etc.)
    }
  };

  return (
    <div>
      <h1>Delete Account</h1>
      <p>Are you sure you want to delete your account? This action cannot be undone.</p>
      <button onClick={handleConfirmDelete}>Confirm Delete</button>
    </div>
  );
}

export default DeleteAccount;