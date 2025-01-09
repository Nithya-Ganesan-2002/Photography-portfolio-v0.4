import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../components/layout/Header';

describe('Header', () => {
  it('renders logo and navigation', () => {
    render(<Header />);
    
    // Check if logo is rendered
    expect(screen.getByText('Photography Portfolio')).toBeInTheDocument();
    
    // Check if navigation links are rendered
    expect(screen.getByText('Gallery')).toBeInTheDocument();
    expect(screen.getByText('Collections')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('has correct navigation links', () => {
    render(<Header />);
    
    const nav = screen.getByText('Gallery').closest('nav');
    const links = nav.querySelectorAll('a');
    const expectedLinks = [
      { text: 'Gallery', href: '/gallery' },
      { text: 'Collections', href: '/collections' },
      { text: 'About', href: '/about' },
      { text: 'Contact', href: '/contact' }
    ];

    expectedLinks.forEach((expectedLink, index) => {
      expect(links[index]).toHaveAttribute('href', expectedLink.href);
      expect(links[index]).toHaveTextContent(expectedLink.text);
    });
  });

  it('applies responsive styles to navigation', () => {
    render(<Header />);
    
    const nav = screen.getByText('Gallery').closest('nav');
    const styles = window.getComputedStyle(nav);
    
    // Default (mobile) view
    expect(styles.display).toBe('none');
    
    // Test media query for desktop view would require additional setup
    // and is typically tested with integration tests
  });
});
