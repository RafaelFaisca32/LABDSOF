import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Signup from "./Signup";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../misc/AuthApi";

jest.mock("../context/AuthContext");
jest.mock("../misc/AuthApi");

describe("Signup Component", () => {
  const mockAuth = {
    userIsAuthenticated: jest.fn(),
    userLogin: jest.fn(),
  };

  beforeEach(() => {
    useAuth.mockReturnValue(mockAuth);
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

  it("renders the signup form with all fields", () => {
    renderComponent();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("First Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Last Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Birth Date (YYYY-MM-DD)")).toBeInTheDocument();
    expect(screen.getByText("Signup")).toBeInTheDocument();
  });

  it("shows an error if required fields are missing", async () => {
    renderComponent();

    fireEvent.click(screen.getByText("Signup"));
    expect(await screen.findByText("Please, inform all required fields!")).toBeInTheDocument();
  });


  it("opens and closes the GDPR modal", async () => {
    renderComponent();

    fireEvent.click(screen.getByText("GDPR Privacy Policy"));
    expect(await screen.findByText("Privacy Notice for Personal Data Processing Under GDPR")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Close"));
    await waitFor(() => {
      expect(screen.queryByText("Privacy Notice for Personal Data Processing Under GDPR")).not.toBeInTheDocument();
    });
  });

});
