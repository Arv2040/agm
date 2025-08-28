'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, AlertTriangle, Send, Zap } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { TypewriterText } from '@/components/TypewriterText';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

// Data Interfaces
interface Vehicle {
  id: string;
  name: string;
}

interface TelemetryData {
  fuelUsed: number; // liters
  loadFactor: number; // percentage
  engineHoursToday: number;
  idleHoursToday: number;
  operatingDays: number;
}

interface AnomalyData {
  damageLikelihood: number; // percentage
  report: string;
}

// Mock API Data
// TODO: This list will be fetched from '/api/vehicles'
const mockVehicleList: Vehicle[] = [
  { id: 'EQX1001', name: 'Excavator EX-1001' },
  { id: 'EQX1002', name: 'Crane CR-1002' },
  { id: 'EQX1003', name: 'Bulldozer BD-1003' },
];

// TODO: This data will be fetched from '/api/telemetry/{vehicleId}'
const mockTelemetryData: { [key: string]: TelemetryData } = {
  'EQX1001': {
    fuelUsed: 180,
    loadFactor: 78,
    engineHoursToday: 8.5,
    idleHoursToday: 1.5,
    operatingDays: 15
  },
  'EQX1002': {
    fuelUsed: 220,
    loadFactor: 85,
    engineHoursToday: 10,
    idleHoursToday: 2,
    operatingDays: 25
  },
  'EQX1003': {
    fuelUsed: 195,
    loadFactor: 72,
    engineHoursToday: 7,
    idleHoursToday: 1,
    operatingDays: 10
  }
};

// TODO: This data will be fetched from '/api/anomaly/{vehicleId}'
const mockAnomalyData: { [key: string]: AnomalyData } = {
  'EQX1001': {
    damageLikelihood: 23,
    report: 'Equipment analysis shows optimal performance with minor hydraulic pressure variations detected. Recommended maintenance window: Q2 2024. All systems operating within normal parameters with no immediate concerns identified.'
  },
  'EQX1002': {
    damageLikelihood: 45,
    report: 'Moderate wear patterns detected in crane boom assembly. Increased monitoring recommended for lifting operations above 80% capacity. Schedule preventive maintenance within 30 days to maintain optimal performance.'
  },
  'EQX1003': {
    damageLikelihood: 67,
    report: 'Significant track wear and engine temperature fluctuations observed. Immediate attention required for cooling system inspection. Recommend reducing operational load until comprehensive maintenance is completed.'
  }
};

