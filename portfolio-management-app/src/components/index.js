// Components barrel file
// Import and export all components here for easier imports throughout the app

// Layout components
export { default as MainLayout } from './layout/MainLayout';
export { default as Header } from './layout/Header';
export { default as Footer } from './layout/Footer';

// Common components
export { default as Button } from './common/Button';
export { default as Container } from './common/Container';
export { default as Section } from './common/Section';

// Feature components
export { default as HeroSection } from './sections/HeroSection';
export { default as GallerySection } from './sections/GallerySection';
export { default as CollectionSection } from './sections/CollectionSection';

// Profile components
export * from './profile';

// Collection components
export * from './collections';
