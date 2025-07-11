
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface CategoryPerformance {
  id: string;
  warehouse_id: string;
  category: string;
  total_picks: number;
  successful_picks: number;
  failed_picks: number;
  average_time_minutes: number;
  date: string;
  created_at: string;
  updated_at: string;
}

export const useCategoryPerformance = () => {
  const { profile } = useAuth();

  const { data: categoryPerformance = [], isLoading, refetch } = useQuery({
    queryKey: ['categoryPerformance', profile?.warehouse_id],
    queryFn: async () => {
      if (!profile?.warehouse_id) return [];
      
      const { data, error } = await supabase
        .from('category_performance')
        .select('*')
        .eq('warehouse_id', profile.warehouse_id)
        .eq('date', new Date().toISOString().split('T')[0])
        .order('total_picks', { ascending: false });

      if (error) throw error;
      return data as CategoryPerformance[];
    },
    enabled: !!profile?.warehouse_id,
  });

  // Real-time subscription
  useEffect(() => {
    if (!profile?.warehouse_id) return;

    const channel = supabase
      .channel('category-performance-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'category_performance',
          filter: `warehouse_id=eq.${profile.warehouse_id}`
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.warehouse_id, refetch]);

  return {
    categoryPerformance,
    isLoading,
  };
};
