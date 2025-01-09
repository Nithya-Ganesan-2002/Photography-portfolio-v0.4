import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CollectionCreateForm from '../CollectionCreateForm';

describe('CollectionCreateForm', () => {
  const mockOnSubmit = jest.fn();
  const defaultProps = {
    onSubmit: mockOnSubmit,
    isLoading: false,
    error: '',
  };

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  // Form Rendering Tests
  describe('Form Rendering', () => {
    it('renders all form elements correctly', () => {
      render(<CollectionCreateForm {...defaultProps} />);

      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/privacy setting/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create collection/i })).toBeInTheDocument();
    });

    it('renders with default values', () => {
      render(<CollectionCreateForm {...defaultProps} />);

      expect(screen.getByLabelText(/title/i)).toHaveValue('');
      expect(screen.getByLabelText(/description/i)).toHaveValue('');
      expect(screen.getByLabelText(/privacy setting/i)).toHaveValue('private');
    });
  });

  // Form Validation Tests
  describe('Form Validation', () => {
    it('shows validation errors when submitting empty form', async () => {
      render(<CollectionCreateForm {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: /create collection/i }));

      expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
      expect(await screen.findByText(/description is required/i)).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('validates title length', async () => {
      render(<CollectionCreateForm {...defaultProps} />);
      const titleInput = screen.getByLabelText(/title/i);

      await userEvent.type(titleInput, 'ab');
      fireEvent.blur(titleInput);

      expect(await screen.findByText(/title must be at least 3 characters long/i)).toBeInTheDocument();
    });

    it('validates description length', async () => {
      render(<CollectionCreateForm {...defaultProps} />);
      const descInput = screen.getByLabelText(/description/i);

      await userEvent.type(descInput, 'short');
      fireEvent.blur(descInput);

      expect(await screen.findByText(/description must be at least 10 characters long/i)).toBeInTheDocument();
    });

    it('clears errors when user starts typing', async () => {
      render(<CollectionCreateForm {...defaultProps} />);
      const titleInput = screen.getByLabelText(/title/i);

      fireEvent.blur(titleInput);
      expect(await screen.findByText(/title is required/i)).toBeInTheDocument();

      await userEvent.type(titleInput, 'New Title');
      expect(screen.queryByText(/title is required/i)).not.toBeInTheDocument();
    });
  });

  // Loading State Tests
  describe('Loading State', () => {
    it('disables form inputs when loading', () => {
      render(<CollectionCreateForm {...defaultProps} isLoading={true} />);

      expect(screen.getByLabelText(/title/i)).toBeDisabled();
      expect(screen.getByLabelText(/description/i)).toBeDisabled();
      expect(screen.getByLabelText(/privacy setting/i)).toBeDisabled();
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('shows loading spinner when isLoading is true', () => {
      render(<CollectionCreateForm {...defaultProps} isLoading={true} />);

      expect(screen.queryByText(/create collection/i)).not.toBeInTheDocument();
      expect(screen.getByRole('button')).toContainElement(screen.getByRole('status'));
    });
  });

  // Error Handling Tests
  describe('Error Handling', () => {
    it('displays API error message when provided', () => {
      const errorMessage = 'Failed to create collection';
      render(<CollectionCreateForm {...defaultProps} error={errorMessage} />);

      expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    it('sets aria-invalid on inputs with errors', async () => {
      render(<CollectionCreateForm {...defaultProps} />);
      const titleInput = screen.getByLabelText(/title/i);

      expect(titleInput).toHaveAttribute('aria-invalid', 'false');

      fireEvent.blur(titleInput);
      await waitFor(() => {
        expect(titleInput).toHaveAttribute('aria-invalid', 'true');
      });
    });

    it('associates error messages with inputs using aria-describedby', async () => {
      render(<CollectionCreateForm {...defaultProps} />);
      const titleInput = screen.getByLabelText(/title/i);

      fireEvent.blur(titleInput);
      await waitFor(() => {
        expect(titleInput).toHaveAttribute('aria-describedby', 'title-error');
      });
    });
  });

  // Form Submission Tests
  describe('Form Submission', () => {
    it('submits form with valid data', async () => {
      render(<CollectionCreateForm {...defaultProps} />);

      await userEvent.type(screen.getByLabelText(/title/i), 'Test Collection');
      await userEvent.type(screen.getByLabelText(/description/i), 'This is a test collection description');
      await userEvent.selectOptions(screen.getByLabelText(/privacy setting/i), 'public');

      fireEvent.click(screen.getByRole('button', { name: /create collection/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          title: 'Test Collection',
          description: 'This is a test collection description',
          privacy: 'public',
        });
      });
    });

    it('prevents submission when form has validation errors', async () => {
      render(<CollectionCreateForm {...defaultProps} />);

      await userEvent.type(screen.getByLabelText(/title/i), 'ab');
      fireEvent.click(screen.getByRole('button', { name: /create collection/i }));

      expect(mockOnSubmit).not.toHaveBeenCalled();
      expect(await screen.findByText(/title must be at least 3 characters long/i)).toBeInTheDocument();
    });
  });
});