'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Truck, Clock, Settings, TrendingUp } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import Image from 'next/image';

// Data Interfaces
interface Equipment {
  id: string;
  type: 'Excavator' | 'Crane' | 'Bulldozer' | 'Grader';
  lastOperatorId: string | null;
  operatingDays: number;
  totalHours: number;
  imageUrl: string;
  status: 'Active' | 'Maintenance' | 'Idle';
  avgHoursPerDay: number;
}

interface SummaryStats {
  activeEquipment: number;
  totalHours: number;
  avgHoursPerUnit: number;
  operationalStatus: number;
}

interface ForecastData {
  nextMonth: number;
  peakDemand: string;
  revenueGrowth: number;
  analysisText: string;
}

// Mock Data Constants
// TODO: This mockEquipmentData will be replaced by a live API call to '/api/equipment'
const mockEquipmentData: Equipment[] = [
  { 
    id: 'EQX1001', 
    type: 'Excavator', 
    lastOperatorId: 'OP101', 
    operatingDays: 15, 
    totalHours: 150, 
    imageUrl: 'https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg',
    status: 'Active',
    avgHoursPerDay: 10
  },
  { 
    id: 'EQX1002', 
    type: 'Crane', 
    lastOperatorId: 'OP203', 
    operatingDays: 25, 
    totalHours: 187.5, 
    imageUrl: 'https://images.pexels.com/photos/236705/pexels-photo-236705.jpeg',
    status: 'Active',
    avgHoursPerDay: 7.5
  },
  { 
    id: 'EQX1003', 
    type: 'Bulldozer', 
    lastOperatorId: 'OP106', 
    operatingDays: 10, 
    totalHours: 75, 
    imageUrl: 'https://images.pexels.com/photos/1078883/pexels-photo-1078883.jpeg',
    status: 'Active',
    avgHoursPerDay: 7.5
  },
  { 
    id: 'EQX1004', 
    type: 'Excavator', 
    lastOperatorId: 'OP301', 
    operatingDays: 30, 
    totalHours: 240, 
    imageUrl: 'https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg',
    status: 'Maintenance',
    avgHoursPerDay: 8
  },
  { 
    id: 'EQX1006', 
    type: 'Grader', 
    lastOperatorId: 'OP114', 
    operatingDays: 18, 
    totalHours: 54, 
    imageUrl: 'https://images.pexels.com/photos/1078882/pexels-photo-1078882.jpeg',
    status: 'Active',
    avgHoursPerDay: 3
  },
];

// TODO: This mockSummaryData will be replaced by API call to '/api/summary'
const mockSummaryData: SummaryStats = {
  activeEquipment: 6,
  totalHours: 883,
  avgHoursPerUnit: 147,
  operationalStatus: 94
};

// TODO: This mockForecastData will be replaced by API call to '/api/forecast'
const mockForecastData: ForecastData = {
  nextMonth: 87,
  peakDemand: 'Q2',
  revenueGrowth: 12,
  analysisText: 'Based on historical usage patterns and current market conditions, our AI-powered forecasting model predicts optimal equipment allocation for the next quarter. The analysis considers seasonal variations, project timelines, and maintenance schedules to maximize fleet utilization efficiency.'
};

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const getStatusColor = () => {
    switch (status) {
      case 'Active':
        return 'bg-cat-green';
      case 'Maintenance':
        return 'bg-cat-orange';
      case 'Idle':
        return 'bg-cat-text-secondary';
      default:
        return 'bg-cat-text-secondary';
    }
  };

  return (
    <motion.div
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      className={`absolute top-2 right-2 w-3 h-3 ${getStatusColor()} rounded-full shadow-lg`}
    />
  );
}

