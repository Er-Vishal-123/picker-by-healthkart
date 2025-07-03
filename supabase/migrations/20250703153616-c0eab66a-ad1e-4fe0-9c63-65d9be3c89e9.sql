
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  employee_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('picker', 'supervisor', 'admin')),
  warehouse_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create warehouses table
CREATE TABLE public.warehouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  manager_id UUID REFERENCES public.profiles(id),
  wms_integration_type TEXT,
  wms_config JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inventory table
CREATE TABLE public.inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  warehouse_id UUID NOT NULL REFERENCES public.warehouses(id) ON DELETE CASCADE,
  sku TEXT NOT NULL,
  product_name TEXT NOT NULL,
  location TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  reserved_quantity INTEGER NOT NULL DEFAULT 0,
  unit_price DECIMAL(10,2),
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(warehouse_id, sku, location)
);

-- Create pick lists table
CREATE TABLE public.pick_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_number TEXT UNIQUE NOT NULL,
  warehouse_id UUID NOT NULL REFERENCES public.warehouses(id) ON DELETE CASCADE,
  assigned_picker_id UUID REFERENCES public.profiles(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_progress', 'completed', 'cancelled')),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  total_items INTEGER NOT NULL DEFAULT 0,
  picked_items INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create pick list items table
CREATE TABLE public.pick_list_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pick_list_id UUID NOT NULL REFERENCES public.pick_lists(id) ON DELETE CASCADE,
  inventory_id UUID NOT NULL REFERENCES public.inventory(id) ON DELETE CASCADE,
  quantity_requested INTEGER NOT NULL,
  quantity_picked INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'picked', 'exception', 'damaged')),
  picker_notes TEXT,
  picked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create performance metrics table
CREATE TABLE public.performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  picker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  warehouse_id UUID NOT NULL REFERENCES public.warehouses(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_picks INTEGER NOT NULL DEFAULT 0,
  successful_picks INTEGER NOT NULL DEFAULT 0,
  exceptions INTEGER NOT NULL DEFAULT 0,
  average_pick_time INTERVAL,
  efficiency_score DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(picker_id, warehouse_id, date)
);

-- Create chat messages table
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  warehouse_id UUID NOT NULL REFERENCES public.warehouses(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  message_text TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'general' CHECK (message_type IN ('general', 'urgent', 'system')),
  is_broadcast BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint for warehouse_id in profiles
ALTER TABLE public.profiles ADD CONSTRAINT fk_profiles_warehouse 
  FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pick_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pick_list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for warehouses
CREATE POLICY "Users can view warehouses they belong to" ON public.warehouses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.warehouse_id = warehouses.id
    )
  );

-- RLS Policies for inventory
CREATE POLICY "Users can view inventory in their warehouse" ON public.inventory
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.warehouse_id = inventory.warehouse_id
    )
  );

-- RLS Policies for pick lists
CREATE POLICY "Users can view pick lists in their warehouse" ON public.pick_lists
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.warehouse_id = pick_lists.warehouse_id
    )
  );

CREATE POLICY "Pickers can update their assigned pick lists" ON public.pick_lists
  FOR UPDATE USING (
    auth.uid() = assigned_picker_id OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('supervisor', 'admin')
      AND profiles.warehouse_id = pick_lists.warehouse_id
    )
  );

-- RLS Policies for pick list items
CREATE POLICY "Users can view pick list items in their warehouse" ON public.pick_list_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.pick_lists pl
      JOIN public.profiles p ON p.id = auth.uid()
      WHERE pl.id = pick_list_items.pick_list_id
      AND p.warehouse_id = pl.warehouse_id
    )
  );

CREATE POLICY "Pickers can update their assigned pick list items" ON public.pick_list_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.pick_lists pl
      WHERE pl.id = pick_list_items.pick_list_id
      AND (pl.assigned_picker_id = auth.uid() OR
           EXISTS (
             SELECT 1 FROM public.profiles p
             WHERE p.id = auth.uid()
             AND p.role IN ('supervisor', 'admin')
             AND p.warehouse_id = pl.warehouse_id
           ))
    )
  );

-- RLS Policies for performance metrics
CREATE POLICY "Users can view performance metrics in their warehouse" ON public.performance_metrics
  FOR SELECT USING (
    picker_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('supervisor', 'admin')
      AND profiles.warehouse_id = performance_metrics.warehouse_id
    )
  );

-- RLS Policies for chat messages
CREATE POLICY "Users can view chat messages in their warehouse" ON public.chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.warehouse_id = chat_messages.warehouse_id
    )
  );

CREATE POLICY "Users can insert chat messages in their warehouse" ON public.chat_messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.warehouse_id = chat_messages.warehouse_id
    )
  );

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, employee_id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'employee_id', 'EMP' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'picker')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample data
INSERT INTO public.warehouses (id, name, location) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'HealthKart Main Warehouse', 'Gurgaon, India'),
  ('550e8400-e29b-41d4-a716-446655440002', 'HealthKart North Warehouse', 'Delhi, India');

INSERT INTO public.inventory (warehouse_id, sku, product_name, location, quantity, category) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'HK-WHEY-001', 'Whey Protein Isolate', 'A1-01', 150, 'Protein'),
  ('550e8400-e29b-41d4-a716-446655440001', 'HK-CREAT-002', 'Creatine Monohydrate', 'A1-02', 200, 'Supplements'),
  ('550e8400-e29b-41d4-a716-446655440001', 'HK-BCAA-003', 'BCAA Powder', 'A1-03', 120, 'Amino Acids'),
  ('550e8400-e29b-41d4-a716-446655440001', 'HK-MULTI-004', 'Multivitamin Tablets', 'B2-01', 300, 'Vitamins');
