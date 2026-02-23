export interface User {
  email: string;
  isAdmin?: boolean;
}

export interface Server {
  id: string;
  planId: string;
  planName: string;
  planEmoji: string;
  port: number;
  status: 'pending' | 'active' | 'stopped' | 'starting';
  purchasedAt: string;
  coOwners: string[];
  subdomain: string;
  ip: string;
  cpu: string;
  ram: string;
  disk: string;
  price: number;
}

export interface Order {
  id: string;
  userEmail: string;
  planId: string;
  planName: string;
  planEmoji: string;
  planPrice: number;
  port: number;
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: string;
  promoUsed?: string;
}

export interface Plan {
  id: string;
  name: string;
  emoji: string;
  image: string;
  desc: string;
  cpu: string;
  ram: string;
  disk: string;
  ddos: string;
  location: string;
  price: number;
  badge?: 'popular' | 'new';
  badgeColor?: 'green' | 'orange';
}

export interface ConsoleLog {
  time: string;
  type: 'info' | 'warn' | 'error' | 'success';
  text: string;
}

export interface DBEntry {
  id: string;
  key: string;
  value: string;
}

export type ServerFile = {
  name: string;
  type: 'jar' | 'jpg' | 'png' | 'txt' | 'json' | 'yml' | 'other';
  size: string;
};