// Vehicle Card Component
function VehicleCard({ equipment }: { equipment: Equipment }) {
  const getInitial = (type: string) => {
    return type.charAt(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.03,
        borderColor: '#FFCD11',
      }}
      transition={{ duration: 0.3 }}
      className="bg-cat-charcoal rounded-xl p-6 border-2 border-transparent hover:border-cat-yellow transition-all duration-300 relative overflow-hidden"
    >
      <StatusBadge status={equipment.status} />
      
      <div className="grid grid-cols-5 gap-4 h-full">
        {/* Left Column - Vehicle Icon */}
        <div className="col-span-2 flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-cat-yellow rounded-full flex items-center justify-center mb-3">
            <span className="text-2xl font-bold text-black">
              {getInitial(equipment.type)}
            </span>
          </div>
          <span className="text-cat-text-secondary text-sm font-medium">
            {equipment.type}
          </span>
        </div>
        
        {/* Right Column - Data */}
        <div className="col-span-3 space-y-3">
          <div>
            <h3 className="text-cat-yellow text-xl font-bold mb-2">{equipment.id}</h3>
            <p className="text-cat-text-primary text-lg font-semibold">{equipment.type}</p>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-cat-text-secondary">Last Operator:</span>
              <span className="text-cat-text-primary font-medium">{equipment.lastOperatorId}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-cat-text-secondary">Operating Days:</span>
              <span className="text-cat-text-primary font-medium">{equipment.operatingDays}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-cat-text-secondary">Total Hours:</span>
              <span className="text-cat-text-primary font-medium">{equipment.totalHours}h</span>
            </div>
            
            <div className="pt-2 border-t border-cat-text-secondary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-cat-green rounded-full" />
                  <span className="text-cat-text-primary text-xs">{equipment.status}</span>
                </div>
                <span className="text-cat-text-secondary text-xs">
                  {equipment.avgHoursPerDay}h/day avg
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Summary Stats Component
function SummaryStats({ stats }: { stats: SummaryStats }) {
  const statsConfig = [
    {
      icon: Truck,
      label: 'Active Equipment',
      value: stats.activeEquipment,
      suffix: ''
    },
    {
      icon: Clock,
      label: 'Total Hours',
      value: stats.totalHours,
      suffix: 'h'
    },
    {
      icon: Settings,
      label: 'Avg Hours/Unit',
      value: stats.avgHoursPerUnit,
      suffix: 'h'
    },
    {
      icon: TrendingUp,
      label: 'Operational Status',
      value: stats.operationalStatus,
      suffix: '%'
    }
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
    >
      {statsConfig.map((stat, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0 }
          }}
          className="bg-cat-charcoal rounded-xl p-6 border border-cat-charcoal hover:border-cat-yellow/30 transition-all duration-300"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-cat-yellow/10 rounded-lg">
              <stat.icon size={24} className="text-cat-yellow" />
            </div>
            <div>
              <p className="text-cat-text-secondary text-sm">{stat.label}</p>
              <p className="text-cat-text-primary text-2xl font-bold">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// Demand Forecasting Component
function DemandForecastingSection({ forecastData }: { forecastData: ForecastData }) {
  const forecastStats = [
    {
      icon: '📅',
      label: 'Next 30 Days',
      value: `${forecastData.nextMonth}%`,
      subtitle: 'Expected Utilization'
    },
    {
      icon: '📈',
      label: 'Peak Demand',
      value: forecastData.peakDemand,
      subtitle: 'Construction Season'
    },
    {
      icon: '💰',
      label: 'Revenue Growth',
      value: `+${forecastData.revenueGrowth}%`,
      subtitle: 'Projected Increase'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.8 }}
      className="bg-cat-charcoal rounded-xl p-8 border border-cat-charcoal"
    >
      <div className="flex items-center space-x-3 mb-6">
        <TrendingUp size={28} className="text-cat-yellow" />
        <h2 className="text-2xl font-bold text-cat-text-primary">Automated Demand Forecast</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Forecast Stats */}
        <div className="lg:col-span-2 space-y-6">
          <div className="text-cat-text-secondary text-base leading-relaxed">
            {forecastData.analysisText}
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {forecastStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="bg-cat-dark/50 rounded-lg p-4 border border-cat-yellow/10"
              >
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-sm text-cat-text-secondary mb-1">{stat.label}</div>
                <div className="text-xl font-bold text-cat-yellow">{stat.value}</div>
                <div className="text-xs text-cat-text-secondary">{stat.subtitle}</div>
              </motion.div>
            ))}
          </div>
          
          {/* TODO Block */}
          <div className="bg-cat-dark/30 rounded-lg p-4 border border-cat-yellow/20">
            <p className="text-cat-text-secondary text-sm mb-2 font-mono">TODO: This section will integrate with:</p>
            <ul className="text-cat-text-secondary text-xs space-y-1 font-mono">
              <li>• Real-time API for equipment usage data</li>
              <li>• Machine learning model for predictive analytics</li>
              <li>• PDF generation service for detailed reports</li>
              <li>• Integration with maintenance scheduling system</li>
            </ul>
          </div>
        </div>
        
        {/* Right: Forecast Analysis */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-cat-text-primary">Forecast Analysis</h3>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-cat-green rounded-full" />
              <span className="text-cat-text-secondary text-sm">Excavator demand: High</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-cat-yellow rounded-full" />
              <span className="text-cat-text-secondary text-sm">Crane utilization: Optimal</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <span className="text-cat-text-secondary text-sm">Maintenance window: Q1</span>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-cat-yellow text-black px-6 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-cat-yellow/20 transition-all duration-300"
          >
            <Download size={20} />
            <span>Download Report (PDF)</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// Main Dashboard Page Component
export default function PassiveDashboardPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [summaryStats, setSummaryStats] = useState<SummaryStats | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API calls for different data sources
    const fetchData = async () => {
      setIsLoading(true);
      
      // TODO: Replace with actual API call to '/api/summary'
      setTimeout(() => {
        setSummaryStats(mockSummaryData);
      }, 500);
      
      // TODO: Replace with actual API call to '/api/equipment'
      setTimeout(() => {
        setEquipment(mockEquipmentData);
      }, 800);
      
      // TODO: Replace with actual API call to '/api/forecast'
      setTimeout(() => {
        setForecastData(mockForecastData);
        setIsLoading(false);
      }, 1200);
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cat-dark">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-cat-yellow border-t-transparent rounded-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cat-dark">
      <Navbar />
      
      <div className="pt-24 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-cat-text-primary mb-4">
              Fleet Overview
            </h1>
            <p className="text-cat-text-secondary text-lg">
              Real-time monitoring and analytics for your Caterpillar equipment fleet
            </p>
          </div>
          
          {/* Summary Stats */}
          {summaryStats && <SummaryStats stats={summaryStats} />}
          
          {/* Equipment Status */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-cat-text-primary mb-6">Equipment Status</h2>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {equipment.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <VehicleCard equipment={item} />
                </motion.div>
              ))}
            </motion.div>
          </div>
          
          {/* Demand Forecasting */}
          {forecastData && <DemandForecastingSection forecastData={forecastData} />}
        </motion.div>
      </div>
    </div>
  );
}