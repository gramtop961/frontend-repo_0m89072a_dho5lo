import React from 'react';
import { List, PlusCircle, History, LogOut, Moon, Sun } from 'lucide-react';

const tabs = [
  { key: 'orders', label: 'Orders', icon: List },
  { key: 'create', label: 'Create Order', icon: PlusCircle },
  { key: 'history', label: 'Order History', icon: History, adminOnly: true },
];

export default function Navbar({ activeTab, setActiveTab, onLogout, role, darkMode, setDarkMode }) {
  return (
    <header className="sticky top-0 z-20">
      <nav className="w-full border-b border-white/10 bg-[#001F3F] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🐟</span>
              <h1 className="text-lg sm:text-xl font-semibold tracking-wide">
                Wild Fish&Chicken
              </h1>
            </div>
            <div className="hidden sm:flex items-center gap-1">
              {tabs.filter(t => !(t.adminOnly && role !== 'admin')).map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`group inline-flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    activeTab === key
                      ? 'bg-[#002b5b] text-[#FFD700] shadow-[0_0_0_1px_rgba(239,184,16,0.4)]'
                      : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  <Icon size={18} className={activeTab === key ? 'text-[#FFD700]' : 'text-white/80'} />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="inline-flex items-center gap-2 rounded-lg px-2.5 py-2 text-white/90 hover:bg-white/10"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-2 rounded-lg bg-[#EFB810] px-3 py-2 font-semibold text-[#001F3F] shadow hover:opacity-90"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
          <div className="sm:hidden pb-3 flex gap-2">
            {tabs.filter(t => !(t.adminOnly && role !== 'admin')).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-1 rounded-lg py-2 text-sm font-medium ${
                  activeTab === key ? 'bg-[#002b5b] text-[#FFD700]' : 'bg-white/5 text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
