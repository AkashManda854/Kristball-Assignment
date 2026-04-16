import { useEffect, useState } from 'react';
import api from '../lib/api';
import FormField from '../components/FormField';

export default function AssignmentsPage() {
  const [equipment, setEquipment] = useState([]);
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({ personnelName: '', equipmentId: '', quantity: '', baseId: '', date: '' });

  const load = () => api.get('/assignments').then((response) => setRecords(response.data));

  useEffect(() => {
    api.get('/equipment').then((response) => setEquipment(response.data));
    load();
  }, []);

  const createAssignment = async (event) => {
    event.preventDefault();
    await api.post('/assignments', form);
    setForm({ personnelName: '', equipmentId: '', quantity: '', baseId: '', date: '' });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-panel">
        <div className="text-xs uppercase tracking-[0.4em] text-brass/90">Assignments</div>
        <h2 className="mt-3 text-3xl font-semibold text-white">Personnel Allocation</h2>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <form onSubmit={createAssignment} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-panel xl:col-span-1 space-y-4">
          <h3 className="text-lg font-semibold text-white">Assign Equipment</h3>
          <FormField label="Personnel Name"><input value={form.personnelName} onChange={(e) => setForm((current) => ({ ...current, personnelName: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white" /></FormField>
          <FormField label="Equipment"><select value={form.equipmentId} onChange={(e) => setForm((current) => ({ ...current, equipmentId: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white"><option value="">Select</option>{equipment.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></FormField>
          <FormField label="Quantity"><input type="number" value={form.quantity} onChange={(e) => setForm((current) => ({ ...current, quantity: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white" /></FormField>
          <FormField label="Base ID"><input value={form.baseId} onChange={(e) => setForm((current) => ({ ...current, baseId: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white" /></FormField>
          <FormField label="Date"><input type="datetime-local" value={form.date} onChange={(e) => setForm((current) => ({ ...current, date: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white" /></FormField>
          <button className="w-full rounded-2xl bg-brass px-4 py-3 font-semibold text-ink">Save Assignment</button>
        </form>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-panel xl:col-span-2">
          <div className="overflow-hidden rounded-3xl border border-white/10">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-900/90 text-sand/70">
                <tr>
                  <th className="px-4 py-3">Personnel</th>
                  <th className="px-4 py-3">Equipment</th>
                  <th className="px-4 py-3">Quantity</th>
                  <th className="px-4 py-3">Base</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-white/5 text-white">
                {records.map((record) => (
                  <tr key={record.id}>
                    <td className="px-4 py-3">{record.personnelName}</td>
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