// Vehicle Selector Component
function VehicleSelector({ 
  vehicles, 
  selectedVehicleId, 
  onVehicleSelect 
}: { 
  vehicles: Vehicle[]; 
  selectedVehicleId: string | null; 
  onVehicleSelect: (id: string) => void; 
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative mb-8">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full md:w-96 bg-cat-charcoal border border-cat-yellow/30 rounded-lg px-6 py-4 flex items-center justify-between text-cat-text-primary hover:border-cat-yellow transition-all duration-300"
        whileHover={{ scale: 1.02 }}
      >
        <span className="text-lg">
          {selectedVehicleId 
            ? vehicles.find(v => v.id === selectedVehicleId)?.name 
            : 'Select a Vehicle to View Live Telemetry'
          }
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown size={20} className="text-cat-yellow" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-cat-charcoal border border-cat-yellow/30 rounded-lg overflow-hidden z-10"
          >
            {vehicles.map((vehicle, index) => (
              <motion.button
                key={vehicle.id}
                onClick={() => {
                  onVehicleSelect(vehicle.id);
                  setIsOpen(false);
                }}
                className="w-full px-6 py-4 text-left hover:bg-cat-yellow/10 transition-colors duration-200 text-cat-text-primary border-b border-cat-yellow/10 last:border-b-0"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                {vehicle.name}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Fuel Gauge Component
function FuelGauge({ value, title }: { value: number; title: string }) {
  const data = [{ name: title, value, fill: '#FFCD11' }];
  
  return (
    <div className="bg-cat-charcoal rounded-xl p-6 border border-cat-charcoal">
      <div className="flex items-center space-x-2 mb-4">
        <Zap size={20} className="text-cat-yellow" />
        <h3 className="text-lg font-semibold text-cat-text-primary">{title}</h3>
      </div>
      <div className="relative h-48">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={data}>
            <RadialBar 
              dataKey="value" 
              cornerRadius={30} 
              fill="#FFCD11"
              className="drop-shadow-lg"
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-cat-text-primary">
              <AnimatedNumber value={value} />
            </div>
            <div className="text-cat-text-secondary text-sm">
              {title === 'Fuel Used Today' ? 'Liters' : '% Capacity'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Usage Breakdown Chart
function UsageBreakdown({ engineHours, idleHours }: { engineHours: number; idleHours: number }) {
  const data = [
    { name: 'Engine', hours: engineHours, fill: '#FFCD11' },
    { name: 'Idle', hours: idleHours, fill: '#FFA500' }
  ];

  return (
    <div className="bg-cat-charcoal rounded-xl p-6 border border-cat-charcoal">
      <div className="flex items-center space-x-2 mb-4">
        <Zap size={20} className="text-cat-yellow" />
        <h3 className="text-lg font-semibold text-cat-text-primary">Hourly Usage Breakdown</h3>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#A1A1A1', fontSize: 12 }}
            />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#2C2C2C', 
                border: '1px solid #FFCD11', 
                borderRadius: '8px',
                color: '#F5F5F5'
              }}
            />
            <Bar dataKey="hours" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Operating Days Display
function OperatingDaysCard({ days }: { days: number }) {
  return (
    <div className="bg-cat-charcoal rounded-xl p-6 border border-cat-charcoal flex flex-col items-center justify-center">
      <h3 className="text-lg font-semibold text-cat-text-primary mb-4">Total Operating Days</h3>
      <div className="text-center">
        <div className="text-5xl font-bold text-cat-yellow mb-2">
          <AnimatedNumber value={days} />
        </div>
        <p className="text-cat-text-secondary">Active Service Days</p>
      </div>
    </div>
  );
}

// Anomaly Detection Component
function AnomalyDetection({ anomalyData }: { anomalyData: AnomalyData }) {
  const radarData = [
    { subject: 'Engine', A: anomalyData.damageLikelihood, fullMark: 100 },
    { subject: 'Hydraulics', A: anomalyData.damageLikelihood - 5, fullMark: 100 },
    { subject: 'Tracks', A: anomalyData.damageLikelihood + 3, fullMark: 100 },
    { subject: 'Electrical', A: anomalyData.damageLikelihood - 8, fullMark: 100 },
    { subject: 'Cooling', A: anomalyData.damageLikelihood + 2, fullMark: 100 },
    { subject: 'Transmission', A: anomalyData.damageLikelihood - 3, fullMark: 100 },
  ];

  const getRiskColor = (likelihood: number) => {
    if (likelihood < 25) return '#FFCD11';
    if (likelihood < 60) return '#FFA500';
    return '#FF4136';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.8 }}
      className="bg-cat-charcoal rounded-xl p-8 border border-cat-charcoal mt-12"
    >
      <div className="flex items-center space-x-3 mb-6">
        <AlertTriangle size={28} className="text-cat-orange" />
        <h2 className="text-2xl font-bold text-cat-text-primary">Anomaly Detection Report</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Damage Likelihood Radar */}
        <div>
          <h3 className="text-lg font-semibold text-cat-text-primary mb-4">System Health Analysis</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid gridType="polygon" stroke="#A1A1A1" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: '#A1A1A1', fontSize: 12 }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]} 
                  tick={{ fill: '#A1A1A1', fontSize: 10 }}
                />
                <Radar
                  name="Risk Level"
                  dataKey="A"
                  stroke={getRiskColor(anomalyData.damageLikelihood)}
                  fill={getRiskColor(anomalyData.damageLikelihood)}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center mt-4">
            <div className="text-3xl font-bold" style={{ color: getRiskColor(anomalyData.damageLikelihood) }}>
              <AnimatedNumber value={anomalyData.damageLikelihood} suffix="%" />
            </div>
            <p className="text-cat-text-secondary">Damage Likelihood</p>
          </div>
        </div>
        
        {/* Right: AI Report */}
        <div>
          <h3 className="text-lg font-semibold text-cat-text-primary mb-4">AI Analysis Report</h3>
          <div className="bg-cat-dark/50 rounded-lg p-6 mb-6 min-h-48">
            <TypewriterText 
              text={anomalyData.report}
              className="text-cat-text-secondary leading-relaxed"
              speed={30}
            />
          </div>
          
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 0 30px rgba(255, 205, 17, 0.3)'
            }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gradient-to-r from-cat-orange to-cat-red text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transition-all duration-300"
          >
            <Send size={20} />
            <span>Send Alert to Customer</span>
          </motion.button>
          
          {/* TODO Comment */}
          <div className="mt-4 bg-cat-dark/30 rounded-lg p-3 border border-cat-orange/20">
            <p className="text-cat-text-secondary text-xs font-mono">
              TODO: Email API integration for customer alerts
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Live Telemetry Dashboard Component
function LiveTelemetryDashboard({ 
  telemetryData, 
  anomalyData 
}: { 
  telemetryData: TelemetryData;
  anomalyData: AnomalyData;
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.8 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <Zap size={28} className="text-cat-yellow" />
          <h2 className="text-2xl font-bold text-cat-text-primary">Live Telemetry Dashboard</h2>
        </div>
        
        {/* Telemetry Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
            <FuelGauge value={telemetryData.fuelUsed} title="Fuel Used Today" />
          </motion.div>
          
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
            <FuelGauge value={telemetryData.loadFactor} title="Load Factor" />
          </motion.div>
          
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
            <UsageBreakdown 
              engineHours={telemetryData.engineHoursToday} 
              idleHours={telemetryData.idleHoursToday} 
            />
          </motion.div>
          
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
            <OperatingDaysCard days={telemetryData.operatingDays} />
          </motion.div>
        </motion.div>
        
        {/* Anomaly Detection */}
        <AnomalyDetection anomalyData={anomalyData} />
      </motion.div>
    </AnimatePresence>
  );
}

// Main Active Telemetry Page Component
export default function ActiveTelemetryPage() {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [telemetryData, setTelemetryData] = useState<TelemetryData | null>(null);
  const [anomalyData, setAnomalyData] = useState<AnomalyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    // TODO: Replace with actual API call to '/api/vehicles'
    setVehicles(mockVehicleList);
  }, []);

  useEffect(() => {
    if (selectedVehicleId) {
      setIsLoading(true);
      
      // TODO: Replace with actual API call to '/api/telemetry/{vehicleId}'
      setTimeout(() => {
        setTelemetryData(mockTelemetryData[selectedVehicleId]);
      }, 800);
      
      // TODO: Replace with actual API call to '/api/anomaly/{vehicleId}'
      setTimeout(() => {
        setAnomalyData(mockAnomalyData[selectedVehicleId]);
        setIsLoading(false);
      }, 1200);
    }
  }, [selectedVehicleId]);

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
              Active Telemetry
            </h1>
            <p className="text-cat-text-secondary text-lg">
              Real-time monitoring and predictive maintenance for your equipment
            </p>
          </div>
          
          {/* Vehicle Selector */}
          <VehicleSelector
            vehicles={vehicles}
            selectedVehicleId={selectedVehicleId}
            onVehicleSelect={setSelectedVehicleId}
          />
          
          {/* Loading State */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center py-12"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-cat-yellow border-t-transparent rounded-full"
              />
            </motion.div>
          )}
          
          {/* Dashboard Content */}
          {!isLoading && telemetryData && anomalyData && (
            <LiveTelemetryDashboard 
              telemetryData={telemetryData} 
              anomalyData={anomalyData} 
            />
          )}
          
          {/* Empty State */}
          {!selectedVehicleId && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <div className="w-24 h-24 bg-cat-charcoal rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap size={32} className="text-cat-yellow" />
              </div>
              <h3 className="text-xl font-semibold text-cat-text-primary mb-2">
                Select Equipment for Live Data
              </h3>
              <p className="text-cat-text-secondary">
                Choose a vehicle from the dropdown to view real-time telemetry and analytics
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}