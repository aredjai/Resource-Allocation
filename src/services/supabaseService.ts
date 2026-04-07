import { supabase } from '../lib/supabase';
import { POD, Resource, Allocation, SprintAllocation } from '../data';

export const supabaseService = {
  async fetchPods(): Promise<POD[]> {
    const { data, error } = await supabase
      .from('pods')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching pods:', error);
      return [];
    }
    return data as POD[];
  },

  async savePods(pods: POD[]) {
    // Upsert pods
    const { error } = await supabase
      .from('pods')
      .upsert(pods.map(p => ({
        id: p.id,
        name: p.name,
        bu: p.bu,
        lead: p.lead,
        description: p.description
      })));
    
    if (error) {
      console.error('Error saving pods:', error);
      throw error;
    }
  },

  async deletePod(id: string) {
    const { error } = await supabase
      .from('pods')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting pod:', error);
      throw error;
    }
  },

  async fetchResources(): Promise<Resource[]> {
    // Fetch resources with their allocations and sprint allocations
    const { data: resourcesData, error: resError } = await supabase
      .from('resources')
      .select(`
        *,
        allocations (
          *,
          sprint_allocations (*)
        )
      `);

    if (resError) {
      console.error('Error fetching resources:', resError);
      return [];
    }

    return resourcesData.map((r: any) => ({
      id: r.id,
      name: r.name,
      department: r.department,
      role: r.role,
      allocations: r.allocations.map((a: any) => ({
        projectId: a.project_id,
        projectName: a.project_name,
        podId: a.pod_id,
        percentage: a.percentage,
        startDate: a.start_date,
        endDate: a.end_date,
        sprintAllocations: a.sprint_allocations.map((sa: any) => ({
          sprintId: sa.sprint_id,
          percentage: sa.percentage
        }))
      }))
    })) as Resource[];
  },

  async saveResources(resources: Resource[]) {
    // This is a complex sync. For simplicity in this dashboard, we'll do a full refresh approach
    // or targeted updates. Let's implement a targeted upsert for resources and their allocations.
    
    for (const res of resources) {
      // 1. Upsert Resource
      const { error: resError } = await supabase
        .from('resources')
        .upsert({
          id: res.id,
          name: res.name,
          department: res.department,
          role: res.role
        });
      
      if (resError) throw resError;

      // 2. Handle Allocations
      // First, delete existing allocations for this resource to ensure clean state
      await supabase.from('allocations').delete().eq('resource_id', res.id);

      for (const alloc of res.allocations) {
        const { data: allocData, error: allocError } = await supabase
          .from('allocations')
          .insert({
            resource_id: res.id,
            pod_id: alloc.podId,
            project_id: alloc.projectId,
            project_name: alloc.projectName,
            percentage: alloc.percentage || 0,
            start_date: alloc.startDate,
            end_date: alloc.endDate
          })
          .select()
          .single();
        
        if (allocError) throw allocError;

        // 3. Handle Sprint Allocations
        if (alloc.sprintAllocations && alloc.sprintAllocations.length > 0) {
          const { error: saError } = await supabase
            .from('sprint_allocations')
            .insert(alloc.sprintAllocations.map(sa => ({
              allocation_id: allocData.id,
              sprint_id: sa.sprintId,
              percentage: sa.percentage
            })));
          
          if (saError) throw saError;
        }
      }
    }
  },

  async resetData(pods: POD[], resources: Resource[]) {
    console.log('Starting database reset...');
    try {
      // Delete in order of dependencies
      const { error: err1 } = await supabase.from('sprint_allocations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (err1) console.warn('Error clearing sprint_allocations:', err1);

      const { error: err2 } = await supabase.from('allocations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (err2) console.warn('Error clearing allocations:', err2);

      const { error: err3 } = await supabase.from('resources').delete().neq('id', '0');
      if (err3) console.warn('Error clearing resources:', err3);

      const { error: err4 } = await supabase.from('pods').delete().neq('id', '0');
      if (err4) console.warn('Error clearing pods:', err4);

      // Re-seed
      console.log('Seeding pods...');
      await this.savePods(pods);
      
      console.log('Seeding resources...');
      await this.saveResources(resources);
      
      console.log('Database reset complete.');
    } catch (err) {
      console.error('Fatal error during resetData:', err);
      throw err;
    }
  }
};
