// Theme configuration for styled-components
const theme = {
  colors: {
    primary: '#FC4308', // Orange accent color from design assets
    background: '#000000',
    text: '#FFFFFF',
    secondary: '#333333',
  },
  typography: {
    fontFamily: 'Montserrat, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    body: {
      fontSize: '1rem',
      fontWeight: 400,
    },
  },
  spacing: {
    small: '0.5rem',
    medium: '1rem',
    large: '2rem',
    xlarge: '4rem',
  },
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1440px',
  },
};

export default theme;