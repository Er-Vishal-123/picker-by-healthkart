
import { useQuery } from '@tanstack/react-query';

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
  // Mock data for demonstration
  const mockCategoryPerformance: CategoryPerformance[] = [
    {
      id: '1',
      warehouse_id: 'WH001',
      category: 'Electronics',
      total_picks: 245,
      successful_picks: 232,
      failed_picks: 13,
      average_time_minutes: 3.2,
      date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      warehouse_id: 'WH001',
      category: 'Health & Wellness',
      total_picks: 189,
      successful_picks: 182,
      failed_picks: 7,
      average_time_minutes: 2.8,
      date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      warehouse_id: 'WH001',
      category: 'Beauty & Personal Care',
      total_picks: 156,
      successful_picks: 148,
      failed_picks: 8,
      average_time_minutes: 2.5,
      date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '4',
      warehouse_id: 'WH001',
      category: 'Sports & Fitness',
      total_picks: 134,
      successful_picks: 129,
      failed_picks: 5,
      average_time_minutes: 3.5,
      date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '5',
      warehouse_id: 'WH001',
      category: 'Home & Kitchen',
      total_picks: 98,
      successful_picks: 91,
      failed_picks: 7,
      average_time_minutes: 4.1,
      date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '6',
      warehouse_id: 'WH001',
      category: 'Baby Care',
      total_picks: 87,
      successful_picks: 84,
      failed_picks: 3,
      average_time_minutes: 2.3,
      date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const { data: categoryPerformance = [], isLoading } = useQuery({
    queryKey: ['categoryPerformance'],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockCategoryPerformance;
    },
  });

  return {
    categoryPerformance,
    isLoading,
  };
};
