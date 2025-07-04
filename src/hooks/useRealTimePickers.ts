
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface RealTimePicker {
  id: string;
  name: string;
  employee_id: string;
  currentPicklist: string | null;
  totalAssigned: number;
  completed: number;
  inProgress: number;
  exceptions: number;
  efficiency: number;
  lastActivity: string;
  status: 'active' | 'idle' | 'offline';
  pickAccuracy: number;
  timePerItem: number;
  ordersPerHour: number;
}

export const useRealTimePickers = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const { data: pickers = [], isLoading } = useQuery({
    queryKey: ['realTimePickers', profile?.warehouse_id],
    queryFn: async () => {
      if (!profile?.warehouse_id) return [];
      
      // Get all pickers in the warehouse
      const { data: pickerProfiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('warehouse_id', profile.warehouse_id)
        .eq('role', 'picker');

      if (profileError) throw profileError;

      // Get pick lists for each picker
      const pickersWithData = await Promise.all(
        pickerProfiles.map(async (picker) => {
          const { data: pickLists } = await supabase
            .from('pick_lists')
            .select('*')
            .eq('assigned_picker_id', picker.id)
            .eq('warehouse_id', profile.warehouse_id);

          const currentPicklist = pickLists?.find(pl => pl.status === 'in_progress');
          const completed = pickLists?.filter(pl => pl.status === 'completed').length || 0;
          const inProgress = pickLists?.filter(pl => pl.status === 'in_progress').length || 0;
          const totalAssigned = pickLists?.length || 0;

          // Get performance metrics
          const { data: metrics } = await supabase
            .from('performance_metrics')
            .select('*')
            .eq('picker_id', picker.id)
            .eq('date', new Date().toISOString().split('T')[0])
            .single();

          return {
            id: picker.id,
            name: picker.full_name,
            employee_id: picker.employee_id,
            currentPicklist: currentPicklist?.list_number || null,
            totalAssigned,
            completed,
            inProgress,
            exceptions: metrics?.exceptions || 0,
            efficiency: metrics?.efficiency_score || 0,
            lastActivity: '2 minutes ago', // Mock data
            status: (inProgress > 0 ? 'active' : 'idle') as 'active' | 'idle' | 'offline',
            pickAccuracy: ((metrics?.successful_picks || 0) / Math.max(metrics?.total_picks || 1, 1)) * 100,
            timePerItem: 35, // Mock data
            ordersPerHour: 8, // Mock data
          } as RealTimePicker;
        })
      );

      return pickersWithData;
    },
    enabled: !!profile?.warehouse_id,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Real-time subscriptions
  useEffect(() => {
    if (!profile?.warehouse_id) return;

    const channels = [
      supabase
        .channel('pick-lists-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'pick_lists',
            filter: `warehouse_id=eq.${profile.warehouse_id}`
          },
          () => {
            queryClient.invalidateQueries({ queryKey: ['realTimePickers'] });
          }
        )
        .subscribe(),

      supabase
        .channel('performance-metrics-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'performance_metrics',
            filter: `warehouse_id=eq.${profile.warehouse_id}`
          },
          () => {
            queryClient.invalidateQueries({ queryKey: ['realTimePickers'] });
          }
        )
        .subscribe(),
    ];

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [profile?.warehouse_id, queryClient]);

  return {
    pickers,
    isLoading,
  };
};
