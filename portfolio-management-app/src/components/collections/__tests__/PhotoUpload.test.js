import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PhotoUpload from '../PhotoUpload';

describe('PhotoUpload Component - File Validation', () => {
  const mockOnUpload = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <PhotoUpload
        onUpload={mockOnUpload}
        onError={mockOnError}
        isLoading={false}
        error=""
      />
    );
  };

  const createFile = (name, type, size) => {
    const file = new File([''], name, { type });
    Object.defineProperty(file, 'size', { value: size });
    return file;
  };

  test('accepts valid image files (JPEG, PNG, WebP)', async () => {
    renderComponent();
    const input = screen.getByRole('button', { name: /drop zone for photo upload/i });

    const validFiles = [
      createFile('test1.jpg', 'image/jpeg', 1024 * 1024),
      createFile('test2.png', 'image/png', 1024 * 1024),
      createFile('test3.webp', 'image/webp', 1024 * 1024)
    ];

    validFiles.forEach(file => {
      const dataTransfer = {
        files: [file],
        types: ['Files']
      };

      fireEvent.dragEnter(input, { dataTransfer });
      fireEvent.dragOver(input, { dataTransfer });
      fireEvent.drop(input, { dataTransfer });
    });

    await waitFor(() => {
      expect(mockOnError).not.toHaveBeenCalled();
      expect(screen.getAllByRole('img')).toHaveLength(3);
    });
  });

  test('rejects files with invalid types', async () => {
    renderComponent();
    const input = screen.getByRole('button', { name: /drop zone for photo upload/i });

    const invalidFile = createFile('test.pdf', 'application/pdf', 1024 * 1024);
    const dataTransfer = {
      files: [invalidFile],
      types: ['Files']
    };

    fireEvent.dragEnter(input, { dataTransfer });
    fireEvent.dragOver(input, { dataTransfer });
    fireEvent.drop(input, { dataTransfer });

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith('File type application/pdf is not supported');
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });
  });

  test('rejects files exceeding size limit (5MB)', async () => {
    renderComponent();
    const input = screen.getByRole('button', { name: /drop zone for photo upload/i });

    const largeFile = createFile('large.jpg', 'image/jpeg', 6 * 1024 * 1024); // 6MB
    const dataTransfer = {
      files: [largeFile],
      types: ['Files']
    };

    fireEvent.dragEnter(input, { dataTransfer });
    fireEvent.dragOver(input, { dataTransfer });
    fireEvent.drop(input, { dataTransfer });

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith('File size exceeds 5MB limit');
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });
  });

  test('displays supported file format information', () => {
    renderComponent();
    expect(screen.getByText(/Supported formats: JPG, PNG, WebP \(max 5MB\)/i)).toBeInTheDocument();
  });

  test('handles multiple file validation correctly', async () => {
    renderComponent();
    const input = screen.getByRole('button', { name: /drop zone for photo upload/i });

    const files = [
      createFile('valid.jpg', 'image/jpeg', 1024 * 1024),
      createFile('invalid.txt', 'text/plain', 1024),
      createFile('toolarge.png', 'image/png', 6 * 1024 * 1024)
    ];

    const dataTransfer = {
      files: files,
      types: ['Files']
    };

    fireEvent.dragEnter(input, { dataTransfer });
    fireEvent.dragOver(input, { dataTransfer });
    fireEvent.drop(input, { dataTransfer });

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledTimes(2);
      expect(screen.getAllByRole('img')).toHaveLength(1);
    });
  });
});