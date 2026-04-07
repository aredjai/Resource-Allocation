import React, { useState } from 'react';
import { POD, BusinessUnit } from '../data';
import { Plus, Trash2, Save, X, Edit2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PodSetupProps {
  pods: POD[];
  onSave: (updatedPods: POD[]) => void | Promise<void>;
  onClose: () => void;
  showNotification?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const PodSetup: React.FC<PodSetupProps> = ({ pods, onSave, onClose, showNotification }) => {
  const [localPods, setLocalPods] = useState<POD[]>(pods);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPod, setNewPod] = useState<Partial<POD>>({
    name: '',
    bu: 'IT',
    lead: '',
    description: ''
  });

  const handleAddPod = () => {
    if (!newPod.name) return;
    const id = `pod-${newPod.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    const podToAdd: POD = {
      id,
      name: newPod.name,
      bu: (newPod.bu as BusinessUnit) || 'IT',
      lead: newPod.lead || '',
      description: newPod.description || ''
    };
    setLocalPods([...localPods, podToAdd]);
    setNewPod({ name: '', bu: 'IT', lead: '', description: '' });
  };

  const handleUpdatePod = (id: string, updates: Partial<POD>) => {
    setLocalPods(localPods.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const handleDeletePod = (id: string) => {
    if (id === 'pod-bench') {
      if (showNotification) showNotification("Cannot delete the Bench POD.", "error");
      return;
    }
    // Removing window.confirm as it's not reliable in iframe
    setLocalPods(localPods.filter(p => p.id !== id));
    if (showNotification) showNotification("POD removed from local list. Save changes to persist.", "info");
  };

  const handleFinalSave = async () => {
    await onSave(localPods);
    onClose();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[80vh]">
      <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Standardized POD Setup</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Manage POD attributes and structure</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <X size={20} className="text-slate-500" />
        </button>
      </div>

      <div className="p-8 overflow-y-auto space-y-8">
        {/* Add New POD Form */}
        <section className="bg-indigo-50/50 rounded-xl border border-indigo-100 p-6 space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-2">Create New POD</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">POD Name</label>
              <input 
                type="text" 
                value={newPod.name}
                onChange={e => setNewPod({ ...newPod, name: e.target.value })}
                placeholder="e.g. Project Raptor"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Business Unit</label>
              <select 
                value={newPod.bu}
                onChange={e => setNewPod({ ...newPod, bu: e.target.value as BusinessUnit })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {['MSD', 'MLD', 'Vylla', 'CMH', 'IT', 'ENT', 'CCM'].map(bu => (
                  <option key={bu} value={bu}>{bu}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">POD Lead</label>
              <input 
                type="text" 
                value={newPod.lead}
                onChange={e => setNewPod({ ...newPod, lead: e.target.value })}
                placeholder="Lead Name"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="flex items-end">
              <button 
                onClick={handleAddPod}
                disabled={!newPod.name}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-md shadow-indigo-100"
              >
                <Plus size={16} /> Add POD
              </button>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Description</label>
            <textarea 
              value={newPod.description}
              onChange={e => setNewPod({ ...newPod, description: e.target.value })}
              placeholder="Brief description of POD scope..."
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none h-20 resize-none"
            />
          </div>
        </section>

        {/* POD List */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Existing PODs</h3>
          <div className="grid grid-cols-1 gap-3">
            {localPods.map(pod => (
              <div key={pod.id} className="group bg-white border border-slate-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all">
                {editingId === pod.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input 
                        type="text" 
                        value={pod.name}
                        onChange={e => handleUpdatePod(pod.id, { name: e.target.value })}
                        className="px-3 py-1.5 border border-slate-200 rounded text-sm"
                      />
                      <select 
                        value={pod.bu}
                        onChange={e => handleUpdatePod(pod.id, { bu: e.target.value as BusinessUnit })}
                        className="px-3 py-1.5 border border-slate-200 rounded text-sm"
                      >
                        {['MSD', 'MLD', 'Vylla', 'CMH', 'IT', 'ENT', 'CCM'].map(bu => (
                          <option key={bu} value={bu}>{bu}</option>
                        ))}
                      </select>
                      <input 
                        type="text" 
                        value={pod.lead}
                        onChange={e => handleUpdatePod(pod.id, { lead: e.target.value })}
                        className="px-3 py-1.5 border border-slate-200 rounded text-sm"
                      />
                    </div>
                    <textarea 
                      value={pod.description}
                      onChange={e => handleUpdatePod(pod.id, { description: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded text-sm h-16 resize-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditingId(null)} className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-slate-800">Cancel</button>
                      <button onClick={() => setEditingId(null)} className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded hover:bg-indigo-700">Done</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                        <Layers size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-800">{pod.name}</h4>
                          <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[8px] font-black uppercase rounded tracking-wider">{pod.bu}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium">Lead: {pod.lead || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setEditingId(pod.id)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDeletePod(pod.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-4">
        <button 
          onClick={onClose}
          className="px-6 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          Cancel
        </button>
        <button 
          onClick={handleFinalSave}
          className="flex items-center gap-2 px-8 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          <Save size={18} /> Save Changes
        </button>
      </div>
    </div>
  );
};

import { Layers } from 'lucide-react';
