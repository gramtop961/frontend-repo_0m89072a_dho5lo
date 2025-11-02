import React, { useEffect, useMemo, useRef, useState } from 'react';
import Navbar from './components/Navbar';
import OrdersDashboard from './components/OrdersDashboard';
import CreateOrderForm from './components/CreateOrderForm';
import OrderHistory from './components/OrderHistory';

const ADMIN = { username: 'wild admin', password: 'Wildadmin123', role: 'admin' };
const STAFF = { username: 'wild user', password: 'Wilduser000', role: 'staff' };

const STATUS_FLOW = ['new', 'working', 'out', 'completed', 'canceled'];

function usePersistentState(key, initial) {
  const [state, setState] = useState(() => {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : initial;
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState];
}

function LoginView({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    setError('');
    const uname = username.trim().toLowerCase();
    const isAdmin = uname === ADMIN.username;
    const isStaff = uname === STAFF.username;
    if (isAdmin && password === ADMIN.password) {
      onLogin({ name: 'Wild admin', role: 'admin', token: 'jwt-admin' });
      return;
    }
    if (isStaff && password === STAFF.password) {
      onLogin({ name: 'Wild user', role: 'staff', token: 'jwt-staff' });
      return;
    }
    setError('Invalid credentials, try again');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001F3F] to-[#002b5b] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white/90 p-8 shadow-2xl shadow-[#001F3F]/40">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🐟</span>
          <h1 className="text-2xl font-bold text-[#001F3F]">Wild Fish&Chicken</h1>
        </div>
        {error && (
          <div className="mb-4 font-bold text-red-600">{error}</div>
        )}
        <form onSubmit={submit}>
          <label className="block text-sm font-medium text-[#002b5b]">Username</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#002b5b]/20 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#EFB810]"
          />
          <label className="block text-sm font-medium text-[#002b5b] mt-4">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#002b5b]/20 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#EFB810]"
          />
          <button
            type="submit"
            className="mt-6 w-full rounded-xl bg-[#EFB810] py-3 font-semibold text-[#001F3F] shadow hover:opacity-90"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-xs text-gray-600">
          Use Admin: Wild admin / Wildadmin123 or Staff: Wild user / Wilduser000
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [auth, setAuth] = usePersistentState('wf_auth', null);
  const [orders, setOrders] = usePersistentState('wf_orders', []);
  const [activeTab, setActiveTab] = usePersistentState('wf_tab', 'orders');
  const [darkMode, setDarkMode] = usePersistentState('wf_dark', false);
  const audioCtxRef = useRef(null);

  useEffect(() => {
    if (!auth) return;
    // ensure tab visibility
    if (activeTab === 'history' && auth?.role !== 'admin') {
      setActiveTab('orders');
    }
  }, [auth, activeTab, setActiveTab]);

  const onLogin = (session) => {
    setAuth(session);
  };

  const onLogout = () => {
    setAuth(null);
    setActiveTab('orders');
  };

  const playDing = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = 880; // A5
      g.gain.value = 0.001;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      const now = ctx.currentTime;
      g.gain.exponentialRampToValueAtTime(0.2, now + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
      o.stop(now + 0.26);
    } catch (e) {
      // ignore audio errors
    }
  };

  const addOrder = (data) => {
    const newOrder = {
      id: Math.random().toString(36).slice(2, 10),
      ...data,
      status: 'new',
      createdAt: Date.now(),
    };
    setOrders([newOrder, ...orders]);
  };

  const updateStatus = (id, status) => {
    if (auth?.role !== 'admin') return; // guard at UI layer
    setOrders(orders.map(o => (o.id === id ? { ...o, status } : o)));
  };

  const page = useMemo(() => {
    if (!auth) return <LoginView onLogin={onLogin} />;
    if (activeTab === 'create') return <CreateOrderForm onCreate={addOrder} onDing={playDing} />;
    if (activeTab === 'history' && auth?.role === 'admin') return (
      <OrderHistory orders={orders} onStatusChange={updateStatus} role={auth.role} />
    );
    return (
      <OrdersDashboard
        orders={orders}
        role={auth?.role}
        onStatusChange={updateStatus}
      />
    );
  }, [auth, activeTab, orders]);

  return (
    <div className={darkMode ? 'bg-[#001737] min-h-screen' : 'bg-gradient-to-b from-[#001F3F] to-[#002b5b] min-h-screen'}>
      {auth && (
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={onLogout}
          role={auth?.role}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      )}
      {page}
    </div>
  );
}
