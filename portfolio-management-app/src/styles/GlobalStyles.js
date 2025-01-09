import { createGlobalStyle } from 'styled-components';
import { colors, typography } from './Variables';

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: ${typography.fontFamily};
    color: ${colors.textColor};
    background: linear-gradient(to bottom, ${colors.darkGradientStart}, ${colors.darkGradientEnd});
    min-height: 100vh;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    font: inherit;
    color: inherit;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  ul, ol {
    list-style: none;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${colors.darkGradientEnd};
  }

  ::-webkit-scrollbar-thumb {
    background: ${colors.primary};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${colors.primaryAlpha80};
  }
`;

export default GlobalStyles;