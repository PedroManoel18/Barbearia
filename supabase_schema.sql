-- ==============================================================================
-- SCHEMA SQL PARA SUPABASE - BARBEARIA GARAGE
-- Instruções:
-- 1. Acesse https://supabase.com e abra seu projeto (ou crie um gratuitamente).
-- 2. No menu lateral esquerdo, clique em "SQL Editor".
-- 3. Clique em "+ New Query", cole todo este código e clique no botão verde "Run".
-- ==============================================================================

-- 1. Criação da tabela de persistência centralizada
CREATE TABLE IF NOT EXISTS public.barbershop_data (
    id TEXT PRIMARY KEY DEFAULT 'garage_main',
    payload JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Habilitação de Segurança por Nível de Linha (Row Level Security - RLS)
ALTER TABLE public.barbershop_data ENABLE ROW LEVEL SECURITY;

-- 3. Política de Leitura Pública:
-- Permite que QUALQUER cliente da barbearia acesse o site e leia os preços, barbeiros e horários atualizados
DROP POLICY IF EXISTS "Leitura pública de dados da barbearia" ON public.barbershop_data;
CREATE POLICY "Leitura pública de dados da barbearia"
ON public.barbershop_data
FOR SELECT
USING (true);

-- 4. Política de Inserção e Atualização para o Painel:
-- Permite que o Painel Administrativo salve ou atualize os dados usando a chave pública (anon)
DROP POLICY IF EXISTS "Atualização permitida para o painel" ON public.barbershop_data;
CREATE POLICY "Atualização permitida para o painel"
ON public.barbershop_data
FOR ALL
USING (true)
WITH CHECK (true);

-- 5. Habilitação de Realtime (Notificações instantâneas)
ALTER PUBLICATION supabase_realtime ADD TABLE public.barbershop_data;
