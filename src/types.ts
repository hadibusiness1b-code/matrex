export interface Order {
  id: string;
  name: string;
  price: number;
}

export type StationStatus = 'available' | 'playing' | 'billing';

export interface Station {
  id: number;
  name: string;
  status: StationStatus;
  playersCount: number;
  startTime: number | null; // Date.now() timestamp
  endTime: number | null;
  orders: Order[];
  isPremium?: boolean;
}

export interface RateCategory {
  1: number;
  2: number;
  3: number;
  4: number;
}

export interface Rates {
  regular: RateCategory;
  vip: RateCategory;
}

export interface SessionLog {
  id: string;
  stationName: string;
  playersCount: number;
  startTime: number;
  endTime: number;
  durationMs: number;
  playCost: number;
  ordersCost: number;
  totalCost: number;
  orders: Order[];
  dateMs: number;
}
