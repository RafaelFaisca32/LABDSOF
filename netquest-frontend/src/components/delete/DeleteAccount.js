import React from "react";
import { useNavigate } from "react-router-dom";
import { deleteUserById } from "../misc/AuthApi";
import { useAuth } from "../context/AuthContext";
import {  Header } from 'semantic-ui-react';

function DeleteAccount() {
  const navigate = useNavigate();
  const { getUser, userLogout } = useAuth();
  const user = getUser();

  const handleDeleteClick = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (isConfirmed) {
      try {
        await deleteUserById(user, user.id);
        userLogout(); // Log out the user after deletion
        navigate('/'); // Redirect to home page
      } catch (error) {
        console.error('Failed to delete account:', error);
        // Handle error (show notification, etc.)
      }
    }
  };

  return (
    <div>
      <Header as="h2" color="blue" textAlign="center">
      Delete Account
      </Header>
      <p>Are you sure you want to delete your account? This action cannot be undone.</p>
      <button onClick={handleDeleteClick}>Delete Account</button>
    </div>
  );
}

export default DeleteAccount;
