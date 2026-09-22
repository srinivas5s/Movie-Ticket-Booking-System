import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const RootLayout = () => {
  return (
    <div className="min-h-screen bg-obsidian-900 text-white flex flex-col selection:bg-white selection:text-black">
      <Navbar />
      <main className="flex-1 pt-16 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
