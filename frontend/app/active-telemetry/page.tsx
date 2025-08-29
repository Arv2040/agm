'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, AlertTriangle, Send, Zap } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { TypewriterText } from '@/components/TypewriterText';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { useActiveState } from '../context';

import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

// ----- Interfaces -----
interface Vehicle {
  id: string;
  name: string;
  operatingDays: number;
}

interface TelemetryData {
  fuelUsed: number;
  engineHoursToday: number;
  idleHoursToday: number;
  operatingDays: number;
  temperature: number;
}

interface AnomalyData {
  damageLikelihood: number;
  report: string;
}

// ----- Default telemetry & anomaly -----
const defaultTelemetry: TelemetryData = {
  fuelUsed: 0,
  engineHoursToday: 0,
  idleHoursToday: 0,
  operatingDays: 0,
  temperature: 0,
};

const defaultAnomaly: AnomalyData = {
  damageLikelihood: 0,
  report: 'No anomalies detected. System operating within normal parameters.',
};

// ----- Mock Vehicles -----
const mockVehicleList: Vehicle[] = [
  { id: 'VEH1', name: 'Vehicle VEH1', operatingDays: 10 },
  { id: 'VEH2', name: 'Vehicle VEH2', operatingDays: 12 },
  { id: 'VEH3', name: 'Vehicle VEH3', operatingDays: 13 },
];

// ----- Thresholds -----
const TEMPERATURE_THRESHOLD = 80;

// ----- Notification Component -----
function Notification({ message, type }: { message: string; type: 'warning' | 'danger' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`fixed top-4 right-4 p-4 rounded-lg border ${
        type === 'warning' ? 'bg-yellow-100 border-yellow-400 text-yellow-800' : 'bg-red-100 border-red-400 text-red-800'
      } z-50 max-w-md`}
    >
      <div className="flex items-center space-x-2">
        <AlertTriangle size={20} />
        <span className="font-semibold">{message}</span>
      </div>
    </motion.div>
  );
}

