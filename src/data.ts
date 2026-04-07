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
  {
    "id": "pod-cdm-2-0",
    "name": "CDM 2.0",
    "bu": "MLD",
    "lead": "TBD",
    "description": "CDM 2.0"
  },
  {
    "id": "pod-reliance-first-cap-integration",
    "name": "Reliance First Cap Integration",
    "bu": "MSD",
    "lead": "TBD",
    "description": "Reliance First Cap Integration"
  },
  {
    "id": "pod-dcr",
    "name": "DCR",
    "bu": "IT",
    "lead": "TBD",
    "description": "DCR"
  },
  {
    "id": "pod-genesys-contact-mgmt-",
    "name": "Genesys Contact Mgmt.",
    "bu": "MSD",
    "lead": "TBD",
    "description": "Genesys Contact Mgmt."
  },
  {
    "id": "pod-gnma-hecm",
    "name": "GNMA HECM",
    "bu": "IT",
    "lead": "TBD",
    "description": "GNMA HECM"
  },
  {
    "id": "pod-investor-portal--s-mon-",
    "name": "Investor Portal (S-MON)",
    "bu": "MSD",
    "lead": "TBD",
    "description": "Investor Portal (S-MON)"
  },
  {
    "id": "pod-meridian--cloud-",
    "name": "Meridian (Cloud)",
    "bu": "IT",
    "lead": "TBD",
    "description": "Meridian (Cloud)"
  },
  {
    "id": "pod-letter-conversion---print-vendor-implementation",
    "name": "Letter Conversion & Print Vendor Implementation",
    "bu": "IT",
    "lead": "TBD",
    "description": "Letter Conversion & Print Vendor Implementation"
  },
  {
    "id": "pod-ocr",
    "name": "OCR",
    "bu": "IT",
    "lead": "TBD",
    "description": "OCR"
  },
  {
    "id": "pod-life-of-loan",
    "name": "Life of Loan",
    "bu": "MLD",
    "lead": "TBD",
    "description": "Life of Loan"
  },
  {
    "id": "pod-treasury-optimization",
    "name": "Treasury Optimization",
    "bu": "IT",
    "lead": "TBD",
    "description": "Treasury Optimization"
  },
  {
    "id": "pod-ai-voice-agents",
    "name": "AI Voice Agents",
    "bu": "IT",
    "lead": "TBD",
    "description": "AI Voice Agents"
  },
  {
    "id": "pod-enhancements--msd-",
    "name": "Enhancements (MSD)",
    "bu": "MSD",
    "lead": "TBD",
    "description": "Enhancements (MSD)"
  },
  {
    "id": "pod-enhancements--cx-",
    "name": "Enhancements (CX)",
    "bu": "IT",
    "lead": "TBD",
    "description": "Enhancements (CX)"
  },
  {
    "id": "pod-enhancements--letters-",
    "name": "Enhancements (Letters)",
    "bu": "MSD",
    "lead": "TBD",
    "description": "Enhancements (Letters)"
  },
  {
    "id": "pod-enhancements--crm-",
    "name": "Enhancements (CRM)",
    "bu": "MSD",
    "lead": "TBD",
    "description": "Enhancements (CRM)"
  },
  {
    "id": "pod-ccm-support",
    "name": "CCM Support",
    "bu": "CCM",
    "lead": "TBD",
    "description": "CCM Support"
  },
  {
    "id": "pod-production-support",
    "name": "Production Support",
    "bu": "IT",
    "lead": "TBD",
    "description": "Production Support"
  },
  {
    "id": "pod-business-intelligence--lending-analytics-",
    "name": "Business Intelligence (Lending Analytics)",
    "bu": "MLD",
    "lead": "TBD",
    "description": "Business Intelligence (Lending Analytics)"
  },
  {
    "id": "pod-business-intelligence--servicing-analytics-",
    "name": "Business Intelligence (Servicing Analytics)",
    "bu": "MSD",
    "lead": "TBD",
    "description": "Business Intelligence (Servicing Analytics)"
  }
];

export const PROJECTS: { id: string; name: string; podId: string }[] = [
  {
    "id": "proj-cdm-2-0",
    "name": "CDM 2.0",
    "podId": "pod-cdm-2-0"
  },
  {
    "id": "proj-reliance-first-cap-integration",
    "name": "Reliance First Cap Integration",
    "podId": "pod-reliance-first-cap-integration"
  },
  {
    "id": "proj-dcr",
    "name": "DCR",
    "podId": "pod-dcr"
  },
  {
    "id": "proj-genesys-contact-mgmt-",
    "name": "Genesys Contact Mgmt.",
    "podId": "pod-genesys-contact-mgmt-"
  },
  {
    "id": "proj-gnma-hecm",
    "name": "GNMA HECM",
    "podId": "pod-gnma-hecm"
  },
  {
    "id": "proj-investor-portal--s-mon-",
    "name": "Investor Portal (S-MON)",
    "podId": "pod-investor-portal--s-mon-"
  },
  {
    "id": "proj-meridian--cloud-",
    "name": "Meridian (Cloud)",
    "podId": "pod-meridian--cloud-"
  },
  {
    "id": "proj-letter-conversion---print-vendor-implementation",
    "name": "Letter Conversion & Print Vendor Implementation",
    "podId": "pod-letter-conversion---print-vendor-implementation"
  },
  {
    "id": "proj-ocr",
    "name": "OCR",
    "podId": "pod-ocr"
  },
  {
    "id": "proj-life-of-loan",
    "name": "Life of Loan",
    "podId": "pod-life-of-loan"
  },
  {
    "id": "proj-treasury-optimization",
    "name": "Treasury Optimization",
    "podId": "pod-treasury-optimization"
  },
  {
    "id": "proj-ai-voice-agents",
    "name": "AI Voice Agents",
    "podId": "pod-ai-voice-agents"
  },
  {
    "id": "proj-enhancements--msd-",
    "name": "Enhancements (MSD)",
    "podId": "pod-enhancements--msd-"
  },
  {
    "id": "proj-enhancements--cx-",
    "name": "Enhancements (CX)",
    "podId": "pod-enhancements--cx-"
  },
  {
    "id": "proj-enhancements--letters-",
    "name": "Enhancements (Letters)",
    "podId": "pod-enhancements--letters-"
  },
  {
    "id": "proj-enhancements--crm-",
    "name": "Enhancements (CRM)",
    "podId": "pod-enhancements--crm-"
  },
  {
    "id": "proj-ccm-support",
    "name": "CCM Support",
    "podId": "pod-ccm-support"
  },
  {
    "id": "proj-production-support",
    "name": "Production Support",
    "podId": "pod-production-support"
  },
  {
    "id": "proj-business-intelligence--lending-analytics-",
    "name": "Business Intelligence (Lending Analytics)",
    "podId": "pod-business-intelligence--lending-analytics-"
  },
  {
    "id": "proj-business-intelligence--servicing-analytics-",
    "name": "Business Intelligence (Servicing Analytics)",
    "podId": "pod-business-intelligence--servicing-analytics-"
  }
];

