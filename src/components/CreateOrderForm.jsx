import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function CreateOrderForm({ onCreate, onDing }) {
  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    address: '',
    items: '',
    notes: '',
    totalPrice: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.customerName || !form.phone || !form.address || !form.items || !form.totalPrice) {
      setError('Please fill in all required fields.');
      return;
    }
    const price = parseFloat(form.totalPrice);
    if (Number.isNaN(price) || price < 0) {
      setError('Enter a valid total price.');
      return;
    }
    onCreate({
      customerName: form.customerName.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      items: form.items.trim(),
      notes: form.notes.trim(),
      totalPrice: price,
    });
    onDing?.();
    setForm({ customerName: '', phone: '', address: '', items: '', notes: '', totalPrice: '' });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-[#001F3F] mb-4">Create New Order</h2>
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/10 bg-white/80 backdrop-blur p-6 shadow-xl shadow-[#001F3F]/20"
      >
        {error && (
          <div className="mb-4 font-bold text-red-600">{error}</div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#002b5b]">Customer Name</label>
            <input
              type="text"
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-[#002b5b]/20 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#EFB810]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#002b5b]">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-[#002b5b]/20 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#EFB810]"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-[#002b5b]">Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-[#002b5b]/20 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#EFB810]"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-[#002b5b]">Ordered Items</label>
            <input
              type="text"
              name="items"
              value={form.items}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-[#002b5b]/20 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#EFB810]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#002b5b]">Total Price ($)</label>
            <input
              type="number"
              step="0.01"
              name="totalPrice"
              value={form.totalPrice}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-[#002b5b]/20 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#EFB810]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#002b5b]">Notes (optional)</label>
            <input
              type="text"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-[#002b5b]/20 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#EFB810]"
            />
          </div>
        </div>
        <div className="mt-6">
          <button
            type="submit"
            className="w-full rounded-xl bg-[#EFB810] py-3 font-semibold text-[#001F3F] shadow hover:opacity-90"
          >
            Add Order
          </button>
        </div>
      </motion.form>
    </div>
  );
}
