import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 80px);
  padding: ${({ theme }) => theme.spacing.medium};
  background: linear-gradient(to bottom, ${({ theme }) => theme.colors.background}, ${({ theme }) => theme.colors.secondary});
  color: ${({ theme }) => theme.colors.text};
  animation: ${fadeIn} 0.5s ease-out;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.large};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    padding: ${({ theme }) => theme.spacing.xlarge};
  }
`;

export const AuthForm = styled.form`
  width: 90%;
  max-width: 320px;
  padding: ${({ theme }) => theme.spacing.large};
  background-color: rgba(51, 51, 51, 0.95);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  margin: 0 auto;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.4);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 85%;
    max-width: 380px;
    padding: ${({ theme }) => theme.spacing.large};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    width: 100%;
    max-width: 480px;
    padding: ${({ theme }) => theme.spacing.xlarge};
  }
`;

export const FormTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.h1.fontSize};
  font-weight: ${({ theme }) => theme.typography.h1.fontWeight};
  margin-bottom: ${({ theme }) => theme.spacing.large};
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

export const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  position: relative;
  transition: transform 0.3s ease;

  &:focus-within {
    transform: translateX(4px);
  }
`;

export const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.small};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  font-weight: 500;
  letter-spacing: 0.5px;
  transition: color 0.3s ease;

  ${FormGroup}:focus-within & {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.medium};
  border: 2px solid ${({ theme, error }) => 
    error ? '#ff4444' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.2);
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 4px rgba(252, 67, 8, 0.2);
    background-color: rgba(0, 0, 0, 0.3);
  }

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    filter: grayscale(1);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const Button = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.medium};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text};
  border: none;
  border-radius: 8px;
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  font-weight: 600;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-top: ${({ theme }) => theme.spacing.large};
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    margin: -10px 0 0 -10px;
    border: 2px solid transparent;
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: ${spin} 0.8s linear infinite;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  ${({ isLoading }) => isLoading && `
    color: transparent;
    pointer-events: none;
    
    &:before {
      opacity: 1;
    }
  `}

  &:hover:not(:disabled) {
    background-color: #fd5a25;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(252, 67, 8, 0.3);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 4px rgba(252, 67, 8, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    background-color: rgba(252, 67, 8, 0.5);
  }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
`;

export const ErrorMessage = styled.p`
  color: #ff4444;
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  margin-top: ${({ theme }) => theme.spacing.small};
  text-align: left;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.small};
  background-color: rgba(255, 68, 68, 0.1);
  border-radius: 4px;
  animation: ${shake} 0.5s ease-in-out;

  &::before {
    content: '⚠️';
    font-size: 1.1em;
  }
`;

export const LinkText = styled.p`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.large};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  font-family: ${({ theme }) => theme.typography.fontFamily};

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    font-weight: 600;
    position: relative;
    padding: 2px 4px;
    transition: all 0.3s ease;

    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: ${({ theme }) => theme.colors.primary};
      transform: scaleX(0);
      transform-origin: right;
      transition: transform 0.3s ease;
    }

    &:hover {
      color: #fd5a25;
      text-decoration: none;

      &:after {
        transform: scaleX(1);
        transform-origin: left;
      }
    }
  }
`;
