import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner';
import { validateLoginForm, formatApiError } from './validation';
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
 * LoginForm component for user authentication
 * @returns {JSX.Element} The rendered login form
 */
const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    // Clear API error when user makes any change
    if (apiError) {
      setApiError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateLoginForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setApiError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token in localStorage
      localStorage.setItem('token', data.token);

      // Redirect to dashboard or home page
      window.location.href = '/dashboard';
    } catch (err) {
      setApiError(formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthForm onSubmit={handleSubmit} aria-labelledby="login-title">
        <FormTitle id="login-title" tabIndex="-1">Login</FormTitle>
        {apiError && <ErrorMessage role="alert" aria-live="polite">{apiError}</ErrorMessage>}
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
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
            autoComplete="email"
          />
          {errors.password && (
            <ErrorMessage id="password-error" role="alert" aria-live="polite">
              {errors.password}
            </ErrorMessage>
          )}
          {errors.email && (
            <ErrorMessage id="email-error" role="alert" aria-live="polite">
              {errors.email}
            </ErrorMessage>
          )}
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
            aria-invalid={errors.password ? 'true' : 'false'}
            aria-describedby={errors.password ? 'password-error' : undefined}
            autoComplete="current-password"
          />
        </FormGroup>
        <Button 
          type="submit" 
          disabled={loading}
          aria-busy={loading}
          aria-disabled={loading}
        >
          {loading ? <LoadingSpinner size="16px" text="Logging in..." /> : 'Login'}
        </Button>
        <LinkText>
          <Link to="/forgot-password" aria-label="Forgot Password? Click to reset">Forgot Password?</Link>
        </LinkText>
        <LinkText>
          Don't have an account? <Link to="/register" aria-label="No account? Click to register">Register</Link>
        </LinkText>
      </AuthForm>
    </AuthContainer>
  );
};

export default LoginForm;
