import React, { useState } from 'react'
import { NavLink, Navigate } from 'react-router-dom'
import { Button, Form, Grid, Segment, Message, Modal, Checkbox } from 'semantic-ui-react'
import { useAuth } from '../context/AuthContext'
import { bookApi } from '../misc/BookApi'
import { handleLogError } from '../misc/Helpers'

function Signup() {
  const Auth = useAuth()
  const isLoggedIn = Auth.userIsAuthenticated()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [gdprConsent, setGdprConsent] = useState(false)
  const [isGdprModalOpen, setIsGdprModalOpen] = useState(false)

  const handleInputChange = (e, { name, value }) => {
    if (name === 'username') {
      setUsername(value)
    } else if (name === 'password') {
      setPassword(value)
    } else if (name === 'name') {
      setName(value)
    } else if (name === 'email') {
      setEmail(value)
    }
  }

  const handleGdprConsentChange = (e, { checked }) => {
    setGdprConsent(checked)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!(username && password && name && email)) {
      setIsError(true)
      setErrorMessage('Please, inform all fields!')
      return
    }

    if (!gdprConsent) {
      setIsError(true)
      setErrorMessage('You must agree to the GDPR Privacy Policy to create an account.')
      return
    }

    const user = { username, password, name, email }

    try {
      const response = await bookApi.signup(user)
      const { id, name, role } = response.data
      const authdata = window.btoa(username + ':' + password)
      const authenticatedUser = { id, name, role, authdata }

      Auth.userLogin(authenticatedUser)

      setUsername('')
      setPassword('')
      setName('')
      setEmail('')
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
              fluid
              autoFocus
              name='username'
              icon='user'
              iconPosition='left'
              placeholder='Username'
              value={username}
              onChange={handleInputChange}
            />
            <Form.Input
              fluid
              name='password'
              icon='lock'
              iconPosition='left'
              placeholder='Password'
              type='password'
              value={password}
              onChange={handleInputChange}
            />
            <Form.Input
              fluid
              name='name'
              icon='address card'
              iconPosition='left'
              placeholder='Name'
              value={name}
              onChange={handleInputChange}
            />
            <Form.Input
              fluid
              name='email'
              icon='at'
              iconPosition='left'
              placeholder='Email'
              value={email}
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

      {/* GDPR Policy Modal */}
      <Modal open={isGdprModalOpen} onClose={() => setIsGdprModalOpen(false)} size='small'>
        <Modal.Header>GDPR Privacy Policy</Modal.Header>
        <Modal.Content scrolling>
          <p><strong>Privacy Notice for Personal Data Processing Under GDPR</strong></p>
          <p>We are committed to protecting your personal data and respecting your privacy. Upon account creation, we collect and process personal information, including your name, email address, and other optional data you may choose to provide.</p>
          <p><strong>Data Usage:</strong> Your data will be used to create and manage your account, deliver our services, improve your experience, and comply with any applicable legal obligations.</p>
          <p><strong>Data Storage:</strong> We store your data securely and retain it only as long as necessary for the purposes outlined or as legally required.</p>
          <p><strong>Your Rights:</strong> Under GDPR, you have the right to access, rectify, or delete your data, as well as the right to restrict processing, data portability, and to object to data processing where applicable. You can exercise these rights by contacting our support team.</p>
          <p>By creating an account, you consent to the collection and use of your personal information as described. For more information on your data rights or if you wish to withdraw consent, please contact our data protection officer at [contact details].</p>
          <p><em>Last Updated: [date]</em></p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setIsGdprModalOpen(false)} color='blue'>Close</Button>
        </Modal.Actions>
      </Modal>
    </Grid>
  )
}

export default Signup
