import React, { useMemo } from 'react';

const STATUS_OPTIONS = [
  { value: 'new', label: '🟥 New Order' },
  { value: 'working', label: '🟨 Working' },
  { value: 'out', label: '🟩 Out for Delivery' },
  { value: 'completed', label: '✅ Completed' },
  { value: 'canceled', label: '❌ Canceled' },
];

export default function OrderHistory({ orders, onStatusChange, role }) {
  const history = orders.filter(o => o.status === 'completed' || o.status === 'canceled');

  const summary = useMemo(() => {
    const totalCompleted = history.filter(o => o.status === 'completed').length;
    const totalRevenue = history
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + Number(o.totalPrice || 0), 0);
    return { totalCompleted, totalRevenue };
  }, [history]);

  const canEdit = role === 'admin';

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-[#001F3F] mb-4">Order History</h2>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-white/80 p-4 border border-white/10">
          <p className="text-sm text-[#002b5b]">Total completed orders</p>
          <p className="text-2xl font-bold text-[#001F3F]">{summary.totalCompleted}</p>
        </div>
        <div className="rounded-xl bg-white/80 p-4 border border-white/10">
          <p className="text-sm text-[#002b5b]">Total revenue</p>
          <p className="text-2xl font-bold text-[#001F3F]">${summary.totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/80 p-4 overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-[#002b5b]">
              <th className="p-2">Order ID</th>
              <th className="p-2">Customer</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Address</th>
              <th className="p-2">Total</th>
              <th className="p-2">Order Date</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map(o => (
              <tr key={o.id} className="border-t border-[#002b5b]/10">
                <td className="p-2 font-mono text-xs">{o.id}</td>
                <td className="p-2 font-medium text-[#001F3F]">{o.customerName}</td>
                <td className="p-2">{o.phone}</td>
                <td className="p-2">{o.address}</td>
                <td className="p-2 font-semibold">${Number(o.totalPrice).toFixed(2)}</td>
                <td className="p-2">{new Date(o.createdAt).toLocaleString()}</td>
                <td className="p-2">
                  {canEdit ? (
                    <select
                      className="rounded-md border border-[#002b5b]/20 px-2 py-1"
                      value={o.status}
                      onChange={(e) => onStatusChange(o.id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  ) : (
                    <span>{STATUS_OPTIONS.find(s => s.value === o.status)?.label}</span>
                  )}
                </td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-600">No completed or canceled orders yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