export const RESOURCES: Resource[] = [
  {
    "id": "naga-chadalwada",
    "name": "Naga Chadalwada",
    "department": "EDE",
    "role": "Developer",
    "allocations": [
      {
        "projectId": "proj-cdm-2-0",
        "projectName": "CDM 2.0",
        "podId": "pod-cdm-2-0",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 50
          },
          {
            "sprintId": "2608",
            "percentage": 50
          },
          {
            "sprintId": "2609",
            "percentage": 50
          }
        ]
      },
      {
        "projectId": "proj-cdm-2-0",
        "projectName": "CDM 2.0",
        "podId": "pod-cdm-2-0",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 50
          },
          {
            "sprintId": "2608",
            "percentage": 50
          },
          {
            "sprintId": "2609",
            "percentage": 50
          },
          {
            "sprintId": "2610",
            "percentage": 50
          },
          {
            "sprintId": "2611",
            "percentage": 50
          },
          {
            "sprintId": "2612",
            "percentage": 50
          },
          {
            "sprintId": "2613",
            "percentage": 50
          }
        ]
      }
    ]
  },
  {
    "id": "dennis-grecu",
    "name": "Dennis Grecu",
    "department": "EDE",
    "role": "Developer",
    "allocations": [
      {
        "projectId": "proj-cdm-2-0",
        "projectName": "CDM 2.0",
        "podId": "pod-cdm-2-0",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 5
          },
          {
            "sprintId": "2608",
            "percentage": 5
          },
          {
            "sprintId": "2609",
            "percentage": 5
          }
        ]
      },
      {
        "projectId": "proj-genesys-contact-mgmt-",
        "projectName": "Genesys Contact Mgmt.",
        "podId": "pod-genesys-contact-mgmt-",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 80
          },
          {
            "sprintId": "2608",
            "percentage": 80
          },
          {
            "sprintId": "2609",
            "percentage": 80
          },
          {
            "sprintId": "2610",
            "percentage": 40
          },
          {
            "sprintId": "2611",
            "percentage": 40
          },
          {
            "sprintId": "2612",
            "percentage": 40
          },
          {
            "sprintId": "2613",
            "percentage": 40
          },
          {
            "sprintId": "2614",
            "percentage": 40
          },
          {
            "sprintId": "2615",
            "percentage": 40
          }
        ]
      }
    ]
  },
  {
    "id": "randy-see",
    "name": "Randy See",
    "department": "EDE",
    "role": "Developer",
    "allocations": [
      {
        "projectId": "proj-reliance-first-cap-integration",
        "projectName": "Reliance First Cap Integration",
        "podId": "pod-reliance-first-cap-integration",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 25
          },
          {
            "sprintId": "2608",
            "percentage": 25
          },
          {
            "sprintId": "2609",
            "percentage": 25
          }
        ]
      },
      {
        "projectId": "proj-dcr",
        "projectName": "DCR",
        "podId": "pod-dcr",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 5
          },
          {
            "sprintId": "2608",
            "percentage": 5
          },
          {
            "sprintId": "2609",
            "percentage": 5
          },
          {
            "sprintId": "2610",
            "percentage": 5
          },
          {
            "sprintId": "2611",
            "percentage": 5
          },
          {
            "sprintId": "2612",
            "percentage": 5
          },
          {
            "sprintId": "2613",
            "percentage": 5
          },
          {
            "sprintId": "2614",
            "percentage": 5
          },
          {
            "sprintId": "2615",
            "percentage": 5
          },
          {
            "sprintId": "2616",
            "percentage": 5
          },
          {
            "sprintId": "2617",
            "percentage": 5
          },
          {
            "sprintId": "2618",
            "percentage": 5
          },
          {
            "sprintId": "2619",
            "percentage": 5
          },
          {
            "sprintId": "2620",
            "percentage": 5
          },
          {
            "sprintId": "2621",
            "percentage": 5
          },
          {
            "sprintId": "2622",
            "percentage": 5
          },
          {
            "sprintId": "2623",
            "percentage": 5
          },
          {
            "sprintId": "2624",
            "percentage": 5
          },
          {
            "sprintId": "2625",
            "percentage": 5
          },
          {
            "sprintId": "2626",
            "percentage": 5
          }
        ]
      },
      {
        "projectId": "proj-investor-portal--s-mon-",
        "projectName": "Investor Portal (S-MON)",
        "podId": "pod-investor-portal--s-mon-",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 25
          },
          {
            "sprintId": "2608",
            "percentage": 25
          },
          {
            "sprintId": "2609",
            "percentage": 25
          },
          {
            "sprintId": "2610",
            "percentage": 25
          },
          {
            "sprintId": "2611",
            "percentage": 25
          },
          {
            "sprintId": "2612",
            "percentage": 25
          },
          {
            "sprintId": "2613",
            "percentage": 25
          }
        ]
      },
      {
        "projectId": "proj-meridian--cloud-",
        "projectName": "Meridian (Cloud)",
        "podId": "pod-meridian--cloud-",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 20
          },
          {
            "sprintId": "2608",
            "percentage": 20
          },
          {
            "sprintId": "2609",
            "percentage": 20
          },
          {
            "sprintId": "2610",
            "percentage": 50
          },
          {
            "sprintId": "2611",
            "percentage": 50
          },
          {
            "sprintId": "2612",
            "percentage": 50
          },
          {
            "sprintId": "2613",
            "percentage": 50
          },
          {
            "sprintId": "2614",
            "percentage": 75
          },
          {
            "sprintId": "2615",
            "percentage": 75
          },
          {
            "sprintId": "2616",
            "percentage": 75
          },
          {
            "sprintId": "2617",
            "percentage": 75
          },
          {
            "sprintId": "2618",
            "percentage": 75
          },
          {
            "sprintId": "2619",
            "percentage": 75
          },
          {
            "sprintId": "2620",
            "percentage": 75
          },
          {
            "sprintId": "2621",
            "percentage": 75
          },
          {
            "sprintId": "2622",
            "percentage": 75
          },
          {
            "sprintId": "2623",
            "percentage": 75
          },
          {
            "sprintId": "2624",
            "percentage": 75
          },
          {
            "sprintId": "2625",
            "percentage": 75
          },
          {
            "sprintId": "2626",
            "percentage": 75
          }
        ]
      },
      {
        "projectId": "proj-ai-voice-agents",
        "projectName": "AI Voice Agents",
        "podId": "pod-ai-voice-agents",
        "sprintAllocations": [
          {
            "sprintId": "2610",
            "percentage": 20
          },
          {
            "sprintId": "2611",
            "percentage": 20
          },
          {
            "sprintId": "2612",
            "percentage": 20
          },
          {
            "sprintId": "2613",
            "percentage": 20
          },
          {
            "sprintId": "2614",
            "percentage": 20
          },
          {
            "sprintId": "2615",
            "percentage": 20
          },
          {
            "sprintId": "2616",
            "percentage": 20
          },
          {
            "sprintId": "2617",
            "percentage": 20
          },
          {
            "sprintId": "2618",
            "percentage": 20
          },
          {
            "sprintId": "2619",
            "percentage": 20
          },
          {
            "sprintId": "2620",
            "percentage": 20
          },
          {
            "sprintId": "2621",
            "percentage": 20
          },
          {
            "sprintId": "2622",
            "percentage": 20
          },
          {
            "sprintId": "2623",
            "percentage": 20
          },
          {
            "sprintId": "2624",
            "percentage": 20
          },
          {
            "sprintId": "2625",
            "percentage": 20
          },
          {
            "sprintId": "2626",
            "percentage": 20
          }
        ]
      },
      {
        "projectId": "proj-enhancements--msd-",
        "projectName": "Enhancements (MSD)",
        "podId": "pod-enhancements--msd-",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 25
          },
          {
            "sprintId": "2608",
            "percentage": 25
          },
          {
            "sprintId": "2609",
            "percentage": 25
          }
        ]
      }
    ]
  },
  {
    "id": "paul-mendoza",
    "name": "Paul Mendoza",
    "department": "EDE",
    "role": "Developer",
    "allocations": [
      {
        "projectId": "proj-reliance-first-cap-integration",
        "projectName": "Reliance First Cap Integration",
        "podId": "pod-reliance-first-cap-integration",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 25
          },
          {
            "sprintId": "2608",
            "percentage": 25
          },
          {
            "sprintId": "2609",
            "percentage": 25
          }
        ]
      },
      {
        "projectId": "proj-business-intelligence--lending-analytics-",
        "projectName": "Business Intelligence (Lending Analytics)",
        "podId": "pod-business-intelligence--lending-analytics-",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 75
          },
          {
            "sprintId": "2608",
            "percentage": 75
          },
          {
            "sprintId": "2609",
            "percentage": 75
          },
          {
            "sprintId": "2610",
            "percentage": 75
          },
          {
            "sprintId": "2611",
            "percentage": 75
          },
          {
            "sprintId": "2612",
            "percentage": 75
          },
          {
            "sprintId": "2613",
            "percentage": 75
          },
          {
            "sprintId": "2614",
            "percentage": 75
          },
          {
            "sprintId": "2615",
            "percentage": 75
          },
          {
            "sprintId": "2616",
            "percentage": 75
          },
          {
            "sprintId": "2617",
            "percentage": 75
          },
          {
            "sprintId": "2618",
            "percentage": 75
          },
          {
            "sprintId": "2619",
            "percentage": 75
          },
          {
            "sprintId": "2620",
            "percentage": 75
          },
          {
            "sprintId": "2621",
            "percentage": 75
          },
          {
            "sprintId": "2622",
            "percentage": 75
          },
          {
            "sprintId": "2623",
            "percentage": 75
          },
          {
            "sprintId": "2624",
            "percentage": 75
          },
          {
            "sprintId": "2625",
            "percentage": 75
          },
          {
            "sprintId": "2626",
            "percentage": 75
          }
        ]
      }
    ]
  },
  {
    "id": "eric-schmidt",
    "name": "Eric Schmidt",
    "department": "EDE",
    "role": "Developer",
    "allocations": [
      {
        "projectId": "proj-gnma-hecm",
        "projectName": "GNMA HECM",
        "podId": "pod-gnma-hecm",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 15
          },
          {
            "sprintId": "2608",
            "percentage": 15
          },
          {
            "sprintId": "2609",
            "percentage": 15
          },
          {
            "sprintId": "2610",
            "percentage": 15
          },
          {
            "sprintId": "2611",
            "percentage": 15
          },
          {
            "sprintId": "2612",
            "percentage": 15
          },
          {
            "sprintId": "2613",
            "percentage": 15
          }
        ]
      },
      {
        "projectId": "proj-treasury-optimization",
        "projectName": "Treasury Optimization",
        "podId": "pod-treasury-optimization",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 25
          },
          {
            "sprintId": "2608",
            "percentage": 25
          },
          {
            "sprintId": "2609",
            "percentage": 25
          },
          {
            "sprintId": "2610",
            "percentage": 25
          },
          {
            "sprintId": "2611",
            "percentage": 25
          },
          {
            "sprintId": "2612",
            "percentage": 25
          },
          {
            "sprintId": "2613",
            "percentage": 25
          },
          {
            "sprintId": "2614",
            "percentage": 25
          },
          {
            "sprintId": "2615",
            "percentage": 25
          },
          {
            "sprintId": "2616",
            "percentage": 25
          },
          {
            "sprintId": "2617",
            "percentage": 25
          },
          {
            "sprintId": "2618",
            "percentage": 25
          },
          {
            "sprintId": "2619",
            "percentage": 25
          },
          {
            "sprintId": "2620",
            "percentage": 25
          },
          {
            "sprintId": "2621",
            "percentage": 25
          },
          {
            "sprintId": "2622",
            "percentage": 25
          },
          {
            "sprintId": "2623",
            "percentage": 25
          },
          {
            "sprintId": "2624",
            "percentage": 25
          },
          {
            "sprintId": "2625",
            "percentage": 25
          },
          {
            "sprintId": "2626",
            "percentage": 25
          }
        ]
      },
      {
        "projectId": "proj-enhancements--msd-",
        "projectName": "Enhancements (MSD)",
        "podId": "pod-enhancements--msd-",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 50
          },
          {
            "sprintId": "2608",
            "percentage": 50
          },
          {
            "sprintId": "2609",
            "percentage": 50
          },
          {
            "sprintId": "2610",
            "percentage": 50
          },
          {
            "sprintId": "2611",
            "percentage": 50
          },
          {
            "sprintId": "2612",
            "percentage": 50
          },
          {
            "sprintId": "2613",
            "percentage": 50
          }
        ]
      }
    ]
  },
  {
    "id": "rick-ritts",
    "name": "Rick Ritts",
    "department": "EDE",
    "role": "Developer",
    "allocations": [
      {
        "projectId": "proj-meridian--cloud-",
        "projectName": "Meridian (Cloud)",
        "podId": "pod-meridian--cloud-",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 100
          },
          {
            "sprintId": "2608",
            "percentage": 100
          },
          {
            "sprintId": "2609",
            "percentage": 100
          },
          {
            "sprintId": "2610",
            "percentage": 100
          },
          {
            "sprintId": "2611",
            "percentage": 100
          },
          {
            "sprintId": "2612",
            "percentage": 100
          },
          {
            "sprintId": "2613",
            "percentage": 100
          },
          {
            "sprintId": "2614",
            "percentage": 100
          },
          {
            "sprintId": "2615",
            "percentage": 100
          },
          {
            "sprintId": "2616",
            "percentage": 100
          },
          {
            "sprintId": "2617",
            "percentage": 100
          },
          {
            "sprintId": "2618",
            "percentage": 100
          },
          {
            "sprintId": "2619",
            "percentage": 100
          },
          {
            "sprintId": "2620",
            "percentage": 100
          },
          {
            "sprintId": "2621",
            "percentage": 100
          },
          {
            "sprintId": "2622",
            "percentage": 100
          },
          {
            "sprintId": "2623",
            "percentage": 100
          },
          {
            "sprintId": "2624",
            "percentage": 100
          },
          {
            "sprintId": "2625",
            "percentage": 100
          },
          {
            "sprintId": "2626",
            "percentage": 100
          }
        ]
      }
    ]
  },
  {
    "id": "amir-hama",
    "name": "Amir Hama",
    "department": "EDE",
    "role": "Developer",
    "allocations": [
      {
        "projectId": "proj-meridian--cloud-",
        "projectName": "Meridian (Cloud)",
        "podId": "pod-meridian--cloud-",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 100
          },
          {
            "sprintId": "2608",
            "percentage": 100
          },
          {
            "sprintId": "2609",
            "percentage": 100
          },
          {
            "sprintId": "2610",
            "percentage": 100
          },
          {
            "sprintId": "2611",
            "percentage": 100
          },
          {
            "sprintId": "2612",
            "percentage": 100
          },
          {
            "sprintId": "2613",
            "percentage": 100
          },
          {
            "sprintId": "2614",
            "percentage": 100
          },
          {
            "sprintId": "2615",
            "percentage": 100
          },
          {
            "sprintId": "2616",
            "percentage": 100
          },
          {
            "sprintId": "2617",
            "percentage": 100
          },
          {
            "sprintId": "2618",
            "percentage": 100
          },
          {
            "sprintId": "2619",
            "percentage": 100
          },
          {
            "sprintId": "2620",
            "percentage": 100
          },
          {
            "sprintId": "2621",
            "percentage": 100
          },
          {
            "sprintId": "2622",
            "percentage": 100
          },
          {
            "sprintId": "2623",
            "percentage": 100
          },
          {
            "sprintId": "2624",
            "percentage": 100
          },
          {
            "sprintId": "2625",
            "percentage": 100
          },
          {
            "sprintId": "2626",
            "percentage": 100
          }
        ]
      }
    ]
  },
  {
    "id": "andrew-hofmann",
    "name": "Andrew Hofmann",
    "department": "EDE",
    "role": "Developer",
    "allocations": [
      {
        "projectId": "proj-meridian--cloud-",
        "projectName": "Meridian (Cloud)",
        "podId": "pod-meridian--cloud-",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 50
          },
          {
            "sprintId": "2608",
            "percentage": 50
          },
          {
            "sprintId": "2609",
            "percentage": 50
          },
          {
            "sprintId": "2610",
            "percentage": 50
          },
          {
            "sprintId": "2611",
            "percentage": 50
          },
          {
            "sprintId": "2612",
            "percentage": 50
          },
          {
            "sprintId": "2613",
            "percentage": 50
          },
          {
            "sprintId": "2614",
            "percentage": 50
          },
          {
            "sprintId": "2615",
            "percentage": 50
          },
          {
            "sprintId": "2616",
            "percentage": 50
          },
          {
            "sprintId": "2617",
            "percentage": 50
          },
          {
            "sprintId": "2618",
            "percentage": 50
          },
          {
            "sprintId": "2619",
            "percentage": 50
          },
          {
            "sprintId": "2620",
            "percentage": 50
          },
          {
            "sprintId": "2621",
            "percentage": 50
          },
          {
            "sprintId": "2622",
            "percentage": 50
          },
          {
            "sprintId": "2623",
            "percentage": 50
          },
          {
            "sprintId": "2624",
            "percentage": 50
          },
          {
            "sprintId": "2625",
            "percentage": 50
          },
          {
            "sprintId": "2626",
            "percentage": 50
          }
        ]
      },
      {
        "projectId": "proj-enhancements--msd-",
        "projectName": "Enhancements (MSD)",
        "podId": "pod-enhancements--msd-",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 50
          },
          {
            "sprintId": "2608",
            "percentage": 50
          },
          {
            "sprintId": "2609",
            "percentage": 50
          },
          {
            "sprintId": "2610",
            "percentage": 50
          },
          {
            "sprintId": "2611",
            "percentage": 50
          },
          {
            "sprintId": "2612",
            "percentage": 50
          },
          {
            "sprintId": "2613",
            "percentage": 50
          }
        ]
      }
    ]
  },
  {
    "id": "anandi-rao",
    "name": "Anandi Rao",
    "department": "EDE",
    "role": "Developer",
    "allocations": [
      {
        "projectId": "proj-letter-conversion---print-vendor-implementation",
        "projectName": "Letter Conversion & Print Vendor Implementation",
        "podId": "pod-letter-conversion---print-vendor-implementation",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 100
          },
          {
            "sprintId": "2608",
            "percentage": 100
          },
          {
            "sprintId": "2609",
            "percentage": 100
          },
          {
            "sprintId": "2610",
            "percentage": 100
          },
          {
            "sprintId": "2611",
            "percentage": 100
          }
        ]
      },
      {
        "projectId": "proj-letter-conversion---print-vendor-implementation",
        "projectName": "Letter Conversion & Print Vendor Implementation",
        "podId": "pod-letter-conversion---print-vendor-implementation",
        "sprintAllocations": [
          {
            "sprintId": "2612",
            "percentage": 100
          },
          {
            "sprintId": "2613",
            "percentage": 100
          },
          {
            "sprintId": "2614",
            "percentage": 100
          },
          {
            "sprintId": "2615",
            "percentage": 100
          },
          {
            "sprintId": "2616",
            "percentage": 100
          },
          {
            "sprintId": "2617",
            "percentage": 100
          },
          {
            "sprintId": "2618",
            "percentage": 100
          },
          {
            "sprintId": "2619",
            "percentage": 100
          },
          {
            "sprintId": "2620",
            "percentage": 100
          },
          {
            "sprintId": "2621",
            "percentage": 100
          },
          {
            "sprintId": "2622",
            "percentage": 100
          },
          {
            "sprintId": "2623",
            "percentage": 100
          },
          {
            "sprintId": "2624",
            "percentage": 100
          },
          {
            "sprintId": "2625",
            "percentage": 100
          },
          {
            "sprintId": "2626",
            "percentage": 100
          }
        ]
      }
    ]
  },
  {
    "id": "nick-miner",
    "name": "Nick Miner",
    "department": "EDE",
    "role": "Developer",
    "allocations": [
      {
        "projectId": "proj-letter-conversion---print-vendor-implementation",
        "projectName": "Letter Conversion & Print Vendor Implementation",
        "podId": "pod-letter-conversion---print-vendor-implementation",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 70
          },
          {
            "sprintId": "2608",
            "percentage": 70
          },
          {
            "sprintId": "2609",
            "percentage": 70
          },
          {
            "sprintId": "2610",
            "percentage": 70
          },
          {
            "sprintId": "2611",
            "percentage": 70
          }
        ]
      },
      {
        "projectId": "proj-letter-conversion---print-vendor-implementation",
        "projectName": "Letter Conversion & Print Vendor Implementation",
        "podId": "pod-letter-conversion---print-vendor-implementation",
        "sprintAllocations": [
          {
            "sprintId": "2612",
            "percentage": 70
          },
          {
            "sprintId": "2613",
            "percentage": 70
          },
          {
            "sprintId": "2614",
            "percentage": 70
          },
          {
            "sprintId": "2615",
            "percentage": 70
          },
          {
            "sprintId": "2616",
            "percentage": 70
          },
          {
            "sprintId": "2617",
            "percentage": 70
          },
          {
            "sprintId": "2618",
            "percentage": 70
          },
          {
            "sprintId": "2619",
            "percentage": 70
          },
          {
            "sprintId": "2620",
            "percentage": 70
          },
          {
            "sprintId": "2621",
            "percentage": 70
          },
          {
            "sprintId": "2622",
            "percentage": 70
          },
          {
            "sprintId": "2623",
            "percentage": 70
          },
          {
            "sprintId": "2624",
            "percentage": 70
          },
          {
            "sprintId": "2625",
            "percentage": 70
          },
          {
            "sprintId": "2626",
            "percentage": 70
          }
        ]
      },
      {
        "projectId": "proj-enhancements--letters-",
        "projectName": "Enhancements (Letters)",
        "podId": "pod-enhancements--letters-",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 30
          },
          {
            "sprintId": "2608",
            "percentage": 30
          },
          {
            "sprintId": "2609",
            "percentage": 30
          },
          {
            "sprintId": "2610",
            "percentage": 30
          },
          {
            "sprintId": "2611",
            "percentage": 30
          },
          {
            "sprintId": "2612",
            "percentage": 30
          },
          {
            "sprintId": "2613",
            "percentage": 30
          }
        ]
      }
    ]
  },
  {
    "id": "stephanos-theodorou",
    "name": "Stephanos Theodorou",
    "department": "EDE",
    "role": "Developer",
    "allocations": [
      {
        "projectId": "proj-ocr",
        "projectName": "OCR",
        "podId": "pod-ocr",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 100
          },
          {
            "sprintId": "2608",
            "percentage": 100
          },
          {
            "sprintId": "2609",
            "percentage": 100
          },
          {
            "sprintId": "2610",
            "percentage": 100
          },
          {
            "sprintId": "2611",
            "percentage": 100
          },
          {
            "sprintId": "2612",
            "percentage": 100
          },
          {
            "sprintId": "2613",
            "percentage": 100
          },
          {
            "sprintId": "2614",
            "percentage": 100
          },
          {
            "sprintId": "2615",
            "percentage": 100
          },
          {
            "sprintId": "2616",
            "percentage": 100
          },
          {
            "sprintId": "2617",
            "percentage": 100
          },
          {
            "sprintId": "2618",
            "percentage": 100
          },
          {
            "sprintId": "2619",
            "percentage": 100
          },
          {
            "sprintId": "2620",
            "percentage": 100
          },
          {
            "sprintId": "2621",
            "percentage": 100
          },
          {
            "sprintId": "2622",
            "percentage": 100
          },
          {
            "sprintId": "2623",
            "percentage": 100
          },
          {
            "sprintId": "2624",
            "percentage": 100
          },
          {
            "sprintId": "2625",
            "percentage": 100
          },
          {
            "sprintId": "2626",
            "percentage": 100
          }
        ]
      }
    ]
  },
  {
    "id": "scott-mayer",
    "name": "Scott Mayer",
    "department": "EDE",
    "role": "Developer",
    "allocations": [
      {
        "projectId": "proj-life-of-loan",
        "projectName": "Life of Loan",
        "podId": "pod-life-of-loan",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 100
          },
          {
            "sprintId": "2608",
            "percentage": 100
          },
          {
            "sprintId": "2609",
            "percentage": 100
          },
          {
            "sprintId": "2610",
            "percentage": 100
          },
          {
            "sprintId": "2611",
            "percentage": 100
          },
          {
            "sprintId": "2612",
            "percentage": 100
          },
          {
            "sprintId": "2613",
            "percentage": 100
          },
          {
            "sprintId": "2614",
            "percentage": 100
          },
          {
            "sprintId": "2615",
            "percentage": 100
          },
          {
            "sprintId": "2616",
            "percentage": 100
          },
          {
            "sprintId": "2617",
            "percentage": 100
          },
          {
            "sprintId": "2618",
            "percentage": 100
          },
          {
            "sprintId": "2619",
            "percentage": 100
          },
          {
            "sprintId": "2620",
            "percentage": 100
          },
          {
            "sprintId": "2621",
            "percentage": 100
          },
          {
            "sprintId": "2622",
            "percentage": 100
          },
          {
            "sprintId": "2623",
            "percentage": 100
          },
          {
            "sprintId": "2624",
            "percentage": 100
          },
          {
            "sprintId": "2625",
            "percentage": 100
          },
          {
            "sprintId": "2626",
            "percentage": 100
          }
        ]
      }
    ]
  },
  {
    "id": "bhavna-bhat",
    "name": "Bhavna Bhat",
    "department": "EDE",
    "role": "Developer",
    "allocations": [
      {
        "projectId": "proj-enhancements--msd-",
        "projectName": "Enhancements (MSD)",
        "podId": "pod-enhancements--msd-",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 30
          },
          {
            "sprintId": "2608",
            "percentage": 30
          },
          {
            "sprintId": "2609",
            "percentage": 30
          },
          {
            "sprintId": "2610",
            "percentage": 30
          },
          {
            "sprintId": "2611",
            "percentage": 30
          },
          {
            "sprintId": "2612",
            "percentage": 30
          },
          {
            "sprintId": "2613",
            "percentage": 30
          }
        ]
      },
      {
        "projectId": "proj-production-support",
        "projectName": "Production Support",
        "podId": "pod-production-support",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 70
          },
          {
            "sprintId": "2608",
            "percentage": 70
          },
          {
            "sprintId": "2609",
            "percentage": 70
          },
          {
            "sprintId": "2610",
            "percentage": 70
          },
          {
            "sprintId": "2611",
            "percentage": 70
          },
          {
            "sprintId": "2612",
            "percentage": 70
          },
          {
            "sprintId": "2613",
            "percentage": 70
          },
          {
            "sprintId": "2614",
            "percentage": 70
          },
          {
            "sprintId": "2615",
            "percentage": 70
          },
          {
            "sprintId": "2616",
            "percentage": 70
          },
          {
            "sprintId": "2617",
            "percentage": 70
          },
          {
            "sprintId": "2618",
            "percentage": 70
          },
          {
            "sprintId": "2619",
            "percentage": 70
          },
          {
            "sprintId": "2620",
            "percentage": 70
          },
          {
            "sprintId": "2621",
            "percentage": 70
          },
          {
            "sprintId": "2622",
            "percentage": 70
          },
          {
            "sprintId": "2623",
            "percentage": 70
          },
          {
            "sprintId": "2624",
            "percentage": 70
          },
          {
            "sprintId": "2625",
            "percentage": 70
          },
          {
            "sprintId": "2626",
            "percentage": 70
          }
        ]
      }
    ]
  },
  {
    "id": "max-dedo",
    "name": "Max Dedo",
    "department": "EDE",
    "role": "Developer",
    "allocations": [
      {
        "projectId": "proj-enhancements--msd-",
        "projectName": "Enhancements (MSD)",
        "podId": "pod-enhancements--msd-",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 100
          },
          {
            "sprintId": "2608",
            "percentage": 100
          },
          {
            "sprintId": "2609",
            "percentage": 100
          },
          {
            "sprintId": "2610",
            "percentage": 100
          },
          {
            "sprintId": "2611",
            "percentage": 100
          },
          {
            "sprintId": "2612",
            "percentage": 100
          },
          {
            "sprintId": "2613",
            "percentage": 100
          }
        ]
      }
    ]
  },
  {
    "id": "hunter-teston",
    "name": "Hunter Teston",
    "department": "EDE",
    "role": "Developer",
    "allocations": [
      {
        "projectId": "proj-enhancements--cx-",
        "projectName": "Enhancements (CX)",
        "podId": "pod-enhancements--cx-",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 90
          },
          {
            "sprintId": "2608",
            "percentage": 90
          },
          {
            "sprintId": "2609",
            "percentage": 90
          },
          {
            "sprintId": "2610",
            "percentage": 90
          },
          {
            "sprintId": "2611",
            "percentage": 90
          },
          {
            "sprintId": "2612",
            "percentage": 90
          },
          {
            "sprintId": "2613",
            "percentage": 90
          }
        ]
      },
      {
        "projectId": "proj-ccm-support",
        "projectName": "CCM Support",
        "podId": "pod-ccm-support",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 10
          },
          {
            "sprintId": "2608",
            "percentage": 10
          },
          {
            "sprintId": "2609",
            "percentage": 10
          },
          {
            "sprintId": "2610",
            "percentage": 10
          },
          {
            "sprintId": "2611",
            "percentage": 10
          },
          {
            "sprintId": "2612",
            "percentage": 10
          },
          {
            "sprintId": "2613",
            "percentage": 10
          }
        ]
      }
    ]
  },
  {
    "id": "randy-huang",
    "name": "Randy Huang",
    "department": "EDE",
    "role": "Developer",
    "allocations": [
      {
        "projectId": "proj-enhancements--crm-",
        "projectName": "Enhancements (CRM)",
        "podId": "pod-enhancements--crm-",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 100
          },
          {
            "sprintId": "2608",
            "percentage": 100
          },
          {
            "sprintId": "2609",
            "percentage": 100
          },
          {
            "sprintId": "2610",
            "percentage": 100
          },
          {
            "sprintId": "2611",
            "percentage": 100
          },
          {
            "sprintId": "2612",
            "percentage": 100
          },
          {
            "sprintId": "2613",
            "percentage": 100
          }
        ]
      }
    ]
  },
  {
    "id": "adam-dean",
    "name": "Adam Dean",
    "department": "EDE",
    "role": "Developer",
    "allocations": [
      {
        "projectId": "proj-ccm-support",
        "projectName": "CCM Support",
        "podId": "pod-ccm-support",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 100
          },
          {
            "sprintId": "2608",
            "percentage": 100
          },
          {
            "sprintId": "2609",
            "percentage": 100
          },
          {
            "sprintId": "2610",
            "percentage": 100
          },
          {
            "sprintId": "2611",
            "percentage": 100
          },
          {
            "sprintId": "2612",
            "percentage": 100
          },
          {
            "sprintId": "2613",
            "percentage": 100
          }
        ]
      }
    ]
  },
  {
    "id": "jagdish-bishnoi",
    "name": "Jagdish Bishnoi",
    "department": "EDE",
    "role": "Developer",
    "allocations": [
      {
        "projectId": "proj-production-support",
        "projectName": "Production Support",
        "podId": "pod-production-support",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 100
          },
          {
            "sprintId": "2608",
            "percentage": 50
          },
          {
            "sprintId": "2609",
            "percentage": 100
          },
          {
            "sprintId": "2610",
            "percentage": 100
          },
          {
            "sprintId": "2611",
            "percentage": 100
          },
          {
            "sprintId": "2612",
            "percentage": 100
          },
          {
            "sprintId": "2613",
            "percentage": 100
          },
          {
            "sprintId": "2614",
            "percentage": 100
          },
          {
            "sprintId": "2615",
            "percentage": 100
          },
          {
            "sprintId": "2616",
            "percentage": 100
          },
          {
            "sprintId": "2617",
            "percentage": 100
          },
          {
            "sprintId": "2618",
            "percentage": 100
          },
          {
            "sprintId": "2619",
            "percentage": 100
          },
          {
            "sprintId": "2620",
            "percentage": 100
          },
          {
            "sprintId": "2621",
            "percentage": 100
          },
          {
            "sprintId": "2622",
            "percentage": 100
          },
          {
            "sprintId": "2623",
            "percentage": 100
          },
          {
            "sprintId": "2624",
            "percentage": 100
          },
          {
            "sprintId": "2625",
            "percentage": 100
          },
          {
            "sprintId": "2626",
            "percentage": 100
          }
        ]
      }
    ]
  },
  {
    "id": "lamont-ford",
    "name": "Lamont Ford",
    "department": "EDE",
    "role": "Developer",
    "allocations": [
      {
        "projectId": "proj-production-support",
        "projectName": "Production Support",
        "podId": "pod-production-support",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 100
          },
          {
            "sprintId": "2608",
            "percentage": 100
          },
          {
            "sprintId": "2609",
            "percentage": 100
          },
          {
            "sprintId": "2610",
            "percentage": 100
          },
          {
            "sprintId": "2611",
            "percentage": 100
          },
          {
            "sprintId": "2612",
            "percentage": 100
          },
          {
            "sprintId": "2613",
            "percentage": 100
          },
          {
            "sprintId": "2614",
            "percentage": 100
          },
          {
            "sprintId": "2615",
            "percentage": 100
          },
          {
            "sprintId": "2616",
            "percentage": 100
          },
          {
            "sprintId": "2617",
            "percentage": 100
          },
          {
            "sprintId": "2618",
            "percentage": 100
          },
          {
            "sprintId": "2619",
            "percentage": 100
          },
          {
            "sprintId": "2620",
            "percentage": 100
          },
          {
            "sprintId": "2621",
            "percentage": 100
          },
          {
            "sprintId": "2622",
            "percentage": 100
          },
          {
            "sprintId": "2623",
            "percentage": 100
          },
          {
            "sprintId": "2624",
            "percentage": 100
          },
          {
            "sprintId": "2625",
            "percentage": 100
          },
          {
            "sprintId": "2626",
            "percentage": 100
          }
        ]
      }
    ]
  },
  {
    "id": "robert-weissenberg",
    "name": "Robert Weissenberg",
    "department": "EDE",
    "role": "Developer",
    "allocations": [
      {
        "projectId": "proj-production-support",
        "projectName": "Production Support",
        "podId": "pod-production-support",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 100
          },
          {
            "sprintId": "2608",
            "percentage": 100
          },
          {
            "sprintId": "2609",
            "percentage": 100
          },
          {
            "sprintId": "2610",
            "percentage": 100
          },
          {
            "sprintId": "2611",
            "percentage": 100
          },
          {
            "sprintId": "2612",
            "percentage": 100
          },
          {
            "sprintId": "2613",
            "percentage": 100
          },
          {
            "sprintId": "2614",
            "percentage": 100
          },
          {
            "sprintId": "2615",
            "percentage": 100
          },
          {
            "sprintId": "2616",
            "percentage": 100
          },
          {
            "sprintId": "2617",
            "percentage": 100
          },
          {
            "sprintId": "2618",
            "percentage": 100
          },
          {
            "sprintId": "2619",
            "percentage": 100
          },
          {
            "sprintId": "2620",
            "percentage": 100
          },
          {
            "sprintId": "2621",
            "percentage": 100
          },
          {
            "sprintId": "2622",
            "percentage": 100
          },
          {
            "sprintId": "2623",
            "percentage": 100
          },
          {
            "sprintId": "2624",
            "percentage": 100
          },
          {
            "sprintId": "2625",
            "percentage": 100
          },
          {
            "sprintId": "2626",
            "percentage": 100
          }
        ]
      }
    ]
  },
  {
    "id": "shiva-bettegowda",
    "name": "Shiva Bettegowda",
    "department": "EDE",
    "role": "Developer",
    "allocations": [
      {
        "projectId": "proj-production-support",
        "projectName": "Production Support",
        "podId": "pod-production-support",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 100
          },
          {
            "sprintId": "2608",
            "percentage": 100
          },
          {
            "sprintId": "2609",
            "percentage": 100
          },
          {
            "sprintId": "2610",
            "percentage": 100
          },
          {
            "sprintId": "2611",
            "percentage": 100
          },
          {
            "sprintId": "2612",
            "percentage": 100
          },
          {
            "sprintId": "2613",
            "percentage": 100
          },
          {
            "sprintId": "2614",
            "percentage": 100
          },
          {
            "sprintId": "2615",
            "percentage": 100
          },
          {
            "sprintId": "2616",
            "percentage": 100
          },
          {
            "sprintId": "2617",
            "percentage": 100
          },
          {
            "sprintId": "2618",
            "percentage": 100
          },
          {
            "sprintId": "2619",
            "percentage": 100
          },
          {
            "sprintId": "2620",
            "percentage": 100
          },
          {
            "sprintId": "2621",
            "percentage": 100
          },
          {
            "sprintId": "2622",
            "percentage": 100
          },
          {
            "sprintId": "2623",
            "percentage": 100
          },
          {
            "sprintId": "2624",
            "percentage": 100
          },
          {
            "sprintId": "2625",
            "percentage": 100
          },
          {
            "sprintId": "2626",
            "percentage": 100
          }
        ]
      }
    ]
  },
  {
    "id": "zee-ansari",
    "name": "Zee Ansari",
    "department": "EDE",
    "role": "Developer",
    "allocations": [
      {
        "projectId": "proj-business-intelligence--lending-analytics-",
        "projectName": "Business Intelligence (Lending Analytics)",
        "podId": "pod-business-intelligence--lending-analytics-",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 100
          },
          {
            "sprintId": "2608",
            "percentage": 100
          },
          {
            "sprintId": "2609",
            "percentage": 100
          },
          {
            "sprintId": "2610",
            "percentage": 100
          },
          {
            "sprintId": "2611",
            "percentage": 100
          },
          {
            "sprintId": "2612",
            "percentage": 100
          },
          {
            "sprintId": "2613",
            "percentage": 100
          },
          {
            "sprintId": "2614",
            "percentage": 100
          },
          {
            "sprintId": "2615",
            "percentage": 100
          },
          {
            "sprintId": "2616",
            "percentage": 100
          },
          {
            "sprintId": "2617",
            "percentage": 100
          },
          {
            "sprintId": "2618",
            "percentage": 100
          },
          {
            "sprintId": "2619",
            "percentage": 100
          },
          {
            "sprintId": "2620",
            "percentage": 100
          },
          {
            "sprintId": "2621",
            "percentage": 100
          },
          {
            "sprintId": "2622",
            "percentage": 100
          },
          {
            "sprintId": "2623",
            "percentage": 100
          },
          {
            "sprintId": "2624",
            "percentage": 100
          },
          {
            "sprintId": "2625",
            "percentage": 100
          },
          {
            "sprintId": "2626",
            "percentage": 100
          }
        ]
      }
    ]
  },
  {
    "id": "joshua-brewster",
    "name": "Joshua Brewster",
    "department": "EDE",
    "role": "Developer",
    "allocations": [
      {
        "projectId": "proj-business-intelligence--lending-analytics-",
        "projectName": "Business Intelligence (Lending Analytics)",
        "podId": "pod-business-intelligence--lending-analytics-",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 100
          },
          {
            "sprintId": "2608",
            "percentage": 100
          },
          {
            "sprintId": "2609",
            "percentage": 100
          },
          {
            "sprintId": "2610",
            "percentage": 100
          },
          {
            "sprintId": "2611",
            "percentage": 100
          },
          {
            "sprintId": "2612",
            "percentage": 100
          },
          {
            "sprintId": "2613",
            "percentage": 100
          },
          {
            "sprintId": "2614",
            "percentage": 100
          },
          {
            "sprintId": "2615",
            "percentage": 100
          },
          {
            "sprintId": "2616",
            "percentage": 100
          },
          {
            "sprintId": "2617",
            "percentage": 100
          },
          {
            "sprintId": "2618",
            "percentage": 100
          },
          {
            "sprintId": "2619",
            "percentage": 100
          },
          {
            "sprintId": "2620",
            "percentage": 100
          },
          {
            "sprintId": "2621",
            "percentage": 100
          },
          {
            "sprintId": "2622",
            "percentage": 100
          },
          {
            "sprintId": "2623",
            "percentage": 100
          },
          {
            "sprintId": "2624",
            "percentage": 100
          },
          {
            "sprintId": "2625",
            "percentage": 100
          },
          {
            "sprintId": "2626",
            "percentage": 100
          }
        ]
      }
    ]
  },
  {
    "id": "nathan-garten",
    "name": "Nathan Garten",
    "department": "EDE",
    "role": "Developer",
    "allocations": [
      {
        "projectId": "proj-business-intelligence--lending-analytics-",
        "projectName": "Business Intelligence (Lending Analytics)",
        "podId": "pod-business-intelligence--lending-analytics-",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 100
          },
          {
            "sprintId": "2608",
            "percentage": 100
          },
          {
            "sprintId": "2609",
            "percentage": 100
          },
          {
            "sprintId": "2610",
            "percentage": 100
          },
          {
            "sprintId": "2611",
            "percentage": 100
          },
          {
            "sprintId": "2612",
            "percentage": 100
          },
          {
            "sprintId": "2613",
            "percentage": 100
          },
          {
            "sprintId": "2614",
            "percentage": 100
          },
          {
            "sprintId": "2615",
            "percentage": 100
          },
          {
            "sprintId": "2616",
            "percentage": 100
          },
          {
            "sprintId": "2617",
            "percentage": 100
          },
          {
            "sprintId": "2618",
            "percentage": 100
          },
          {
            "sprintId": "2619",
            "percentage": 100
          },
          {
            "sprintId": "2620",
            "percentage": 100
          },
          {
            "sprintId": "2621",
            "percentage": 100
          },
          {
            "sprintId": "2622",
            "percentage": 100
          },
          {
            "sprintId": "2623",
            "percentage": 100
          },
          {
            "sprintId": "2624",
            "percentage": 100
          },
          {
            "sprintId": "2625",
            "percentage": 100
          },
          {
            "sprintId": "2626",
            "percentage": 100
          }
        ]
      },
      {
        "projectId": "proj-business-intelligence--lending-analytics-",
        "projectName": "Business Intelligence (Lending Analytics)",
        "podId": "pod-business-intelligence--lending-analytics-",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 100
          },
          {
            "sprintId": "2608",
            "percentage": 100
          },
          {
            "sprintId": "2609",
            "percentage": 100
          },
          {
            "sprintId": "2610",
            "percentage": 100
          },
          {
            "sprintId": "2611",
            "percentage": 100
          },
          {
            "sprintId": "2612",
            "percentage": 100
          },
          {
            "sprintId": "2613",
            "percentage": 100
          },
          {
            "sprintId": "2614",
            "percentage": 100
          },
          {
            "sprintId": "2615",
            "percentage": 100
          },
          {
            "sprintId": "2616",
            "percentage": 100
          },
          {
            "sprintId": "2617",
            "percentage": 100
          },
          {
            "sprintId": "2618",
            "percentage": 100
          },
          {
            "sprintId": "2619",
            "percentage": 100
          },
          {
            "sprintId": "2620",
            "percentage": 100
          },
          {
            "sprintId": "2621",
            "percentage": 100
          },
          {
            "sprintId": "2622",
            "percentage": 100
          },
          {
            "sprintId": "2623",
            "percentage": 100
          },
          {
            "sprintId": "2624",
            "percentage": 100
          },
          {
            "sprintId": "2625",
            "percentage": 100
          },
          {
            "sprintId": "2626",
            "percentage": 100
          }
        ]
      }
    ]
  },
  {
    "id": "aaron-robinson",
    "name": "Aaron Robinson",
    "department": "EDE",
    "role": "Developer",
    "allocations": [
      {
        "projectId": "proj-business-intelligence--lending-analytics-",
        "projectName": "Business Intelligence (Lending Analytics)",
        "podId": "pod-business-intelligence--lending-analytics-",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 100
          },
          {
            "sprintId": "2608",
            "percentage": 100
          },
          {
            "sprintId": "2609",
            "percentage": 100
          },
          {
            "sprintId": "2610",
            "percentage": 100
          },
          {
            "sprintId": "2611",
            "percentage": 100
          },
          {
            "sprintId": "2612",
            "percentage": 100
          },
          {
            "sprintId": "2613",
            "percentage": 100
          },
          {
            "sprintId": "2614",
            "percentage": 100
          },
          {
            "sprintId": "2615",
            "percentage": 100
          },
          {
            "sprintId": "2616",
            "percentage": 100
          },
          {
            "sprintId": "2617",
            "percentage": 100
          },
          {
            "sprintId": "2618",
            "percentage": 100
          },
          {
            "sprintId": "2619",
            "percentage": 100
          },
          {
            "sprintId": "2620",
            "percentage": 100
          },
          {
            "sprintId": "2621",
            "percentage": 100
          },
          {
            "sprintId": "2622",
            "percentage": 100
          },
          {
            "sprintId": "2623",
            "percentage": 100
          },
          {
            "sprintId": "2624",
            "percentage": 100
          },
          {
            "sprintId": "2625",
            "percentage": 100
          },
          {
            "sprintId": "2626",
            "percentage": 100
          }
        ]
      }
    ]
  },
  {
    "id": "corey-walker",
    "name": "Corey Walker",
    "department": "EDE",
    "role": "Developer",
    "allocations": [
      {
        "projectId": "proj-business-intelligence--servicing-analytics-",
        "projectName": "Business Intelligence (Servicing Analytics)",
        "podId": "pod-business-intelligence--servicing-analytics-",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 100
          },
          {
            "sprintId": "2608",
            "percentage": 100
          },
          {
            "sprintId": "2609",
            "percentage": 100
          },
          {
            "sprintId": "2610",
            "percentage": 100
          },
          {
            "sprintId": "2611",
            "percentage": 100
          },
          {
            "sprintId": "2612",
            "percentage": 100
          },
          {
            "sprintId": "2613",
            "percentage": 100
          },
          {
            "sprintId": "2614",
            "percentage": 100
          },
          {
            "sprintId": "2615",
            "percentage": 100
          },
          {
            "sprintId": "2616",
            "percentage": 100
          },
          {
            "sprintId": "2617",
            "percentage": 100
          },
          {
            "sprintId": "2618",
            "percentage": 100
          },
          {
            "sprintId": "2619",
            "percentage": 100
          },
          {
            "sprintId": "2620",
            "percentage": 100
          },
          {
            "sprintId": "2621",
            "percentage": 100
          },
          {
            "sprintId": "2622",
            "percentage": 100
          },
          {
            "sprintId": "2623",
            "percentage": 100
          },
          {
            "sprintId": "2624",
            "percentage": 100
          },
          {
            "sprintId": "2625",
            "percentage": 100
          },
          {
            "sprintId": "2626",
            "percentage": 100
          }
        ]
      }
    ]
  },
  {
    "id": "geoff-grant",
    "name": "Geoff Grant",
    "department": "EDE",
    "role": "Developer",
    "allocations": [
      {
        "projectId": "proj-business-intelligence--servicing-analytics-",
        "projectName": "Business Intelligence (Servicing Analytics)",
        "podId": "pod-business-intelligence--servicing-analytics-",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 100
          },
          {
            "sprintId": "2608",
            "percentage": 100
          },
          {
            "sprintId": "2609",
            "percentage": 100
          },
          {
            "sprintId": "2610",
            "percentage": 100
          },
          {
            "sprintId": "2611",
            "percentage": 100
          },
          {
            "sprintId": "2612",
            "percentage": 100
          },
          {
            "sprintId": "2613",
            "percentage": 100
          },
          {
            "sprintId": "2614",
            "percentage": 100
          },
          {
            "sprintId": "2615",
            "percentage": 100
          },
          {
            "sprintId": "2616",
            "percentage": 100
          },
          {
            "sprintId": "2617",
            "percentage": 100
          },
          {
            "sprintId": "2618",
            "percentage": 100
          },
          {
            "sprintId": "2619",
            "percentage": 100
          },
          {
            "sprintId": "2620",
            "percentage": 100
          },
          {
            "sprintId": "2621",
            "percentage": 100
          },
          {
            "sprintId": "2622",
            "percentage": 100
          },
          {
            "sprintId": "2623",
            "percentage": 100
          },
          {
            "sprintId": "2624",
            "percentage": 100
          },
          {
            "sprintId": "2625",
            "percentage": 100
          },
          {
            "sprintId": "2626",
            "percentage": 100
          }
        ]
      }
    ]
  },
  {
    "id": "zane-searchwell",
    "name": "Zane Searchwell",
    "department": "EDE",
    "role": "Developer",
    "allocations": [
      {
        "projectId": "proj-business-intelligence--servicing-analytics-",
        "projectName": "Business Intelligence (Servicing Analytics)",
        "podId": "pod-business-intelligence--servicing-analytics-",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 100
          },
          {
            "sprintId": "2608",
            "percentage": 100
          },
          {
            "sprintId": "2609",
            "percentage": 100
          },
          {
            "sprintId": "2610",
            "percentage": 100
          },
          {
            "sprintId": "2611",
            "percentage": 100
          },
          {
            "sprintId": "2612",
            "percentage": 100
          },
          {
            "sprintId": "2613",
            "percentage": 100
          },
          {
            "sprintId": "2614",
            "percentage": 100
          },
          {
            "sprintId": "2615",
            "percentage": 100
          },
          {
            "sprintId": "2616",
            "percentage": 100
          },
          {
            "sprintId": "2617",
            "percentage": 100
          },
          {
            "sprintId": "2618",
            "percentage": 100
          },
          {
            "sprintId": "2619",
            "percentage": 100
          },
          {
            "sprintId": "2620",
            "percentage": 100
          },
          {
            "sprintId": "2621",
            "percentage": 100
          },
          {
            "sprintId": "2622",
            "percentage": 100
          },
          {
            "sprintId": "2623",
            "percentage": 100
          },
          {
            "sprintId": "2624",
            "percentage": 100
          },
          {
            "sprintId": "2625",
            "percentage": 100
          },
          {
            "sprintId": "2626",
            "percentage": 100
          }
        ]
      }
    ]
  },
  {
    "id": "mark-flores",
    "name": "Mark Flores",
    "department": "EDE",
    "role": "Developer",
    "allocations": [
      {
        "projectId": "proj-business-intelligence--servicing-analytics-",
        "projectName": "Business Intelligence (Servicing Analytics)",
        "podId": "pod-business-intelligence--servicing-analytics-",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 100
          },
          {
            "sprintId": "2608",
            "percentage": 100
          },
          {
            "sprintId": "2609",
            "percentage": 100
          },
          {
            "sprintId": "2610",
            "percentage": 100
          },
          {
            "sprintId": "2611",
            "percentage": 100
          },
          {
            "sprintId": "2612",
            "percentage": 100
          },
          {
            "sprintId": "2613",
            "percentage": 100
          },
          {
            "sprintId": "2614",
            "percentage": 100
          },
          {
            "sprintId": "2615",
            "percentage": 100
          },
          {
            "sprintId": "2616",
            "percentage": 100
          },
          {
            "sprintId": "2617",
            "percentage": 100
          },
          {
            "sprintId": "2618",
            "percentage": 100
          },
          {
            "sprintId": "2619",
            "percentage": 100
          },
          {
            "sprintId": "2620",
            "percentage": 100
          },
          {
            "sprintId": "2621",
            "percentage": 100
          },
          {
            "sprintId": "2622",
            "percentage": 100
          },
          {
            "sprintId": "2623",
            "percentage": 100
          },
          {
            "sprintId": "2624",
            "percentage": 100
          },
          {
            "sprintId": "2625",
            "percentage": 100
          },
          {
            "sprintId": "2626",
            "percentage": 100
          }
        ]
      }
    ]
  },
  {
    "id": "manny-govea",
    "name": "Manny Govea",
    "department": "EDE",
    "role": "Developer",
    "allocations": [
      {
        "projectId": "proj-business-intelligence--servicing-analytics-",
        "projectName": "Business Intelligence (Servicing Analytics)",
        "podId": "pod-business-intelligence--servicing-analytics-",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 100
          },
          {
            "sprintId": "2608",
            "percentage": 100
          },
          {
            "sprintId": "2609",
            "percentage": 100
          },
          {
            "sprintId": "2610",
            "percentage": 100
          },
          {
            "sprintId": "2611",
            "percentage": 100
          },
          {
            "sprintId": "2612",
            "percentage": 100
          },
          {
            "sprintId": "2613",
            "percentage": 100
          },
          {
            "sprintId": "2614",
            "percentage": 100
          },
          {
            "sprintId": "2615",
            "percentage": 100
          },
          {
            "sprintId": "2616",
            "percentage": 100
          },
          {
            "sprintId": "2617",
            "percentage": 100
          },
          {
            "sprintId": "2618",
            "percentage": 100
          },
          {
            "sprintId": "2619",
            "percentage": 100
          },
          {
            "sprintId": "2620",
            "percentage": 100
          },
          {
            "sprintId": "2621",
            "percentage": 100
          },
          {
            "sprintId": "2622",
            "percentage": 100
          },
          {
            "sprintId": "2623",
            "percentage": 100
          },
          {
            "sprintId": "2624",
            "percentage": 100
          },
          {
            "sprintId": "2625",
            "percentage": 100
          },
          {
            "sprintId": "2626",
            "percentage": 100
          }
        ]
      }
    ]
  },
  {
    "id": "sherry-crocker",
    "name": "Sherry Crocker",
    "department": "EDE",
    "role": "Developer",
    "allocations": [
      {
        "projectId": "proj-business-intelligence--servicing-analytics-",
        "projectName": "Business Intelligence (Servicing Analytics)",
        "podId": "pod-business-intelligence--servicing-analytics-",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 100
          },
          {
            "sprintId": "2608",
            "percentage": 100
          },
          {
            "sprintId": "2609",
            "percentage": 100
          },
          {
            "sprintId": "2610",
            "percentage": 100
          },
          {
            "sprintId": "2611",
            "percentage": 100
          },
          {
            "sprintId": "2612",
            "percentage": 100
          },
          {
            "sprintId": "2613",
            "percentage": 100
          },
          {
            "sprintId": "2614",
            "percentage": 100
          },
          {
            "sprintId": "2615",
            "percentage": 100
          },
          {
            "sprintId": "2616",
            "percentage": 100
          },
          {
            "sprintId": "2617",
            "percentage": 100
          },
          {
            "sprintId": "2618",
            "percentage": 100
          },
          {
            "sprintId": "2619",
            "percentage": 100
          },
          {
            "sprintId": "2620",
            "percentage": 100
          },
          {
            "sprintId": "2621",
            "percentage": 100
          },
          {
            "sprintId": "2622",
            "percentage": 100
          },
          {
            "sprintId": "2623",
            "percentage": 100
          },
          {
            "sprintId": "2624",
            "percentage": 100
          },
          {
            "sprintId": "2625",
            "percentage": 100
          },
          {
            "sprintId": "2626",
            "percentage": 100
          }
        ]
      }
    ]
  },
  {
    "id": "nick-sung",
    "name": "Nick Sung",
    "department": "EDE",
    "role": "Developer",
    "allocations": [
      {
        "projectId": "proj-business-intelligence--servicing-analytics-",
        "projectName": "Business Intelligence (Servicing Analytics)",
        "podId": "pod-business-intelligence--servicing-analytics-",
        "sprintAllocations": [
          {
            "sprintId": "2607",
            "percentage": 100
          },
          {
            "sprintId": "2608",
            "percentage": 100
          },
          {
            "sprintId": "2609",
            "percentage": 100
          },
          {
            "sprintId": "2610",
            "percentage": 100
          },
          {
            "sprintId": "2611",
            "percentage": 100
          },
          {
            "sprintId": "2612",
            "percentage": 100
          },
          {
            "sprintId": "2613",
            "percentage": 100
          },
          {
            "sprintId": "2614",
            "percentage": 100
          },
          {
            "sprintId": "2615",
            "percentage": 100
          },
          {
            "sprintId": "2616",
            "percentage": 100
          },
          {
            "sprintId": "2617",
            "percentage": 100
          },
          {
            "sprintId": "2618",
            "percentage": 100
          },
          {
            "sprintId": "2619",
            "percentage": 100
          },
          {
            "sprintId": "2620",
            "percentage": 100
          },
          {
            "sprintId": "2621",
            "percentage": 100
          },
          {
            "sprintId": "2622",
            "percentage": 100
          },
          {
            "sprintId": "2623",
            "percentage": 100
          },
          {
            "sprintId": "2624",
            "percentage": 100
          },
          {
            "sprintId": "2625",
            "percentage": 100
          },
          {
            "sprintId": "2626",
            "percentage": 100
          }
        ]
      }
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
