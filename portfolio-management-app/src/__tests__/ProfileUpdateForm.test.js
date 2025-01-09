import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfileUpdateForm from '../components/profile/ProfileUpdateForm';

// Mock the fetch function
global.fetch = jest.fn();

describe('ProfileUpdateForm', () => {
  beforeEach(() => {
    // Clear mock calls and reset localStorage before each test
    fetch.mockClear();
    localStorage.clear();
    localStorage.setItem('token', 'mock-token');
  });

  test('renders form fields with correct accessibility attributes', () => {
    render(<ProfileUpdateForm />);

    // Check form title
    expect(screen.getByRole('heading', { name: /update profile/i })).toBeInTheDocument();

    // Check form fields
    const nameInput = screen.getByLabelText(/name/i);
    expect(nameInput).toHaveAttribute('aria-required', 'true');
    expect(nameInput).toHaveAttribute('aria-invalid', 'false');

    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toHaveAttribute('aria-required', 'true');
    expect(emailInput).toHaveAttribute('aria-invalid', 'false');

    const bioInput = screen.getByLabelText(/bio/i);
    expect(bioInput).toHaveAttribute('aria-invalid', 'false');

    const profilePictureInput = screen.getByLabelText(/profile picture/i);
    expect(profilePictureInput).toHaveAttribute('accept', 'image/*');
  });

  test('handles form input changes correctly', async () => {
    render(<ProfileUpdateForm />);

    // Test text inputs
    await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/bio/i), 'Test bio');

    expect(screen.getByLabelText(/name/i)).toHaveValue('John Doe');
    expect(screen.getByLabelText(/email/i)).toHaveValue('john@example.com');
    expect(screen.getByLabelText(/bio/i)).toHaveValue('Test bio');

    // Test file input
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText(/profile picture/i);
    await userEvent.upload(fileInput, file);

    expect(fileInput.files[0]).toBe(file);
    expect(fileInput.files).toHaveLength(1);
  });

  test('displays loading state during form submission', async () => {
    fetch.mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<ProfileUpdateForm />);

    // Fill form
    await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');

    // Submit form
    fireEvent.submit(screen.getByRole('form'));

    // Check loading state
    expect(await screen.findByText(/updating profile/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('button')).toBeDisabled();
  });

  test('handles successful form submission', async () => {
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Profile updated successfully' })
      })
    );

    render(<ProfileUpdateForm />);

    // Fill and submit form
    await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    fireEvent.submit(screen.getByRole('form'));

    // Check success message
    await waitFor(() => {
      expect(screen.getByText(/profile updated successfully/i)).toBeInTheDocument();
    });

    // Verify fetch call
    expect(fetch).toHaveBeenCalledWith('/api/profile/update', {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer mock-token'
      },
      body: expect.any(FormData)
    });
  });

  test('handles form submission errors', async () => {
    const errorMessage = 'Invalid email format';
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: errorMessage })
      })
    );

    render(<ProfileUpdateForm />);

    // Fill and submit form
    await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'invalid-email');
    fireEvent.submit(screen.getByRole('form'));

    // Check error message
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
    });
  });

  test('supports keyboard navigation', async () => {
    render(<ProfileUpdateForm />);

    // Check if all interactive elements are focusable
    const focusableElements = screen.getAllByRole('textbox')
      .concat(screen.getByRole('button'));

    // Tab through all focusable elements
    for (const element of focusableElements) {
      element.focus();
      expect(document.activeElement).toBe(element);
    }
  });
});