'use client';

import { CaterpillarLogo } from './CaterpillarLogo';
import { User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {useState} from 'react';
import { useActiveState } from '@/app/context';

export function Navbar() {
  const pathname = usePathname();
  const {open,setIsOpen} = useActiveState();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cat-dark/90 backdrop-blur-lg border-b border-cat-charcoal">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <CaterpillarLogo />
          </Link>
          
          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link 
              href="/passive-dashboard"
              onClick={() => setIsOpen(1)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                pathname === '/passive-dashboard'
                  ? 'bg-cat-yellow text-black'
                  : 'text-cat-text-secondary hover:text-cat-text-primary'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              href="/active-telemetry"
              onClick={() => setIsOpen(2)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                pathname === '/active-telemetry'
                  ? 'bg-cat-yellow text-black'
                  : 'text-cat-text-secondary hover:text-cat-text-primary'
              }`}
            >
              Active Telemetry
            </Link>
          </div>
          
          {/* User Profile */}
          <div className="p-2 rounded-full bg-cat-charcoal hover:bg-cat-yellow hover:text-black transition-all duration-300 cursor-pointer">
            <User size={20} />
          </div>
        </div>
      </div>
    </nav>
  );
}