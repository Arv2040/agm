'use client';

import { motion } from 'framer-motion';
import { Truck, ArrowRight } from 'lucide-react';
import { CaterpillarLogo } from '@/components/CaterpillarLogo';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-cat-dark">
      <Navbar />
      
      <div className="flex items-center justify-center min-h-screen px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Logo and Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
            className="mb-12"
          >
            <div className="w-24 h-24 bg-cat-yellow rounded-full flex items-center justify-center mx-auto mb-6">
              <Truck size={40} className="text-black" />
            </div>
            <CaterpillarLogo className="justify-center text-2xl" />
          </motion.div>
          
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-cat-text-primary mb-6">
              Caterpillar
            </h1>
            <h2 className="text-2xl md:text-3xl font-medium text-cat-yellow mb-8">
              Fleet Management System
            </h2>
            <p className="text-lg text-cat-text-secondary mb-12 max-w-2xl mx-auto leading-relaxed">
              Advanced analytics and real-time monitoring for your heavy equipment fleet
            </p>
            
            <Link href="/passive-dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-cat-yellow text-black px-8 py-4 rounded-full text-lg font-semibold flex items-center space-x-3 mx-auto hover:shadow-2xl hover:shadow-cat-yellow/20 transition-all duration-300"
              >
                <span>View Fleet Dashboard</span>
                <ArrowRight size={20} />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}