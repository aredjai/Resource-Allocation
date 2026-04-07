/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
  Line,
  Cell,
  PieChart,
  Pie,
  ReferenceLine,
} from 'recharts';
import Papa from 'papaparse';
import { AllocationDetails } from './components/AllocationDetails';
import { PodSetup } from './components/PodSetup';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp,
  PieChart as PieChartIcon,
  Layers,
  Zap,
  Activity,
  UserPlus,
  ArrowUpRight,
  Upload,
  Download,
  FileText,
  RotateCcw,
  Edit,
  Settings
} from 'lucide-react';
import { RESOURCES as INITIAL_RESOURCES, PROJECTS as INITIAL_PROJECTS, SPRINTS, PODS as INITIAL_PODS, QUARTERS, Resource, POD, Quarter } from './data';
import { supabaseService } from './services/supabaseService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [view, setView] = useState<'pod' | 'department' | 'resource' | 'allocation-details'>('pod');
  const [selectedQuarterIds, setSelectedQuarterIds] = useState<string[]>(['2026-Q2', '2026-Q3', '2026-Q4']);
  const [selectedBU, setSelectedBU] = useState<string>('All');
  
  // Dynamic Data State
  const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES);
  const [pods, setPods] = useState<POD[]>(INITIAL_PODS);
  const [isUploading, setIsUploading] = useState(false);
  const [isPodSetupOpen, setIsPodSetupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from Supabase on mount
  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
      showNotification("Supabase credentials missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Settings.", "error");
    }

    const loadData = async () => {
      try {
        const [dbPods, dbResources] = await Promise.all([
          supabaseService.fetchPods(),
          supabaseService.fetchResources()
        ]);
        
        if (dbPods.length > 0) {
          setPods(dbPods);
          setResources(dbResources);
          console.log("Data loaded from Supabase successfully.");
        } else {
          console.log("No data found in Supabase, using local defaults.");
          setPods(INITIAL_PODS);
          setResources(INITIAL_RESOURCES);
        }
      } catch (error) {
        console.error("Failed to load data from Supabase:", error);
        showNotification("Failed to connect to database. Using local defaults.", "error");
        setPods(INITIAL_PODS);
        setResources(INITIAL_RESOURCES);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Filtered Resources based on BU
  const filteredResources = useMemo(() => {
    if (selectedBU === 'All') return resources;
    // A resource is "in" a BU if they have any allocation to a POD in that BU
    return resources.filter(r => 
      r.allocations.some(a => {
        const pod = pods.find(p => p.id === a.podId);
        return pod?.bu === selectedBU;
      })
    );
  }, [resources, pods, selectedBU]);

  // Filtered PODs based on BU
  const filteredPods = useMemo(() => {
    if (selectedBU === 'All') return pods;
    return pods.filter(p => p.bu === selectedBU);
  }, [pods, selectedBU]);

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const resetToSeedData = async () => {
    console.log("Resetting to seed data...");
    setIsLoading(true);
    try {
      await supabaseService.resetData(INITIAL_PODS, INITIAL_RESOURCES);
      setResources(INITIAL_RESOURCES);
      setPods(INITIAL_PODS);
      setSelectedBU('All');
      setSelectedQuarterIds(['2026-Q2', '2026-Q3', '2026-Q4']);
      showNotification("Database reset to seed data successfully.", "success");
    } catch (error) {
      console.error("Reset error:", error);
      showNotification("Failed to reset database. Check console for details.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedQuarters = useMemo(() => {
    return QUARTERS.filter(q => selectedQuarterIds.includes(q.id));
  }, [selectedQuarterIds]);

  // Template Download Logic
  const downloadTemplate = () => {
    // Include all sprints for the planning horizon
    const planningSprints = SPRINTS.filter(s => 
      ['2026-Q2', '2026-Q3', '2026-Q4', '2027-Q1'].includes(s.quarter)
    ).map(s => s.id);

    const headers = [
      'Resource Name', 'Resource Department', 'Resource Role', 'Project Name', 'POD Name', 'POD BU', 'POD Lead', 'POD Description',
      ...planningSprints.map(id => `Sprint ${id} %`)
    ];
    
    const csvRows: string[][] = [];

    resources.forEach(resource => {
      if (resource.allocations.length === 0) {
        // Include resources with no allocations
        const row = [
          resource.name, resource.department, resource.role, 'Bench', 'Bench', 'IT', 'N/A', 'Unallocated resource capacity',
          ...planningSprints.map(() => '0')
        ];
        csvRows.push(row);
      } else {
        resource.allocations.forEach(alloc => {
          const pod = pods.find(p => p.id === alloc.podId);
          const sprintMap: { [sprintId: string]: number } = {};
          if (alloc.sprintAllocations) {
            alloc.sprintAllocations.forEach(sa => {
              sprintMap[sa.sprintId] = sa.percentage;
            });
          }

          const row = [
            resource.name, 
            resource.department, 
            resource.role, 
            alloc.projectName || pod?.name || 'Unknown', 
            pod?.name || 'Unknown', 
            pod?.bu || 'IT',
            pod?.lead || 'TBD',
            pod?.description || '',
            ...planningSprints.map(sId => (sprintMap[sId] || 0).toString())
          ];
          csvRows.push(row);
        });
      }
    });

    const csvContent = [headers, ...csvRows].map(e => e.map(val => `"${(val || '').toString().replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `resource_planning_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Upload & Processing Logic
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as any[];
        
        // 1. Extract unique PODs
        const newPodsMap = new Map<string, POD>();
        data.forEach(row => {
          const podName = row['POD Name'];
          const bu = row['POD BU'] as any;
          if (podName && !newPodsMap.has(podName)) {
            newPodsMap.set(podName, {
              id: `pod-${podName.toLowerCase().replace(/\s+/g, '-')}`,
              name: podName,
              bu: bu || 'IT',
              lead: row['POD Lead'] || 'TBD',
              description: row['POD Description'] || ''
            });
          }
        });
        
        // Add Bench POD if not present
        if (!newPodsMap.has('Bench')) {
          newPodsMap.set('Bench', { id: 'pod-bench', name: 'Bench', bu: 'IT', lead: 'N/A', description: 'Unallocated resource capacity' });
        }
        const newPods = Array.from(newPodsMap.values());

        // 2. Extract unique Resources and their allocations
        const resourcesMap = new Map<string, Resource>();
        data.forEach(row => {
          const resName = row['Resource Name'];
          if (!resName) return;

          if (!resourcesMap.has(resName)) {
            resourcesMap.set(resName, {
              id: `res-${resName.toLowerCase().replace(/\s+/g, '-')}`,
              name: resName,
              department: row['Resource Department'] || 'Other',
              role: row['Resource Role'] || 'Contributor',
              allocations: []
            });
          }

          const resource = resourcesMap.get(resName)!;
          const podName = row['POD Name'];
          const projectName = row['Project Name'] || podName;
          const pod = newPods.find(p => p.name === podName);

          if (pod) {
            // Find all sprint columns
            const sprintAllocations: { sprintId: string; percentage: number }[] = [];
            Object.keys(row).forEach(key => {
              if (key.startsWith('Sprint ') && key.endsWith(' %')) {
                const sprintId = key.replace('Sprint ', '').replace(' %', '');
                const percentage = parseFloat(row[key]) || 0;
                if (percentage > 0) {
                  sprintAllocations.push({ sprintId, percentage });
                }
              }
            });

            if (sprintAllocations.length > 0) {
              resource.allocations.push({
                projectId: `proj-${projectName.toLowerCase().replace(/\s+/g, '-')}`,
                projectName: projectName,
                podId: pod.id,
                sprintAllocations
              });
            }
          }
        });

        setPods(newPods);
        setResources(Array.from(resourcesMap.values()));
        
        // Persist to Supabase
        const persistImport = async () => {
          try {
            // Use resetData to clear existing data and replace with new data
            await supabaseService.resetData(newPods, Array.from(resourcesMap.values()));
            showNotification("Data imported and database replaced successfully!", "success");
          } catch (error) {
            console.error("Persistence error:", error);
            showNotification("Data imported locally but failed to save to database.", "error");
          } finally {
            setIsUploading(false);
          }
        };
        persistImport();
      },
      error: (error) => {
        console.error("CSV Parsing Error:", error);
        setIsUploading(false);
        showNotification("Failed to parse CSV. Please ensure you are using the correct template.", "error");
      }
    });
  };

  const selectedPeriodLabel = useMemo(() => {
    if (selectedQuarterIds.length === QUARTERS.length) return "All Quarters";
    if (selectedQuarterIds.length === 0) return "No Period Selected";
    if (selectedQuarterIds.length === 1) return selectedQuarters[0].name;
    return `${selectedQuarters[0].name} + ${selectedQuarterIds.length - 1} more`;
  }, [selectedQuarterIds, selectedQuarters]);

  // Helper to calculate average allocation across selected quarters
  const getResourceAllocationInPeriod = (resource: Resource, quarters: Quarter[]) => {
    if (quarters.length === 0) return 0;
    
    const totalAlloc = quarters.reduce((qAcc, quarter) => {
      // Get all sprints belonging to this quarter's ID (e.g. 2026-Q1)
      const qSprints = SPRINTS.filter(s => s.quarter === quarter.id);
      
      const qAlloc = resource.allocations.reduce((acc, alloc) => {
        if (alloc.sprintAllocations && alloc.sprintAllocations.length > 0) {
          // Sprint-level logic
          const sprintSum = alloc.sprintAllocations
            .filter(sa => qSprints.some(qs => qs.id === sa.sprintId))
            .reduce((sum, sa) => sum + (sa.percentage || 0), 0);
          return acc + (qSprints.length > 0 ? sprintSum / qSprints.length : 0);
        } else {
          // Legacy date-based logic
          const qStart = new Date(quarter.startDate).getTime();
          const qEnd = new Date(quarter.endDate).getTime();
          const aStart = new Date(alloc.startDate || '').getTime();
          const aEnd = new Date(alloc.endDate || '').getTime();
          if (aStart <= qEnd && aEnd >= qStart) {
            return acc + (alloc.percentage || 0);
          }
        }
        return acc;
      }, 0);
      return qAcc + qAlloc;
    }, 0);

    const result = totalAlloc / quarters.length;
    return isNaN(result) ? 0 : result;
  };

  // Helper to get specific project allocation averaged across selected quarters
  const getProjectAllocationInPeriod = (resource: Resource, projectId: string, quarters: Quarter[]) => {
    if (quarters.length === 0) return 0;

    const totalAlloc = quarters.reduce((qAcc, quarter) => {
      const qSprints = SPRINTS.filter(s => s.quarter === quarter.id);

      const qAlloc = resource.allocations
        .filter(a => a.projectId === projectId)
        .reduce((acc, alloc) => {
          if (alloc.sprintAllocations && alloc.sprintAllocations.length > 0) {
            const sprintSum = alloc.sprintAllocations
              .filter(sa => qSprints.some(qs => qs.id === sa.sprintId))
              .reduce((sum, sa) => sum + (sa.percentage || 0), 0);
            return acc + (qSprints.length > 0 ? sprintSum / qSprints.length : 0);
          } else {
            const qStart = new Date(quarter.startDate).getTime();
            const qEnd = new Date(quarter.endDate).getTime();
            const aStart = new Date(alloc.startDate || '').getTime();
            const aEnd = new Date(alloc.endDate || '').getTime();
            if (aStart <= qEnd && aEnd >= qStart) {
              return acc + (alloc.percentage || 0);
            }
          }
          return acc;
        }, 0);
      return qAcc + qAlloc;
    }, 0);

    const result = totalAlloc / quarters.length;
    return isNaN(result) ? 0 : result;
  };

  // Calculate POD metrics for selected period
  const podMetrics = useMemo(() => {
    return filteredPods.map(pod => {
      let totalFTE = 0;
      const uniqueResources = new Set<string>();
      let hasOverAllocatedResource = false;

      resources.forEach(resource => {
        // Collect all allocations for this resource that belong to this POD
        const relevantAllocations = resource.allocations.filter(a => a.podId === pod.id);

        if (relevantAllocations.length > 0) {
          // Calculate total allocation for this resource across ALL pods in the selected period
          const totalResourceAlloc = getResourceAllocationInPeriod(resource, selectedQuarters);
          if (totalResourceAlloc > 100) hasOverAllocatedResource = true;

          // Calculate average allocation for these relevant projects across selected quarters
          const avgAlloc = selectedQuarters.length === 0 ? 0 : selectedQuarters.reduce((qAcc, quarter) => {
            const qSprints = SPRINTS.filter(s => s.quarter === quarter.id);
            const qStart = new Date(quarter.startDate).getTime();
            const qEnd = new Date(quarter.endDate).getTime();
            
            const qAlloc = relevantAllocations.reduce((acc, alloc) => {
              if (alloc.sprintAllocations && alloc.sprintAllocations.length > 0) {
                const sprintSum = alloc.sprintAllocations
                  .filter(sa => qSprints.some(qs => qs.id === sa.sprintId))
                  .reduce((sum, sa) => sum + sa.percentage, 0);
                return acc + (qSprints.length > 0 ? sprintSum / qSprints.length : 0);
              } else {
                const aStart = new Date(alloc.startDate || '').getTime();
                const aEnd = new Date(alloc.endDate || '').getTime();
                if (aStart <= qEnd && aEnd >= qStart) return acc + (alloc.percentage || 0);
              }
              return acc;
            }, 0);
            
            return qAcc + qAlloc;
          }, 0) / selectedQuarters.length;

          if (avgAlloc > 0) {
            uniqueResources.add(resource.id);
            totalFTE += avgAlloc / 100;
          }
        }
      });

      return {
        ...pod,
        fte: isNaN(totalFTE) ? 0 : parseFloat(totalFTE.toFixed(2)),
        headcount: uniqueResources.size,
        utilization: pod.id === 'pod-bench' ? 0 : Math.min(100, Math.round(((isNaN(totalFTE) ? 0 : totalFTE) / (uniqueResources.size || 1)) * 100)),
        hasRisk: hasOverAllocatedResource
      };
    });
  }, [selectedQuarters, filteredPods, resources]);

  // Calculate Bench Strength for selected period
  const benchStrength = useMemo(() => {
    const totalHeadcount = filteredResources.length;
    const totalAllocatedFTE = filteredResources.reduce((acc, r) => {
      const alloc = getResourceAllocationInPeriod(r, selectedQuarters);
      return acc + (alloc / 100);
    }, 0);
    
    const benchFTE = Math.max(0, totalHeadcount - totalAllocatedFTE);
    const benchPct = totalHeadcount > 0 ? (benchFTE / totalHeadcount) * 100 : 0;

    return {
      totalHeadcount,
      allocatedFTE: isNaN(totalAllocatedFTE) ? 0 : parseFloat(totalAllocatedFTE.toFixed(1)),
      benchFTE: isNaN(benchFTE) ? 0 : parseFloat(benchFTE.toFixed(1)),
      benchPct: isNaN(benchPct) ? 0 : Math.round(benchPct)
    };
  }, [selectedQuarters, filteredResources]);

  // Trend data for bench strength across all quarters with team breakdowns
  const trendData = useMemo(() => {
    return QUARTERS.map(q => {
      const calculateBench = (team?: string) => {
        const teamResources = team ? filteredResources.filter(r => r.department === team) : filteredResources;
        const totalHeadcount = teamResources.length;
        const totalAllocatedFTE = teamResources.reduce((acc, r) => {
          const qSprints = SPRINTS.filter(s => s.quarter === q.id);
          
          const alloc = r.allocations.reduce((aAcc, a) => {
            if (a.sprintAllocations && a.sprintAllocations.length > 0) {
              const sprintSum = a.sprintAllocations
                .filter(sa => qSprints.some(qs => qs.id === sa.sprintId))
                .reduce((sum, sa) => sum + sa.percentage, 0);
              return aAcc + (qSprints.length > 0 ? sprintSum / qSprints.length : 0);
            } else {
              const qStart = new Date(q.startDate).getTime();
              const qEnd = new Date(q.endDate).getTime();
              const aStart = new Date(a.startDate || '').getTime();
              const aEnd = new Date(a.endDate || '').getTime();
              if (aStart <= qEnd && aEnd >= qStart) return aAcc + (a.percentage || 0);
            }
            return aAcc;
          }, 0);
          return acc + (alloc / 100);
        }, 0);
        const result = parseFloat(Math.max(0, totalHeadcount - (isNaN(totalAllocatedFTE) ? 0 : totalAllocatedFTE)).toFixed(1));
        return isNaN(result) ? 0 : result;
      };

      return {
        name: q.name,
        all: calculateBench(),
        ede: calculateBench('EDE'),
        apd: calculateBench('APD'),
        aps: calculateBench('APS'),
      };
    });
  }, [filteredResources]);

  // Departmental Data for selected period
  const deptData = useMemo(() => {
    const departments = ['EDE', 'APD', 'APS'];
    return departments.map(dept => {
      const deptResources = resources.filter(r => r.department === dept);
      const totalFTE = deptResources.length;
      const allocatedFTE = deptResources.reduce((acc, r) => {
        const alloc = getResourceAllocationInPeriod(r, selectedQuarters);
        return acc + (alloc / 100);
      }, 0);
      
      return {
        name: dept,
        total: totalFTE,
        allocated: isNaN(allocatedFTE) ? 0 : parseFloat(allocatedFTE.toFixed(1)),
        bench: isNaN(totalFTE - allocatedFTE) ? 0 : parseFloat((totalFTE - allocatedFTE).toFixed(1)),
        utilization: totalFTE > 0 ? Math.round(((isNaN(allocatedFTE) ? 0 : allocatedFTE) / totalFTE) * 100) : 0
      };
    });
  }, [selectedQuarters, resources]);

  // Calculate per-team averages for the selected period
  const teamBenchMetrics = useMemo(() => {
    const teams = ['EDE', 'APD', 'APS'];
    if (selectedQuarters.length === 0) return [];
    
    return teams.map(teamName => {
      const teamResources = resources.filter(r => r.department === teamName);
      const totalHeadcount = teamResources.length;
      const allocatedFTE = getResourceAllocationInPeriod({ allocations: teamResources.flatMap(r => r.allocations) } as any, selectedQuarters);
      
      const benchFTE = Math.max(0, totalHeadcount - (isNaN(allocatedFTE) ? 0 : allocatedFTE));
      
      // Find the best quarter for this team specifically
      const bestQuarter = selectedQuarters.map(q => {
        const qSprints = SPRINTS.filter(s => s.quarter === q.id);
        
        const qAlloc = teamResources.reduce((acc, r) => {
          const rAlloc = r.allocations.reduce((aAcc, a) => {
            if (a.sprintAllocations && a.sprintAllocations.length > 0) {
              const sprintSum = a.sprintAllocations
                .filter(sa => qSprints.some(qs => qs.id === sa.sprintId))
                .reduce((sum, sa) => sum + (sa.percentage || 0), 0);
              return aAcc + (qSprints.length > 0 ? sprintSum / qSprints.length : 0);
            } else {
              const qStart = new Date(q.startDate).getTime();
              const qEnd = new Date(q.endDate).getTime();
              const aStart = new Date(a.startDate || '').getTime();
              const aEnd = new Date(a.endDate || '').getTime();
              if (aStart <= qEnd && aEnd >= qStart) return aAcc + (a.percentage || 0);
            }
            return aAcc;
          }, 0);
          return acc + (rAlloc / 100);
        }, 0);
        return { name: q.name, bench: totalHeadcount - qAlloc };
      }).sort((a, b) => b.bench - a.bench)[0];

      return {
        team: teamName,
        avgBenchFte: isNaN(benchFTE) ? 0 : parseFloat(benchFTE.toFixed(1)),
        benchPct: totalHeadcount > 0 ? Math.round(((isNaN(benchFTE) ? 0 : benchFTE) / totalHeadcount) * 100) : 0,
        bestQuarter: bestQuarter?.name || 'N/A',
        bestQuarterBench: bestQuarter ? parseFloat((isNaN(bestQuarter.bench) ? 0 : bestQuarter.bench).toFixed(1)) : 0
      };
    });
  }, [selectedQuarters, resources]);

  const topCapacityTeam = useMemo(() => 
    teamBenchMetrics.length > 0 ? [...teamBenchMetrics].sort((a, b) => b.avgBenchFte - a.avgBenchFte)[0] : null
  , [teamBenchMetrics]);

  const constrainedTeam = useMemo(() => 
    teamBenchMetrics.length > 0 ? [...teamBenchMetrics].sort((a, b) => a.avgBenchFte - b.avgBenchFte)[0] : null
  , [teamBenchMetrics]);

  // Calculate Bench Resource Availability for the selected period
  const benchResources = useMemo(() => {
    return resources
      .map(r => ({
        ...r,
        allocated: getResourceAllocationInPeriod(r, selectedQuarters)
      }))
      .filter(r => r.allocated !== 100) // Show both under-allocated (bench) and over-allocated
      .sort((a, b) => a.allocated - b.allocated);
  }, [resources, selectedQuarters, selectedPeriodLabel]);

  const toggleQuarter = (id: string) => {
    setSelectedQuarterIds(prev => 
      prev.includes(id) 
        ? prev.filter(qId => qId !== id) 
        : [...prev, id]
    );
  };

  const selectAllQuarters = () => {
    setSelectedQuarterIds(QUARTERS.map(q => q.id));
  };

  const selectNoneQuarters = () => {
    setSelectedQuarterIds([]);
  };

  const TrendChart = ({ dataKey, title, color }: { dataKey: string, title: string, color: string }) => (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">{title}</h3>
      <div className="h-[120px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`color-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.2}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 8, fontWeight: 600, fill: '#94a3b8' }}
              interval={0}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 8, fontWeight: 600, fill: '#94a3b8' }}
            />
            <Tooltip 
              contentStyle={{ fontSize: 10, borderRadius: 8, border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              strokeWidth={2}
              fillOpacity={1} 
              fill={`url(#color-${dataKey})`} 
              activeDot={{ r: 4, strokeWidth: 0, fill: color }}
            />
            {selectedQuarters.map(q => (
              <ReferenceLine 
                key={q.id}
                x={q.name} 
                stroke={color} 
                strokeDasharray="3 3" 
                strokeOpacity={0.5}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Notifications */}
      {notification && (
        <div className={cn(
          "fixed top-4 right-4 z-[200] px-6 py-3 rounded-xl shadow-2xl border animate-in fade-in slide-in-from-top-4 duration-300",
          notification.type === 'success' ? "bg-emerald-50 border-emerald-200 text-emerald-800" :
          notification.type === 'error' ? "bg-rose-50 border-rose-200 text-rose-800" :
          "bg-indigo-50 border-indigo-200 text-indigo-800"
        )}>
          <div className="flex items-center gap-3">
            {notification.type === 'success' && <CheckCircle2 size={18} />}
            {notification.type === 'error' && <AlertCircle size={18} />}
            {notification.type === 'info' && <Activity size={18} />}
            <span className="text-sm font-bold">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-6 bg-indigo-500 rounded-full" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Capacity & Bench Strength Guardian</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">CapGuard</h1>
          <p className="text-sm text-slate-500 max-w-2xl">
            Strategic planning for <span className="text-indigo-600 font-semibold">"When can we start the next thing?"</span> and <span className="text-indigo-600 font-semibold">"Who is available?"</span>
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-[10px] font-bold uppercase text-slate-400 mb-0.5">Average Bench Strength</div>
            <div className="text-2xl font-bold text-indigo-600">{benchStrength.benchPct}% <span className="text-sm font-medium text-slate-400">Available</span></div>
          </div>
        </div>
      </header>

      {/* Shared IT Teams Bench Strength Section */}
      <section className="px-8 pt-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <Activity className="text-indigo-500" size={20} />
            <h2 className="text-xl font-bold text-slate-800">Shared IT Teams Bench Strength</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {['All', 'MSD', 'MLD', 'Vylla', 'CMH', 'IT'].map(bu => (
                <button
                  key={bu}
                  onClick={() => setSelectedBU(bu)}
                  className={cn(
                    "px-4 py-1.5 text-[10px] font-bold uppercase transition-all rounded-lg",
                    selectedBU === bu 
                      ? "bg-white text-indigo-600 shadow-sm" 
                      : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  {bu}
                </button>
              ))}
            </div>
            <div className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
              Live Trend Analysis
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <TrendChart dataKey="all" title="Bench Strength (ALL IT)" color="#6366f1" />
          <TrendChart dataKey="ede" title="Bench Strength EDE" color="#0ea5e9" />
          <TrendChart dataKey="apd" title="Bench Strength APD" color="#8b5cf6" />
          <TrendChart dataKey="aps" title="Bench Strength APS" color="#f59e0b" />
        </div>
      </section>

      {/* Period Selection Section Break */}
      <section className="px-8 mt-12 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <Calendar size={24} />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-800">POD Planning Horizon</h2>
              <p className="text-xs text-slate-400 font-medium max-w-md">Select one or more quarters to analyze average POD allocations and bench capacity across the chosen timeframe.</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex bg-slate-100 p-1 rounded-xl mr-2">
              <button 
                onClick={selectAllQuarters}
                className={cn(
                  "px-3 py-1.5 text-[10px] font-bold uppercase transition-colors rounded-lg",
                  selectedQuarterIds.length === QUARTERS.length ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
                )}
              >
                All
              </button>
              <button 
                onClick={selectNoneQuarters}
                className={cn(
                  "px-3 py-1.5 text-[10px] font-bold uppercase transition-colors rounded-lg",
                  selectedQuarterIds.length === 0 ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
                )}
              >
                None
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {QUARTERS.map(q => (
                <button
                  key={q.id}
                  onClick={() => toggleQuarter(q.id)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                    selectedQuarterIds.includes(q.id)
                      ? "bg-indigo-500 text-white border-indigo-500 shadow-md shadow-indigo-100"
                      : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                  )}
                >
                  {q.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Split Layout */}
      <main className="grid grid-cols-12 border-t border-slate-200 min-h-[800px] bg-slate-50/30">
        
        {/* Navigation & Control Sidebar (The "Control Rail") */}
        <aside className="col-span-12 lg:col-span-3 bg-slate-100/40 border-b lg:border-b-0 lg:border-r border-slate-200 p-8 shadow-[inset_-1px_0_0_rgba(0,0,0,0.02)]">
          <div className="flex flex-col h-full sticky top-8 space-y-8 min-h-[calc(100vh-160px)]">
            <div className="space-y-6">
              <div className="space-y-1 mb-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Navigation</h3>
              </div>
              <section className="bg-white rounded-xl border border-slate-200 p-2 shadow-sm">
                <div className="space-y-1">
                  {[
                    { id: 'pod', label: 'POD Distribution', icon: Layers },
                    { id: 'department', label: 'Departmental Heatmap', icon: Briefcase },
                    { id: 'resource', label: 'Bench Resources', icon: UserPlus },
                    { id: 'allocation-details', label: 'Allocation Details', icon: Edit },
                  ].map(item => (
                    <button 
                      key={item.id}
                      onClick={() => setView(item.id as any)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 text-xs font-bold uppercase transition-all rounded-lg",
                        view === item.id 
                          ? "bg-indigo-50 text-indigo-600" 
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                      )}
                    >
                      <item.icon size={18} className={cn(view === item.id ? "text-indigo-600" : "text-slate-400")} />
                      {item.label}
                    </button>
                  ))}
                </div>
              </section>
            </div>

            {/* Bench Strength Card */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Average Bench ({selectedPeriodLabel})</h2>
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div className="text-5xl font-bold tracking-tighter text-slate-800">{benchStrength.benchFTE}</div>
                  <div className="text-right pb-1">
                    <div className="text-[10px] font-bold uppercase text-slate-400">FTE on Bench</div>
                    <div className="text-[10px] font-bold uppercase text-emerald-600 flex items-center gap-1 justify-end">
                      <ArrowUpRight size={10} /> {benchStrength.benchPct > 20 ? 'High Strength' : 'Low Strength'}
                    </div>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 w-full rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 transition-all duration-1000 rounded-full"
                    style={{ width: `${benchStrength.benchPct}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div>
                    <div className="text-xl font-bold">{benchStrength.allocatedFTE}</div>
                    <div className="text-[9px] font-bold uppercase text-slate-400">Allocated FTE</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold">{benchStrength.totalHeadcount}</div>
                    <div className="text-[9px] font-bold uppercase text-slate-400">Total Headcount</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Strategic Insight Card */}
            <section className="bg-white rounded-xl border-2 border-indigo-500 p-6 shadow-xl shadow-indigo-100/50 relative overflow-hidden">
              <div className="absolute -top-6 -right-6 opacity-[0.03] pointer-events-none">
                <Zap size={120} className="text-indigo-900" />
              </div>
              
              <div className="flex items-center gap-2 mb-6 relative z-10">
                <div className="bg-indigo-600 p-1.5 rounded-lg shadow-sm">
                  <Zap size={16} className="text-white" />
                </div>
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">Strategic Insight</h2>
              </div>
              
              {topCapacityTeam && constrainedTeam ? (
                <div className="space-y-6 relative z-10">
                  {/* Primary Opportunity */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase rounded tracking-wider">Primary Opportunity</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800 leading-tight">
                      {topCapacityTeam.avgBenchFte > 1.0 
                        ? <><span className="text-indigo-600 underline decoration-indigo-200 underline-offset-4">{topCapacityTeam.team} Team</span> has the highest availability with <span className="text-indigo-600">{topCapacityTeam.avgBenchFte} FTE</span> available.</>
                        : "Resources are highly utilized across all teams. Capacity is limited."}
                    </p>
                  </div>

                  {/* Resource Capacity Constraint Risk */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[9px] font-black uppercase rounded tracking-wider">Capacity Risk</span>
                    </div>
                    <p className="text-xs font-bold text-slate-600 leading-tight">
                      {constrainedTeam.avgBenchFte < 0.5 
                        ? <><span className="text-rose-600">{constrainedTeam.team}</span> is at critical capacity risk. Any new project will require resource trade-offs.</>
                        : "No immediate critical capacity risks identified across departments."}
                    </p>
                  </div>

                  {/* Recommendation */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2.5">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={14} className="text-indigo-500" />
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">When can we start?</span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-600 font-semibold">
                      {topCapacityTeam.avgBenchFte > 2 
                        ? `The next major initiative can start in ${topCapacityTeam.bestQuarter} using ${topCapacityTeam.team} capacity (${topCapacityTeam.bestQuarterBench} FTE peak).`
                        : topCapacityTeam.avgBenchFte > 0.5
                        ? `Small workstreams can be absorbed by ${topCapacityTeam.team} starting now.`
                        : `New work is blocked until ${topCapacityTeam.bestQuarter} when minor capacity opens up.`}
                    </p>
                  </div>

                  {/* Team Capacity Matrix */}
                  <div className="pt-5 border-t border-slate-100 space-y-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                      <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Team Capacity Matrix</div>
                    </div>
                    
                    <div className="space-y-3">
                      {teamBenchMetrics.map(team => {
                        const canHigh = team.bestQuarterBench >= 2.0;
                        const canLow = team.bestQuarterBench >= 0.5;
                        
                        return (
                          <div key={team.team} className="bg-slate-50/50 rounded-xl border border-slate-100 p-3 hover:bg-white hover:shadow-sm transition-all group">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-black text-slate-800 tracking-tight">{team.team} Team</span>
                              <div className="flex gap-1">
                                {canHigh ? (
                                  <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 text-[8px] font-black uppercase rounded">High Cap</span>
                                ) : canLow ? (
                                  <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[8px] font-black uppercase rounded">Low Cap</span>
                                ) : (
                                  <span className="px-1.5 py-0.5 bg-rose-100 text-rose-700 text-[8px] font-black uppercase rounded">At Capacity</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <div className="text-[9px] font-bold text-slate-400 uppercase">Best Window</div>
                                <div className="text-[11px] font-bold text-slate-700">{team.bestQuarter}</div>
                              </div>
                              <div className="text-right space-y-0.5">
                                <div className="text-[9px] font-bold text-slate-400 uppercase">Peak Bench</div>
                                <div className="text-[11px] font-black text-indigo-600">{team.bestQuarterBench} FTE</div>
                              </div>
                            </div>
                            
                            {/* Capacity Indicator Bar */}
                            <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={cn(
                                  "h-full transition-all duration-500",
                                  canHigh ? "bg-indigo-500" : canLow ? "bg-amber-500" : "bg-rose-500"
                                )}
                                style={{ width: `${Math.min(100, (team.bestQuarterBench / 3) * 100)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-slate-100">
                    <Calendar size={20} className="text-slate-300" />
                  </div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Select Planning Horizon</p>
                  <p className="text-[10px] text-slate-400 italic">Insights will generate based on chosen quarters.</p>
                </div>
              )}
            </section>

            {/* Data Management Section - Minimalist & Bottom Aligned */}
            <section className="mt-auto pt-6 border-t border-slate-200 flex flex-col gap-3">
              <button 
                onClick={resetToSeedData}
                className="flex items-center gap-2 text-[9px] font-bold uppercase text-slate-400 hover:text-indigo-600 transition-colors group"
              >
                <RotateCcw size={12} className="text-slate-300 group-hover:text-indigo-500 transition-transform group-hover:rotate-[-45deg]" />
                <span>Restore Seed Data</span>
              </button>

              <button 
                onClick={downloadTemplate}
                className="flex items-center gap-2 text-[9px] font-bold uppercase text-slate-400 hover:text-indigo-600 transition-colors group"
              >
                <Download size={12} className="text-slate-300 group-hover:text-indigo-500 transition-transform group-hover:-translate-y-0.5" />
                <span>Get Template</span>
              </button>

              <label className="flex items-center gap-2 text-[9px] font-bold uppercase text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer group">
                {isUploading ? (
                  <Activity size={12} className="text-indigo-500 animate-spin" />
                ) : (
                  <Upload size={12} className="text-slate-300 group-hover:text-indigo-500 transition-transform group-hover:-translate-y-0.5" />
                )}
                <span>
                  {isUploading ? 'Processing...' : 'Batch Upload'}
                </span>
                <input 
                  type="file" 
                  accept=".csv" 
                  className="hidden" 
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </label>

              <button 
                onClick={() => setIsPodSetupOpen(true)}
                className="flex items-center gap-2 text-[9px] font-bold uppercase text-slate-400 hover:text-indigo-600 transition-colors group"
              >
                <Settings size={12} className="text-slate-300 group-hover:text-indigo-500 transition-transform group-hover:rotate-90" />
                <span>POD Setup</span>
              </button>
            </section>
          </div>
        </aside>

        {/* Dynamic Content Area (The "Stage") */}
        <div className="col-span-12 lg:col-span-9 p-10 space-y-10 bg-slate-50/40 relative">
          {/* Subtle background pattern for the stage */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px]" />
          
          <div className="relative z-10">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Database...</p>
              </div>
            ) : view === 'allocation-details' ? (
              <AllocationDetails 
                resources={resources}
                pods={pods}
                onSave={async (updatedResources, updatedPods) => {
                  try {
                    await Promise.all([
                      supabaseService.saveResources(updatedResources),
                      supabaseService.savePods(updatedPods)
                    ]);
                    setResources(updatedResources);
                    setPods(updatedPods);
                  } catch (error) {
                    console.error("Save error:", error);
                    alert("Failed to save changes to database. Please check your Supabase configuration.");
                  }
                }}
                onClose={() => setView('pod')}
              />
            ) : view === 'pod' ? (
              <div className="space-y-10">
                {/* Section Header for PODs */}
                <div className="flex items-end justify-between border-b border-slate-200 pb-6">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">POD Distribution</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Resource allocation across active PODs</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Active PODs</div>
                      <div className="text-xl font-black text-indigo-600">
                        {podMetrics.filter(p => p.id !== 'pod-bench').length}
                      </div>
                    </div>
                  </div>
                </div>

                {/* POD Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {podMetrics.filter(p => p.id !== 'pod-bench').map(pod => (
                    <div key={pod.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start gap-3">
                        <div>
                          <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-500 transition-colors">{pod.name}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold uppercase text-slate-400">{pod.bu}</span>
                            {pod.hasRisk && (
                              <span className="flex items-center gap-1 text-[8px] font-black text-rose-500 uppercase bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">
                                <AlertCircle size={10} /> Contention Risk
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-slate-800">{pod.fte}</div>
                        <div className="text-[9px] font-bold uppercase text-slate-400">FTE</div>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mb-4 italic leading-relaxed">
                      {pod.description || "No description provided for this POD."}
                    </p>
                    <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-bold uppercase">
                        <span className="text-slate-500">Utilization</span>
                        <span className="text-slate-800">{pod.utilization}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 w-full rounded-full">
                        <div 
                          className="h-full bg-indigo-500 rounded-full transition-all"
                          style={{ width: `${pod.utilization}%` }}
                        />
                      </div>
                      <div className="pt-4 flex justify-between items-center border-t border-slate-50">
                        <span className="text-[10px] font-medium text-slate-400">Lead: {pod.lead}</span>
                        <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">{pod.headcount} Resources</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* POD Allocation Chart */}
              <section className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-slate-800">POD Resource Distribution ({selectedPeriodLabel})</h2>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-indigo-500 rounded-sm" />
                      <span className="text-[10px] font-bold uppercase text-slate-400">Active POD</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-amber-500 rounded-sm" />
                      <span className="text-[10px] font-bold uppercase text-slate-400">Bench</span>
                    </div>
                  </div>
                </div>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={podMetrics} layout="vertical" margin={{ left: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                      <XAxis type="number" hide />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }}
                        width={150}
                      />
                      <Tooltip 
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: 12, fontWeight: 600, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: any) => [`${value} Avg FTE`, 'Allocation']}
                      />
                      <Bar dataKey="fte" fill="#6366f1" radius={[0, 4, 4, 0]} name="Average FTE Allocation">
                        {podMetrics.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.id === 'pod-bench' ? '#f59e0b' : '#6366f1'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>
            </div>
          ) : view === 'department' ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {deptData.map(dept => (
                  <section key={dept.name} className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800">{dept.name}</h3>
                        <p className="text-xs text-slate-400 font-medium">Departmental Efficiency ({selectedPeriodLabel})</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-indigo-500">{dept.utilization}%</div>
                        <div className="text-[10px] font-bold uppercase text-slate-400">Utilization</div>
                      </div>
                    </div>
                    
                    <div className="h-[250px] w-full mb-8 relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Allocated', value: dept.allocated },
                              { name: 'Bench', value: dept.bench },
                            ]}
                            innerRadius={70}
                            outerRadius={90}
                            paddingAngle={8}
                            dataKey="value"
                            stroke="none"
                          >
                            <Cell fill="#6366f1" />
                            <Cell fill="#f59e0b" />
                          </Pie>
                          <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-3xl font-bold text-slate-800">{dept.total}</span>
                        <span className="text-[10px] font-bold uppercase text-slate-400">Total FTE</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                          <span className="text-[10px] font-bold uppercase text-slate-400">Allocated</span>
                        </div>
                        <div className="text-xl font-bold text-slate-800">{dept.allocated} <span className="text-xs font-medium text-slate-400">FTE</span></div>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 bg-amber-500 rounded-full" />
                          <span className="text-[10px] font-bold uppercase text-slate-400">Bench</span>
                        </div>
                        <div className="text-xl font-bold text-slate-800">{dept.bench} <span className="text-xs font-medium text-slate-400">FTE</span></div>
                      </div>
                    </div>
                  </section>
                ))}
              </div>
            </div>
            ) : view === 'resource' ? (
            <section className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Resource Capacity Analysis ({selectedPeriodLabel})</h3>
                  <p className="text-xs text-slate-400 font-medium">Resources with bench capacity or over-allocation</p>
                </div>
                <div className="flex gap-3">
                  <div className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">
                    {benchResources.filter(r => r.allocated < 100).length} On Bench
                  </div>
                  <div className="text-[10px] font-bold text-rose-500 bg-rose-50 px-3 py-1 rounded-full uppercase tracking-wider">
                    {benchResources.filter(r => r.allocated > 100).length} Over-Allocated
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/30 border-b border-slate-100">
                      <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400">Resource</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400">Role</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400">Team</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {benchResources.map(resource => {
                      const isOverAllocated = resource.allocated > 100;
                      return (
                        <tr key={resource.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-5">
                            <div className="font-bold text-slate-800">{resource.name}</div>
                          </td>
                          <td className="px-6 py-5 text-xs font-medium text-slate-500">{resource.role}</td>
                          <td className="px-6 py-5">
                            <span className="text-[10px] font-bold uppercase text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                              {resource.department}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className="inline-flex items-center gap-4">
                              <div className="text-right">
                                {isOverAllocated ? (
                                  <div className="text-sm font-bold text-rose-500">
                                    {resource.allocated}% <span className="text-xs font-medium text-rose-400">Allocated</span>
                                    <div className="text-[9px] font-black uppercase text-rose-400 flex items-center gap-1 justify-end">
                                      <AlertCircle size={10} /> Overload
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-sm font-bold text-indigo-500">
                                    {100 - resource.allocated}% <span className="text-xs font-medium text-slate-400">Free</span>
                                  </div>
                                )}
                              </div>
                              <div className={cn(
                                "w-2 h-2 rounded-full shadow-sm",
                                isOverAllocated ? "bg-rose-500 animate-pulse" : "bg-indigo-400"
                              )} />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}
          </div>
        </div>
      </main>

      {/* POD Setup Modal */}
      {isPodSetupOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-4xl animate-in fade-in zoom-in duration-200">
            <PodSetup 
              pods={pods}
              onSave={async (updatedPods) => {
                try {
                  await supabaseService.savePods(updatedPods);
                  setPods(updatedPods);
                  setIsPodSetupOpen(false);
                  showNotification("PODs updated successfully.", "success");
                } catch (error) {
                  console.error("Save error:", error);
                  showNotification("Failed to save PODs to database.", "error");
                }
              }}
              onClose={() => setIsPodSetupOpen(false)}
              showNotification={showNotification}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 px-8 py-8 mt-12 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          © 2026 Capacity & Bench Strength Guardian
        </div>
        <div className="flex gap-8 text-[10px] font-bold uppercase text-slate-400">
          <a href="#" className="hover:text-indigo-600 transition-colors">Export Analytics</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">POD Framework</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Bench Policy</a>
        </div>
      </footer>
    </div>
  );
}
