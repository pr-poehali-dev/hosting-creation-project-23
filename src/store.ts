import { useState, useEffect } from 'react';
import type { User, Server, Order } from './types';

const ADMIN_PROMO = 'adminlog2026ss';

// Global in-memory store (simulates real-time)
let _orders: Order[] = [];
let _servers: Server[] = [];
let _listeners: (() => void)[] = [];

function notify() {
  _listeners.forEach(fn => fn());
}

export function subscribeStore(fn: () => void) {
  _listeners.push(fn);
  return () => { _listeners = _listeners.filter(l => l !== fn); };
}

export function getOrders() { return _orders; }
export function getServers() { return _servers; }

export function addOrder(order: Order) {
  _orders = [order, ..._orders];
  notify();
}

export function confirmOrder(orderId: string) {
  const order = _orders.find(o => o.id === orderId);
  if (!order) return;
  _orders = _orders.map(o => o.id === orderId ? { ...o, status: 'confirmed' } : o);
  // Create server
  const server: Server = {
    id: 'srv_' + Math.random().toString(36).slice(2),
    planId: order.planId,
    planName: order.planName,
    planEmoji: order.planEmoji,
    port: order.port,
    status: 'stopped',
    purchasedAt: new Date().toISOString(),
    coOwners: [],
    subdomain: order.planId + '-' + Math.random().toString(36).slice(2, 6),
    ip: 'msk.zetixhost.me',
    cpu: '',
    ram: '',
    disk: '',
    price: order.planPrice,
  };
  _servers = [..._servers, server];
  notify();
}

export function rejectOrder(orderId: string) {
  _orders = _orders.map(o => o.id === orderId ? { ...o, status: 'rejected' } : o);
  notify();
}

export function updateServer(serverId: string, patch: Partial<Server>) {
  _servers = _servers.map(s => s.id === serverId ? { ...s, ...patch } : s);
  notify();
}

export function addCoOwner(serverId: string, email: string) {
  _servers = _servers.map(s => {
    if (s.id !== serverId) return s;
    if (s.coOwners.includes(email)) return s;
    return { ...s, coOwners: [...s.coOwners, email] };
  });
  notify();
}

export function removeCoOwner(serverId: string, email: string) {
  _servers = _servers.map(s =>
    s.id === serverId ? { ...s, coOwners: s.coOwners.filter(e => e !== email) } : s
  );
  notify();
}

export function getServersByUser(email: string): Server[] {
  const pendingPlanIds = _orders
    .filter(o => o.userEmail === email && o.status === 'pending')
    .map(o => o.planId);
  const owned = _servers.filter(s => {
    const order = _orders.find(o => o.planId === s.planId && o.userEmail === email && o.status === 'confirmed');
    return !!order;
  });
  const coOwned = _servers.filter(s => s.coOwners.includes(email) && !owned.find(o => o.id === s.id));
  return [...owned, ...coOwned];
}

export function getUserOrderCount(email: string): number {
  return _orders.filter(o => o.userEmail === email && o.status !== 'rejected').length;
}

export { ADMIN_PROMO };