// ----- Vehicle Selector -----
function VehicleSelector({ vehicles, selectedVehicleId, onVehicleSelect }: { vehicles: Vehicle[]; selectedVehicleId: string | null; onVehicleSelect: (id: string) => void; }) {
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

// ----- Fuel Gauge -----
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
            <RadialBar dataKey="value" cornerRadius={30} fill="#FFCD11" />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-cat-text-primary">
              <AnimatedNumber value={value} />
            </div>
            <div className="text-cat-text-secondary text-sm">Liters</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----- Usage Breakdown -----
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
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#A1A1A1', fontSize: 12 }} />
            <Tooltip contentStyle={{ backgroundColor: '#2C2C2C', border: '1px solid #FFCD11', borderRadius: '8px', color: '#F5F5F5' }} />
            <Bar dataKey="hours" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ----- Operating Days -----
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

// ----- Sensor Data -----
function SensorData({ temperature }: { temperature: number }) {
  const isTempCritical = temperature > TEMPERATURE_THRESHOLD;

  return (
    <div className="bg-cat-charcoal rounded-xl p-6 border border-cat-charcoal">
      <h3 className="text-lg font-semibold text-cat-text-primary mb-4">Sensor Readings</h3>
      <div className={`p-3 rounded-lg ${isTempCritical ? 'bg-red-500/20 border border-red-500' : 'bg-cat-dark/30'}`}>
        <div className="flex justify-between items-center">
          <span className="text-cat-text-secondary">Temperature</span>
          <span className={`font-bold ${isTempCritical ? 'text-red-400' : 'text-cat-text-primary'}`}>
            <AnimatedNumber value={temperature} />°C
          </span>
        </div>
        {isTempCritical && <p className="text-red-400 text-sm mt-1">Warning: Temperature exceeds threshold!</p>}
      </div>
    </div>
  );
}

// ----- Anomaly Radar -----
function AnomalyRadar({ telemetryData }: { telemetryData: TelemetryData }) {
  const radarData = [
    { subject: 'Fuel Used', A: telemetryData.fuelUsed, fullMark: 100 },
    { subject: 'Engine Hours', A: telemetryData.engineHoursToday * 10, fullMark: 100 },
    { subject: 'Idle Hours', A: telemetryData.idleHoursToday * 20, fullMark: 100 },
    { subject: 'Operating Days', A: telemetryData.operatingDays * 7, fullMark: 100 },
    { subject: 'Temperature', A: telemetryData.temperature, fullMark: 100 },
  ];

  return (
    <div className="bg-cat-charcoal rounded-xl p-8 border border-cat-charcoal mt-12">
      <h2 className="text-2xl font-bold mb-4 text-cat-text-primary">System Health Radar</h2>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={radarData}>
          <PolarGrid gridType="polygon" stroke="#A1A1A1" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#A1A1A1', fontSize: 12 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#A1A1A1', fontSize: 10 }} />
          <Radar name="Telemetry" dataKey="A" stroke="#FFCD11" fill="#FFCD11" fillOpacity={0.3} strokeWidth={2} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ----- AI Report & Send Alert -----
function AIReportSection({ anomaly }: { anomaly: AnomalyData }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSendAlert = async () => {
    setSending(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSent(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-cat-charcoal rounded-xl p-6 border border-cat-charcoal mt-8">
      <h3 className="text-lg font-semibold text-cat-text-primary mb-4">AI-Powered Damage Report</h3>
      <p className="text-cat-text-secondary mb-4">{anomaly.report}</p>
      <button
        onClick={handleSendAlert}
        disabled={sending || sent}
        className={`px-6 py-3 rounded-lg font-semibold text-cat-text-primary transition-colors duration-200 ${
          sent ? 'bg-green-600' : 'bg-cat-yellow hover:bg-yellow-500'
        }`}
      >
        {sending ? 'Sending...' : sent ? 'Alert Sent' : 'Send Alert via Email'}
      </button>
    </div>
  );
}

// ----- Live Dashboard -----
function LiveTelemetryDashboard({ telemetryData, anomalyData }: { telemetryData: TelemetryData; anomalyData: AnomalyData }) {
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} transition={{ duration: 0.8 }} className="space-y-8">
        <div className="flex items-center space-x-3 mb-8">
          <Zap size={28} className="text-cat-yellow" />
          <h2 className="text-2xl font-bold text-cat-text-primary">Live Telemetry Dashboard</h2>
        </div>

        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FuelGauge value={telemetryData.fuelUsed} title="Fuel Used Today" />
          <UsageBreakdown engineHours={telemetryData.engineHoursToday} idleHours={telemetryData.idleHoursToday} />
          <OperatingDaysCard days={telemetryData.operatingDays} />
          <SensorData temperature={telemetryData.temperature} />
        </motion.div>

        <AnomalyRadar telemetryData={telemetryData} />

        <AIReportSection anomaly={anomalyData} />
      </motion.div>
    </AnimatePresence>
  );
}

// ----- Main Page -----
export default function ActiveTelemetryPage() {
  const {open,setIsOpen} = useActiveState();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('VEH1');
  const [telemetryData, setTelemetryData] = useState<TelemetryData>(defaultTelemetry);
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicleList);
  const [notifications, setNotifications] = useState<{ id: string; message: string; type: 'warning' | 'danger' }[]>([]);
  const [anomalyData, setAnomalyData] = useState<AnomalyData>(defaultAnomaly);

  const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const telemetryRef = useRef<TelemetryData>(defaultTelemetry);

  useEffect(() => {
    telemetryRef.current = telemetryData;
  }, [telemetryData]);

  const addNotification = (message: string, type: 'warning' | 'danger') => {
    const newNotification = { id: Date.now().toString(), message, type };
    setNotifications(prev => [...prev, newNotification]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== newNotification.id)), 5000);
  };

  useEffect(() => {
    if (!selectedVehicleId || open == 1) return;

    let isCancelled = false;

    const fetchData = async () => {
      try {
        const vehicle = vehicles.find(v => v.id === selectedVehicleId)!;
        const newTelemetry: TelemetryData = {
          fuelUsed: telemetryRef.current.fuelUsed + Math.floor(Math.random() * 5 + 1),
          engineHoursToday: Math.floor(Math.random() * 10 + 1),
          idleHoursToday: Math.floor(Math.random() * 5),
          operatingDays: vehicle.operatingDays,
          temperature: Math.floor(Math.random() * 100),
        };
        setTelemetryData(newTelemetry);

        // Generate anomaly report
        const damageLikelihood = Math.min(Math.floor(Math.random() * 100), 100);
        const report = damageLikelihood > 70
          ? `High risk of damage detected! Likelihood: ${damageLikelihood}%. Immediate inspection recommended.`
          : `System operating normally. Likelihood of damage: ${damageLikelihood}%.`;
        setAnomalyData({ damageLikelihood, report });

        if (newTelemetry.temperature > TEMPERATURE_THRESHOLD) {
          addNotification(`High temperature alert: ${newTelemetry.temperature}°C (Vehicle ${selectedVehicleId})`, 'warning');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        if (!isCancelled) pollingTimeoutRef.current = setTimeout(fetchData, 3000);
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
      if (pollingTimeoutRef.current) clearTimeout(pollingTimeoutRef.current);
    };
  }, [selectedVehicleId, vehicles]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cat-dark text-cat-text-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <VehicleSelector vehicles={vehicles} selectedVehicleId={selectedVehicleId} onVehicleSelect={setSelectedVehicleId} />
          {telemetryData && <LiveTelemetryDashboard telemetryData={telemetryData} anomalyData={anomalyData} />}
        </div>
      </main>

      <AnimatePresence>
        {notifications.map(n => <Notification key={n.id} message={n.message} type={n.type} />)}
      </AnimatePresence>
    </>
  );
}
