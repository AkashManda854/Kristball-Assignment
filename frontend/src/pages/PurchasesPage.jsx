import { useEffect, useState } from 'react';
import api from '../lib/api';
import FormField from '../components/FormField';

export default function PurchasesPage() {
  const [equipment, setEquipment] = useState([]);
  const [bases, setBases] = useState([]);
  const [records, setRecords] = useState([]);
  const [filters, setFilters] = useState({ baseId: '', equipmentId: '', startDate: '', endDate: '' });
  const [form, setForm] = useState({ equipmentId: '', quantity: '', baseId: '', date: '' });

  const load = () => {
    api.get('/purchases', { params: filters }).then((response) => setRecords(response.data));
  };

  useEffect(() => {
    api.get('/equipment').then((response) => setEquipment(response.data));
    api.get('/bases').catch(() => setBases([]));
  }, []);

  useEffect(load, [filters]);

  const createPurchase = async (event) => {
    event.preventDefault();
    await api.post('/purchases', form);
    setForm({ equipmentId: '', quantity: '', baseId: '', date: '' });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-panel">
        <div className="text-xs uppercase tracking-[0.4em] text-brass/90">Purchases</div>
        <h2 className="mt-3 text-3xl font-semibold text-white">Procurement History</h2>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <form onSubmit={createPurchase} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-panel xl:col-span-1 space-y-4">
          <h3 className="text-lg font-semibold text-white">Create Purchase</h3>
          <FormField label="Equipment">
            <select value={form.equipmentId} onChange={(e) => setForm((current) => ({ ...current, equipmentId: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white">
              <option value="">Select</option>
              {equipment.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </FormField>
          <FormField label="Quantity">
            <input type="number" value={form.quantity} onChange={(e) => setForm((current) => ({ ...current, quantity: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white" />
          </FormField>
          <FormField label="Base ID">
            <input value={form.baseId} onChange={(e) => setForm((current) => ({ ...current, baseId: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white" />
          </FormField>
          <FormField label="Date">
            <input type="datetime-local" value={form.date} onChange={(e) => setForm((current) => ({ ...current, date: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white" />
          </FormField>
          <button className="w-full rounded-2xl bg-brass px-4 py-3 font-semibold text-ink">Save Purchase</button>
        </form>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-panel xl:col-span-2">
          <div className="grid gap-3 md:grid-cols-4">
            <FormField label="Base">
              <input value={filters.baseId} onChange={(e) => setFilters((current) => ({ ...current, baseId: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white" />
            </FormField>
            <FormField label="Equipment">
              <input value={filters.equipmentId} onChange={(e) => setFilters((current) => ({ ...current, equipmentId: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white" />
            </FormField>
            <FormField label="Start">
              <input type="date" value={filters.startDate} onChange={(e) => setFilters((current) => ({ ...current, startDate: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white" />
            </FormField>
            <FormField label="End">
              <input type="date" value={filters.endDate} onChange={(e) => setFilters((current) => ({ ...current, endDate: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white" />
            </FormField>
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-white/10">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-900/90 text-sand/70">
                <tr>
                  <th className="px-4 py-3">Equipment</th>
                  <th className="px-4 py-3">Quantity</th>
                  <th className="px-4 py-3">Base</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-white/5 text-white">
                {records.map((record) => (
                  <tr key={record.id}>
                    <td className="px-4 py-3">{record.equipment?.name}</td>
                    <td className="px-4 py-3">{record.quantity}</td>
                    <td className="px-4 py-3">{record.base?.name}</td>
                    <td className="px-4 py-3">{new Date(record.date).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
