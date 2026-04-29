-- Habilitar extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla: profiles (para multi-user support si se necesita)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Tabla: transactions
CREATE TABLE IF NOT EXISTS transactions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  amount numeric NOT NULL,
  title text NOT NULL,
  category text NOT NULL,
  transaction_date date DEFAULT CURRENT_DATE,
  type text CHECK (type IN ('income', 'expense')) NOT NULL,
  is_recurring boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Tabla: reminders
CREATE TABLE IF NOT EXISTS reminders (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  due_date date NOT NULL,
  amount numeric,
  is_paid boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Políticas RLS básicas (requiere que el usuario esté autenticado)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own transactions" ON transactions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own reminders" ON reminders
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own profile" ON profiles
  FOR ALL USING (auth.uid() = id);
