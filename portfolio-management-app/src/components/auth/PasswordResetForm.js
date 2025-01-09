import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner';
import { validatePasswordResetForm, PASSWORD_REQUIREMENTS, ERROR_MESSAGES } from './validation';
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
 * PasswordResetForm component for resetting user password
 * @returns {JSX.Element} The rendered password reset form
 */
const PasswordResetForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    token: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState([]);

  useEffect(() => {
    // Check password strength whenever new password changes
    if (formData.newPassword) {
      const strength = PASSWORD_REQUIREMENTS.map(req => ({
        ...req,
        valid: req.regex.test(formData.newPassword)
      }));
      setPasswordStrength(strength);
    } else {
      setPasswordStrength([]);
    }
  }, [formData.newPassword]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateEmailForm = () => {
    const validationErrors = validatePasswordResetForm({ email: formData.email });
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const validateResetForm = () => {
    const validationErrors = {};
    
    if (!formData.token) {
      validationErrors.token = 'Reset token is required';
    }

    if (!formData.newPassword) {
      validationErrors.newPassword = ERROR_MESSAGES.password.required;
    } else if (!PASSWORD_REGEX.test(formData.newPassword)) {
      validationErrors.newPassword = ERROR_MESSAGES.password.invalid;
    }

    if (!formData.confirmPassword) {
      validationErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      validationErrors.confirmPassword = ERROR_MESSAGES.password.mismatch;
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    
    if (!validateEmailForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/request-password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: formData.email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to request password reset');
      }

      setMessage('Password reset instructions have been sent to your email');
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!validateResetForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: formData.token,
          newPassword: formData.newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      setMessage('Password has been reset successfully');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthForm 
        onSubmit={step === 1 ? handleRequestReset : handleResetPassword}
        aria-labelledby="reset-title"
      >
        <FormTitle id="reset-title" tabIndex="-1">Reset Password</FormTitle>
        {Object.keys(errors).map((field) => (
          <ErrorMessage key={field} role="alert" aria-live="polite">
            {errors[field]}
          </ErrorMessage>
        ))}
        {step === 2 && formData.newPassword && (
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
        {message && (
          <ErrorMessage 
            style={{ color: '#4CAF50' }} 
            role="status" 
            aria-live="polite"
          >
            {message}
          </ErrorMessage>
        )}
        
        {step === 1 ? (
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
        ) : (
          <>
            <FormGroup>
              <Label htmlFor="token">Reset Token</Label>
              <Input
                type="text"
                id="token"
                name="token"
                value={formData.token}
                onChange={handleChange}
                required
                aria-required="true"
                aria-invalid={error && error.includes('token') ? 'true' : 'false'}
                aria-describedby={error && error.includes('token') ? 'token-error' : undefined}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
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
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
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
          </>
        )}
        
        <Button 
          type="submit" 
          disabled={loading}
          aria-busy={loading}
          aria-disabled={loading}
        >
          {loading ? (
            <LoadingSpinner size="16px" text="Processing..." />
          ) : step === 1 ? (
            'Request Reset'
          ) : (
            'Reset Password'
          )}
        </Button>
        
        <LinkText>
          Remember your password? <Link to="/login" aria-label="Remember your password? Click to login">Login</Link>
        </LinkText>
      </AuthForm>
    </AuthContainer>
  );
};

export default PasswordResetForm;
