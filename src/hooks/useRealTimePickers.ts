
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

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
  const queryClient = useQueryClient();

  // Mock data for demonstration
  const mockPickers: RealTimePicker[] = [
    {
      id: '1',
      name: 'John Smith',
      employee_id: 'EMP001',
      currentPicklist: 'PL-2024-001',
      totalAssigned: 12,
      completed: 8,
      inProgress: 2,
      exceptions: 1,
      efficiency: 85,
      lastActivity: '2 minutes ago',
      status: 'active',
      pickAccuracy: 96.5,
      timePerItem: 35,
      ordersPerHour: 8,
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      employee_id: 'EMP002',
      currentPicklist: null,
      totalAssigned: 15,
      completed: 12,
      inProgress: 0,
      exceptions: 0,
      efficiency: 92,
      lastActivity: '5 minutes ago',
      status: 'idle',
      pickAccuracy: 98.2,
      timePerItem: 28,
      ordersPerHour: 10,
    },
    {
      id: '3',
      name: 'Mike Chen',
      employee_id: 'EMP003',
      currentPicklist: 'PL-2024-003',
      totalAssigned: 18,
      completed: 14,
      inProgress: 3,
      exceptions: 2,
      efficiency: 88,
      lastActivity: '1 minute ago',
      status: 'active',
      pickAccuracy: 94.8,
      timePerItem: 32,
      ordersPerHour: 9,
    },
    {
      id: '4',
      name: 'Lisa Brown',
      employee_id: 'EMP004',
      currentPicklist: 'PL-2024-004',
      totalAssigned: 10,
      completed: 6,
      inProgress: 4,
      exceptions: 1,
      efficiency: 78,
      lastActivity: '3 minutes ago',
      status: 'active',
      pickAccuracy: 91.3,
      timePerItem: 42,
      ordersPerHour: 6,
    },
    {
      id: '5',
      name: 'David Wilson',
      employee_id: 'EMP005',
      currentPicklist: null,
      totalAssigned: 8,
      completed: 8,
      inProgress: 0,
      exceptions: 0,
      efficiency: 95,
      lastActivity: '15 minutes ago',
      status: 'offline',
      pickAccuracy: 99.1,
      timePerItem: 25,
      ordersPerHour: 12,
    },
  ];

  const { data: pickers = [], isLoading } = useQuery({
    queryKey: ['realTimePickers'],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockPickers;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  return {
    pickers,
    isLoading,
  };
};
