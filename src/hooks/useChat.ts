
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useEffect } from 'react';

export const useChat = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['chatMessages', profile?.warehouse_id],
    queryFn: async () => {
      if (!profile?.warehouse_id) return [];
      
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          sender:profiles!sender_id (
            full_name,
            employee_id,
            role
          ),
          recipient:profiles!recipient_id (
            full_name,
            employee_id
          )
        `)
        .eq('warehouse_id', profile.warehouse_id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching chat messages:', error);
        throw error;
      }
      return data || [];
    },
    enabled: !!profile?.warehouse_id,
  });

  const sendMessage = useMutation({
    mutationFn: async ({ 
      message_text, 
      recipient_id, 
      message_type = 'general',
      is_broadcast = false 
    }: { 
      message_text: string; 
      recipient_id?: string; 
      message_type?: string;
      is_broadcast?: boolean;
    }) => {
      if (!profile?.warehouse_id || !profile?.id) {
        throw new Error('User not authenticated or warehouse not assigned');
      }

      const { error } = await supabase
        .from('chat_messages')
        .insert({
          warehouse_id: profile.warehouse_id,
          sender_id: profile.id,
          recipient_id,
          message_text,
          message_type,
          is_broadcast
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages'] });
    },
  });

  // Set up real-time subscription for new messages
  useEffect(() => {
    if (!profile?.warehouse_id) return;

    const channel = supabase
      .channel('chat_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `warehouse_id=eq.${profile.warehouse_id}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['chatMessages'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.warehouse_id, queryClient]);

  return {
    messages: messages || [],
    isLoading,
    sendMessage: sendMessage.mutate,
    isLoading: sendMessage.isPending,
  };
};
