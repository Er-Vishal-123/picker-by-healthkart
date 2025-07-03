
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const usePerformanceMetrics = () => {
  const { profile } = useAuth();

  const { data: metrics, isLoading } = useQuery({
    queryKey: ['performanceMetrics', profile?.warehouse_id],
    queryFn: async () => {
      if (!profile?.warehouse_id) return [];
      
      const { data, error } = await supabase
        .from('performance_metrics')
        .select(`
          *,
          profiles!picker_id (
            full_name,
            employee_id
          )
        `)
        .eq('warehouse_id', profile.warehouse_id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching performance metrics:', error);
        throw error;
      }
      return data || [];
    },
    enabled: !!profile?.warehouse_id,
  });

  return {
    metrics: metrics || [],
    isLoading,
  };
};
