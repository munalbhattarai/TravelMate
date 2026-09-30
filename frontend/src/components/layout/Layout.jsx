import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children, currentRoute, onNavigate }) {
  return (
    <div className="app-layout">
      <Navbar currentRoute={currentRoute} onNavigate={onNavigate} />
      <main className="main-content-wrapper">
        {children}
      </main>
      <Footer />
    </div>
  );
}
