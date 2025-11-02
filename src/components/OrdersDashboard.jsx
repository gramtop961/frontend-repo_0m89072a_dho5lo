import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_OPTIONS = [
  { value: 'new', label: '🟥 New Order', color: 'bg-red-500' },
  { value: 'working', label: '🟨 Working', color: 'bg-yellow-400' },
  { value: 'out', label: '🟩 Out for Delivery', color: 'bg-green-500' },
  { value: 'completed', label: '✅ Completed', color: 'bg-emerald-600' },
  { value: 'canceled', label: '❌ Canceled', color: 'bg-gray-500' },
];

function StatusBadge({ status }) {
  const s = STATUS_OPTIONS.find(s => s.value === status);
  return (
    <span className={`inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-full ${s?.color} text-white`}>{s?.label}</span>
  );
}

function OrderCard({ order, canEdit, onStatusChange }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-white/10 bg-white/80 backdrop-blur p-4 shadow-xl shadow-[#001F3F]/20 hover:shadow-2xl hover:shadow-[#001F3F]/30"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-[#001F3F] font-bold text-lg">{order.customerName}</h3>
          <p className="text-sm text-gray-600">{order.phone}</p>
          <p className="text-sm text-gray-600">{order.address}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>
      <div className="mt-3 text-sm text-gray-700">
        <p><span className="font-semibold text-[#002b5b]">Items:</span> {order.items}</p>
        {order.notes && <p className="mt-1"><span className="font-semibold text-[#002b5b]">Notes:</span> {order.notes}</p>}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-[#001F3F] font-semibold">Total: ${Number(order.totalPrice).toFixed(2)}</p>
        <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
      </div>
      <div className="mt-3">
        {canEdit ? (
          <select
            className="w-full rounded-lg border border-[#002b5b]/20 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#EFB810]"
            value={order.status}
            onChange={(e) => onStatusChange(order.id, e.target.value)}
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        ) : (
          <p className="text-xs text-gray-500">Status changes available for Admin only.</p>
        )}
      </div>
    </motion.div>
  );
}

export default function OrdersDashboard({ orders, role, onStatusChange }) {
  const active = orders.filter(o => o.status !== 'completed' && o.status !== 'canceled');
  const done = orders.filter(o => o.status === 'completed' || o.status === 'canceled');
  const canEdit = role === 'admin';

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-[#001F3F] mb-4">Active Orders</h2>
      {active.length === 0 ? (
        <p className="text-gray-600">No active orders yet.</p>
      ) : (
        <motion.div layout className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {active.map(order => (
              <OrderCard key={order.id} order={order} canEdit={canEdit} onStatusChange={onStatusChange} />)
            )}
          </AnimatePresence>
        </motion.div>
      )}

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-[#001F3F] mb-3">Completed & Canceled</h3>
        <div className="rounded-2xl border border-white/10 bg-white/60 p-4 max-h-96 overflow-auto">
          {done.length === 0 ? (
            <p className="text-gray-600">Nothing here yet.</p>
          ) : (
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {done.map(order => (
                <OrderCard key={order.id} order={order} canEdit={canEdit} onStatusChange={onStatusChange} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
