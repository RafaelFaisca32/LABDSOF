import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Menu, Dropdown } from "semantic-ui-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { getUser, userIsAuthenticated, userLogout } = useAuth();
  const navigate = useNavigate();

  const logout = () => {
    userLogout();
  };

  const handleDeleteAccount = () => {
    navigate("/delete-account"); // Navigate to the delete account page
  };

  const handleEditAccount = () => {
    navigate("/edit-account"); // Navigate to the delete account page
  };

  const enterMenuStyle = () => {
    return userIsAuthenticated() ? { display: "none" } : { display: "block" };
  };

  const logoutMenuStyle = () => {
    return userIsAuthenticated() ? { display: "block" } : { display: "none" };
  };

  const adminPageStyle = () => {
    const user = getUser();
    return user && user.role === "ADMIN"
      ? { display: "block" }
      : { display: "none" };
  };

  const wifiPageStyle = () => {
    const user = getUser();
    return user &&
      (user.role === "USER" ||
        user.role === "USER_PREMIUM" ||
        user.role === "ADMIN")
      ? { display: "block" }
      : { display: "none" };
  };

  const getUserName = () => {
    const user = getUser();
    return user ? user.name : "";
  };

  return (
    <Menu
      inverted
      color="blue"
      stackable
      size="massive"
      style={{ borderRadius: 0 }}
    >
      <Container>
        <Menu.Item header>Netquest</Menu.Item>
        <Menu.Item as={Link} exact="true" to="/">
          Home
        </Menu.Item>
        <Menu.Item as={Link} to="/adminpage" style={adminPageStyle()}>
          Admin Page
        </Menu.Item>
        <Menu.Item as={Link} to="/wifispot" style={wifiPageStyle()}>
          Wifi Map
        </Menu.Item>
        <Menu.Menu position="right">
          <Menu.Item as={Link} to="/login" style={enterMenuStyle()}>
            Login
          </Menu.Item>
          <Menu.Item as={Link} to="/signup" style={enterMenuStyle()}>
            Sign Up
          </Menu.Item>
          {userIsAuthenticated() && (
            <Dropdown
              item
              text={`Hi ${getUserName()}`}
              style={logoutMenuStyle()}
            >
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/visited-locations">Visited Locations</Dropdown.Item>
                <Dropdown.Item as={Link} to="/pointsearntransaction">
                  Points Earned
                </Dropdown.Item>
                <Dropdown.Item onClick={handleEditAccount}>
                  Manage Account
                </Dropdown.Item>
                <Dropdown.Item onClick={handleDeleteAccount}>
                  Delete Account
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
          <Menu.Item
            as={Link}
            to="/"
            style={logoutMenuStyle()}
            onClick={logout}
          >
            Logout
          </Menu.Item>
        </Menu.Menu>
      </Container>
    </Menu>
  );
}

export default Navbar;
