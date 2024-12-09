import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  getByPlaceholderText,
} from "@testing-library/react";
import EditAccount from "./EditAccount";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../misc/AuthApi";
import { BrowserRouter as Router } from "react-router-dom";

// Mock the useAuth hook and authApi methods
jest.mock("../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../misc/AuthApi", () => ({
  authApi: {
    getUsers: jest.fn(),
    editUser: jest.fn(),
    authenticate: jest.fn(),
  },
}));

describe("EditAccount", () => {
  let mockNavigate, mockGetUser, mockEditUser;

  beforeEach(() => {
    mockNavigate = jest.fn();
    mockGetUser = { id: "user1", name: "John Doe" };
    mockEditUser = { id: "user1", name: "John Doe", password: "newpassword" };

    useAuth.mockReturnValue({
      getUser: jest.fn().mockReturnValue(mockGetUser),
      userLogin: jest.fn(),
      userLogout: jest.fn(),
    });

    authApi.getUsers.mockResolvedValue({
      data: {
        id: "user1",
        username: "johndoe",
        email: "john@example.com",
        password: "password",
        vatNumber: "123456",
        addressLine1: "123 Main St",
        addressCity: "New York",
        addressCountry: "USA",
        addressZipCode: "10001",
      },
    });

    authApi.editUser.mockResolvedValue(mockEditUser);
    authApi.authenticate.mockResolvedValue({ data: mockEditUser });
  });

  test("renders correctly with user data", async () => {
    const { getByPlaceholderText } = render(
      <Router>
        <EditAccount />
      </Router>,
    );

    // Wait for the input fields to load
    await waitFor(() =>
      expect(getByPlaceholderText("Username")).toBeInTheDocument(),
    );

    // Verify the username field's value
    const usernameInput = getByPlaceholderText("Username");
    expect(usernameInput.value).toBe("johndoe"); // or whatever the username is

    // Optionally, ensure it is disabled
    expect(usernameInput).toBeDisabled();
  });

  test("shows loading state initially", () => {
    const { getByText } = render(
      <Router>
        <EditAccount />
      </Router>,
    );
    expect(getByText("Loading...")).toBeInTheDocument();
  });

  test("handles error when update fails", async () => {
    // Simulate an error from the API
    authApi.editUser.mockRejectedValueOnce({
      response: {
        data: {
          status: 400,
          errors: [{ defaultMessage: "Invalid email" }],
        },
      },
    });

    const { getByText } = render(
      <Router>
        <EditAccount />
      </Router>,
    );

    // Wait for user data to be loaded
    await waitFor(() => expect(getByText("Username")).toBeInTheDocument());
    fireEvent.click(getByText(/update/i));
    // Check for error message
    await waitFor(() => expect(getByText("Invalid email")).toBeInTheDocument());
  });
});
