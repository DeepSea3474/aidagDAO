import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import SoulwareChat from './SoulwareChat';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30">
      <Navbar />
      <main>{children}</main>
      <Footer />
      <SoulwareChat />
    </div>
  );
}
