import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Resource, POD, SPRINTS, QUARTERS, Allocation, SprintAllocation } from '../data';
import { Save, X, Search, ChevronRight, ChevronDown, Filter, Download, Upload, AlertCircle, Check, Info, UserPlus, Activity, Maximize2, Minimize2, ArrowUpDown, ArrowUp, ArrowDown, Trash2, Plus } from 'lucide-react';
import { cn } from '../lib/utils';

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  placeholder?: string;
  className?: string;
  isNew?: boolean;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  value,
  onChange,
  suggestions,
  placeholder,
  className,
  isNew
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filtered, setFiltered] = useState<string[]>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    
    if (val.trim()) {
      const matches = suggestions.filter(s => 
        s.toLowerCase().includes(val.toLowerCase()) && s.toLowerCase() !== val.toLowerCase()
      );
      setFiltered(matches.slice(0, 5));
      setIsOpen(matches.length > 0);
    } else {
      setIsOpen(false);
    }
  };

  const selectSuggestion = (s: string) => {
    onChange(s);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => {
          if (value.trim()) {
            const matches = suggestions.filter(s => 
              s.toLowerCase().includes(value.toLowerCase()) && s.toLowerCase() !== value.toLowerCase()
            );
            setFiltered(matches.slice(0, 5));
            setIsOpen(matches.length > 0);
          }
        }}
        placeholder={placeholder}
        className={className}
      />
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 shadow-xl rounded-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="px-2 py-1.5 bg-slate-50 border-b border-slate-100">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Existing Values</span>
          </div>
          {filtered.map((s, i) => (
            <button
              key={i}
              onClick={() => selectSuggestion(s)}
              className="w-full text-left px-3 py-2 text-xs hover:bg-indigo-50 text-slate-700 flex items-center justify-between group transition-colors"
            >
              <span className="font-medium">{s}</span>
              <Plus size={12} className="text-slate-300 group-hover:text-indigo-500" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface AllocationDetailsProps {
  resources: Resource[];
  pods: POD[];
  onSave: (updatedResources: Resource[], updatedPods: POD[]) => void | Promise<void>;
  onClose: () => void;
}

interface GridRow {
  id: string; // unique row id: resourceId-podId
  resourceId: string;
  resourceName: string;
  department: string;
  role: string;
  podId: string;
  podName: string;
  podBU: string;
  podLead: string;
  podDescription: string;
  sprintAllocations: { [sprintId: string]: number };
  isNew?: boolean;
}

export const AllocationDetails: React.FC<AllocationDetailsProps> = ({
  resources,
  pods,
  onSave,
  onClose
}) => {
  const [rows, setRows] = useState<GridRow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof GridRow; direction: 'asc' | 'desc' } | null>(null);
  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>({
    resourceName: 200,
    department: 100,
    role: 180,
    podBU: 100,
    podName: 220,
    podLead: 150,
    podDescription: 300,
  });
  const resizingColumn = useRef<string | null>(null);
  const startX = useRef<number>(0);
  const startWidth = useRef<number>(0);

  const handleMouseDown = (e: React.MouseEvent, columnKey: string) => {
    resizingColumn.current = columnKey;
    startX.current = e.clientX;
    startWidth.current = columnWidths[columnKey];
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (resizingColumn.current) {
      const diff = e.clientX - startX.current;
      const newWidth = Math.max(80, startWidth.current + diff);
      setColumnWidths(prev => ({
        ...prev,
        [resizingColumn.current!]: newWidth
      }));
    }
  };

  const handleMouseUp = () => {
    resizingColumn.current = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const resourceNames = useMemo(() => Array.from(new Set(resources.map(r => r.name))), [resources]);
  const podNames = useMemo(() => Array.from(new Set(pods.map(p => p.name))), [pods]);
  const roles = useMemo(() => Array.from(new Set(resources.map(r => r.role))), [resources]);
  const podLeads = useMemo(() => Array.from(new Set(pods.map(p => p.lead))), [pods]);

  // Initialize rows from resources
  useEffect(() => {
    const initialRows: GridRow[] = [];
    resources.forEach(resource => {
      if (resource.allocations.length === 0) {
        // Include resources with no allocations as a "Bench" row
        initialRows.push({
          id: `${resource.id}-bench-0`,
          resourceId: resource.id,
          resourceName: resource.name,
          department: resource.department,
          role: resource.role,
          podId: 'pod-bench',
          podName: 'Bench / Available',
          podBU: 'IT',
          podLead: 'N/A',
          podDescription: 'Unallocated resource capacity',
          sprintAllocations: {}
        });
      } else {
        resource.allocations.forEach((alloc, idx) => {
          const pod = pods.find(p => p.id === alloc.podId);
          const sprintMap: { [sprintId: string]: number } = {};
          
          if (alloc.sprintAllocations && alloc.sprintAllocations.length > 0) {
            alloc.sprintAllocations.forEach(sa => {
              sprintMap[sa.sprintId] = sa.percentage || 0;
            });
          } else if (alloc.percentage !== undefined && alloc.startDate && alloc.endDate) {
            // Fallback to legacy date-based logic: map percentage to all sprints in the date range
            const aStart = new Date(alloc.startDate).getTime();
            const aEnd = new Date(alloc.endDate).getTime();
            
            SPRINTS.forEach(s => {
              const sStart = new Date(s.startDate).getTime();
              const sEnd = new Date(s.endDate).getTime();
              if (sStart <= aEnd && sEnd >= aStart) {
                sprintMap[s.id] = alloc.percentage || 0;
              }
            });
          }

          initialRows.push({
            id: `${resource.id}-${alloc.podId}-${idx}`,
            resourceId: resource.id,
            resourceName: resource.name,
            department: resource.department,
            role: resource.role,
            podId: alloc.podId,
            podName: pod?.name || alloc.projectName || 'Unknown POD',
            podBU: pod?.bu || 'N/A',
            podLead: pod?.lead || 'N/A',
            podDescription: pod?.description || '',
            sprintAllocations: sprintMap
          });
        });
      }
    });
    setRows(initialRows);
  }, [resources, pods]);

  const filteredRows = useMemo(() => {
    let result = [...rows];
    
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(r => 
        r.resourceName.toLowerCase().includes(lower) || 
        r.podName.toLowerCase().includes(lower) ||
        r.department.toLowerCase().includes(lower)
      );
    }

    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        return 0;
      });
    }

    return result;
  }, [rows, searchTerm, sortConfig]);

  const handleSort = (key: keyof GridRow) => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        if (prev.direction === 'asc') return { key, direction: 'desc' };
        return null;
      }
      return { key, direction: 'asc' };
    });
  };

  const handleInputChange = (rowId: string, field: string, value: string) => {
    setRows(prev => prev.map(row => {
      if (row.id === rowId) {
        if (field.startsWith('sprint-')) {
          const sprintId = field.replace('sprint-', '');
          const numValue = parseInt(value) || 0;
          return {
            ...row,
            sprintAllocations: {
              ...row.sprintAllocations,
              [sprintId]: numValue
            }
          };
        }

        // Auto-fill logic for POD Name
        if (field === 'podName') {
          const existingPod = pods.find(p => p.name.toLowerCase() === value.toLowerCase());
          if (existingPod) {
            return {
              ...row,
              podName: existingPod.name,
              podId: existingPod.id,
              podBU: existingPod.bu,
              podLead: existingPod.lead,
              podDescription: existingPod.description
            };
          }
        }

        // Auto-fill logic for Resource Name
        if (field === 'resourceName') {
          const existingRes = resources.find(r => r.name.toLowerCase() === value.toLowerCase());
          if (existingRes) {
            return {
              ...row,
              resourceName: existingRes.name,
              resourceId: existingRes.id,
              department: existingRes.department,
              role: existingRes.role
            };
          }
        }

        return { ...row, [field]: value };
      }
      return row;
    }));
  };

  const addNewRow = () => {
    setSearchTerm(''); // Clear search so the new row is visible
    const newId = `new-${Date.now()}`;
    setRows(prev => [
      {
        id: newId,
        resourceId: '',
        resourceName: '',
        department: 'Other',
        role: '',
        podId: '',
        podName: '',
        podBU: 'IT',
        podLead: '',
        podDescription: '',
        sprintAllocations: {},
        isNew: true
      },
      ...prev
    ]);
  };

  const deleteRow = (rowId: string) => {
    setRows(prev => prev.filter(r => r.id !== rowId));
  };

  const handleDownloadTemplate = () => {
    const allSprints = SPRINTS.filter(s => 
      ['2026-Q2', '2026-Q3', '2026-Q4', '2027-Q1'].includes(s.quarter)
    ).map(s => s.id);

    const headers = [
      'Resource ID', 'Resource Name', 'Team', 'Role', 
      'POD ID', 'POD Name', 'BU', 'POD Lead', 'POD Description',
      ...allSprints.map(id => `Sprint ${id} %`)
    ];

    const csvRows = rows.map(row => {
      const sprintData = allSprints.map(sId => row.sprintAllocations[sId] || 0);
      return [
        row.resourceId, row.resourceName, row.department, row.role,
        row.podId, row.podName, row.podBU, row.podLead, row.podDescription,
        ...sprintData
      ].map(val => `"${(val || '').toString().replace(/"/g, '""')}"`).join(',');
    });

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `allocation_template_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUploadData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      if (lines.length < 2) return;

      const parseCSVLine = (line: string) => {
        const values: string[] = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        values.push(current.trim());
        return values;
      };

      const headers = parseCSVLine(lines[0]);
      const allSprints = SPRINTS.map(s => s.id);
      
      const newRows: GridRow[] = lines.slice(1).map((line, idx) => {
        const values = parseCSVLine(line);
        const rowData: { [key: string]: string } = {};
        headers.forEach((header, i) => {
          rowData[header] = values[i] || '';
        });

        const sprintAllocations: { [key: string]: number } = {};
        allSprints.forEach(sId => {
          const headerKey = `Sprint ${sId} %`;
          if (rowData[headerKey] !== undefined) {
            sprintAllocations[sId] = parseInt(rowData[headerKey]) || 0;
          } else if (rowData[sId] !== undefined) {
            // Fallback for old format
            sprintAllocations[sId] = parseInt(rowData[sId]) || 0;
          }
        });

        return {
          id: rowData['Resource ID'] && rowData['POD ID'] 
            ? `${rowData['Resource ID']}-${rowData['POD ID']}-${idx}` 
            : `new-${Date.now()}-${idx}`,
          resourceId: rowData['Resource ID'] || '',
          resourceName: rowData['Resource Name'] || '',
          department: rowData['Team'] || rowData['Resource Department'] || rowData['Department'] || 'Other',
          role: rowData['Role'] || rowData['Resource Role'] || 'Contributor',
          podId: rowData['POD ID'] || '',
          podName: rowData['POD Name'] || '',
          podBU: rowData['BU'] || rowData['POD BU'] || 'IT',
          podLead: rowData['POD Lead'] || '',
          podDescription: rowData['POD Description'] || '',
          sprintAllocations,
          isNew: !rowData['Resource ID']
        };
      });

      setRows(newRows);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Group rows by resourceId (or name if new)
    const resourceMap = new Map<string, GridRow[]>();
    const podMap = new Map<string, Partial<POD>>();

    rows.forEach(row => {
      const resKey = row.resourceId || row.resourceName;
      if (!resKey) return;

      if (!resourceMap.has(resKey)) {
        resourceMap.set(resKey, []);
      }
      resourceMap.get(resKey)!.push(row);

      // Update POD info
      if (row.podId || row.podName) {
        const podKey = row.podId || row.podName;
        podMap.set(podKey, {
          id: row.podId,
          name: row.podName,
          bu: row.podBU,
          lead: row.podLead,
          description: row.podDescription
        });
      }
    });

    // Process PODs - Start fresh to ensure we only have what's in the grid
    const updatedPods: POD[] = [];
    podMap.forEach((podData, key) => {
      if (podData.name) {
        updatedPods.push({
          id: podData.id || `pod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: podData.name,
          bu: podData.bu || 'IT',
          lead: podData.lead || '',
          description: podData.description || ''
        });
      }
    });

    // Process Resources - Start fresh to ensure we only have what's in the grid
    const updatedResources: Resource[] = [];
    resourceMap.forEach((resourceRows, key) => {
      const firstRow = resourceRows[0];
      
      const newAllocations: Allocation[] = resourceRows
        .filter(row => row.podId !== 'pod-bench' && row.podName !== 'Bench / Available')
        .map(row => {
          const sprintAllocations: SprintAllocation[] = Object.entries(row.sprintAllocations)
            .filter(([_, percentage]) => (percentage || 0) > 0)
            .map(([sprintId, percentage]) => ({ sprintId, percentage: percentage || 0 }));

          // Find the actual pod ID from our updated list
          const actualPod = updatedPods.find(p => p.name === row.podName);

          return {
            projectId: row.podId || `proj-${Date.now()}`,
            podId: actualPod?.id || row.podId,
            projectName: row.podName,
            sprintAllocations
          };
        });

      updatedResources.push({
        id: firstRow.resourceId || `res-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: firstRow.resourceName,
        department: firstRow.department as any,
        role: firstRow.role,
        allocations: newAllocations
      });
    });

    try {
      await onSave(updatedResources, updatedPods);
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Save error:", error);
      setIsSaving(false);
    }
  };

  // Group sprints by Quarter and Month for headers
  const sprintHeaders = useMemo(() => {
    const quarters = ['2026-Q2', '2026-Q3', '2026-Q4', '2027-Q1'];
    return quarters.map(qId => {
      const quarter = QUARTERS.find(q => q.id === qId);
      const qSprints = SPRINTS.filter(s => s.quarter === qId);
      
      // Group by month (approximate based on startDate)
      const months: { [key: string]: typeof qSprints } = {};
      qSprints.forEach(s => {
        const date = new Date(s.startDate);
        const monthName = date.toLocaleString('default', { month: 'short' });
        if (!months[monthName]) months[monthName] = [];
        months[monthName].push(s);
      });

      return {
        id: qId,
        name: quarter?.name.split(' ')[0] || qId,
        months: Object.entries(months).map(([name, sprints]) => ({ name, sprints }))
      };
    });
  }, []);

  return (
    <div className={cn(
      "bg-white border border-slate-200 shadow-xl overflow-hidden flex flex-col transition-all duration-300",
      isExpanded 
        ? "fixed inset-0 z-[100] h-screen w-screen rounded-none" 
        : "rounded-2xl h-[800px]"
    )}>
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
            <Info className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Allocation Details</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Grid-based resource commitment management</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500 flex items-center gap-2 border border-slate-200 bg-white"
            title={isExpanded ? "Minimize" : "Expand to Full Screen"}
          >
            {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            <span className="text-[10px] font-bold uppercase">{isExpanded ? "Minimize" : "Full Screen"}</span>
          </button>

          <button 
            onClick={addNewRow}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-all border border-indigo-100"
          >
            <UserPlus size={16} />
            <span>Add Allocation</span>
          </button>

          <button 
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-all border border-emerald-100"
            title="Download current data as template"
          >
            <Download size={16} />
            <span>Get Template</span>
          </button>

          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-xs font-bold hover:bg-amber-100 transition-all border border-amber-100"
            title="Upload CSV data"
          >
            <Upload size={16} />
            <span>Upload Data</span>
          </button>

          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleUploadData}
            accept=".csv"
            className="hidden"
          />

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder="Search resources or PODs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none w-64 transition-all"
            />
          </div>
          
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Grid Content */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse table-fixed min-w-[2600px]">
          <colgroup>
            <col style={{ width: '60px' }} />
            <col style={{ width: columnWidths.resourceName }} />
            <col style={{ width: columnWidths.department }} />
            <col style={{ width: columnWidths.role }} />
            <col style={{ width: columnWidths.podBU }} />
            <col style={{ width: columnWidths.podName }} />
            <col style={{ width: columnWidths.podLead }} />
            <col style={{ width: columnWidths.podDescription }} />
            {sprintHeaders.map(q => q.months.map(m => m.sprints.map(s => (
              <col key={s.id} style={{ width: '60px' }} />
            )))).flat().flat()}
          </colgroup>
          <thead className="sticky top-0 z-20 bg-white shadow-sm">
            {/* Quarter Header */}
            <tr className="bg-slate-800 text-white border-b border-slate-700">
              <th className="w-[60px] border-r border-slate-700"></th>
              <th colSpan={7} className="px-4 py-2 text-left text-[10px] font-black uppercase tracking-widest border-r border-slate-700">Resource & POD Info</th>
              {sprintHeaders.map(q => (
                <th key={q.id} colSpan={q.months.reduce((acc, m) => acc + m.sprints.length, 0)} className="px-4 py-2 text-center text-[10px] font-black uppercase tracking-widest border-r border-slate-700">
                  {q.name}
                </th>
              ))}
            </tr>
            {/* Month Header */}
            <tr className="bg-slate-700 text-slate-300 border-b border-slate-600">
              <th className="w-[60px] border-r border-slate-600"></th>
              <th colSpan={7} className="border-r border-slate-600"></th>
              {sprintHeaders.map(q => q.months.map(m => (
                <th key={`${q.id}-${m.name}`} colSpan={m.sprints.length} className="px-2 py-1.5 text-center text-[9px] font-bold uppercase tracking-wider border-r border-slate-600">
                  {m.name}
                </th>
              ))).flat()}
            </tr>
            {/* Sprint Header */}
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="w-[60px] px-4 py-3 text-center text-[10px] font-bold uppercase text-slate-500 border-r border-slate-200">Act</th>
              {[
                { key: 'resourceName', label: 'Resource Name' },
                { key: 'department', label: 'Team' },
                { key: 'role', label: 'Role' },
              ].map(col => (
                <th 
                  key={col.key}
                  style={{ width: columnWidths[col.key] }}
                  className={cn(
                    "px-4 py-3 text-left text-[10px] font-bold uppercase border-r border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors group relative",
                    sortConfig?.key === col.key ? "text-indigo-600 bg-indigo-50/50" : "text-slate-500"
                  )}
                >
                  <div className="flex items-center justify-between" onClick={() => handleSort(col.key as keyof GridRow)}>
                    <span>{col.label}</span>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      {sortConfig?.key === col.key ? (
                        sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
                      ) : (
                        <ArrowUpDown size={12} className="text-slate-300" />
                      )}
                    </div>
                  </div>
                  <div 
                    onMouseDown={(e) => handleMouseDown(e, col.key)}
                    className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-indigo-500 group-hover:bg-slate-300 transition-colors z-10 border-r border-transparent hover:border-indigo-600"
                  />
                </th>
              ))}
                <th style={{ width: columnWidths.podBU }} className="px-4 py-3 text-left text-[10px] font-bold uppercase text-slate-500 border-r border-slate-200 relative group">
                  <div className="flex items-center justify-between">
                    <span>BU</span>
                  </div>
                  <div 
                    onMouseDown={(e) => handleMouseDown(e, 'podBU')}
                    className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-indigo-500 group-hover:bg-slate-300 transition-colors z-10 border-r border-transparent hover:border-indigo-600"
                  />
                </th>
                <th style={{ width: columnWidths.podName }} className="px-4 py-3 text-left text-[10px] font-bold uppercase text-slate-500 border-r border-slate-200 relative group">
                  <div className="flex items-center justify-between">
                    <span>POD Name</span>
                  </div>
                  <div 
                    onMouseDown={(e) => handleMouseDown(e, 'podName')}
                    className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-indigo-500 group-hover:bg-slate-300 transition-colors z-10 border-r border-transparent hover:border-indigo-600"
                  />
                </th>
                <th style={{ width: columnWidths.podLead }} className="px-4 py-3 text-left text-[10px] font-bold uppercase text-slate-500 border-r border-slate-200 relative group">
                  <div className="flex items-center justify-between">
                    <span>POD Lead</span>
                  </div>
                  <div 
                    onMouseDown={(e) => handleMouseDown(e, 'podLead')}
                    className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-indigo-500 group-hover:bg-slate-300 transition-colors z-10 border-r border-transparent hover:border-indigo-600"
                  />
                </th>
                <th style={{ width: columnWidths.podDescription }} className="px-4 py-3 text-left text-[10px] font-bold uppercase text-slate-500 border-r border-slate-200 relative group">
                  <div className="flex items-center justify-between">
                    <span>POD Description</span>
                  </div>
                  <div 
                    onMouseDown={(e) => handleMouseDown(e, 'podDescription')}
                    className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-indigo-500 group-hover:bg-slate-300 transition-colors z-10 border-r border-transparent hover:border-indigo-600"
                  />
                </th>
              {sprintHeaders.map(q => q.months.map(m => m.sprints.map(s => (
                <th key={s.id} className="w-[60px] px-1 py-3 text-center text-[10px] font-black text-slate-600 border-r border-slate-200">
                  {s.id}
                </th>
              ))).flat()).flat()}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRows.map((row, idx) => (
              <tr key={row.id} className={cn("hover:bg-indigo-50/30 transition-colors group", idx % 2 === 0 ? "bg-white" : "bg-slate-50/30")}>
                <td className="px-2 py-2 border-r border-slate-100 text-center">
                  <button 
                    onClick={() => deleteRow(row.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded transition-all"
                    title="Delete Allocation"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
                <td style={{ width: columnWidths.resourceName }} className="px-2 py-2 border-r border-slate-100 relative">
                  {row.isNew && (
                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-500 rounded-r-full" />
                  )}
                  <div className="flex flex-col">
                    <AutocompleteInput 
                      value={row.resourceName}
                      onChange={(val) => handleInputChange(row.id, 'resourceName', val)}
                      suggestions={resourceNames}
                      placeholder="New Resource..."
                      isNew={row.isNew}
                      className={cn(
                        "w-full bg-transparent text-sm font-bold px-2 py-1 rounded focus:bg-white focus:ring-1 focus:ring-indigo-500 outline-none",
                        row.isNew ? "text-emerald-700 placeholder:text-emerald-300" : "text-slate-800"
                      )}
                    />
                    {row.isNew && <span className="ml-2 text-[8px] font-black text-emerald-600 uppercase tracking-tighter">New Entry</span>}
                  </div>
                </td>
                <td style={{ width: columnWidths.department }} className="px-2 py-2 border-r border-slate-100">
                  <select 
                    value={row.department}
                    onChange={(e) => handleInputChange(row.id, 'department', e.target.value)}
                    className="w-full bg-transparent text-[10px] font-black text-slate-500 uppercase px-2 py-1 rounded focus:bg-white focus:ring-1 focus:ring-indigo-500 outline-none appearance-none"
                  >
                    <option value="EDE">EDE</option>
                    <option value="APD">APD</option>
                    <option value="APS">APS</option>
                  </select>
                </td>
                <td style={{ width: columnWidths.role }} className="px-2 py-2 border-r border-slate-100">
                  <AutocompleteInput 
                    value={row.role}
                    onChange={(val) => handleInputChange(row.id, 'role', val)}
                    suggestions={roles}
                    placeholder="Role"
                    className="w-full bg-transparent text-xs text-slate-600 px-2 py-1 rounded focus:bg-white focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </td>
                <td style={{ width: columnWidths.podBU }} className="px-2 py-2 border-r border-slate-100">
                  <div className="px-2 py-1 text-[10px] font-black text-indigo-600 uppercase">
                    {row.podBU}
                  </div>
                </td>
                <td style={{ width: columnWidths.podName }} className="px-2 py-2 border-r border-slate-100">
                  <select 
                    value={row.podId}
                    onChange={(e) => {
                      const selectedPod = pods.find(p => p.id === e.target.value);
                      if (selectedPod) {
                        handleInputChange(row.id, 'podId', selectedPod.id);
                        handleInputChange(row.id, 'podName', selectedPod.name);
                        handleInputChange(row.id, 'podBU', selectedPod.bu);
                        handleInputChange(row.id, 'podLead', selectedPod.lead);
                        handleInputChange(row.id, 'podDescription', selectedPod.description);
                      }
                    }}
                    className="w-full bg-transparent text-sm font-bold text-slate-700 px-2 py-1 rounded focus:bg-white focus:ring-1 focus:ring-indigo-500 outline-none appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select POD...</option>
                    {pods.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </td>
                <td style={{ width: columnWidths.podLead }} className="px-2 py-2 border-r border-slate-100">
                  <div className="px-2 py-1 text-xs text-slate-500">
                    {row.podLead || 'N/A'}
                  </div>
                </td>
                <td style={{ width: columnWidths.podDescription }} className="px-2 py-2 border-r border-slate-100">
                  <div className="px-2 py-1 text-[10px] text-slate-400 italic truncate" title={row.podDescription}>
                    {row.podDescription || '-'}
                  </div>
                </td>
                {sprintHeaders.map(q => q.months.map(m => m.sprints.map(s => (
                  <td key={s.id} className="px-1 py-2 border-r border-slate-100">
                    <input 
                      type="text"
                      value={row.sprintAllocations[s.id] || ''}
                      onChange={(e) => handleInputChange(row.id, `sprint-${s.id}`, e.target.value)}
                      className={cn(
                        "w-full text-center text-xs font-bold py-1 rounded transition-all outline-none",
                        row.sprintAllocations[s.id] ? "bg-indigo-50 text-indigo-700" : "bg-transparent text-slate-300 hover:bg-slate-100"
                      )}
                      placeholder="-"
                    />
                  </td>
                ))).flat()).flat()}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Controls */}
      <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-indigo-500 rounded-sm" />
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Active Allocation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-200 rounded-sm" />
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">No Commitment</span>
          </div>
          <div className="ml-4 px-3 py-1 bg-white border border-slate-200 rounded-full">
            <span className="text-[10px] font-black text-slate-500 uppercase">Showing {filteredRows.length} Allocation Rows</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {showSuccess && (
            <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold animate-in fade-in slide-in-from-right-4">
              <Check size={16} />
              <span>Changes Saved Successfully</span>
            </div>
          )}
          
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
          
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={cn(
              "flex items-center gap-2 px-8 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition-all",
              isSaving ? "bg-slate-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-95"
            )}
          >
            {isSaving ? (
              <Activity size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            <span>{isSaving ? 'Saving Changes...' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
