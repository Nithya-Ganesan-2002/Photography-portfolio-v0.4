import React, { useState } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import {
  AuthContainer,
  AuthForm,
  FormTitle,
  FormGroup,
  Label,
  Input,
  Button,
  ErrorMessage
} from '../auth/styles';

// PUBLIC_INTERFACE
/**
 * ProfileUpdateForm component for updating user profile information
 * @returns {JSX.Element} The rendered profile update form
 */
const ProfileUpdateForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    profile_picture: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      const token = localStorage.getItem('token');
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Profile update failed');
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthForm onSubmit={handleSubmit} aria-labelledby="profile-update-title">
        <FormTitle id="profile-update-title" tabIndex="-1">Update Profile</FormTitle>
        {error && <ErrorMessage role="alert" aria-live="polite">{error}</ErrorMessage>}
        {success && (
          <ErrorMessage 
            role="alert" 
            aria-live="polite" 
            style={{ color: '#4CAF50' }}
          >
            Profile updated successfully!
          </ErrorMessage>
        )}
        <FormGroup>
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            aria-required="true"
            aria-invalid={error && error.includes('name') ? 'true' : 'false'}
            aria-describedby={error && error.includes('name') ? 'name-error' : undefined}
            autoComplete="name"
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
          <Label htmlFor="bio">Bio</Label>
          <Input
            as="textarea"
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            aria-invalid={error && error.includes('bio') ? 'true' : 'false'}
            aria-describedby={error && error.includes('bio') ? 'bio-error' : undefined}
            style={{ minHeight: '100px', resize: 'vertical' }}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="profile_picture">Profile Picture</Label>
          <Input
            type="file"
            id="profile_picture"
            name="profile_picture"
            onChange={handleChange}
            accept="image/*"
            aria-invalid={error && error.includes('profile_picture') ? 'true' : 'false'}
            aria-describedby={error && error.includes('profile_picture') ? 'profile-picture-error' : undefined}
          />
        </FormGroup>
        <Button 
          type="submit" 
          disabled={loading}
          aria-busy={loading}
          aria-disabled={loading}
        >
          {loading ? <LoadingSpinner size="16px" text="Updating profile..." /> : 'Update Profile'}
        </Button>
      </AuthForm>
    </AuthContainer>
  );
};

export default ProfileUpdateForm;