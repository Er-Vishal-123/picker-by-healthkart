
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface TaskAssignment {
  id: string;
  supervisor_id: string;
  picker_id: string;
  task_type: string;
  task_id: string | null;
  priority: string;
  assigned_at: string;
  due_date: string | null;
  status: string;
  notes: string | null;
  warehouse_id: string;
  created_at: string;
  updated_at: string;
}

export interface TaskAssignmentInput {
  picker_id: string;
  task_type: string;
  priority: string;
  due_date?: string | null;
  notes?: string | null;
  status: string;
  task_id?: string | null;
}

export const useTaskAssignments = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Real-time subscription
  useEffect(() => {
    if (!profile?.warehouse_id) return;

    const channel = supabase
      .channel('task-assignments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'task_assignments',
          filter: `warehouse_id=eq.${profile.warehouse_id}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['taskAssignments'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.warehouse_id, queryClient]);

  const { data: taskAssignments = [], isLoading } = useQuery({
    queryKey: ['taskAssignments', profile?.warehouse_id],
    queryFn: async () => {
      if (!profile?.warehouse_id) return [];
      
      const { data, error } = await supabase
        .from('task_assignments')
        .select('*')
        .eq('warehouse_id', profile.warehouse_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as TaskAssignment[];
    },
    enabled: !!profile?.warehouse_id,
  });

  const createTaskAssignment = useMutation({
    mutationFn: async (task: TaskAssignmentInput) => {
      if (!profile?.id || !profile?.warehouse_id) {
        throw new Error('User profile not available');
      }

      const taskData = {
        picker_id: task.picker_id,
        task_type: task.task_type,
        priority: task.priority,
        due_date: task.due_date,
        notes: task.notes,
        status: task.status,
        task_id: task.task_id,
        supervisor_id: profile.id,
        warehouse_id: profile.warehouse_id,
      };

      const { data, error } = await supabase
        .from('task_assignments')
        .insert(taskData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskAssignments'] });
      toast({
        title: "Task Assigned",
        description: "Task has been successfully assigned to picker.",
      });
    },
    onError: (error) => {
      toast({
        title: "Assignment Failed",
        description: "Failed to assign task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateTaskAssignment = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<TaskAssignment> }) => {
      const { data, error } = await supabase
        .from('task_assignments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskAssignments'] });
    },
  });

  return {
    taskAssignments,
    isLoading,
    createTaskAssignment: createTaskAssignment.mutate,
    updateTaskAssignment: updateTaskAssignment.mutate,
    isCreating: createTaskAssignment.isPending,
    isUpdating: updateTaskAssignment.isPending,
  };
};
