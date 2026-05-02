import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { StationCard } from './components/StationCard';
import { SettingsModal } from './components/SettingsModal';
import { LogModal } from './components/LogModal';
import { Station, Rates, SessionLog, Order } from './types';

const STORAGE_KEY_RATES = 'matrex_rates';
const STORAGE_KEY_LOGS = 'matrex_logs';

const DEFAULT_RATES: Rates = {
  regular: {
    1: 5000,
    2: 7000,
    3: 8000,
    4: 10000,
  },
  vip: {
    1: 7000,
    2: 8000,
    3: 10000,
    4: 12000,
  }
};

const INITIAL_STATIONS: Station[] = [
  { id: 0, name: 'بليستيشن 5 (VIP)', status: 'available', playersCount: 1, startTime: null, endTime: null, orders: [], isPremium: true },
  { id: 1, name: 'جهاز 1', status: 'available', playersCount: 1, startTime: null, endTime: null, orders: [] },
  { id: 2, name: 'جهاز 2', status: 'available', playersCount: 1, startTime: null, endTime: null, orders: [] },
  { id: 3, name: 'جهاز 3', status: 'available', playersCount: 1, startTime: null, endTime: null, orders: [] },
  { id: 4, name: 'جهاز 4', status: 'available', playersCount: 1, startTime: null, endTime: null, orders: [] },
];

export default function App() {
  const [rates, setRates] = useState<Rates>(DEFAULT_RATES);
  const [logs, setLogs] = useState<SessionLog[]>([]);
  const [stations, setStations] = useState<Station[]>(INITIAL_STATIONS);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLogsOpen, setIsLogsOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedRates = localStorage.getItem(STORAGE_KEY_RATES);
    if (savedRates) {
      try {
        const parsed = JSON.parse(savedRates);
        if (parsed.regular && parsed.vip) {
          setRates(parsed);
        } else {
          // Migration from old flat format
          setRates({
            regular: parsed,
            vip: {
              1: parsed[1] * 2 || 25000,
              2: parsed[2] * 2 || 30000,
              3: parsed[3] * 2 || 40000,
              4: parsed[4] * 2 || 50000,
            }
          });
        }
      } catch (e) {
        console.error('Failed to parse rates', e);
      }
    }

    const savedLogs = localStorage.getItem(STORAGE_KEY_LOGS);
    if (savedLogs) {
      try {
        setLogs(JSON.parse(savedLogs));
      } catch (e) {
        console.error('Failed to parse logs', e);
      }
    }
  }, []);

  // Save rates to localStorage when they change
  const handleSaveRates = (newRates: Rates) => {
    setRates(newRates);
    localStorage.setItem(STORAGE_KEY_RATES, JSON.stringify(newRates));
  };

  // Save logs to localStorage when they change
  const saveLogs = (newLogs: SessionLog[]) => {
    setLogs(newLogs);
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(newLogs));
  };

  const clearLogs = () => {
    if (window.confirm('هل أنت متأكد من مسح جميع السجلات؟ لا يمكن التراجع عن هذا الإجراء.')) {
      saveLogs([]);
    }
  };

  const handleStartSession = (id: number, playersCount: number) => {
    setStations(prev => prev.map(station => 
      station.id === id 
        ? { ...station, status: 'playing', playersCount, startTime: Date.now(), orders: [], endTime: null }
        : station
    ));
  };

  const handleEndSession = (id: number) => {
    setStations(prev => prev.map(station => 
      station.id === id 
        ? { ...station, status: 'billing', endTime: Date.now() }
        : station
    ));
  };

  const handleAddOrder = (id: number, orderData: Omit<Order, 'id'>) => {
    const newOrder: Order = { ...orderData, id: Math.random().toString(36).substring(7) };
    setStations(prev => prev.map(station => 
      station.id === id 
        ? { ...station, orders: [...station.orders, newOrder] }
        : station
    ));
  };

  const handleClearSession = (id: number) => {
    const station = stations.find(s => s.id === id);
    if (!station || !station.startTime || !station.endTime) return;

    // Calculate costs for the log
    const durationMs = station.endTime - station.startTime;
    const durationHours = durationMs / (1000 * 60 * 60);
    const categoryRates = station.isPremium ? rates.vip : rates.regular;
    const rate = categoryRates[station.playersCount as keyof typeof categoryRates] || 0;
    const playCost = Math.round(durationHours * rate);
    // Standard rounding could be applied if needed: Math.round(playCost / 250) * 250
    const finalPlayCost = Math.round(playCost);
    const ordersCost = station.orders.reduce((acc, o) => acc + o.price, 0);

    const logEntry: SessionLog = {
      id: Math.random().toString(36).substring(7),
      stationName: station.name,
      playersCount: station.playersCount,
      startTime: station.startTime,
      endTime: station.endTime,
      durationMs,
      playCost: finalPlayCost,
      ordersCost,
      totalCost: finalPlayCost + ordersCost,
      orders: [...station.orders],
      dateMs: Date.now(),
    };

    saveLogs([...logs, logEntry]);

    // Reset station
    setStations(prev => prev.map(s => 
      s.id === id 
        ? { ...s, status: 'available', startTime: null, endTime: null, orders: [], playersCount: 1 }
        : s
    ));
  };

  return (
    <div className="min-h-screen flex flex-col font-cairo">
      <Header 
        onOpenSettings={() => setIsSettingsOpen(true)} 
        onOpenLogs={() => setIsLogsOpen(true)} 
      />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl flex flex-col gap-12">
        {/* VIP Station (centered/large) */}
        <div className="w-full max-w-4xl mx-auto">
          {stations.filter(s => s.isPremium).map(station => (
            <StationCard 
              key={station.id}
              station={station}
              rates={rates}
              onStartSession={handleStartSession}
              onEndSession={handleEndSession}
              onAddOrder={handleAddOrder}
              onClearSession={handleClearSession}
            />
          ))}
        </div>

        {/* Regular Stations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {stations.filter(s => !s.isPremium).map(station => (
            <StationCard 
              key={station.id}
              station={station}
              rates={rates}
              onStartSession={handleStartSession}
              onEndSession={handleEndSession}
              onAddOrder={handleAddOrder}
              onClearSession={handleClearSession}
            />
          ))}
        </div>
      </main>

      <Footer />

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        rates={rates}
        onSave={handleSaveRates}
      />

      <LogModal 
        isOpen={isLogsOpen}
        onClose={() => setIsLogsOpen(false)}
        logs={logs}
        onClearLogs={clearLogs}
      />
    </div>
  );
}
