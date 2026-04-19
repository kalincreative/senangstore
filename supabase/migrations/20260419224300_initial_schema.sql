-- 20260419224300_initial_schema.sql
-- Initial Schema for SenangStore (Next.js + Supabase)

-- 1. Merchants Table
CREATE TABLE IF NOT EXISTS public.merchants (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    store_name TEXT NOT NULL,
    store_slug TEXT UNIQUE NOT NULL,
    store_bio TEXT,
    logo_url TEXT,
    plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'business')),
    bayarcash_portal_key TEXT,
    currency TEXT NOT NULL DEFAULT 'MYR',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Reserved slugs constraint
    CONSTRAINT reserved_slugs CHECK (
        store_slug NOT IN ('dashboard', 'api', 'admin', 'login', 'signup', 'onboarding', 'settings', 'orders', 'products', 'checkout', 'api', 'static', 'public')
    )
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    product_type TEXT NOT NULL DEFAULT 'pdf' CHECK (product_type IN ('pdf', 'zip', 'video_link', 'license_key', 'external_url')),
    file_path TEXT, -- Path in private bucket
    thumbnail_url TEXT, -- Path in public bucket
    is_published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    UNIQUE(merchant_id, slug)
);

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE SET NULL,
    buyer_email TEXT NOT NULL,
    buyer_name TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'MYR',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
    bayarcash_ref TEXT UNIQUE,
    download_token UUID UNIQUE DEFAULT gen_random_uuid(),
    download_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS POLICIES

-- Enable RLS
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Merchants policies
CREATE POLICY "Users can insert their own merchant profile" ON public.merchants
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Merchants can view their own profile" ON public.merchants
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Merchants can update their own profile" ON public.merchants
    FOR UPDATE USING (auth.uid() = id);

-- Products policies
CREATE POLICY "Anyone can view published products" ON public.products
    FOR SELECT USING (is_published = true);

CREATE POLICY "Merchants can view all their own products" ON public.products
    FOR SELECT USING (auth.uid() = merchant_id);

CREATE POLICY "Merchants can insert their own products" ON public.products
    FOR INSERT WITH CHECK (auth.uid() = merchant_id);

CREATE POLICY "Merchants can update their own products" ON public.products
    FOR UPDATE USING (auth.uid() = merchant_id);

CREATE POLICY "Merchants can delete their own products" ON public.products
    FOR DELETE USING (auth.uid() = merchant_id);

-- Orders policies
CREATE POLICY "Merchants can view their own orders" ON public.orders
    FOR SELECT USING (auth.uid() = merchant_id);

-- Storage bucket instructions (to be run manually or via Dashboard)
-- bucket: product-files (private)
-- bucket: thumbnails (public)
