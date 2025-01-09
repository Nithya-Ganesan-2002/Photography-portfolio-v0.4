import React from 'react';
import PropTypes from 'prop-types';
import { SpinnerWrapper, Spinner, SpinnerText } from './LoadingSpinner.styles';

// PUBLIC_INTERFACE
/**
 * LoadingSpinner component for displaying loading states
 * @param {Object} props - Component props
 * @param {string} [props.size] - Size of the spinner in pixels
 * @param {string} [props.color] - Color of the spinner
 * @param {string} [props.text] - Text to display next to the spinner
 * @returns {JSX.Element} The rendered loading spinner
 */
const LoadingSpinner = ({ size, color, text }) => {
  return (
    <SpinnerWrapper role="status" aria-busy="true">
      <Spinner size={size} color={color} />
      {text && <SpinnerText color={color}>{text}</SpinnerText>}
    </SpinnerWrapper>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.string,
  color: PropTypes.string,
  text: PropTypes.string
};

export default LoadingSpinner;