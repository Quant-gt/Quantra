-- Fix handle_new_user trigger to handle email unique constraint conflicts
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Delete any pre-existing user with the same email (e.g., from seed data or orphan rows)
  -- to prevent unique key violations on email.
  DELETE FROM public.users WHERE email = NEW.email;

  INSERT INTO public.users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;
