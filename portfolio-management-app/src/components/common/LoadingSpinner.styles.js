import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const SpinnerWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const Spinner = styled.div`
  width: ${({ size }) => size || '20px'};
  height: ${({ size }) => size || '20px'};
  border: 2px solid transparent;
  border-top-color: ${({ theme, color }) => color || theme.colors.textColor};
  border-right-color: ${({ theme, color }) => color || theme.colors.textColor};
  border-radius: 50%;
  animation: ${spin} 1.2s linear infinite;
`;

export const SpinnerText = styled.span`
  color: ${({ theme, color }) => color || theme.colors.textColor};
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-weight: 500;
`;
