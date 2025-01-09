import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner';
import { validateRegistrationForm, PASSWORD_REQUIREMENTS, ERROR_MESSAGES } from './validation';
import {
  AuthContainer,
  AuthForm,
  FormTitle,
  FormGroup,
  Label,
  Input,
  Button,
  ErrorMessage,
  LinkText
} from './styles';

// PUBLIC_INTERFACE
/**
 * RegistrationForm component for user registration
 * @returns {JSX.Element} The rendered registration form
 */
const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState([]);

  useEffect(() => {
    // Check password strength whenever password changes
    if (formData.password) {
      const strength = PASSWORD_REQUIREMENTS.map(req => ({
        ...req,
        valid: req.regex.test(formData.password)
      }));
      setPasswordStrength(strength);
    } else {
      setPasswordStrength([]);
    }
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const validationErrors = validateRegistrationForm(formData);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store token in localStorage
      localStorage.setItem('token', data.token);

      // Redirect to dashboard or home page
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthForm onSubmit={handleSubmit} aria-labelledby="register-title">
        <FormTitle id="register-title" tabIndex="-1">Register</FormTitle>
        {Object.keys(errors).map((field) => (
          <ErrorMessage key={field} role="alert" aria-live="polite">
            {errors[field]}
          </ErrorMessage>
        ))}
        {formData.password && (
          <div className="password-requirements" role="alert" aria-live="polite">
            <p>Password requirements:</p>
            <ul>
              {passwordStrength.map((req, index) => (
                <li key={index} style={{ color: req.valid ? '#4CAF50' : '#f44336' }}>
                  {req.message} {req.valid ? '✓' : '✗'}
                </li>
              ))}
            </ul>
          </div>
        )}
        <FormGroup>
          <Label htmlFor="username">Username</Label>
          <Input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            aria-required="true"
            aria-invalid={error && error.includes('username') ? 'true' : 'false'}
            aria-describedby={error && error.includes('username') ? 'username-error' : undefined}
            autoComplete="username"
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            aria-required="true"
            aria-invalid={error && error.includes('email') ? 'true' : 'false'}
            aria-describedby={error && error.includes('email') ? 'email-error' : undefined}
            autoComplete="email"
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            aria-required="true"
            aria-invalid={error && error.includes('password') ? 'true' : 'false'}
            aria-describedby={error && error.includes('password') ? 'password-error' : undefined}
            autoComplete="new-password"
            minLength="8"
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            aria-required="true"
            aria-invalid={error && error.includes('password') ? 'true' : 'false'}
            aria-describedby={error && error.includes('password') ? 'confirm-password-error' : undefined}
            autoComplete="new-password"
            minLength="8"
          />
        </FormGroup>
        <Button 
          type="submit" 
          disabled={loading}
          aria-busy={loading}
          aria-disabled={loading}
        >
          {loading ? <LoadingSpinner size="16px" text="Registering..." /> : 'Register'}
        </Button>
        <LinkText>
          Already have an account? <Link to="/login" aria-label="Already have an account? Click to login">Login</Link>
        </LinkText>
      </AuthForm>
    </AuthContainer>
  );
};

export default RegistrationForm;
