import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Container } from "semantic-ui-react";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../misc/AuthApi";
import AdminTab from "./AdminTab";
import { handleLogError } from "../misc/Helpers";

function AdminPage() {
  const Auth = useAuth();
  const user = Auth.getUser();
  const isAdmin = user.role === "ADMIN";

  const [users, setUsers] = useState([]);
  const [userUsernameSearch, setUserUsernameSearch] = useState("");
  const [isUsersLoading, setIsUsersLoading] = useState(false);

  useEffect(() => {
    handleGetUsers();
  });

  const handleInputChange = (e, { name, value }) => {
    if (name === "userUsernameSearch") {
      setUserUsernameSearch(value);
    }
  };

  const handleGetUsers = async () => {
    try {
      setIsUsersLoading(true);
      const response = await authApi.getUsers(user);
      const users = response.data;
      setUsers(users);
    } catch (error) {
      handleLogError(error);
    } finally {
      setIsUsersLoading(false);
    }
  };

  const handleDeleteUser = async (username) => {
    try {
      await authApi.deleteUser(user, username);
      await handleGetUsers();
    } catch (error) {
      handleLogError(error);
    }
  };

  const handleSearchUser = async () => {
    try {
      const response = await authApi.getUsers(user, userUsernameSearch);
      const data = response.data;
      const users = data instanceof Array ? data : [data];
      setUsers(users);
    } catch (error) {
      handleLogError(error);
      setUsers([]);
    }
  };

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <Container>
      <AdminTab
        isUsersLoading={isUsersLoading}
        users={users}
        userUsernameSearch={userUsernameSearch}
        handleDeleteUser={handleDeleteUser}
        handleSearchUser={handleSearchUser}
      />
    </Container>
  );
}

export default AdminPage;
