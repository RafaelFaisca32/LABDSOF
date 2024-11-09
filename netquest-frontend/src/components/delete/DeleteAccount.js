import React from 'react';
import { useNavigate } from 'react-router-dom';

function DeleteAccount() {
  const navigate = useNavigate();

  const handleConfirmDelete = () => {
    // Logic for deleting the account, e.g., calling an API endpoint
    console.log('Account deleted');
    // Redirect to home or login after deletion
    navigate('/');
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
