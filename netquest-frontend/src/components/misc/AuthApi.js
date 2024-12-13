import axios from "axios";
import { config } from "../../Constants";

export const authApi = {
  authenticate,
  signup,
  numberOfUsers,
  getUsers,
  deleteUser,
  editUser,
};

function authenticate(username, password) {
  return instance.post(
    "/auth/authenticate",
    { username, password },
    {
      headers: { "Content-type": "application/json" },
    },
  );
}

function signup(user) {
  return instance.post("/auth/signup", user, {
    headers: { "Content-type": "application/json" },
  });
}

function numberOfUsers() {
  return instance.get("/public/numberOfUsers");
}

function getUsers(user, username) {
  const url = username ? `/api/users/${username}` : "/api/users";
  return instance.get(url, {
    headers: { Authorization: basicAuth(user) },
  });
}

export function deleteUser(user, username) {
  return instance.delete(`/api/users/${username}`, {
    headers: { Authorization: basicAuth(user) },
  });
}

export function deleteUserById(user) {
  return instance.delete(`/api/users/deleteMyAccount`, {
    headers: { Authorization: basicAuth(user) },
  });
}

export function editUser(user, loggedUser) {
  return instance.put(`/api/users/edit`, user, {
    headers: {
      "Content-type": "application/json",
      Authorization: basicAuth(loggedUser),
    },
  });
}

// -- Axios

const instance = axios.create({
  baseURL: config.url.API_BASE_URL,
});

// -- Helper functions

function basicAuth(user) {
  return `Basic ${user.authdata}`;
}
