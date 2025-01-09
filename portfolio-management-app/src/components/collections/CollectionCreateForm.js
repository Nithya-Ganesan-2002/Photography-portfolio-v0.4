import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { LoadingSpinner } from '../common/LoadingSpinner';
import {
  CollectionFormContainer,
  CollectionForm,
  FormTitle,
  FormGroup,
  Label,
  Input,
  TextArea,
  Select,
  ErrorMessage,
  SubmitButton,
} from './styles';

// Form validation rules
const validateForm = (values) => {
  const errors = {};

  if (!values.title.trim()) {
    errors.title = 'Title is required';
  } else if (values.title.length < 3) {
    errors.title = 'Title must be at least 3 characters long';
  }

  if (!values.description.trim()) {
    errors.description = 'Description is required';
  } else if (values.description.length < 10) {
    errors.description = 'Description must be at least 10 characters long';
  }

  if (!values.privacy) {
    errors.privacy = 'Privacy setting is required';
  }

  return errors;
};

// PUBLIC_INTERFACE
/**
 * Collection creation form component with validation and accessibility features
 * @param {Object} props - Component props
 * @param {Function} props.onSubmit - Function to handle form submission
 * @param {boolean} props.isLoading - Loading state of the form
 * @param {string} props.error - Error message from API
 */
const CollectionCreateForm = ({ onSubmit, isLoading, error }) => {
  const [values, setValues] = useState({
    title: '',
    description: '',
    privacy: 'private',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validate field on blur
    const fieldErrors = validateForm({
      ...values,
      [name]: values[name],
    });

    if (fieldErrors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: fieldErrors[name],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const formErrors = validateForm(values);
    setErrors(formErrors);

    // Mark all fields as touched
    setTouched({
      title: true,
      description: true,
      privacy: true,
    });

    // If no errors, submit the form
    if (Object.keys(formErrors).length === 0) {
      await onSubmit(values);
    }
  };

  return (
    <CollectionFormContainer>
      <CollectionForm onSubmit={handleSubmit} noValidate>
        <FormTitle>Create New Collection</FormTitle>

        {error && <ErrorMessage role="alert">{error}</ErrorMessage>}

        <FormGroup>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            type="text"
            value={values.title}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.title && errors.title}
            aria-invalid={touched.title && errors.title ? 'true' : 'false'}
            aria-describedby={errors.title ? 'title-error' : undefined}
            disabled={isLoading}
            placeholder="Enter collection title"
          />
          {touched.title && errors.title && (
            <ErrorMessage id="title-error" role="alert">
              {errors.title}
            </ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="description">Description</Label>
          <TextArea
            id="description"
            name="description"
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.description && errors.description}
            aria-invalid={touched.description && errors.description ? 'true' : 'false'}
            aria-describedby={errors.description ? 'description-error' : undefined}
            disabled={isLoading}
            placeholder="Enter collection description"
          />
          {touched.description && errors.description && (
            <ErrorMessage id="description-error" role="alert">
              {errors.description}
            </ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="privacy">Privacy Setting</Label>
          <Select
            id="privacy"
            name="privacy"
            value={values.privacy}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.privacy && errors.privacy}
            aria-invalid={touched.privacy && errors.privacy ? 'true' : 'false'}
            aria-describedby={errors.privacy ? 'privacy-error' : undefined}
            disabled={isLoading}
          >
            <option value="private">Private</option>
            <option value="public">Public</option>
            <option value="shared">Shared</option>
          </Select>
          {touched.privacy && errors.privacy && (
            <ErrorMessage id="privacy-error" role="alert">
              {errors.privacy}
            </ErrorMessage>
          )}
        </FormGroup>

        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? <LoadingSpinner size="small" /> : 'Create Collection'}
        </SubmitButton>
      </CollectionForm>
    </CollectionFormContainer>
  );
};

CollectionCreateForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
};

CollectionCreateForm.defaultProps = {
  isLoading: false,
  error: '',
};

export default CollectionCreateForm;