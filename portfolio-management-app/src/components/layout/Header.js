import React from 'react';
import styled from 'styled-components';
import { colors, spacing, typography, breakpoints } from '../../styles/Variables';

const HeaderWrapper = styled.header`
  background: ${colors.darkGradientStart};
  padding: ${spacing.lg} 0;
  border-bottom: ${colors.borderColor} 1px solid;
`;

const HeaderContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 ${spacing.lg};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  font-size: ${typography.sizes.lg};
  color: ${colors.primary};
  font-weight: bold;
  
  @media (min-width: ${breakpoints.md}) {
    font-size: ${typography.sizes.xl};
  }
`;

const Nav = styled.nav`
  display: none;
  
  @media (min-width: ${breakpoints.md}) {
    display: flex;
    gap: ${spacing.xl};
  }
`;

const NavLink = styled.a`
  color: ${colors.textColor};
  font-size: ${typography.sizes.base};
  transition: color 0.3s ease;
  
  &:hover {
    color: ${colors.primaryAlpha80};
  }
`;

// PUBLIC_INTERFACE
const Header = () => {
  return (
    <HeaderWrapper>
      <HeaderContent>
        <Logo>Photography Portfolio</Logo>
        <Nav>
          <NavLink href="/gallery">Gallery</NavLink>
          <NavLink href="/collections">Collections</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/contact">Contact</NavLink>
        </Nav>
      </HeaderContent>
    </HeaderWrapper>
  );
};

export default Header;