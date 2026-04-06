export type BusinessUnit = 'MSD' | 'MLD' | 'Vylla' | 'CMH' | 'IT' | 'ENT' | 'CCM';

export interface Resource {
  id: string;
  name: string;
  department: string; // EDE, APD, etc.
  role: string;
  allocations: Allocation[];
}

export interface SprintAllocation {
  sprintId: string;
  percentage: number;
}

export interface Allocation {
  projectId: string;
  projectName: string;
  podId: string; // Rollup link
  sprintAllocations?: SprintAllocation[];
  percentage?: number; // Legacy/Average
  startDate?: string; // Legacy
  endDate?: string; // Legacy
}

export interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  quarter: string;
}

export interface Quarter {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

export const QUARTERS: Quarter[] = [
  { id: '2026-Q1', name: 'Q1 2026', startDate: '2026-01-01', endDate: '2026-03-31' },
  { id: '2026-Q2', name: 'Q2 2026', startDate: '2026-04-01', endDate: '2026-06-30' },
  { id: '2026-Q3', name: 'Q3 2026', startDate: '2026-07-01', endDate: '2026-09-30' },
  { id: '2026-Q4', name: 'Q4 2026', startDate: '2026-10-01', endDate: '2026-12-31' },
  { id: '2027-Q1', name: 'Q1 2027', startDate: '2027-01-01', endDate: '2027-03-31' },
  { id: '2027-Q2', name: 'Q2 2027', startDate: '2027-04-01', endDate: '2027-06-30' },
];

export interface POD {
  id: string;
  name: string;
  bu: BusinessUnit;
  lead: string;
  description: string;
}

export const PODS: POD[] = [
  { id: 'pod-bench', name: 'Bench / Available', bu: 'IT', lead: 'N/A', description: 'Unallocated resource capacity' },
  { id: 'pod-meridian-vk', name: 'Project Meridian', bu: 'IT', lead: 'Vijay Kashyap', description: 'Project Meridian Core Development' },
  { id: 'pod-letter-conv', name: 'Letter Conversion & Print Vendor Implementation', bu: 'MSD', lead: 'Vijay Kashyap', description: 'MP and Covious Efforts' },
  { id: 'pod-msd-maint', name: 'MSD Maintenance and Prod Support', bu: 'MSD', lead: 'Prahlad Kulkarni', description: 'Production support and optimization' },
  { id: 'pod-mld-maint', name: 'MLD Maintenance and Prod Support', bu: 'MLD', lead: '', description: '' },
  { id: 'pod-ent-maint', name: 'ENT Maintenance and Prod Support', bu: 'ENT', lead: '', description: '' },
  { id: 'pod-genesys-mgmt', name: 'Genesys Contact Mgmt.', bu: 'MSD', lead: 'Vijay Kashyap', description: 'Genesys Contact Management Center' },
  { id: 'pod-cdm-2', name: 'CDM 2.0', bu: 'MLD', lead: 'Vijay Kashyap', description: 'CDM 2.0 Setup' },
  { id: 'pod-gnma-hecm', name: 'GNMA HECM', bu: 'IT', lead: 'Vijay Kashyap', description: 'GNMA HECM & Infrastructure Support' },
  { id: 'pod-servicing-enh', name: 'Servicing Enhancements', bu: 'MSD', lead: 'N/A', description: 'Genesys & Investor Portal' },
  { id: 'pod-meridian-js', name: 'Project Meridian POD', bu: 'IT', lead: 'Joshua Saunders', description: 'Project Meridian Core Development' },
  { id: 'pod-reliance-int', name: 'Reliance First Cap Integration', bu: 'MSD', lead: 'Vijay Kashyap', description: 'RFC Efforts for Integration' },
  { id: 'pod-digital-cr', name: 'Digital Change Request', bu: 'IT', lead: 'Brett Wilbur', description: 'DCR Product Development' },
  { id: 'pod-ccm-support', name: 'CCM Support', bu: 'CCM', lead: 'Adam Dean', description: 'CCM Support' },
  { id: 'pod-omni-enh', name: 'OMNI Enhancements', bu: 'MSD', lead: 'Behzad Kashefipour', description: 'Ongoing Enhancements to OMNI' },
  { id: 'pod-imaging', name: 'Imaging Team', bu: 'MSD', lead: 'N/A', description: 'Imaging Team' },
  { id: 'pod-raptor', name: 'Project Raptor', bu: 'MSD', lead: 'N/A', description: 'Servicing Business Acquisition' },
  { id: 'pod-servicing-conv', name: 'Servicing System Conversion', bu: 'MSD', lead: 'N/A', description: 'Servicing System Migration' },
];

export const PROJECTS: { id: string; name: string; podId: string }[] = [
  { id: 'cdm-2.0', name: 'CDM 2.0 Migration', podId: 'pod-cdm-2' },
  { id: 'reliance', name: 'Reliance', podId: 'pod-reliance-int' },
  { id: 'dcr', name: 'Digital Change Request', podId: 'pod-digital-cr' },
  { id: 'genesys', name: 'Genesys', podId: 'pod-genesys-mgmt' },
  { id: 'gnma-hecm', name: 'GNMA HECM', podId: 'pod-gnma-hecm' },
  { id: 'investor-portal', name: 'Investor Portal', podId: 'pod-servicing-enh' },
  { id: 'mcdm', name: 'MCDM', podId: 'pod-gnma-hecm' },
  { id: 'meridian', name: 'Project Meridian', podId: 'pod-meridian-js' },
  { id: 'message-point', name: 'Message Point', podId: 'pod-letter-conv' },
  { id: 'covius', name: 'Covius Setup', podId: 'pod-letter-conv' },
  { id: 'performance', name: 'Performance Team', podId: 'pod-msd-maint' },
  { id: 'imaging', name: 'Imaging Team', podId: 'pod-imaging' },
  { id: 'sprint-general', name: 'Sprint (General)', podId: 'pod-bench' },
  { id: 'sprint-cx', name: 'Sprint (CX)', podId: 'pod-bench' },
  { id: 'sprint-letters', name: 'Sprint (Letters)', podId: 'pod-bench' },
  { id: 'sprint-crm', name: 'Sprint (CRM)', podId: 'pod-bench' },
  { id: 'ccm-support-proj', name: 'CCM Support', podId: 'pod-ccm-support' },
];

export const RESOURCES: Resource[] = [
  {
    id: 'adam-dean',
    name: 'Adam Dean',
    department: 'EDE',
    role: 'Support',
    allocations: [
      { projectId: 'ccm-support-proj', projectName: 'CCM Support', podId: 'pod-ccm-support', percentage: 100, startDate: '2026-01-01', endDate: '2026-06-30' },
      { projectId: 'ccm-support-proj', projectName: 'CCM Support', podId: 'pod-ccm-support', percentage: 50, startDate: '2026-07-01', endDate: '2026-12-31' },
      { projectId: 'sprint-general', projectName: 'Sprint (General)', podId: 'pod-bench', percentage: 50, startDate: '2026-07-01', endDate: '2026-12-31' }
    ],
  },
  {
    id: 'amir-hama',
    name: 'Amir Hama',
    department: 'APD',
    role: 'QA',
    allocations: [
      { projectId: 'meridian', projectName: 'Project Meridian', podId: 'pod-meridian-js', percentage: 100, startDate: '2026-01-01', endDate: '2026-09-30' },
      { projectId: 'meridian', projectName: 'Project Meridian', podId: 'pod-meridian-js', percentage: 20, startDate: '2026-10-01', endDate: '2026-12-31' },
      { projectId: 'sprint-crm', projectName: 'Sprint (CRM)', podId: 'pod-bench', percentage: 80, startDate: '2026-10-01', endDate: '2026-12-31' },
    ],
  },
  {
    id: 'andrew-hofmann',
    name: 'Andrew Hofmann',
    department: 'EDE',
    role: 'Developer',
    allocations: [
      { projectId: 'sprint-general', projectName: 'Sprint (General)', podId: 'pod-bench', percentage: 80, startDate: '2026-01-01', endDate: '2026-06-30' },
      { projectId: 'sprint-general', projectName: 'Sprint (General)', podId: 'pod-bench', percentage: 100, startDate: '2026-07-01', endDate: '2026-12-31' }
    ],
  },
  {
    id: 'anandi-rao',
    name: 'Anandi Rao',
    department: 'EDE',
    role: 'Developer',
    allocations: [
      { projectId: 'covius', projectName: 'Covius Setup', podId: 'pod-letter-conv', percentage: 100, startDate: '2026-01-01', endDate: '2026-06-30' },
      { projectId: 'mcdm', projectName: 'MCDM', podId: 'pod-gnma-hecm', percentage: 100, startDate: '2026-07-01', endDate: '2026-12-31' },
    ],
  },
  {
    id: 'bhavna-bhat',
    name: 'Bhavna Bhat',
    department: 'EDE',
    role: 'Developer',
    allocations: [
      { projectId: 'performance', projectName: 'Performance Team', podId: 'pod-msd-maint', percentage: 70, startDate: '2026-01-01', endDate: '2026-06-30' },
      { projectId: 'performance', projectName: 'Performance Team', podId: 'pod-msd-maint', percentage: 100, startDate: '2026-07-01', endDate: '2026-12-31' },
    ],
  },
  {
    id: 'dennis-grecu',
    name: 'Dennis Grecu',
    department: 'EDE',
    role: 'Developer',
    allocations: [
      { projectId: 'genesys', projectName: 'Genesys', podId: 'pod-genesys-mgmt', percentage: 80, startDate: '2026-01-01', endDate: '2026-09-30' },
      { projectId: 'genesys', projectName: 'Genesys', podId: 'pod-genesys-mgmt', percentage: 50, startDate: '2026-10-01', endDate: '2026-12-31' },
      { projectId: 'sprint-letters', projectName: 'Sprint (Letters)', podId: 'pod-bench', percentage: 50, startDate: '2026-10-01', endDate: '2026-12-31' },
    ],
  },
  {
    id: 'eric-schmidt',
    name: 'Eric Schmidt',
    department: 'EDE',
    role: 'Developer',
    allocations: [
      { projectId: 'gnma-hecm', projectName: 'GNMA HECM', podId: 'pod-gnma-hecm', percentage: 15, startDate: '2026-01-01', endDate: '2026-06-30' },
      { projectId: 'gnma-hecm', projectName: 'GNMA HECM', podId: 'pod-gnma-hecm', percentage: 100, startDate: '2026-07-01', endDate: '2026-12-31' }
    ],
  },
  {
    id: 'hunter-teston',
    name: 'Hunter Teston',
    department: 'EDE',
    role: 'Developer',
    allocations: [
      { projectId: 'sprint-cx', projectName: 'Sprint (CX)', podId: 'pod-bench', percentage: 100, startDate: '2026-01-01', endDate: '2026-06-30' },
      { projectId: 'sprint-cx', projectName: 'Sprint (CX)', podId: 'pod-bench', percentage: 20, startDate: '2026-07-01', endDate: '2026-12-31' },
      { projectId: 'cdm-2.0', projectName: 'CDM 2.0 Migration', podId: 'pod-cdm-2', percentage: 80, startDate: '2026-07-01', endDate: '2026-12-31' }
    ],
  },
  {
    id: 'jagdish-bishnoi',
    name: 'Jagdish Bishnoi',
    department: 'EDE',
    role: 'Developer',
    allocations: [
      { projectId: 'performance', projectName: 'Performance Team', podId: 'pod-msd-maint', percentage: 80, startDate: '2026-01-01', endDate: '2026-09-30' },
      { projectId: 'performance', projectName: 'Performance Team', podId: 'pod-msd-maint', percentage: 0, startDate: '2026-10-01', endDate: '2026-12-31' },
    ],
  },
  {
    id: 'lamont-ford',
    name: 'Lamont Ford',
    department: 'EDE',
    role: 'Developer',
    allocations: [
      { projectId: 'performance', projectName: 'Performance Team', podId: 'pod-msd-maint', percentage: 100, startDate: '2026-01-01', endDate: '2026-12-31' }
    ],
  },
  {
    id: 'max-dedo',
    name: 'Max Dedo',
    department: 'EDE',
    role: 'Developer',
    allocations: [
      { projectId: 'sprint-general', projectName: 'Sprint (General)', podId: 'pod-bench', percentage: 100, startDate: '2026-01-01', endDate: '2026-12-31' }
    ],
  },
  {
    id: 'naga-chadalawada',
    name: 'Naga Chadalawada',
    department: 'EDE',
    role: 'Developer',
    allocations: [
      { projectId: 'cdm-2.0', projectName: 'CDM 2.0 Migration', podId: 'pod-cdm-2', percentage: 100, startDate: '2026-01-01', endDate: '2026-06-30' },
      { projectId: 'cdm-2.0', projectName: 'CDM 2.0 Migration', podId: 'pod-cdm-2', percentage: 50, startDate: '2026-07-01', endDate: '2026-12-31' }
    ],
  },
  {
    id: 'nick-miner',
    name: 'Nick Miner',
    department: 'EDE',
    role: 'Developer',
    allocations: [
      { projectId: 'covius', projectName: 'Covius Setup', podId: 'pod-letter-conv', percentage: 70, startDate: '2026-01-01', endDate: '2026-06-30' },
      { projectId: 'covius', projectName: 'Covius Setup', podId: 'pod-letter-conv', percentage: 100, startDate: '2026-07-01', endDate: '2026-12-31' },
    ],
  },
  {
    id: 'randy-huang',
    name: 'Randy Huang',
    department: 'EDE',
    role: 'Developer',
    allocations: [
      { projectId: 'sprint-crm', projectName: 'Sprint (CRM)', podId: 'pod-bench', percentage: 80, startDate: '2026-01-01', endDate: '2026-12-31' }
    ],
  },
  {
    id: 'randy-see',
    name: 'Randy See',
    department: 'APD',
    role: 'Developer',
    allocations: [
      { projectId: 'investor-portal', projectName: 'Investor Portal', podId: 'pod-servicing-enh', percentage: 75, startDate: '2026-01-01', endDate: '2026-06-30' },
      { projectId: 'investor-portal', projectName: 'Investor Portal', podId: 'pod-servicing-enh', percentage: 100, startDate: '2026-07-01', endDate: '2026-12-31' },
    ],
  },
  {
    id: 'rick-ritts',
    name: 'Rick Ritts',
    department: 'APS',
    role: 'Contractor',
    allocations: [
      { projectId: 'meridian', projectName: 'Project Meridian', podId: 'pod-meridian-js', percentage: 100, startDate: '2026-01-01', endDate: '2026-06-30' },
      { projectId: 'meridian', projectName: 'Project Meridian', podId: 'pod-meridian-js', percentage: 0, startDate: '2026-07-01', endDate: '2026-12-31' }
    ],
  },
  {
    id: 'robert-weissenberg',
    name: 'Robert Weissenberg',
    department: 'APS',
    role: 'Developer',
    allocations: [
      { projectId: 'performance', projectName: 'Performance Team', podId: 'pod-msd-maint', percentage: 100, startDate: '2026-01-01', endDate: '2026-09-30' },
      { projectId: 'performance', projectName: 'Performance Team', podId: 'pod-msd-maint', percentage: 50, startDate: '2026-10-01', endDate: '2026-12-31' }
    ],
  },
  {
    id: 'scott-mayer',
    name: 'Scott Mayer',
    department: 'APS',
    role: 'Imaging',
    allocations: [
      { projectId: 'imaging', projectName: 'Imaging Team', podId: 'pod-imaging', percentage: 100, startDate: '2026-01-01', endDate: '2026-12-31' }
    ],
  },
  {
    id: 'shiva-bettegowda',
    name: 'Shiva Bettegowda',
    department: 'APS',
    role: 'Developer',
    allocations: [
      { projectId: 'performance', projectName: 'Performance Team', podId: 'pod-msd-maint', percentage: 100, startDate: '2026-01-01', endDate: '2026-12-31' }
    ],
  },
  {
    id: 'stephanos-theodorou',
    name: 'Stephanos Theodorou',
    department: 'APS',
    role: 'Imaging',
    allocations: [
      { projectId: 'imaging', projectName: 'Imaging Team', podId: 'pod-imaging', percentage: 100, startDate: '2026-01-01', endDate: '2026-12-31' }
    ],
  },
  {
    id: 'paul-mendoza',
    name: 'Paul Mendoza',
    department: 'APD',
    role: 'Developer',
    allocations: [
      { projectId: 'reliance', projectName: 'Reliance', podId: 'pod-reliance-int', percentage: 25, startDate: '2026-01-01', endDate: '2026-12-31' },
      { projectId: 'dcr', projectName: 'Digital Change Request', podId: 'pod-digital-cr', percentage: 75, startDate: '2026-01-01', endDate: '2026-12-31' }
    ],
  },
  {
    id: 'sarah-jenkins',
    name: 'Sarah Jenkins',
    department: 'APD',
    role: 'Product Manager',
    allocations: [
      { projectId: 'reliance', projectName: 'Reliance', podId: 'pod-reliance-int', percentage: 100, startDate: '2026-01-01', endDate: '2026-06-30' },
      { projectId: 'dcr', projectName: 'Digital Change Request', podId: 'pod-digital-cr', percentage: 100, startDate: '2026-07-01', endDate: '2026-12-31' }
    ],
  },
  {
    id: 'michael-chen',
    name: 'Michael Chen',
    department: 'EDE',
    role: 'Senior Developer',
    allocations: [
      { projectId: 'meridian', projectName: 'Project Meridian', podId: 'pod-meridian-js', percentage: 50, startDate: '2026-01-01', endDate: '2026-12-31' },
      { projectId: 'message-point', projectName: 'Message Point', podId: 'pod-letter-conv', percentage: 50, startDate: '2026-01-01', endDate: '2026-12-31' }
    ],
  },
  {
    id: 'laura-wilson',
    name: 'Laura Wilson',
    department: 'APS',
    role: 'QA Lead',
    allocations: [
      { projectId: 'genesys', projectName: 'Genesys', podId: 'pod-genesys-mgmt', percentage: 100, startDate: '2026-01-01', endDate: '2026-06-30' },
      { projectId: 'investor-portal', projectName: 'Investor Portal', podId: 'pod-servicing-enh', percentage: 100, startDate: '2026-07-01', endDate: '2026-12-31' }
    ],
  },
  {
    id: 'david-miller',
    name: 'David Miller',
    department: 'EDE',
    role: 'DevOps',
    allocations: [
      { projectId: 'gnma-hecm', projectName: 'GNMA HECM', podId: 'pod-gnma-hecm', percentage: 100, startDate: '2026-01-01', endDate: '2026-12-31' }
    ],
  },
  {
    id: 'emily-davis',
    name: 'Emily Davis',
    department: 'APD',
    role: 'Analyst',
    allocations: [
      { projectId: 'sprint-letters', projectName: 'Sprint (Letters)', podId: 'pod-bench', percentage: 100, startDate: '2026-01-01', endDate: '2026-06-30' },
      { projectId: 'sprint-crm', projectName: 'Sprint (CRM)', podId: 'pod-bench', percentage: 100, startDate: '2026-07-01', endDate: '2026-12-31' }
    ],
  },
  {
    id: 'james-taylor',
    name: 'James Taylor',
    department: 'APS',
    role: 'Developer',
    allocations: [
      { projectId: 'performance', projectName: 'Performance Team', podId: 'pod-msd-maint', percentage: 100, startDate: '2026-01-01', endDate: '2026-12-31' }
    ],
  },
  {
    id: 'jessica-white',
    name: 'Jessica White',
    department: 'EDE',
    role: 'Developer',
    allocations: [
      { projectId: 'cdm-2.0', projectName: 'CDM 2.0 Migration', podId: 'pod-cdm-2', percentage: 100, startDate: '2026-01-01', endDate: '2026-12-31' }
    ],
  },
  {
    id: 'kevin-brown',
    name: 'Kevin Brown',
    department: 'APD',
    role: 'QA',
    allocations: [
      { projectId: 'meridian', projectName: 'Project Meridian', podId: 'pod-meridian-js', percentage: 100, startDate: '2026-01-01', endDate: '2026-12-31' }
    ],
  },
  {
    id: 'olivia-garcia',
    name: 'Olivia Garcia',
    department: 'APS',
    role: 'Developer',
    allocations: [
      { projectId: 'imaging', projectName: 'Imaging Team', podId: 'pod-imaging', percentage: 100, startDate: '2026-01-01', endDate: '2026-12-31' }
    ],
  },
  {
    id: 'res-sarah-chen',
    name: 'Sarah Chen',
    department: 'EDE',
    role: 'Lead Architect',
    allocations: [
      { projectId: 'proj-cdm-2.0', projectName: 'CDM 2.0 Migration', podId: 'pod-cdm-2', percentage: 80, startDate: '2026-01-01', endDate: '2026-03-31' },
      { projectId: 'proj-reliance', projectName: 'Reliance', podId: 'pod-reliance-int', percentage: 40, startDate: '2026-01-01', endDate: '2026-03-31' },
    ]
  }
];

export const SPRINTS: Sprint[] = [
  // Q1 2026
  { id: '2601', name: 'Sprint 2601', startDate: '2026-01-05', endDate: '2026-01-16', quarter: '2026-Q1' },
  { id: '2602', name: 'Sprint 2602', startDate: '2026-01-19', endDate: '2026-01-30', quarter: '2026-Q1' },
  { id: '2603', name: 'Sprint 2603', startDate: '2026-02-02', endDate: '2026-02-13', quarter: '2026-Q1' },
  { id: '2604', name: 'Sprint 2604', startDate: '2026-02-16', endDate: '2026-02-27', quarter: '2026-Q1' },
  { id: '2605', name: 'Sprint 2605', startDate: '2026-03-02', endDate: '2026-03-13', quarter: '2026-Q1' },
  { id: '2606', name: 'Sprint 2606', startDate: '2026-03-16', endDate: '2026-03-27', quarter: '2026-Q1' },
  
  // Q2 2026 (April has 3 sprints starting)
  { id: '2607', name: 'Sprint 2607', startDate: '2026-03-30', endDate: '2026-04-10', quarter: '2026-Q2' },
  { id: '2608', name: 'Sprint 2608', startDate: '2026-04-13', endDate: '2026-04-24', quarter: '2026-Q2' },
  { id: '2609', name: 'Sprint 2609', startDate: '2026-04-27', endDate: '2026-05-08', quarter: '2026-Q2' },
  { id: '2610', name: 'Sprint 2610', startDate: '2026-05-11', endDate: '2026-05-22', quarter: '2026-Q2' },
  { id: '2611', name: 'Sprint 2611', startDate: '2026-05-25', endDate: '2026-06-05', quarter: '2026-Q2' },
  { id: '2612', name: 'Sprint 2612', startDate: '2026-06-08', endDate: '2026-06-19', quarter: '2026-Q2' },
  { id: '2613', name: 'Sprint 2613', startDate: '2026-06-22', endDate: '2026-07-03', quarter: '2026-Q2' },

  // Q3 2026 (September has 3 sprints starting)
  { id: '2614', name: 'Sprint 2614', startDate: '2026-07-06', endDate: '2026-07-17', quarter: '2026-Q3' },
  { id: '2615', name: 'Sprint 2615', startDate: '2026-07-20', endDate: '2026-07-31', quarter: '2026-Q3' },
  { id: '2616', name: 'Sprint 2616', startDate: '2026-08-03', endDate: '2026-08-14', quarter: '2026-Q3' },
  { id: '2617', name: 'Sprint 2617', startDate: '2026-08-17', endDate: '2026-08-28', quarter: '2026-Q3' },
  { id: '2618', name: 'Sprint 2618', startDate: '2026-08-31', endDate: '2026-09-11', quarter: '2026-Q3' },
  { id: '2619', name: 'Sprint 2619', startDate: '2026-09-14', endDate: '2026-09-25', quarter: '2026-Q3' },
  { id: '2620', name: 'Sprint 2620', startDate: '2026-09-28', endDate: '2026-10-09', quarter: '2026-Q3' },

  // Q4 2026
  { id: '2621', name: 'Sprint 2621', startDate: '2026-10-12', endDate: '2026-10-23', quarter: '2026-Q4' },
  { id: '2622', name: 'Sprint 2622', startDate: '2026-10-26', endDate: '2026-11-06', quarter: '2026-Q4' },
  { id: '2623', name: 'Sprint 2623', startDate: '2026-11-09', endDate: '2026-11-20', quarter: '2026-Q4' },
  { id: '2624', name: 'Sprint 2624', startDate: '2026-11-23', endDate: '2026-12-04', quarter: '2026-Q4' },
  { id: '2625', name: 'Sprint 2625', startDate: '2026-12-07', endDate: '2026-12-18', quarter: '2026-Q4' },
  { id: '2626', name: 'Sprint 2626', startDate: '2026-12-21', endDate: '2027-01-01', quarter: '2026-Q4' },

  // Q1 2027
  { id: '2701', name: 'Sprint 2701', startDate: '2027-01-04', endDate: '2027-01-15', quarter: '2027-Q1' },
  { id: '2702', name: 'Sprint 2702', startDate: '2027-01-18', endDate: '2027-01-29', quarter: '2027-Q1' },
  { id: '2703', name: 'Sprint 2703', startDate: '2027-02-01', endDate: '2027-02-12', quarter: '2027-Q1' },
  { id: '2704', name: 'Sprint 2704', startDate: '2027-02-15', endDate: '2027-02-26', quarter: '2027-Q1' },
  { id: '2705', name: 'Sprint 2705', startDate: '2027-03-01', endDate: '2027-03-12', quarter: '2027-Q1' },
  { id: '2706', name: 'Sprint 2706', startDate: '2027-03-15', endDate: '2027-03-26', quarter: '2027-Q1' },
];
