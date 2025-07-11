
-- Update the handle_new_user function to generate unique employee IDs
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  generated_employee_id text;
  counter integer := 1;
BEGIN
  -- If employee_id is provided in raw_user_meta_data, use it
  IF NEW.raw_user_meta_data->>'employee_id' IS NOT NULL THEN
    generated_employee_id := NEW.raw_user_meta_data->>'employee_id';
  ELSE
    -- Generate a unique employee ID
    generated_employee_id := 'EMP' || substr(replace(NEW.id::text, '-', ''), 1, 8);
    
    -- Ensure uniqueness by adding a counter if needed
    while exists(select 1 from public.profiles where employee_id = generated_employee_id) loop
      generated_employee_id := 'EMP' || substr(replace(NEW.id::text, '-', ''), 1, 6) || lpad(counter::text, 2, '0');
      counter := counter + 1;
    end loop;
  END IF;

  INSERT INTO public.profiles (id, employee_id, full_name, role)
  VALUES (
    NEW.id,
    generated_employee_id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'picker')
  );
  
  RETURN NEW;
END;
$function$
