
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const usePickLists = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const { data: pickLists, isLoading } = useQuery({
    queryKey: ['pickLists', profile?.id],
    queryFn: async () => {
      if (!profile?.warehouse_id) return [];
      
      const { data, error } = await supabase
        .from('pick_lists')
        .select(`
          *,
          pick_list_items (
            *,
            inventory (
              sku,
              product_name,
              location
            )
          )
        `)
        .eq('warehouse_id', profile.warehouse_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!profile?.warehouse_id,
  });

  const updatePickListStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('pick_lists')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pickLists'] });
    },
  });

  return {
    pickLists: pickLists || [],
    isLoading,
    updatePickListStatus: updatePickListStatus.mutate,
  };
};
