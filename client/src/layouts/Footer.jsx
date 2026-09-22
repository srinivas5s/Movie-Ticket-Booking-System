import React from 'react';
import { Film, Github, Shield, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-white/10 bg-obsidian-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-white flex items-center justify-center text-black font-bold">
                <Film className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold tracking-wider uppercase text-white">
                Antigravity Cinemas
              </span>
            </div>
            <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
              High-performance, ultra-sleek movie ticket booking platform built with the MERN stack and Antigravity Dark Obsidian design system.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">Platform</h4>
            <ul className="space-y-1.5 text-xs text-zinc-400">
              <li><a href="#" className="hover:text-white transition-colors">Now Playing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Upcoming Premieres</a></li>
              <li><a href="#" className="hover:text-white transition-colors">IMAX Experience</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Exclusive Lounges</a></li>
            </ul>
          </div>

          {/* Legal / Security */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">Security & Terms</h4>
            <ul className="space-y-1.5 text-xs text-zinc-400">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Ticket Cancellation Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security Verification</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Antigravity Cinemas Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Engineered with precision for cinema lovers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
