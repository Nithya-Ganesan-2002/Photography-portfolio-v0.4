import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../components/layout/Footer';

describe('Footer', () => {
  it('renders navigation section with correct links', () => {
    render(<Footer />);
    
    expect(screen.getByText('Navigation')).toBeInTheDocument();
    
    const navigationLinks = ['Gallery', 'Collections', 'About', 'Contact'];
    const navigationSection = screen.getByText('Navigation').closest('div');
    
    navigationLinks.forEach(link => {
      const linkElement = screen.getByRole('link', { name: link, within: navigationSection });
      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveAttribute('href', `/${link.toLowerCase()}`);
    });
  });

  it('renders social media links with correct attributes', () => {
    render(<Footer />);
    
    expect(screen.getByText('Connect')).toBeInTheDocument();
    
    const socialLinks = [
      { text: 'Instagram', href: 'https://instagram.com' },
      { text: 'Facebook', href: 'https://facebook.com' },
      { text: 'Twitter', href: 'https://twitter.com' }
    ];

    socialLinks.forEach(({ text, href }) => {
      const link = screen.getByText(text);
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', href);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('renders contact section with correct information', () => {
    render(<Footer />);
    
    const contactSection = screen.getAllByText('Contact')[1].closest('div');
    expect(contactSection).toBeInTheDocument();
    
    const emailLink = screen.getByRole('link', { name: 'contact@photography.com' });
    expect(emailLink).toHaveAttribute('href', 'mailto:contact@photography.com');
    
    const phoneLink = screen.getByRole('link', { name: '+1 (234) 567-890' });
    expect(phoneLink).toHaveAttribute('href', 'tel:+1234567890');
  });

  it('renders copyright notice', () => {
    render(<Footer />);
    
    expect(screen.getByText(/© 2024 Photography Portfolio\. All rights reserved\./)).toBeInTheDocument();
  });

  it('applies responsive grid layout', () => {
    render(<Footer />);
    
    const footerContent = screen.getByText('Navigation').closest('div').parentElement;
    const styles = window.getComputedStyle(footerContent);
    
    expect(styles.display).toBe('grid');
    expect(styles.gridTemplateColumns).toBe('1fr');
    
    // Test media query for desktop view would require additional setup
    // and is typically tested with integration tests
  });
});
