import { useEffect, useMemo, useState } from 'react';
import api from '../lib/api';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';
import FormField from '../components/FormField';

function money(value) {
  return new Intl.NumberFormat('en-US').format(value);
}

export default function DashboardPage() {
  const [bases, setBases] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [filters, setFilters] = useState({ baseId: '', equipmentId: '', startDate: '', endDate: '' });
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get('/dashboard', { params: filters })
      .then((response) => {
        setBases(response.data.filters.bases);
        setEquipment(response.data.filters.equipment);
        setSummary(response.data.summary);
      })
      .finally(() => setLoading(false));
  }, [filters]);

  const netMovementBreakdown = useMemo(() => {
    if (!summary) return [];
    return [
      { label: 'Purchases', value: summary.purchasesTotal },
      { label: 'Transfers In', value: summary.transferInTotal },
      { label: 'Transfers Out', value: summary.transferOutTotal },
    ];
  }, [summary]);

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-panel">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.4em] text-brass/90">Dashboard</div>
            <h2 className="mt-3 text-3xl font-semibold text-white">Operational Asset Overview</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            <FormField label="Base">
              <select value={filters.baseId} onChange={(e) => setFilters((current) => ({ ...current, baseId: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white">
                <option value="">All</option>
                {bases.map((base) => <option key={base.id} value={base.id}>{base.name}</option>)}
              </select>
            </FormField>
            <FormField label="Equipment Type">
              <select value={filters.equipmentId} onChange={(e) => setFilters((current) => ({ ...current, equipmentId: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white">
                <option value="">All</option>
                {equipment.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </FormField>
            <FormField label="Start Date">
              <input type="date" value={filters.startDate} onChange={(e) => setFilters((current) => ({ ...current, startDate: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white" />
            </FormField>
            <FormField label="End Date">
              <input type="date" value={filters.endDate} onChange={(e) => setFilters((current) => ({ ...current, endDate: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white" />
            </FormField>
          </div>
        </div>
      </div>

      {loading || !summary ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-sand/70">Loading dashboard metrics...</div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <StatCard title="Opening Balance" value={money(summary.openingBalance)} hint="Balance at the start of the selected window" />
            <StatCard title="Closing Balance" value={money(summary.closingBalance)} hint="Projected balance after movement and usage" accent />
            <button onClick={() => setModalOpen(true)} className="text-left">
              <StatCard title="Net Movement" value={money(summary.netMovement)} hint="Purchases + Transfers In - Transfers Out" />
            </button>
            <StatCard title="Assigned Assets" value={money(summary.assignedAssets)} hint="Assets currently assigned to personnel" />
            <StatCard title="Expended Assets" value={money(summary.expendedAssets)} hint="Assets consumed or written off" />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-panel">
              <h3 className="text-lg font-semibold text-white">Net Movement Breakdown</h3>
              <div className="mt-5 space-y-4">
                {netMovementBreakdown.map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-2xl bg-slate-900/80 px-4 py-3">
                    <span className="text-sand/75">{item.label}</span>
                    <span className="font-semibold text-white">{money(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-panel">
              <h3 className="text-lg font-semibold text-white">Current Filters</h3>
              <div className="mt-5 space-y-3 text-sm text-sand/75">
                <div>Base: {filters.baseId ? bases.find((base) => String(base.id) === filters.baseId)?.name : 'All bases'}</div>
                <div>Equipment: {filters.equipmentId ? equipment.find((item) => String(item.id) === filters.equipmentId)?.name : 'All equipment'}</div>
                <div>Range: {filters.startDate || 'Start'} to {filters.endDate || 'End'}</div>
              </div>
            </div>
          </div>
        </>
      )}

      <Modal open={modalOpen} title="Net Movement Details" onClose={() => setModalOpen(false)}>
        <div className="space-y-3">
          {netMovementBreakdown.map((item) => (
            <div key={item.label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <span className="text-sand/75">{item.label}</span>
              <span className="font-semibold text-white">{money(item.value)}</span>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
