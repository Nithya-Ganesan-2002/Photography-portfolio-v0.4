import React from 'react';
import styled from 'styled-components';
import { colors, spacing, typography, breakpoints } from '../../styles/Variables';

const FooterWrapper = styled.footer`
  background: ${colors.footerBackground};
  padding: ${spacing.xxl} 0;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 ${spacing.lg};
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing.xl};
  
  @media (min-width: ${breakpoints.md}) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

const FooterTitle = styled.h3`
  color: ${colors.primary};
  font-size: ${typography.sizes.md};
  margin-bottom: ${spacing.base};
`;

const FooterLink = styled.a`
  color: ${colors.textColor};
  font-size: ${typography.sizes.base};
  transition: color 0.3s ease;
  
  &:hover {
    color: ${colors.primaryAlpha80};
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: ${spacing.lg};
`;

const Credits = styled.p`
  color: ${colors.textColor};
  font-size: ${typography.sizes.sm};
  text-align: center;
  margin-top: ${spacing.xxl};
  opacity: 0.8;
`;

// PUBLIC_INTERFACE
const Footer = () => {
  return (
    <FooterWrapper>
      <FooterContent>
        <FooterSection>
          <FooterTitle>Navigation</FooterTitle>
          <FooterLink href="/gallery">Gallery</FooterLink>
          <FooterLink href="/collections">Collections</FooterLink>
          <FooterLink href="/about">About</FooterLink>
          <FooterLink href="/contact">Contact</FooterLink>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>Connect</FooterTitle>
          <SocialLinks>
            <FooterLink href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</FooterLink>
            <FooterLink href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</FooterLink>
            <FooterLink href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</FooterLink>
          </SocialLinks>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>Contact</FooterTitle>
          <FooterLink href="mailto:contact@photography.com">contact@photography.com</FooterLink>
          <FooterLink href="tel:+1234567890">+1 (234) 567-890</FooterLink>
        </FooterSection>
      </FooterContent>
      <Credits>© 2024 Photography Portfolio. All rights reserved.</Credits>
    </FooterWrapper>
  );
};

export default Footer;