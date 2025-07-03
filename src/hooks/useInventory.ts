
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useInventory = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const { data: inventory, isLoading } = useQuery({
    queryKey: ['inventory', profile?.warehouse_id],
    queryFn: async () => {
      if (!profile?.warehouse_id) return [];
      
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('warehouse_id', profile.warehouse_id)
        .order('product_name');

      if (error) {
        console.error('Error fetching inventory:', error);
        throw error;
      }
      return data || [];
    },
    enabled: !!profile?.warehouse_id,
  });

  const updateInventoryQuantity = useMutation({
    mutationFn: async ({ 
      id, 
      quantity_change 
    }: { 
      id: string; 
      quantity_change: number; 
    }) => {
      // First get current quantity
      const { data: currentItem, error: fetchError } = await supabase
        .from('inventory')
        .select('quantity')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      const newQuantity = Math.max(0, currentItem.quantity + quantity_change);

      const { error } = await supabase
        .from('inventory')
        .update({ 
          quantity: newQuantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });

  return {
    inventory: inventory || [],
    isLoading,
    updateInventoryQuantity: updateInventoryQuantity.mutate,
  };
};
