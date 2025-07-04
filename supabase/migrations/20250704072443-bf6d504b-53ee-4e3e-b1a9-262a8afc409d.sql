
-- Create tables for real-time task management and category tracking
CREATE TABLE public.task_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supervisor_id UUID REFERENCES auth.users(id) NOT NULL,
  picker_id UUID REFERENCES auth.users(id) NOT NULL,
  task_type TEXT NOT NULL DEFAULT 'pick_list',
  task_id UUID, -- references pick_lists.id or other task tables
  priority TEXT NOT NULL DEFAULT 'medium',
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  due_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'assigned',
  notes TEXT,
  warehouse_id UUID REFERENCES warehouses(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create category performance tracking table
CREATE TABLE public.category_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  warehouse_id UUID REFERENCES warehouses(id) NOT NULL,
  category TEXT NOT NULL,
  total_picks INTEGER DEFAULT 0,
  successful_picks INTEGER DEFAULT 0,
  failed_picks INTEGER DEFAULT 0,
  average_time_minutes NUMERIC,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(warehouse_id, category, date)
);

-- Create real-time activity log table
CREATE TABLE public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  activity_type TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB,
  warehouse_id UUID REFERENCES warehouses(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.task_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for task_assignments
CREATE POLICY "Supervisors can manage task assignments in their warehouse" 
  ON public.task_assignments 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('supervisor', 'admin') 
    AND profiles.warehouse_id = task_assignments.warehouse_id
  ));

CREATE POLICY "Pickers can view their assigned tasks" 
  ON public.task_assignments 
  FOR SELECT 
  USING (picker_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('supervisor', 'admin') 
    AND profiles.warehouse_id = task_assignments.warehouse_id
  ));

-- RLS Policies for category_performance
CREATE POLICY "Users can view category performance in their warehouse" 
  ON public.category_performance 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.warehouse_id = category_performance.warehouse_id
  ));

CREATE POLICY "Supervisors can manage category performance in their warehouse" 
  ON public.category_performance 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('supervisor', 'admin') 
    AND profiles.warehouse_id = category_performance.warehouse_id
  ));

-- RLS Policies for activity_log
CREATE POLICY "Users can view activity logs in their warehouse" 
  ON public.activity_log 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.warehouse_id = activity_log.warehouse_id
  ));

CREATE POLICY "Users can insert their own activity logs" 
  ON public.activity_log 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid() AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.warehouse_id = activity_log.warehouse_id
  ));

-- Enable realtime for all new tables
ALTER TABLE public.task_assignments REPLICA IDENTITY FULL;
ALTER TABLE public.category_performance REPLICA IDENTITY FULL;
ALTER TABLE public.activity_log REPLICA IDENTITY FULL;

ALTER PUBLICATION supabase_realtime ADD TABLE public.task_assignments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.category_performance;
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_log;

-- Also enable realtime for existing tables if not already enabled
ALTER TABLE public.pick_lists REPLICA IDENTITY FULL;
ALTER TABLE public.pick_list_items REPLICA IDENTITY FULL;
ALTER TABLE public.performance_metrics REPLICA IDENTITY FULL;

ALTER PUBLICATION supabase_realtime ADD TABLE public.pick_lists;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pick_list_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.performance_metrics;

-- Create function to update category performance
CREATE OR REPLACE FUNCTION update_category_performance()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.category_performance (
    warehouse_id,
    category,
    total_picks,
    successful_picks,
    failed_picks,
    date
  )
  SELECT 
    i.warehouse_id,
    i.category,
    COUNT(*) as total_picks,
    COUNT(*) FILTER (WHERE pli.status = 'completed') as successful_picks,
    COUNT(*) FILTER (WHERE pli.status = 'exception') as failed_picks,
    CURRENT_DATE
  FROM pick_list_items pli
  JOIN inventory i ON i.id = pli.inventory_id
  WHERE i.category = (SELECT category FROM inventory WHERE id = NEW.inventory_id)
    AND DATE(pli.picked_at) = CURRENT_DATE
  GROUP BY i.warehouse_id, i.category
  ON CONFLICT (warehouse_id, category, date) 
  DO UPDATE SET
    total_picks = EXCLUDED.total_picks,
    successful_picks = EXCLUDED.successful_picks,
    failed_picks = EXCLUDED.failed_picks,
    updated_at = now();
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update category performance when pick list items are updated
CREATE TRIGGER update_category_performance_trigger
  AFTER UPDATE ON public.pick_list_items
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status AND NEW.status IN ('completed', 'exception'))
  EXECUTE FUNCTION update_category_performance();
