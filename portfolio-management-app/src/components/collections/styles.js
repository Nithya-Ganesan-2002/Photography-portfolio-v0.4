import styled from 'styled-components';

export const CollectionFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.large};
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

export const CollectionForm = styled.form`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.large};
  background-color: ${({ theme }) => theme.colors.secondary};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const FormTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.h2.fontSize};
  font-weight: ${({ theme }) => theme.typography.h2.fontWeight};
  margin-bottom: ${({ theme }) => theme.spacing.large};
  text-align: center;
`;

export const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

export const Label = styled.label`
  display: block;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  font-weight: 500;
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

export const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.medium};
  background-color: transparent;
  border: 1px solid ${({ theme, error }) => error ? '#ff4444' : theme.colors.text};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}33;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text}99;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.medium};
  background-color: transparent;
  border: 1px solid ${({ theme, error }) => error ? '#ff4444' : theme.colors.text};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  min-height: 120px;
  resize: vertical;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}33;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text}99;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.medium};
  background-color: transparent;
  border: 1px solid ${({ theme, error }) => error ? '#ff4444' : theme.colors.text};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  transition: border-color 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right ${({ theme }) => theme.spacing.medium} center;
  background-size: 20px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}33;
  }

  option {
    background-color: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const ErrorMessage = styled.span`
  color: #ff4444;
  font-size: 0.875rem;
  margin-top: ${({ theme }) => theme.spacing.small};
  display: block;
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.medium};
  background-color: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: ${({ theme }) => theme.spacing.large};

  &:hover {
    background-color: ${({ theme }) => `${theme.colors.primary}dd`};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background-color: ${({ theme }) => `${theme.colors.primary}66`};
    cursor: not-allowed;
    transform: none;
  }
`;

export const DropZone = styled.div`
  width: 100%;
  min-height: 200px;
  border: 2px dashed ${({ theme, isDragging }) =>
    isDragging ? theme.colors.primary : theme.colors.text};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.large};
  margin-bottom: ${({ theme }) => theme.spacing.large};
  background-color: ${({ theme, isDragging }) =>
    isDragging ? `${theme.colors.primary}22` : 'transparent'};
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => `${theme.colors.primary}11`};
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.typography.fontFamily};
  }

  small {
    display: block;
    margin-top: ${({ theme }) => theme.spacing.small};
    color: ${({ theme }) => `${theme.colors.text}99`};
  }
`;

export const PhotoPreviewContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: ${({ theme }) => theme.spacing.medium};
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;

export const PhotoPreviewItem = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 4px;
  overflow: hidden;

  button {
    position: absolute;
    top: ${({ theme }) => theme.spacing.small};
    right: ${({ theme }) => theme.spacing.small};
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.secondary};
    border: none;
    color: ${({ theme }) => theme.colors.text};
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;

    &:hover {
      background-color: ${({ theme }) => theme.colors.primary};
    }
  }

  &:hover button {
    opacity: 1;
  }
`;

export const PhotoPreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const UploadProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: ${({ theme }) => `${theme.colors.text}33`};

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${({ progress }) => `${progress}%`};
    background-color: ${({ theme }) => theme.colors.primary};
    transition: width 0.3s ease;
  }
`;

export const UploadProgressText = styled.span`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing.small};
  right: ${({ theme }) => theme.spacing.small};
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.text};
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
`;
