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
  type: string;
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

// Mock Data Constants (kept as a fallback)
const mockEquipmentData: Equipment[] = [
  // ... original mock data can be kept here for fallback purposes
];

const mockSummaryData: SummaryStats = {
  activeEquipment: 6,
  totalHours: 883,
  avgHoursPerUnit: 147,
  operationalStatus: 94
};

const mockForecastData: ForecastData = {
  nextMonth: 87,
  peakDemand: 'Q2',
  revenueGrowth: 12,
  analysisText: 'Based on historical usage patterns and current market conditions, our AI-powered forecasting model predicts optimal equipment allocation for the next quarter. The analysis considers seasonal variations, project timelines, and maintenance schedules to maximize fleet utilization efficiency.'
};

// Status Badge Component (No changes needed)
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

// VehicleCard component (No changes needed from last version)
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
          <div className="col-span-3 flex flex-col justify-between">
            <div>
              <h3 className="text-cat-yellow text-xl font-bold mb-2">{equipment.id}</h3>
              <p className="text-cat-text-primary text-lg font-semibold">{equipment.type}</p>
            </div>
            
            <div className="pt-2 border-t border-cat-text-secondary/20">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 ${equipment.status === 'Active' ? 'bg-cat-green' : 'bg-cat-orange'} rounded-full`} />
                <span className="text-cat-text-primary text-xs">{equipment.status}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

// Summary Stats Component (No changes needed)
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

// Demand Forecasting Component (No changes needed)
function DemandForecastingSection({ forecastData }: { forecastData: ForecastData }) {
    // ... (Component code remains the same)
    return <div></div>;
}

// Main Dashboard Page Component
export default function PassiveDashboardPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [summaryStats, setSummaryStats] = useState<SummaryStats | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // MODIFICATION: useEffect now fetches from both APIs to calculate summary stats
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // 1. Fetch from both endpoints in parallel for efficiency
        const [equipmentRes, demandRes] = await Promise.all([
          fetch('http://127.0.0.1:8000/equipment/'),
          fetch('http://127.0.0.1:8000/expose_demand/')
        ]);

        if (!equipmentRes.ok) throw new Error(`Equipment API error: ${equipmentRes.status}`);
        if (!demandRes.ok) throw new Error(`Demand API error: ${demandRes.status}`);

        const equipmentData = await equipmentRes.json();
        const demandData = await demandRes.json();

        // 2. Process equipment data for the vehicle cards and active count
        const processedEquipment: Equipment[] = equipmentData.equipment.map((item: any) => ({
          id: item._id,
          type: item.type,
          status: item.status === 'Available' ? 'Active' : 'Maintenance',
          lastOperatorId: 'N/A',
          operatingDays: 0,
          totalHours: 0,
          avgHoursPerDay: 0,
          imageUrl: '',
        }));
        
        setEquipment(processedEquipment);
        const activeCount = processedEquipment.filter(e => e.status === 'Active').length;
        const totalUnits = processedEquipment.length;

        // 3. Process demand data to calculate total and average hours
        const totalRuntimeHours = demandData.demand_data.reduce(
          (sum: number, record: { runtime_hours: number }) => sum + record.runtime_hours,
          0
        );

        const avgHoursPerUnit = totalUnits > 0 ? Math.round(totalRuntimeHours / totalUnits) : 0;

        // 4. Update summary stats with all new dynamic values
        setSummaryStats({
          ...mockSummaryData, // Use mock as a base for any remaining static values
          activeEquipment: activeCount,
          totalHours: totalRuntimeHours,
          avgHoursPerUnit: avgHoursPerUnit,
        });
        
        // Load other mock data
        setForecastData(mockForecastData);

      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Fallback to mock data if any API call fails
        setEquipment(mockEquipmentData);
        setSummaryStats(mockSummaryData);
        setForecastData(mockForecastData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // ... (Rest of the component remains the same)
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
              {equipment.map((item) => (
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