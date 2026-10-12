import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children, currentRoute, onNavigate }) {
  const isAuthPage = currentRoute === 'login' || currentRoute === 'register';

  return (
    <div className={`app-layout ${isAuthPage ? 'auth-layout-active' : ''}`}>
      <Navbar currentRoute={currentRoute} onNavigate={onNavigate} />
      <main className={`main-content-wrapper ${isAuthPage ? 'auth-main-wrapper' : ''}`}>
        {children}
      </main>
      {!isAuthPage && <Footer onNavigate={onNavigate} />}
    </div>
  );
}
