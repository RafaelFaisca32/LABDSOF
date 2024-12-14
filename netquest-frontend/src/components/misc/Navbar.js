import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sidebar, Menu, Icon, Button } from "semantic-ui-react";
import { useAuth } from "../context/AuthContext";

function Navbar({ children }) {
  const { getUser, userIsAuthenticated, userLogout } = useAuth();
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  const logout = () => {
    userLogout();
    setVisible(false);
  };

  const links = [
    { to: "/", icon: "home", label: "Home", visible: true },
    { to: "/adminpage", icon: "user secret", label: "Admin Page", visible: () => getUser()?.role === "ADMIN" },
    { to: "/wifispot", icon: "wifi", label: "Wifi Map", visible: () => ["USER", "USER_PREMIUM", "ADMIN"].includes(getUser()?.role) },
    { to: "/login", icon: "sign-in", label: "Login", visible: () => !userIsAuthenticated() },
    { to: "/signup", icon: "signup", label: "Sign Up", visible: () => !userIsAuthenticated() },
    { to: "/visited-locations", icon: "map marker alternate", label: "Visited Locations", visible: () => userIsAuthenticated() },
    { to: "/pointsearntransaction", icon: "star", label: "Points Earned", visible: () => userIsAuthenticated() },
    { to: "/edit-account", icon: "user", label: "Manage Account", visible: () => userIsAuthenticated() },
    { to: "/delete-account", icon: "trash", label: "Delete Account", visible: () => userIsAuthenticated() },
    { to: "/my-reviews", icon: "comments", label: "My Reviews", visible: () => userIsAuthenticated() }, 
    { to: "/", icon: "sign-out", label: "Logout", visible: () => userIsAuthenticated(), action: logout },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{ minHeight: "100vh" }}>
      <Sidebar
        as={Menu}
        animation="overlay"
        icon="labeled"
        inverted
        vertical
        visible={visible}
        onHide={() => setVisible(false)}
        style={{ zIndex: 1000 }}
      >
        {links
          .filter((link) => (typeof link.visible === "function" ? link.visible() : link.visible))
          .map(({ to, icon, label, action }, idx) => (
            <Menu.Item
              key={idx}
              as={Link}
              to={to}
              active={isActive(to)}
              onClick={() => {
                setVisible(false);
                if (action) action();
              }}
            >
              <Icon name={icon} />
              {label}
            </Menu.Item>
          ))}
      </Sidebar>
      <Button
        icon="sidebar"
        onClick={() => setVisible(!visible)}
        color="blue"
        style={{
          position: "fixed",
          top: "10px",
          left: "10px",
          zIndex: 1100,
        }}
      />
      <Sidebar.Pusher dimmed={visible} style={{ minHeight: "100vh" }}>
        <div style={{ padding: "1rem" }}>{children}</div>
      </Sidebar.Pusher>
    </div>
  );
}

export default Navbar;
