import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Grid,
  Segment,
  Header,
  Checkbox,
  Message,
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
  const [successMessage, setSuccessMessage] = useState(""); // New state for success message

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
            username: loggedUser.data.username,
            firstName: loggedUser.data.firstName,
            lastName: loggedUser.data.lastName,
            gender: loggedUser.data.gender,
            role: loggedUser.data.role,
            birthDate: loggedUser.data.birthDate,
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

  const isFormValid = () => {
    // Check if password is required and missing
    const isPasswordMissing = isPasswordVisible && !formData.password;
    // Check if email is required and missing
    const isEmailMissing = isEmailVisible && !formData.email;

    return !(isPasswordMissing || isEmailMissing);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    dataToSend.addressCity = dataToSend.city;
    delete dataToSend.city;
    dataToSend.addressCountry = dataToSend.country;
    delete dataToSend.country;
    dataToSend.addressDistrict = dataToSend.district;
    delete dataToSend.district;
    dataToSend.addressZipCode = dataToSend.zipCode;
    delete dataToSend.zipCode;

    try {
      await authApi.editUser(dataToSend, Auth.getUser());

      // Set success message after successful update
      setSuccessMessage("Your account has been updated successfully!");

      const updatedUser = {
        ...Auth.getUser(),
        password: dataToSend.password || Auth.getUser().password, // Only update password if changed
      };

      navigate("/"); // Redirect to home page
      if (updatedUser.password) {
        Auth.userLogout();
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
      }

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
        {/* Success message */}
        {successMessage && <Message success>{successMessage}</Message>}
        {isError && <p style={{ color: "red" }}>{errorMessage}</p>}
        <Form size="large" onSubmit={handleSubmit}>
          <Segment>
            <Form.Input
              fluid
              name="username"
              icon="user"
              iconPosition="left"
              label="Username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              disabled
            />
            {isPasswordVisible && (
              <Form.Input
                required
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                label="Password"
                placeholder="Password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            )}
            <Form.Input
              fluid
              name="firstName"
              icon="address card"
              iconPosition="left"
              label="First Name"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              disabled
            />
            <Form.Input
              fluid
              name="lastName"
              icon="address card"
              iconPosition="left"
              label="Last Name"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              disabled
            />
            {isEmailVisible && (
              <Form.Input
                required
                fluid
                name="email"
                icon="at"
                iconPosition="left"
                placeholder="Email"
                label="Email"
                value={formData.email}
                onChange={handleInputChange}
              />
            )}
            <Form.Input
              fluid
              selection
              placeholder="Select Gender"
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              disabled
            />
            <Form.Input
              fluid
              selection
              label="Role"
              placeholder="Select Role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              disabled
            />
            <Form.Input
              required={true}
              fluid
              name="birthDate"
              icon="calendar"
              iconPosition="left"
              label="Birth Date"
              placeholder="Birth Date (YYYY-MM-DD)"
              type="date"
              value={formData.birthDate}
              onChange={handleInputChange}
              max={new Date().toISOString().split("T")[0]}
              disabled
            />
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
            <Checkbox
              label="Change email"
              checked={isEmailVisible}
              onChange={() => setIsEmailVisible((prev) => !prev)}
            />
            <Button color="blue" fluid size="large" disabled={!isFormValid()}>
              Update
            </Button>
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
}

export default EditAccount;
