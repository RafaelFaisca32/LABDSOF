import React, { useState } from 'react'
import { NavLink, Navigate } from 'react-router-dom'
import { Button, Form, Grid, Segment, Message, Modal, Checkbox, Dropdown } from 'semantic-ui-react'
import { useAuth } from '../context/AuthContext'
import { bookApi } from '../misc/BookApi'
import { handleLogError } from '../misc/Helpers'

function Signup() {
  const Auth = useAuth()
  const isLoggedIn = Auth.userIsAuthenticated()

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    gender: '',
    email: '',
    role: '',
    birthDate: '',
    vatNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    district: '',
    country: '',
    zipCode: ''
  })

  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [gdprConsent, setGdprConsent] = useState(false)
  const [isGdprModalOpen, setIsGdprModalOpen] = useState(false)

  const genderOptions = [
    { key: 'male', text: 'Male', value: 'MALE' },
    { key: 'female', text: 'Female', value: 'FEMALE' }
  ]

  const roleOptions = [
    { key: 'user', text: 'User', value: 'USER' },
    { key: 'user_premium', text: 'User Premium', value: 'USER_PREMIUM' },
    { key: 'admin', text: 'Admin', value: 'ADMIN' },
    { key: 'offer_manager', text: 'Offer Manager', value: 'OFFER_MANAGER' }
  ]

  const handleInputChange = (e, { name, value }) => {
    setFormData(prevData => ({ ...prevData, [name]: value }))
  }

  const handleGdprConsentChange = (e, { checked }) => {
    setGdprConsent(checked)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { username, password, firstName, lastName, gender, email, role, birthDate } = formData
    if (!(username && password && firstName && lastName && gender && email && role && birthDate)) {
      setIsError(true)
      setErrorMessage('Please, inform all required fields!')
      return
    }

    if (!gdprConsent) {
      setIsError(true)
      setErrorMessage('You must agree to the GDPR Privacy Policy to create an account.')
      return
    }

    try {
      const response = await bookApi.signup(formData)
      const { id, name, role } = response.data
      const authdata = window.btoa(name + ':' + password)
      const authenticatedUser = { id, name, role, authdata }

      Auth.userLogin(authenticatedUser)
      setFormData({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        gender: '',
        email: '',
        role: '',
        birthDate: '',
        vatNumber: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        district: '',
        country: '',
        zipCode: ''
      })
      setIsError(false)
      setErrorMessage('')
    } catch (error) {
      handleLogError(error)
      if (error.response && error.response.data) {
        const errorData = error.response.data
        let errorMessage = 'Invalid fields'
        if (errorData.status === 409) {
          errorMessage = errorData.message
        } else if (errorData.status === 400) {
          errorMessage = errorData.errors[0].defaultMessage
        }
        setIsError(true)
        setErrorMessage(errorMessage)
      }
    }
  }

  if (isLoggedIn) {
    return <Navigate to='/' />
  }

  return (
    <Grid textAlign='center'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Form size='large' onSubmit={handleSubmit}>
          <Segment>
            <Form.Input
              required={true}
              fluid
              name='username'
              icon='user'
              iconPosition='left'
              placeholder='Username'
              value={formData.username}
              onChange={handleInputChange}
            />
            <Form.Input
              required={true}
              fluid
              name='password'
              icon='lock'
              iconPosition='left'
              placeholder='Password'
              type='password'
              value={formData.password}
              onChange={handleInputChange}
            />
            <Form.Input
              required={true}
              fluid
              name='firstName'
              icon='address card'
              iconPosition='left'
              placeholder='First Name'
              value={formData.firstName}
              onChange={handleInputChange}
            />
            <Form.Input
              required={true}
              fluid
              name='lastName'
              icon='address card'
              iconPosition='left'
              placeholder='Last Name'
              value={formData.lastName}
              onChange={handleInputChange}
            />
            <Form.Input
              required={true}
              fluid
              name='email'
              icon='at'
              iconPosition='left'
              placeholder='Email'
              value={formData.email}
              onChange={handleInputChange}
            />
            <Dropdown
              required={true}
              fluid
              selection
              options={genderOptions}
              placeholder='Select Gender'
              name='gender'
              value={formData.gender}
              onChange={handleInputChange}
            />
            <Dropdown
              required={true}
              fluid
              selection
              options={roleOptions}
              placeholder='Select Role'
              name='role'
              value={formData.role}
              onChange={handleInputChange}
            />
            <Form.Input
              required={true}
              fluid
              name='birthDate'
              icon='calendar'
              iconPosition='left'
              placeholder='Birth Date (YYYY-MM-DD)'
              type='date'
              value={formData.birthDate}
              onChange={handleInputChange}
              max={new Date().toISOString().split('T')[0]} 
            />
            <Form.Input
              fluid
              name='vatNumber'
              placeholder='VAT Number'
              value={formData.vatNumber}
              onChange={handleInputChange}
            />
            <Form.Input
              fluid
              name='addressLine1'
              placeholder='Address Line 1'
              value={formData.addressLine1}
              onChange={handleInputChange}
            />
            <Form.Input
              fluid
              name='addressLine2'
              placeholder='Address Line 2'
              value={formData.addressLine2}
              onChange={handleInputChange}
            />
            <Form.Input
              fluid
              name='city'
              placeholder='City'
              value={formData.city}
              onChange={handleInputChange}
            />
            <Form.Input
              fluid
              name='district'
              placeholder='District'
              value={formData.district}
              onChange={handleInputChange}
            />
            <Form.Input
              fluid
              name='country'
              placeholder='Country'
              value={formData.country}
              onChange={handleInputChange}
            />
            <Form.Input
              fluid
              name='zipCode'
              placeholder='Zip Code'
              value={formData.zipCode}
              onChange={handleInputChange}
            />
            <Checkbox
              label={<label>I have read and agree to the <span onClick={() => setIsGdprModalOpen(true)} style={{ color: 'blue', cursor: 'pointer' }}>GDPR Privacy Policy</span></label>}
              checked={gdprConsent}
              onChange={handleGdprConsentChange}
            />
            <Button color='blue' fluid size='large'>Signup</Button>
          </Segment>
        </Form>
        <Message>{`Already have an account? `}
          <NavLink to="/login" color='teal'>Login</NavLink>
        </Message>
        {isError && <Message negative>{errorMessage}</Message>}
      </Grid.Column>
      <Modal open={isGdprModalOpen} onClose={() => setIsGdprModalOpen(false)} size='small'>
        <Modal.Header>GDPR Privacy Policy</Modal.Header>
        <Modal.Content scrolling>
          <p><strong>Privacy Notice for Personal Data Processing Under GDPR</strong></p>
          <p>We are committed to protecting your personal data and respecting your privacy...</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setIsGdprModalOpen(false)} color='blue'>Close</Button>
        </Modal.Actions>
      </Modal>
    </Grid>
  )
}

export default Signup
