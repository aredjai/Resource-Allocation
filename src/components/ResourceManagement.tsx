import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Resource, POD, QUARTERS, Quarter, Allocation, PROJECTS, SPRINTS } from '../data';
import { Save, Plus, Trash2, Edit2, X, Check, Search, Zap, ArrowRight, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface ResourceManagementProps {
  resources: Resource[];
  pods: POD[];
  onSave: (updatedResources: Resource[], updatedPods: POD[]) => void;
  onClose: () => void;
}

export function ResourceManagement({ resources, pods, onSave, onClose }: ResourceManagementProps) {
  const [editingResourceId, setEditingResourceId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<{
    name: string;
    department: string;
    role: string;
    allocations: {
      projectName: string;
      quarterName: string;
      sprintAllocations: { [sprintId: string]: number };
    }[];
  }>({
    name: '',
    department: 'EDE',
    role: '',
    allocations: [{ projectName: '', quarterName: QUARTERS[0].name, sprintAllocations: {} }]
  });

  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  const handleAddAllocation = () => {
    setFormData(prev => ({
      ...prev,
      allocations: [...prev.allocations, { projectName: '', quarterName: QUARTERS[0].name, sprintAllocations: {} }]
    }));
  };

  const handleRemoveAllocation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      allocations: prev.allocations.filter((_, i) => i !== index)
    }));
  };

  const handleAllocationChange = (index: number, field: string, value: any) => {
    const newAllocations = [...formData.allocations];
    if (field === 'sprintAllocations') {
      const { sprintId, val } = value;
      newAllocations[index].sprintAllocations = {
        ...newAllocations[index].sprintAllocations,
        [sprintId]: val
      };
    } else if (field === 'quickFill') {
      const quarter = QUARTERS.find(q => q.name === newAllocations[index].quarterName);
      const qSprints = SPRINTS.filter(s => s.quarter === quarter?.id);
      const newSprints = { ...newAllocations[index].sprintAllocations };
      qSprints.forEach(s => {
        newSprints[s.id] = value;
      });
      newAllocations[index].sprintAllocations = newSprints;
    } else {
      (newAllocations[index] as any)[field] = value;
    }
    setFormData(prev => ({ ...prev, allocations: newAllocations }));
  };

  const handleEdit = (resource: Resource) => {
    setEditingResourceId(resource.id);
    
    const mappedAllocations = resource.allocations.map(a => {
      // Find which quarter this allocation belongs to (based on first sprint if available)
      let quarterName = QUARTERS[0].name;
      let quarterId = QUARTERS[0].id;
      if (a.sprintAllocations && a.sprintAllocations.length > 0) {
        const firstSprint = SPRINTS.find(s => s.id === a.sprintAllocations[0].sprintId);
        if (firstSprint) {
          const q = QUARTERS.find(q => q.id === firstSprint.quarter);
          if (q) {
            quarterName = q.name;
            quarterId = q.id;
          }
        }
      } else if (a.startDate) {
        const quarter = QUARTERS.find(q => q.startDate === a.startDate);
        if (quarter) {
          quarterName = quarter.name;
          quarterId = quarter.id;
        }
      }

      const sprintAllocationsMap: { [sprintId: string]: number } = {};
      if (a.sprintAllocations) {
        a.sprintAllocations.forEach(sa => {
          sprintAllocationsMap[sa.sprintId] = sa.percentage;
        });
      } else if (a.percentage !== undefined) {
        // Legacy fallback
        const qSprints = SPRINTS.filter(s => s.quarter === quarterId);
        qSprints.forEach(s => {
          sprintAllocationsMap[s.id] = a.percentage!;
        });
      }

      return {
        projectName: a.projectName,
        quarterName,
        sprintAllocations: sprintAllocationsMap
      };
    });

    setFormData({
      name: resource.name,
      department: resource.department,
      role: resource.role,
      allocations: mappedAllocations.length > 0 ? mappedAllocations : [{ projectName: '', quarterName: QUARTERS[0].name, sprintAllocations: {} }]
    });

    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  };

  const handleSave = () => {
    if (!formData.name) {
      return;
    }

    const newResourceId = editingResourceId || `res-${formData.name.toLowerCase().replace(/\s+/g, '-')}`;
    
    const processedAllocations: Allocation[] = [];
    const newPods = [...pods];

    formData.allocations.forEach(alloc => {
      if (!alloc.projectName) return;

      // Find project and its associated POD
      const project = PROJECTS.find(p => p.name === alloc.projectName);
      let podId = 'pod-bench';
      let projectName = alloc.projectName;
      let projectId = `proj-${alloc.projectName.toLowerCase().replace(/\s+/g, '-')}`;

      if (project) {
        podId = project.podId;
        projectId = project.id;
        projectName = project.name;
      } else {
        const pod = newPods.find(p => p.name === alloc.projectName);
        if (pod) {
          podId = pod.id;
        }
      }

      const sprintAllocations = Object.entries(alloc.sprintAllocations)
        .filter(([_, percentage]) => (percentage as number) > 0)
        .map(([sprintId, percentage]) => ({ sprintId, percentage: percentage as number }));

      if (sprintAllocations.length > 0) {
        processedAllocations.push({
          projectId,
          projectName,
          podId,
          sprintAllocations
        });
      }
    });

    const newResource: Resource = {
      id: newResourceId,
      name: formData.name,
      department: formData.department,
      role: formData.role,
      allocations: processedAllocations
    };

    let updatedResources;
    if (editingResourceId) {
      updatedResources = resources.map(r => r.id === editingResourceId ? newResource : r);
    } else {
      updatedResources = [...resources, newResource];
    }

    onSave(updatedResources, newPods);
    handleClear();
  };

  const handleClear = () => {
    setEditingResourceId(null);
    setFormData({
      name: '',
      department: 'EDE',
      role: '',
      allocations: [{ projectName: '', quarterName: QUARTERS[0].name, sprintAllocations: {} }]
    });
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  };

  const handleDelete = (id: string) => {
    onSave(resources.filter(r => r.id !== id), pods);
  };

  const filteredResources = resources.filter(res => 
    res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    res.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    res.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Derive all unique POD/Project names from existing resources to improve suggestions
  const allExistingPodNames = useMemo(() => {
    const names = new Set(pods.map(p => p.name));
    resources.forEach(r => {
      r.allocations.forEach(a => names.add(a.projectName));
    });
    return Array.from(names).sort();
  }, [pods, resources]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter">Resource Intelligence</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Manual Data Entry & Optimization</p>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X size={20} className="text-slate-400" />
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Form Section */}
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl shadow-slate-200/50 space-y-8">
            {/* Basic Info - Compact Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Resource Name</label>
                <input 
                  ref={nameInputRef}
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-700"
                  placeholder="Full Name"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Department</label>
                <select 
                  value={formData.department}
                  onChange={e => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all bg-white font-bold text-slate-700 appearance-none"
                >
                  <option value="EDE">EDE</option>
                  <option value="APD">APD</option>
                  <option value="APS">APS</option>
                </select>
              </div>
              <div className="md:col-span-3 space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Role / Designation</label>
                <input 
                  type="text"
                  value={formData.role}
                  onChange={e => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-700"
                  placeholder="e.g. Senior Software Engineer"
                />
              </div>
            </div>

            {/* Allocations - Table Style */}
            <div className="pt-8 border-t border-slate-100 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-indigo-600 p-1.5 rounded-lg">
                      <Zap size={14} className="text-white" />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">POD Allocations</h3>
                  </div>
                  {formData.allocations.length > 0 && (
                    <div className="px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100">
                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider">
                        Total: {(formData.allocations.reduce((acc, a) => {
                          const quarter = QUARTERS.find(q => q.name === a.quarterName);
                          const qSprints = SPRINTS.filter(s => s.quarter === quarter?.id);
                          const sprintSum = qSprints.reduce((sum, s) => sum + (a.sprintAllocations[s.id] || 0), 0);
                          return acc + (qSprints.length > 0 ? sprintSum / qSprints.length : 0);
                        }, 0) / 100).toFixed(2)} FTE
                      </span>
                    </div>
                  )}
                </div>
                <button 
                  onClick={handleAddAllocation}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase transition-all border border-slate-100 hover:border-indigo-200"
                >
                  <Plus size={14} /> Add POD
                </button>
              </div>

              <div className="space-y-4">
                {formData.allocations.map((alloc, idx) => {
                  const quarter = QUARTERS.find(q => q.name === alloc.quarterName);
                  const qSprints = SPRINTS.filter(s => s.quarter === quarter?.id);
                  const avgAlloc = qSprints.length > 0 
                    ? Math.round(qSprints.reduce((sum, s) => sum + (alloc.sprintAllocations[s.id] || 0), 0) / qSprints.length)
                    : 0;
                  const isOverAllocated = avgAlloc > 100;

                  return (
                    <div key={idx} className={cn(
                      "group relative bg-slate-50/50 rounded-2xl border p-6 transition-all",
                      isOverAllocated ? "border-rose-200 bg-rose-50/30" : "border-slate-100 hover:bg-white hover:shadow-lg"
                    )}>
                      <button 
                        onClick={() => handleRemoveAllocation(idx)}
                        className="absolute -top-2 -right-2 p-1.5 bg-white border border-slate-200 text-slate-300 hover:text-rose-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        <div className="lg:col-span-12 flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Allocation {idx + 1}</span>
                            <span className={cn(
                              "px-2 py-0.5 rounded text-[9px] font-bold uppercase",
                              isOverAllocated ? "bg-rose-100 text-rose-600" : "bg-indigo-50 text-indigo-600"
                            )}>
                              {(avgAlloc / 100).toFixed(2)} FTE Avg
                            </span>
                          </div>
                        </div>
                        {/* POD & Quarter Selection */}
                        <div className="lg:col-span-4 space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Target Project</label>
                            <input 
                              type="text"
                              list="pod-suggestions"
                              value={alloc.projectName}
                              onChange={e => handleAllocationChange(idx, 'projectName', e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-bold text-slate-700"
                              placeholder="Select or Type Name"
                            />
                            <datalist id="pod-suggestions">
                              {allExistingPodNames.map(name => <option key={name} value={name} />)}
                            </datalist>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Quarter</label>
                            <select 
                              value={alloc.quarterName}
                              onChange={e => handleAllocationChange(idx, 'quarterName', e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-bold text-slate-700 bg-white appearance-none"
                            >
                              {QUARTERS.map(q => <option key={q.id} value={q.name}>{q.name}</option>)}
                            </select>
                          </div>
                        </div>

                        {/* Sprint Inputs with Quick Fill */}
                        <div className="lg:col-span-8 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Sprint Distribution (%)</label>
                              {isOverAllocated && (
                                <span className="flex items-center gap-1 text-[8px] font-black text-rose-500 uppercase animate-pulse">
                                  <AlertCircle size={10} /> Over 100% Avg
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[8px] font-bold text-slate-400 uppercase">Quick Fill</span>
                              <input 
                                type="number"
                                placeholder="All"
                                className="w-12 px-1.5 py-0.5 rounded border border-slate-200 text-[10px] text-center focus:ring-1 focus:ring-indigo-500"
                                onChange={e => handleAllocationChange(idx, 'quickFill', parseInt(e.target.value) || 0)}
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                            {qSprints.map((s) => (
                              <div key={s.id} className="space-y-1.5">
                                <div className="text-[8px] font-black text-center text-slate-400">{s.id}</div>
                                <input 
                                  type="number"
                                  min="0"
                                  value={alloc.sprintAllocations[s.id] || 0}
                                  onChange={e => handleAllocationChange(idx, 'sprintAllocations', { sprintId: s.id, val: parseInt(e.target.value) || 0 })}
                                  className={cn(
                                    "w-full px-2 py-2 rounded-xl border text-center text-xs font-bold transition-all",
                                    (alloc.sprintAllocations[s.id] || 0) > 100 ? "border-rose-300 bg-rose-50 text-rose-600" : "border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                  )}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-8 flex justify-between items-center border-t border-slate-100">
              <button 
                onClick={handleClear}
                className="px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
              >
                Reset Form
              </button>
              <div className="flex gap-3">
                <button 
                  onClick={handleSave}
                  disabled={!formData.name}
                  className={cn(
                    "flex items-center gap-3 px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl",
                    formData.name 
                      ? "bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5" 
                      : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                  )}
                >
                  <Save size={16} />
                  {editingResourceId ? 'Update Intelligence' : 'Save Resource'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* List Section - Optimized for Search */}
        <div className="xl:col-span-4 space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-bold"
              />
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col max-h-[700px]">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Inventory ({filteredResources.length})</h3>
              </div>
              <div className="divide-y divide-slate-100 overflow-y-auto">
                {filteredResources.length > 0 ? (
                  filteredResources.map(res => (
                    <div key={res.id} className="p-5 hover:bg-indigo-50/30 transition-all group cursor-pointer" onClick={() => handleEdit(res)}>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{res.name}</div>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{res.department}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                          <button 
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-sm"
                            title="Edit Resource"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(res.id);
                            }}
                            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-white rounded-xl transition-all shadow-sm"
                            title="Delete Resource"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center space-y-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No matches found</p>
                    <p className="text-[10px] text-slate-400 italic">Try a different search term</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
