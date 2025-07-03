
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useInventory = () => {
  const { profile } = useAuth();

  const { data: inventory, isLoading } = useQuery({
    queryKey: ['inventory', profile?.warehouse_id],
    queryFn: async () => {
      if (!profile?.warehouse_id) return [];
      
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('warehouse_id', profile.warehouse_id)
        .order('product_name');

      if (error) throw error;
      return data || [];
    },
    enabled: !!profile?.warehouse_id,
  });

  return {
    inventory: inventory || [],
    isLoading,
  };
};
