import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Grid,
  Segment,
  Header,
  Checkbox,
} from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../misc/AuthApi";
import { handleLogError } from "../misc/Helpers";

function EditAccount() {
  const navigate = useNavigate();
  const Auth = useAuth();
  const [formData, setFormData] = useState({
    password: "",
    email: "",
    vatNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    district: "",
    country: "",
    zipCode: "",
  });
  const [isEmailVisible, setIsEmailVisible] = useState(false); // Track checkbox state
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Track checkbox state
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const loggedUser = await authApi.getUsers(
          Auth.getUser(),
          Auth.getUser().name,
        );
        if (loggedUser) {
          setFormData({
            id: loggedUser.data.id,
            password: "",
            email: loggedUser.data.email || "",
            vatNumber: loggedUser.data.vatNumber.replace(/[^0-9]/g, "") || "",
            addressLine1: loggedUser.data.addressLine1 || "",
            addressLine2: loggedUser.data.addressLine2 || "",
            city: loggedUser.data.addressCity || "",
            district: loggedUser.data.addressDistrict || "",
            country: loggedUser.data.addressCountry || "",
            zipCode: loggedUser.data.addressZipCode || "",
          });
        }
        setIsLoading(false);
      } catch (error) {
        handleLogError(error);
        setIsError(true);
        setErrorMessage("Failed to load user data.");
        setIsLoading(false); // Ensure loading stops even if there is an error
      }
    };

    fetchUserData();
  }, [Auth]);

  const handleInputChange = (e, { name, value }) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    if (isPasswordVisible && !formData.password) {
      setIsError(true);
      setErrorMessage("Please provide a password if you wish to change it.");
      return;
    }

    if (isEmailVisible && !formData.email) {
      setIsError(true);
      setErrorMessage("Please provide an email if you wish to change it.");
      return;
    }

    // Create a copy of formData
    let dataToSend = { ...formData };

    // Remove password field if not visible
    if (!isPasswordVisible) {
      delete dataToSend.password;
    }

    // Remove email field if not visible
    if (!isEmailVisible) {
      delete dataToSend.email;
    }

    try {
      await authApi.editUser(dataToSend, Auth.getUser());

      const updatedUser = {
        ...Auth.getUser(),
        password: dataToSend.password || Auth.getUser().password, // Only update email if changed
      };

      Auth.userLogout();
      navigate("/"); // Redirect to home page
      const response = await authApi.authenticate(
        updatedUser.name,
        updatedUser.password,
      );
      const { id, name, role } = response.data;
      const authdata = window.btoa(
        updatedUser.name + ":" + updatedUser.password,
      );
      const authenticatedUser = { id, name, role, authdata };
      Auth.userLogin(authenticatedUser);

      setFormData({
        id: "",
        password: "",
        email: "",
        vatNumber: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        district: "",
        country: "",
        zipCode: "",
      });
      setIsError(false);
      setErrorMessage("");
    } catch (error) {
      handleLogError(error);
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        let errorMessage = "Invalid fields";
        if (errorData.status === 409) {
          errorMessage = errorData.message;
        } else if (errorData.status === 400) {
          errorMessage = errorData.errors[0].defaultMessage;
        }
        setIsError(true);
        setErrorMessage(errorMessage);
      }
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Grid textAlign="center">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="blue" textAlign="center">
          Manage Account
        </Header>
        {isError && <p style={{ color: "red" }}>{errorMessage}</p>}
        <Form size="large" onSubmit={handleSubmit}>
          <Segment>
            <Form.Input
              fluid
              name="vatNumber"
              label="VAT Number"
              placeholder="VAT Number"
              value={formData.vatNumber}
              onChange={handleInputChange}
            />
            <Form.Input
              fluid
              name="addressLine1"
              label="Address Line 1"
              placeholder="Address Line 1"
              value={formData.addressLine1}
              onChange={handleInputChange}
            />
            <Form.Input
              fluid
              name="addressLine2"
              label="Address Line 2"
              placeholder="Address Line 2"
              value={formData.addressLine2}
              onChange={handleInputChange}
            />
            <Form.Input
              fluid
              name="city"
              label="City"
              placeholder="City"
              value={formData.city}
              onChange={handleInputChange}
            />
            <Form.Input
              fluid
              name="district"
              label="District"
              placeholder="District"
              value={formData.district}
              onChange={handleInputChange}
            />
            <Form.Input
              fluid
              name="country"
              label="Country"
              placeholder="Country"
              value={formData.country}
              onChange={handleInputChange}
            />
            <Form.Input
              fluid
              name="zipCode"
              label="Zip Code"
              placeholder="Zip Code"
              value={formData.zipCode}
              onChange={handleInputChange}
            />
            <Checkbox
              label="Change password"
              checked={isPasswordVisible}
              onChange={() => setIsPasswordVisible((prev) => !prev)}
              style={{ marginRight: "20px" }}
            />
            {isPasswordVisible && (
              <Form.Input
                required
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            )}
            <Checkbox
              label="Change email"
              checked={isEmailVisible}
              onChange={() => setIsEmailVisible((prev) => !prev)}
            />
            {isEmailVisible && (
              <Form.Input
                required
                fluid
                name="email"
                icon="at"
                iconPosition="left"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
              />
            )}
            <Button color="blue" fluid size="large">
              Edit
            </Button>
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
}

export default EditAccount;
