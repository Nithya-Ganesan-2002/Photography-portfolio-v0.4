import React from 'react';
import { render, screen } from '@testing-library/react';
import MainLayout from '../components/layout/MainLayout';

describe('MainLayout', () => {
  it('renders header, main content, and footer', () => {
    const testContent = 'Test Content';
    render(
      <MainLayout>
        <div>{testContent}</div>
      </MainLayout>
    );

    // Check if header is rendered
    expect(screen.getByRole('banner')).toBeInTheDocument();

    // Check if main content is rendered
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByText(testContent)).toBeInTheDocument();

    // Check if footer is rendered
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('applies correct styling to layout wrapper', () => {
    render(
      <MainLayout>
        <div>Content</div>
      </MainLayout>
    );

    const layoutWrapper = screen.getByRole('main').parentElement;
    const styles = window.getComputedStyle(layoutWrapper);
    
    expect(styles.display).toBe('flex');
    expect(styles.flexDirection).toBe('column');
    expect(styles.minHeight).toBe('100vh');
  });

  it('applies correct styling to main content', () => {
    render(
      <MainLayout>
        <div>Content</div>
      </MainLayout>
    );

    const main = screen.getByRole('main');
    const styles = window.getComputedStyle(main);
    
    expect(styles.flex).toBe('1');
    expect(styles.width).toBe('100%');
    expect(styles.maxWidth).toBe('1280px');
    expect(styles.margin).toBe('0px auto');
    expect(styles.padding).toBe('0px 16px');
  });
});